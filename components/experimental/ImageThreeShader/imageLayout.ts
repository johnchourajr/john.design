import type { ShaderFrame, ShaderSize } from '../useShaderRenderer';

/** 3456 × 3456: the portrait's buffer at 2x on a 1728px-wide screen. */
export const HERO_MAX_PIXELS = 3456 * 3456;

/** The largest box of `aspectRatio` ("w:h") that fits `container`. */
export const calculateDimensions = (
  container: DOMRect,
  aspectRatio: string,
): ShaderSize => {
  const [numerator, denominator] = aspectRatio.split(':').map(Number);
  const targetRatio = numerator / denominator;

  let width = container.width;
  let height = container.width / targetRatio;

  if (container.width / container.height > targetRatio) {
    height = container.height;
    width = container.height * targetRatio;
  }

  return { width, height };
};

/**
 * An image shader's canvas and frame, on WebGL and WebGPU alike (#125).
 * The frame is the image's own box, from the canvas's top left. With a
 * headline, the canvas grows down to the headline's bottom when it runs
 * past the image; the image keeps its place and size.
 */
export const imageShaderLayout = (
  aspectRatio: string,
  getHeadline?: () => HTMLElement | null,
) => ({
  getFrame: (container: HTMLElement): ShaderFrame => ({
    x: 0,
    y: 0,
    ...calculateDimensions(container.getBoundingClientRect(), aspectRatio),
  }),
  getSize: (container: HTMLElement): ShaderSize => {
    const bounds = container.getBoundingClientRect();
    const size = calculateDimensions(bounds, aspectRatio);
    const headline = getHeadline?.()?.getBoundingClientRect();
    if (!headline) return size;
    return {
      width: size.width,
      height: Math.max(size.height, Math.ceil(headline.bottom - bounds.top)),
    };
  },
});
