import { init, type Gpu } from 'vgpu';

/**
 * One WebGPU device for every shader on the page: the type posters, the
 * hero and the page headers. Asking for a device is the slow part of
 * starting WebGPU, and eight posters each asking for their own was most of
 * the wait. Each shader takes its own surface on the shared device.
 *
 * The device stays open between pages, rather than closing when the last
 * shader unmounts: reopening it cost ~300ms on every client-side
 * navigation, and it holds nothing a page left behind (each shader frees
 * its own textures). It's replaced if it's lost.
 */
let shared: Promise<Gpu> | null = null;

export type SharedGpu = {
  gpu: Promise<Gpu>;
  /** The device was lost: the next shader asks for a new one. */
  forget: () => void;
};

export const takeGpu = (): SharedGpu => {
  const current = (shared ??= init());
  // A device that failed to start isn't kept: the next shader tries again.
  current.catch(() => {
    if (shared === current) shared = null;
  });
  return {
    gpu: current,
    forget: () => {
      if (shared === current) shared = null;
    },
  };
};
