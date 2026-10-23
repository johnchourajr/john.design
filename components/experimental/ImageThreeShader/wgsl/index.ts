import type { ShaderVariant } from '../shaders/types';

/**
 * The hero variants' WGSL (#125), loaded only when that variant runs on
 * WebGPU. The `.wgsl` loader prepares them at build time. A variant missing
 * here runs on WebGL.
 */
export const heroGpuShaders: Partial<
  Record<ShaderVariant, () => Promise<{ default: unknown }>>
> = {
  pixel: () => import('./pixel.wgsl'),
  distortion: () => import('./distortion.wgsl'),
  loupe: () => import('./loupe.wgsl'),
  vertical: () => import('./vertical.wgsl'),
  sphere: () => import('./sphere.wgsl'),
  prism: () => import('./prism.wgsl'),
};
