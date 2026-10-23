/**
 * The canvas a shader's headline layer is read from, renderer by renderer
 * (#108, #125): `headlineTexture` for three.js, and the WebGPU core's own.
 */
export type HeadlineSink = {
  /**
   * The band canvas has a new size, so the GPU copy needs a new one. `rect`
   * is the band in canvas UV (y up): offset, then size.
   */
  band: (rect: [number, number, number, number]) => void;
  /** The band canvas was redrawn: upload it. */
  drawn: () => void;
  /** The canvas shows the headline (`hasHeadline`), or hands back to the DOM. */
  live: (live: boolean) => void;
  /** The headline's largest font size, in CSS px. */
  em: (em: number) => void;
};

export type HeadlineLayerContext = {
  /** The shader's canvas, which the letters are lined up with. */
  canvas: HTMLCanvasElement;
  /** Asks for one frame when the loop isn't running. */
  invalidate: () => void;
};

export type HeadlineLayer = {
  /** The band canvas, sized to the rows the letters reach. */
  surface: HTMLCanvasElement;
  /** Before every frame: redraws the band if anything moved. */
  beforeRender: () => void;
  /** After the canvas resizes, with its drawing buffer in device pixels. */
  resize: (buffer: { width: number; height: number }) => void;
  /** Lines for the `?shader-debug` panel. */
  debug: () => string[];
  dispose: () => void;
};

/** Room above and below the headline for letters motion moves past its box. */
const BAND_PAD = 0.25;

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
 * Draws the text inside `root` into the band canvas, letter for
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
 * band dirty. A dirty pass reads the boxes, and only redraws and uploads
 * when a letter moved or changed.
 *
 * The DOM text stays visible while any letter's font hasn't loaded or
 * doesn't measure the same in canvas, with reduced motion, and when the
 * renderer fails or is lost.
 *
 * Returns null when there's nothing to draw (no root, reduced motion, no
 * 2D canvas): the DOM headline stays as it is.
 */
