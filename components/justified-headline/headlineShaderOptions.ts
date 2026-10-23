/**
 * How a headline's shader canvas is set up (#108), on WebGL and WebGPU
 * alike (#125).
 */

// Until the pointer arrives, the effect waits off the canvas.
export const offCanvas = { x: -1e4, y: -1e4 };

/**
 * The effects are sized from their frame. The home hero's frame is its
 * portrait, a square as wide as the viewport, so a headline on its own is
 * measured against the same square: the lens, sphere and cube come out the
 * same size in CSS pixels on every page.
 */
export const viewportSquare = () => ({
  x: 0,
  y: 0,
  width: window.innerWidth,
  height: window.innerWidth,
});

export const HEADLINE_SHADER = {
  maxPixelRatio: 3,
  // A headline band is far smaller than the home portrait's square.
  maxPixels: 3456 * 3456,
  mouseDamping: 0.08,
  jumpOnEnter: true,
  // The canvas ignores the pointer so links and selection under it work.
  pointerTarget: 'window',
} as const;
