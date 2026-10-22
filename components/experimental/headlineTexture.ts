import * as THREE from 'three';
import type { ShaderInput } from './useShaderRenderer';

/** Uniforms a material needs to take a headline. See shaders/layers.ts. */
export const headlineUniforms = () => ({
  layerRect: { value: new THREE.Vector4(0, 0, 1, 1) },
  headline: { value: null },
  hasHeadline: { value: 0 },
  hideImage: { value: 0 },
  // Driven by the core: how far the effect reaches the type.
  hover: { value: 0 },
});

type Glyph = {
  text: string;
  /** Index into the run styles of this pass. */
  run: number;
  /** Device pixels on the canvas: the glyph's left and baseline, then scale. */
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
};

type Run = {
  font: string;
  color: string;
  alpha: number;
};

/** Drawn when nothing about the pixels has changed since. */
const SAME = 0.01;

/**
 * Draws the text inside `getRoot()` into the `headline` texture, letter for
 * letter where the page has laid it out, and hides the DOM text (opacity 0,
 * so layout and motion carry on) once the canvas shows it (#108).
 *
 * The DOM stays the source of truth: layout, the layout animation, the
 * accent colour, accessibility and the no-JS page all come from it. Each
 * letter's box comes from a Range, so motion's transforms are included, and
 * the letter is drawn at that box with the letter's own computed font,
 * colour and opacity. Canvas and DOM agree on the font box (Range height is
 * the font's ascent plus descent), so the baseline sits at box top plus
 * `fontBoundingBoxAscent`, rounded to a whole CSS pixel as the browser
 * paints it. Measured against the DOM, the type matches pixel for pixel.
 *
 * Nothing runs while nothing moves: a MutationObserver (motion writes
 * `style` every animated frame, the layout iterations swap classes), a
 * ResizeObserver, the accent colour on `<html>` and font loads mark the
 * texture dirty. A dirty pass reads the boxes, and only redraws and uploads
 * when a letter moved or changed.
 *
 * The DOM text stays visible while any letter's font hasn't loaded or
 * doesn't measure the same in canvas, with reduced motion, and when WebGL
 * fails or is lost.
 */
