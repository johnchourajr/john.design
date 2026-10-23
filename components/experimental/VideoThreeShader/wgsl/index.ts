import type { fragmentThreeVideoShaders } from '../shaders';

/**
 * The video shaders' WGSL (#129), loaded only when that shader runs on
 * WebGPU. The `.wgsl` loader prepares them at build time. A shader missing
 * here runs on WebGL.
 */
export const videoGpuShaders: Partial<
  Record<keyof typeof fragmentThreeVideoShaders, () => Promise<{ default: unknown }>>
> = {
  vhs: () => import('./vhs.wgsl'),
  retroGlow: () => import('./retroGlow.wgsl'),
  videoProcess: () => import('./videoProcess.wgsl'),
  buildDither: () => import('./buildDither.wgsl'),
};
