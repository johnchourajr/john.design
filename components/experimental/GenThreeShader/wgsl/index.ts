import type { ShaderVariant } from '../shaders/types';

/**
 * The generative shaders' WGSL (#129), loaded only when that shader runs on
 * WebGPU. The `.wgsl` loader prepares them at build time. A shader missing
 * here runs on WebGL.
 */
export const genGpuShaders: Partial<
  Record<ShaderVariant, () => Promise<{ default: unknown }>>
> = {
  kaleidoscopeShader: () => import('./kaleidoscope.wgsl'),
  spaceTimeShader: () => import('./spaceTime.wgsl'),
  pinwheelShader: () => import('./pinwheel.wgsl'),
  wavesShader: () => import('./waves.wgsl'),
  spiralSphereShader: () => import('./spiralSphere.wgsl'),
};