export function headlineLayer(
  root: HTMLElement | null,
  reducedMotion: boolean,
  { canvas, invalidate }: HeadlineLayerContext,
  sink: HeadlineSink,
): HeadlineLayer | null {
  const surface = document.createElement('canvas');
  const context = surface.getContext('2d');

  // Reduced motion keeps the plain DOM headline: a still frame would only
  // show the type unwarped, which the DOM already does.
  if (!root || reducedMotion || !context) return null;

  // A blank 1px band until the first is fitted: an empty canvas can't be
  // uploaded.
  surface.width = 1;
  surface.height = 1;

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
  // For the ?shader-debug panel.
  let failures = 0;
  let lastFailure = 'none';
  let headlineRect: [number, number, number, number] = [0, 0, 1, 1];
  // The canvas's drawing buffer, and the band of it the texture covers:
  // only the headline's rows, so a viewport-wide canvas doesn't upload
  // a viewport-sized texture every time a letter moves.
  let bufferWidth = 0;
  let bufferHeight = 0;
  let bandTop = 0;
  let inkTop = 0;
  let inkBottom = 0;
  let bandStale = true;

  /**
   * Fits the texture to the rows the letters reach, with room to spare so
   * the layout animation doesn't reallocate it every frame. Grows when a
   * letter leaves it, shrinks when it's over twice the size it needs.
   */
  const fitBand = () => {
    if (!glyphCount) return;
    const need = inkBottom - inkTop;
    const pad = need * BAND_PAD;
    const bandBottom = bandTop + surface.height;
    const fits =
      !bandStale &&
      surface.width === bufferWidth &&
      inkTop >= bandTop &&
      inkBottom <= bandBottom &&
      surface.height <= (need + 2 * pad) * 2;
    if (fits) return;
    const top = Math.max(0, Math.floor(inkTop - pad));
    const bottom = Math.min(bufferHeight, Math.ceil(inkBottom + pad));
    bandTop = top;
    bandStale = false;
    surface.width = bufferWidth;
    surface.height = Math.max(1, bottom - top);
    signature = NaN;
    headlineRect = [0, 1 - bottom / bufferHeight, 1, surface.height / bufferHeight];
    // The GPU copy has a fixed size: the renderer makes a new one.
    sink.band(headlineRect);
  };

  const markDirty = () => {
    // fonts.ready can settle after unmount.
    if (disposed) return;
    dirty = true;
    invalidate();
  };

  const setLive = (next: boolean) => {
    if (live === next) return;
    live = next;
    sink.live(next);
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
    const sx = bufferWidth / bounds.width;
    const sy = bufferHeight / bounds.height;


    // The browser composites the canvas at its box snapped to whole CSS
    // pixels, and puts each text baseline on a whole CSS pixel too.
    const originX = Math.round(bounds.left) * sx;
    const originY = Math.round(bounds.top) * sy;
    let matches = true;
    let em = 0;
    glyphCount = 0;
    runCount = 0;
    inkTop = Infinity;
    inkBottom = -Infinity;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const text = node as Text;
      const element = text.parentElement;
      if (!element || !text.data.trim()) continue;

      const style = getComputedStyle(element);
      const alpha = opacityOf(element);
      if (alpha <= 0 || style.visibility === 'hidden') continue;

      const font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      em = Math.max(em, parseFloat(style.fontSize) || 0);
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
      // Layout rounds boxes to 1/64px, and a line box that lands on a half
      // device pixel grows by up to one CSS pixel; neither is a transform.
      if (Math.abs(runScaleY - 1) < 0.002 || Math.abs(runBox.height - height) <= 1) {
        runScaleY = 1;
      }
      if (Math.abs(runScaleX - 1) < 0.002 || Math.abs(runBox.width - runAdvance) <= 1) {
        runScaleX = 1;
      }
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
        inkTop = Math.min(inkTop, (box.top - bounds.top) * sy);
        inkBottom = Math.max(inkBottom, (box.bottom - bounds.top) * sy);
        entry.scaleX = runScaleX * sx;
        entry.scaleY = runScaleY * sy;
        glyphCount += 1;
      }
      runCount += 1;
    }
    sink.em(em);
    return matches;
  };

  // A number that changes when any drawn pixel would.
  const sign = () => {
    let hash = glyphCount + surface.width * 7 + surface.height * 13 + bandTop;
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
      context.setTransform(
        glyph.scaleX,
        0,
        0,
        glyph.scaleY,
        glyph.x,
        glyph.y - bandTop,
      );
      context.fillText(glyph.text, 0, 0);
    }
    sink.drawn();
  };

  const update = () => {
    dirty = false;
    if (!bufferWidth || !bufferHeight) return;
    const matches = read();
    if (!matches) {
      failures += 1;
      lastFailure = new Date().toLocaleTimeString();
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
    fitBand();
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

  return {
    surface,
    beforeRender: () => {
      if (dirty) update();
    },
    resize: ({ width, height }) => {
      bufferWidth = width;
      bufferHeight = height;
      // Refit the band to the new buffer.
      bandStale = true;
      dirty = true;
    },
    debug: () => {
      const rect = headlineRect.map((value) => value.toFixed(3));
      return [
        `headline live ${live} dom opacity "${root.style.opacity}"`,
        `glyphs ${glyphCount} band ${surface.width}x${surface.height} top ${bandTop} headlineRect ${rect[0]},${rect[1]} ${rect[2]}x${rect[3]}`,
        `read failures ${failures} (last ${lastFailure}) retries ${retries} fonts ${document.fonts.status}`,
      ];
    },
    dispose: () => {
      disposed = true;
      window.clearTimeout(retryId);
      mutations.disconnect();
      theme.disconnect();
      resizes.disconnect();
      document.fonts.removeEventListener('loadingdone', markDirty);
      setLive(false);
    },
  };
}
