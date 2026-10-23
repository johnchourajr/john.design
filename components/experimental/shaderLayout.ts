import type { ShaderFrame, ShaderSize } from './useShaderRenderer';

/**
 * Sizing and the program-swap reveal, as both shader cores do them (#125):
 * useShaderRenderer on WebGL and gpuShader on WebGPU.
 */

/** The container's content box. */
export const contentBoxSize = (container: HTMLElement): ShaderSize => {
  const style = getComputedStyle(container);
  return {
    width:
      container.clientWidth -
      parseFloat(style.paddingLeft) -
      parseFloat(style.paddingRight),
    height:
      container.clientHeight -
      parseFloat(style.paddingTop) -
      parseFloat(style.paddingBottom),
  };
};

/**
 * The screen's pixel ratio, capped at `maxPixelRatio`, and lower once a
 * canvas of `width` × `height` CSS px would pass `maxPixels` device pixels.
 */
export const shaderPixelRatio = (
  width: number,
  height: number,
  maxPixelRatio: number,
  maxPixels: number,
) =>
  Math.min(
    window.devicePixelRatio,
    maxPixelRatio,
    Math.sqrt(maxPixels / Math.max(1, width * height)),
  );

type LayoutOptions = {
  getSize: (container: HTMLElement) => ShaderSize;
  getFrame?: (container: HTMLElement, size: ShaderSize) => ShaderFrame;
  snapToPixels: boolean;
};

/**
 * Measures the canvas for `container`: writes its frame into `frame` and,
 * with `snapToPixels`, the nudge onto whole CSS pixels into `snap` (and the
 * canvas's transform). Returns the canvas's size in CSS px.
 */
export function layoutShader(
  container: HTMLElement,
  canvas: HTMLCanvasElement,
  { getSize, getFrame, snapToPixels }: LayoutOptions,
  frame: ShaderFrame,
  snap: { x: number; y: number },
): ShaderSize {
  const size = getSize(container);
  let { width, height } = size;
  Object.assign(
    frame,
    getFrame ? getFrame(container, size) : { x: 0, y: 0, width, height },
  );
  if (snapToPixels) {
    const bounds = container.getBoundingClientRect();
    const left = bounds.left + window.scrollX;
    const top = bounds.top + window.scrollY;
    snap.x = Math.round(left) - left;
    snap.y = Math.round(top) - top;
    canvas.style.transform = `translate(${snap.x}px, ${snap.y}px)`;
    frame.x -= snap.x;
    frame.y -= snap.y;
    width = Math.ceil(width + Math.abs(snap.x));
    height = Math.ceil(height + Math.abs(snap.y));
  }
  return { width, height };
}

/** The frame in canvas UV, y up: offset, then size (`layerRect`). */
export const layerRectOf = (
  frame: ShaderFrame,
  { width, height }: ShaderSize,
): [number, number, number, number] => [
  frame.x / width,
  1 - (frame.y + frame.height) / height,
  frame.width / width,
  frame.height / height,
];

/** How long a program swap takes to reveal, in ms. */
export const SWAP_MS = 700;

/**
 * A program swap reveals the new frame over the old in a circle, from the
 * click that asked for it (within the last second) or the middle of the
 * canvas. All in the drawing buffer's pixels, y up.
 */
export type Reveal = {
  start: number;
  origin: [number, number];
  /** Corner to corner from the origin, at its furthest. */
  reach: number;
  feather: number;
};

export function startReveal(
  canvas: HTMLCanvasElement,
  buffer: ShaderSize,
  lastClick: { x: number; y: number; time: number } | null,
): Reveal {
  const now = performance.now();
  const area = canvas.getBoundingClientRect();
  const at =
    lastClick && now - lastClick.time < 1000
      ? lastClick
      : { x: area.left + area.width / 2, y: area.top + area.height / 2 };
  const ox = ((at.x - area.left) / area.width) * buffer.width;
  const oy = ((area.bottom - at.y) / area.height) * buffer.height;
  return {
    start: now,
    origin: [ox, oy],
    reach: Math.max(
      Math.hypot(ox, oy),
      Math.hypot(buffer.width - ox, oy),
      Math.hypot(ox, buffer.height - oy),
      Math.hypot(buffer.width - ox, buffer.height - oy),
    ),
    feather: Math.hypot(buffer.width, buffer.height) * 0.08,
  };
}

/** The reveal's radius now, eased in and out; null once it's done. */
export function revealRadius(reveal: Reveal): number | null {
  const progress = Math.min((performance.now() - reveal.start) / SWAP_MS, 1);
  if (progress >= 1) return null;
  const eased =
    progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
  return eased * (reveal.reach + reveal.feather);
}
