import { clock, effect, frameLoop, init, surface } from 'vgpu';
import pinwheelShader from './pinwheel.wgsl';

export type PinwheelParams = {
  rotationSpeed: number;
  vortexStrength: number;
  colorIntensity: number;
};

export type PinwheelController = {
  /** Update slider-driven uniforms without rebuilding anything. */
  setParams: (params: PinwheelParams) => void;
  /** Normalized pointer position, x right and y up, both 0..1. */
  setMouse: (x: number, y: number) => void;
  dispose: () => void;
};

/**
 * Renders the pinwheel shader on `canvas` with vgpu (WebGPU).
 * Rejects when WebGPU is unavailable (`VGPU-RING1-UNSUPPORTED`), so callers
 * can fall back to the three.js/WebGL version.
 *
 * Browser-only: import this module dynamically from an effect so vgpu never
 * evaluates during static prerendering.
 */
export async function startPinwheel(
  canvas: HTMLCanvasElement,
  initial: PinwheelParams,
): Promise<PinwheelController> {
  const gpu = await init();

  try {
    const canvasSurface = surface(gpu, canvas, { dpr: [1, 2] });
    const pinwheel = effect(gpu, pinwheelShader, {
      label: 'pinwheel',
      set: { params: { time: 0, mouse: [0, 0], ...initial } },
    });

    const time = clock(gpu);
    const loop = frameLoop(gpu, (frame) => {
      pinwheel.set({ params: { time: time.time } });
      frame.pass(canvasSurface, pinwheel);
    });

    return {
      setParams: (params) => {
        pinwheel.set({ params: { ...params } });
      },
      setMouse: (x, y) => {
        pinwheel.set({ params: { mouse: [x, y] } });
      },
      dispose: () => {
        loop.stop();
        gpu.dispose();
      },
    };
  } catch (error) {
    gpu.dispose();
    throw error;
  }
}