export const headlineTexture =
  (getRoot: () => HTMLElement | null): ShaderInput =>
  ({ material, ready, reducedMotion, canvas, invalidate }) => {
    const root = getRoot();
    const uniforms = material.uniforms;
    const surface = document.createElement('canvas');
    const context = surface.getContext('2d');

    // Reduced motion keeps the plain DOM headline: a still frame would only
    // show the type unwarped, which the DOM already does.
    if (!root || reducedMotion || !context || !uniforms.headline) {
      ready();
      return { dispose: () => {} };
    }

    const texture = new THREE.CanvasTexture(surface);
    // The type is composited premultiplied, like the browser does.
    texture.premultiplyAlpha = true;
    texture.generateMipmaps = false;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    uniforms.headline.value = texture;

    const range = document.createRange();
    const glyphs: Glyph[] = [];
    const runs: Run[] = [];
    const metrics = new Map<string, number>();
    let glyphCount = 0;
    let runCount = 0;
    let signature = NaN;
    let dirty = true;
    let live = false;
    let retries = 0;
    let retryId = 0;
    let disposed = false;

    const markDirty = () => {
      // fonts.ready can settle after unmount.
      if (disposed) return;
      dirty = true;
      invalidate();
    };

    const setLive = (next: boolean) => {
      if (live === next) return;
      live = next;
      uniforms.hasHeadline.value = next ? 1 : 0;
      root.style.opacity = next ? '0' : '';
    };

    const measure = (font: string, text: string) => {
      const key = `${font}\n${text}`;
      let width = metrics.get(key);
      if (width === undefined) {
        context.font = font;
        width = context.measureText(text).width;
        metrics.set(key, width);
      }
      return width;
    };

    const ascentOf = (font: string) => {
      const key = `${font}\n`;
      let ascent = metrics.get(key);
      if (ascent === undefined) {
        context.font = font;
        const box = context.measureText('H');
        ascent = box.fontBoundingBoxAscent;
        metrics.set(`${font}\n\n`, ascent + box.fontBoundingBoxDescent);
        metrics.set(key, ascent);
      }
      return ascent;
    };

    const opacityOf = (element: Element) => {
      let alpha = 1;
      for (
        let node: Element | null = element;
        node && node !== root;
        node = node.parentElement
      ) {
        alpha *= parseFloat(getComputedStyle(node).opacity);
      }
      return alpha;
    };

    /**
     * Reads every letter's box. Returns false when a font hasn't loaded, or
     * (before the swap) doesn't measure the same as the DOM's, so the DOM
     * text has to stay.
     */
    const read = () => {
      const bounds = canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return false;
      const sx = surface.width / bounds.width;
      const sy = surface.height / bounds.height;
      // The browser composites the canvas at its box snapped to whole CSS
      // pixels, and puts each text baseline on a whole CSS pixel too.
      const originX = Math.round(bounds.left) * sx;
      const originY = Math.round(bounds.top) * sy;
      let matches = true;
      glyphCount = 0;
      runCount = 0;

      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        const text = node as Text;
        const element = text.parentElement;
        if (!element || !text.data.trim()) continue;

        const style = getComputedStyle(element);
        const alpha = opacityOf(element);
        if (alpha <= 0 || style.visibility === 'hidden') continue;

        const font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
        if (!document.fonts.check(font, text.data)) matches = false;
        const upper = style.textTransform === 'uppercase';
        const spacing = parseFloat(style.letterSpacing) || 0;
        const ascent = ascentOf(font);
        const height = metrics.get(`${font}\n\n`) ?? 1;

        const run = runs[runCount] ?? (runs[runCount] = {} as Run);
        run.font = font;
        run.color = style.color;
        run.alpha = alpha;

        // The run as a whole, from its first to its last letter: kerning
        // moves single letters' boxes, but the run's width only changes
        // with the font or a transform.
        const first = text.data.search(/\S/);
        const last = text.data.trimEnd().length;
        range.setStart(text, first);
        range.setEnd(text, last);
        const runBox = range.getBoundingClientRect();
        const content = text.data.slice(first, last);
        const runText = upper ? content.toUpperCase() : content;
        const runAdvance =
          measure(font, runText) + spacing * content.length;
        let runScaleY = runBox.height / height;
        let runScaleX = runBox.width / runAdvance;
        // Layout rounds boxes to 1/64px; that isn't a transform.
        if (Math.abs(runScaleY - 1) < 0.002) runScaleY = 1;
        if (Math.abs(runScaleX - 1) < 0.002) runScaleX = 1;
        // Before the swap, the canvas font has to measure as the DOM's
        // does. After it, a mismatch is a transform mid-animation (motion
        // can stretch one axis), and only an unloaded font swaps back.
        if (
          !live &&
          Math.abs(runBox.width / runScaleY - runAdvance) >
            0.5 + 0.02 * content.length
        ) {
          matches = false;
        }

        for (let i = first; i < last; i++) {
          // Keep surrogate pairs (emoji, astral letters) whole.
          const code = text.data.charCodeAt(i);
          const end = code >= 0xd800 && code <= 0xdbff ? i + 2 : i + 1;
          const char = text.data.slice(i, end);
          const index = i;
          i = end - 1;
          if (!char.trim()) continue;

          range.setStart(text, index);
          range.setEnd(text, end);
          const box = range.getBoundingClientRect();
          if (!box.width || !box.height) continue;

          const entry =
            glyphs[glyphCount] ?? (glyphs[glyphCount] = {} as Glyph);
          entry.text = upper ? char.toUpperCase() : char;
          entry.run = runCount;
          // Where the browser paints this glyph, on the canvas's pixels.
          entry.x = box.left * sx - originX;
          entry.y = Math.round(box.top + ascent * runScaleY) * sy - originY;
          entry.scaleX = runScaleX * sx;
          entry.scaleY = runScaleY * sy;
          glyphCount += 1;
        }
        runCount += 1;
      }
      return matches;
    };

    // A number that changes when any drawn pixel would.
    const sign = () => {
      let hash = glyphCount + surface.width * 7 + surface.height * 13;
      for (let i = 0; i < runCount; i++) {
        const run = runs[i];
        hash = hash * 31 + run.alpha * 997;
        for (let c = 0; c < run.color.length; c++) {
          hash = (hash * 31 + run.color.charCodeAt(c)) % 1e15;
        }
        for (let c = 0; c < run.font.length; c++) {
          hash = (hash * 31 + run.font.charCodeAt(c)) % 1e15;
        }
      }
      for (let i = 0; i < glyphCount; i++) {
        const glyph = glyphs[i];
        hash = (hash * 31 + Math.round(glyph.x / SAME)) % 1e15;
        hash = (hash * 31 + Math.round(glyph.y / SAME)) % 1e15;
        hash = (hash * 31 + Math.round(glyph.scaleX / SAME)) % 1e15;
        hash = (hash * 31 + Math.round(glyph.scaleY / SAME)) % 1e15;
        hash = (hash * 31 + glyph.text.charCodeAt(0) + glyph.run) % 1e15;
      }
      return hash;
    };

    const draw = () => {
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, surface.width, surface.height);
      context.textBaseline = 'alphabetic';
      context.textAlign = 'left';
      let current = -1;
      for (let i = 0; i < glyphCount; i++) {
        const glyph = glyphs[i];
        const run = runs[glyph.run];
        if (glyph.run !== current) {
          current = glyph.run;
          context.font = run.font;
          context.fillStyle = run.color;
          context.globalAlpha = run.alpha;
        }
        context.setTransform(glyph.scaleX, 0, 0, glyph.scaleY, glyph.x, glyph.y);
        context.fillText(glyph.text, 0, 0);
      }
      texture.needsUpdate = true;
    };

    const update = () => {
      dirty = false;
      if (!surface.width || !surface.height) return;
      const matches = read();
      if (!matches) {
        // A font is still loading. Font events usually say when; retry a
        // few times in case they don't.
        setLive(false);
        if (retries < 20 && !retryId) {
          retries += 1;
          retryId = window.setTimeout(() => {
            retryId = 0;
            markDirty();
          }, 250);
        }
        return;
      }
      const next = sign();
      if (next !== signature) {
        signature = next;
        draw();
      }
      setLive(true);
    };

    const mutations = new MutationObserver(markDirty);
    mutations.observe(root, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['style', 'class'],
    });
    // The accent colour (--root-color) is set on <html>.
    const theme = new MutationObserver(markDirty);
    theme.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style', 'class', 'data-color'],
    });
    const resizes = new ResizeObserver(markDirty);
    resizes.observe(root);
    document.fonts.addEventListener('loadingdone', markDirty);
    document.fonts.ready.then(markDirty);

    ready();

    return {
      beforeRender: () => {
        if (dirty) update();
      },
      resize: ({ width, height }) => {
        if (surface.width === width && surface.height === height) return;
        surface.width = width;
        surface.height = height;
        // The GPU copy has a fixed size; let three allocate a new one.
        texture.dispose();
        signature = NaN;
        dirty = true;
      },
      dispose: () => {
        disposed = true;
        window.clearTimeout(retryId);
        mutations.disconnect();
        theme.disconnect();
        resizes.disconnect();
        document.fonts.removeEventListener('loadingdone', markDirty);
        setLive(false);
        uniforms.headline.value = null;
        texture.dispose();
      },
    };
  };
