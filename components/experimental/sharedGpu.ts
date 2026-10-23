import { init, type Gpu } from 'vgpu';

/**
 * One WebGPU device for every shader on the page: the type posters, the
 * hero and the page headers. Asking for a device is the slow part of
 * starting WebGPU, and eight posters each asking for their own was most of
 * the wait. Each shader takes its own surface on the shared device; the
 * device closes when the last one lets go, or is replaced if it's lost.
 */
let shared: { gpu: Promise<Gpu>; users: number } | null = null;

export type SharedGpu = {
  gpu: Promise<Gpu>;
  /** Let go of the device. The last user closes it. */
  release: () => void;
  /** The device was lost: the next shader asks for a new one. */
  forget: () => void;
};

export const takeGpu = (): SharedGpu => {
  shared ??= { gpu: init(), users: 0 };
  shared.users += 1;
  const current = shared;
  return {
    gpu: current.gpu,
    release: () => {
      current.users -= 1;
      if (current.users > 0) return;
      if (shared === current) shared = null;
      current.gpu.then((gpu) => gpu.dispose()).catch(() => {});
    },
    forget: () => {
      if (shared === current) shared = null;
    },
  };
};
