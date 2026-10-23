import * as THREE from 'three';

import type { ShaderInput } from '../useShaderRenderer';

export type PosterSize = { width: number; height: number };

/**
 * Lays out a poster's type on a 2D canvas, in CSS pixels. The canvas is
 * opaque black; paint expressive type in red (`INK`), small print in green
 * (`PRINT`) and any grid in blue (`GRID`), so the shader can treat each
 * layer on its own. Layers add where they overlap.
 */
export type ComposePoster = (
  ctx: CanvasRenderingContext2D,
  size: PosterSize,
) => void;

/** The expressive layer: the words the shader acts on. */
export const INK = '#f00';
/** The small print: credits and captions, usually left as they are. */
export const PRINT = '#0f0';
/** A grid or rule layer, for shaders that bend space visibly. */
export const GRID = '#00f';

/** Every face a poster draws with; the canvas waits for all of them. */
const FONTS = [
  '100px "Montreal"',
  '100px "KUniforma Black"',
  '100px "KUniforma Bold"',
  '100px "BigCaslon"',
  '100px "PPMondwest"',
  'italic 100px "MontrealItalic"',
];

/** A system monospace, for the technical small print. */
export const MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace';

/** Resolves once every face the posters draw with has loaded (or failed). */
export const posterFontsReady = () =>
  Promise.all(FONTS.map((face) => document.fonts.load(face)))
    .catch(() => [])
    .then(() => undefined);

/**
 * Paints a poster's composition onto `source` at `buffer` (device pixels),
 * laid out in CSS pixels (`size`). Shared by the WebGPU path and the WebGL
 * fallback, so both draw exactly the same layers.
 */
export const paintPoster = (
  source: HTMLCanvasElement,
  compose: ComposePoster,
  buffer: PosterSize,
  size: PosterSize,
) => {
  source.width = buffer.width;
  source.height = buffer.height;
  const ctx = source.getContext('2d');
  if (!ctx) return false;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, source.width, source.height);
  ctx.scale(buffer.width / size.width, buffer.height / size.height);
  ctx.textBaseline = 'alphabetic';
  ctx.globalCompositeOperation = 'lighter';
  compose(ctx, size);
  return true;
};

/**
 * The WebGL fallback's input: draws `compose` into a texture at the
 * canvas's own pixels and hands it to the material as `type`. It redraws on
 * resize, once the fonts have loaded.
 */
export const posterTexture =
  (compose: ComposePoster): ShaderInput =>
  ({ material, ready, canvas, invalidate }) => {
    const source = document.createElement('canvas');
    let texture: THREE.CanvasTexture | null = null;
    let buffer: PosterSize | null = null;
    let fontsReady = false;
    let disposed = false;

    const draw = () => {
      if (!buffer || !fontsReady) return;
      const { width, height } = canvas.getBoundingClientRect();
      if (!width || !height) return;
      if (!paintPoster(source, compose, buffer, { width, height })) return;
      // A canvas that changes size needs a new texture: the old one keeps
      // its first upload's dimensions.
      texture?.dispose();
      texture = new THREE.CanvasTexture(source);
      texture.generateMipmaps = false;
      texture.minFilter = THREE.LinearFilter;
      material.uniforms.type.value = texture;
      invalidate();
    };

    posterFontsReady().then(() => {
      if (disposed) return;
      fontsReady = true;
      draw();
      ready();
    });

    return {
      resize: (next) => {
        buffer = next;
        draw();
      },
      dispose: () => {
        disposed = true;
        texture?.dispose();
      },
    };
  };

/** A font string for `ctx.font`. A stack (with commas) goes in as it is. */
export const font = (size: number, family: string, style = '') =>
  `${style} ${size}px ${family.includes(',') ? family : `"${family}"`}`.trim();

/**
 * The size at which `text` in `family` spans `width`, measured once at
 * 100px. Tracking (`letterSpacing`, in em) is included.
 */
export const fitSize = (
  ctx: CanvasRenderingContext2D,
  text: string,
  family: string,
  width: number,
  { style = '', tracking = 0 } = {},
) => {
  ctx.save();
  ctx.font = font(100, family, style);
  ctx.letterSpacing = `${tracking * 100}px`;
  const measured = ctx.measureText(text).width;
  ctx.restore();
  return (100 * width) / Math.max(1, measured);
};

/** Fills `text` with its tracking (em) at `size`. */
export const fillText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  size: number,
  family: string,
  { style = '', tracking = 0, align = 'left' as CanvasTextAlign } = {},
) => {
  ctx.font = font(size, family, style);
  ctx.letterSpacing = `${tracking * size}px`;
  ctx.textAlign = align;
  ctx.fillText(text, x, y);
};

/**
 * The size of a poster's small print: a fixed share of its width, so it
 * keeps its place in the composition at every size, and never under 5px.
 */
export const fine = (width: number, scale = 1) => Math.max(5, width * 0.0115 * scale);

type PrintOptions = {
  family?: string;
  style?: string;
  /** Letter spacing, in em. */
  tracking?: number;
  /** Line spacing, as a multiple of the size. */
  leading?: number;
  align?: CanvasTextAlign;
  upper?: boolean;
};

/** Small print in capitals, top to bottom from the first baseline at `y`. */
export const printLines = (
  ctx: CanvasRenderingContext2D,
  lines: string[],
  x: number,
  y: number,
  size: number,
  {
    family = 'Montreal',
    style = '',
    // Small print is set in capitals, opened up a little to suit them.
    tracking = 0.04,
    leading = 1.3,
    align = 'left',
    upper = true,
  }: PrintOptions = {},
) => {
  ctx.fillStyle = PRINT;
  lines.forEach((line, i) =>
    fillText(ctx, upper ? line.toUpperCase() : line, x, y + i * size * leading, size, family, {
      style,
      tracking,
      align,
    }),
  );
};

/** A hairline rule in the small print's layer. */
export const printRule = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  weight = 0.75,
) => {
  ctx.fillStyle = PRINT;
  ctx.fillRect(x, y, width, weight);
};
