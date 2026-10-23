/**
 * Each poster's WGSL (#123), by slug, loaded only when that poster runs on
 * WebGPU. The `.wgsl` loader prepares them at build time.
 */
export const posterShaders: Record<string, () => Promise<{ default: unknown }>> = {
  'out-of-register': () => import('./outOfRegister.wgsl'),
  vortices: () => import('./vortices.wgsl'),
  'mass-bends-light': () => import('./massBendsLight.wgsl'),
  'everything-falls': () => import('./everythingFalls.wgsl'),
  interference: () => import('./interference.wgsl'),
  rocaille: () => import('./rocaille.wgsl'),
  afterimage: () => import('./afterimage.wgsl'),
  'dot-gain': () => import('./dotGain.wgsl'),
};
