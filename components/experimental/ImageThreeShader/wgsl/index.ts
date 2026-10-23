import type { ShaderVariant } from '../shaders/types';

/**
 * The image variants' WGSL (#125, #129), loaded only when that variant
 * runs on WebGPU. The `.wgsl` loader prepares them at build time. A variant missing
 * here runs on WebGL.
 */
export const imageGpuShaders: Partial<
  Record<ShaderVariant, () => Promise<{ default: unknown }>>
> = {
  pixel: () => import('./pixel.wgsl'),
  distortion: () => import('./distortion.wgsl'),
  loupe: () => import('./loupe.wgsl'),
  vertical: () => import('./vertical.wgsl'),
  sphere: () => import('./sphere.wgsl'),
  prism: () => import('./prism.wgsl'),
  ripple: () => import('./ripple.wgsl'),
  fluted: () => import('./fluted.wgsl'),
  edgeDetect: () => import('./edgeDetect.wgsl'),
  glass: () => import('./glass.wgsl'),
  liquid: () => import('./liquid.wgsl'),
};
