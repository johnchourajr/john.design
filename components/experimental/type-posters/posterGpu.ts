import { effect, frame, init, sampler, surface, texture, type Texture } from 'vgpu';

import { paintPoster, posterFontsReady, type ComposePoster } from './posterTexture';

/**
 * A type poster on WebGPU (#123), with vgpu. It does what useShaderRenderer
 * does for the WebGL fallback, so the two look and behave the same: the
 * composition painted at the canvas's own pixels and uploaded as
 * `type_tex`, the pointer damped, `hover` eased in the first time the
 * pointer arrives and then held, `time` in seconds, one still frame with
 * reduced motion, and no drawing while the poster is off-screen.
 *
 * Browser-only, and rejects when WebGPU is missing or the shader doesn't
 * compile, so the caller can fall back to WebGL. Import it dynamically.
 */
export type PosterGpu = { dispose: () => void };

/** A prepared shader, as a `.wgsl` import gives it. */
export type PosterShader = Parameters<typeof effect>[1];

type PosterGpuOptions = {
  shader: PosterShader;
  compose: ComposePoster;
  reducedMotion: boolean;
  /** WebGPU stopped (device loss) after starting: fall back. */
  onLost: () => void;
};

/** Fraction of the way the pointer value moves per 60th of a second. */
const MOUSE_DAMPING = 0.06;
/** Seconds for `hover` to cover most of the way to its target. */
const HOVER_EASE = 0.18;

/** The site's accent colour (--root-color) as 0 to 1 RGB. */
const accentColour = (): [number, number, number] => {
  const value = getComputedStyle(document.documentElement).getPropertyValue('--root-color').trim();
  // The 2D canvas normalises any CSS colour to #rrggbb.
  const ctx = document.createElement('canvas').getContext('2d');
  if (!ctx) return [1, 0, 0];
  ctx.fillStyle = value || '#ff0000';
  const hex = ctx.fillStyle.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255) as [number, number, number];
};

export async function startPosterGpu(
  container: HTMLElement,
  { shader, compose, reducedMotion, onLost }: PosterGpuOptions,
): Promise<PosterGpu> {
  if (!('gpu' in navigator)) throw new Error('navigator.gpu is missing');
  const gpu = await init();
  const canvas = document.createElement('canvas');
  canvas.className = 'block w-full h-full';
  canvas.setAttribute('aria-hidden', 'true');

  try {
    await posterFontsReady();
    container.appendChild(canvas);
    const canvasSurface = surface(gpu, canvas, { dpr: [1, 2] });
    const poster = effect(gpu, shader, {
      label: 'type-poster',
      set: {
        samp: sampler(gpu, { minFilter: 'linear', magFilter: 'linear' }),
        params: { resolution: [1, 1], mouse: [0, 0], time: 0, hover: 0, accent: accentColour() },
      },
    });

    // The composition, painted at the canvas's pixels and uploaded. A new
    // size needs a new texture: textures don't resize.
    const source = document.createElement('canvas');
    let layers: Texture | null = null;
    const upload = (width: number, height: number) => {
      const size = { width: canvas.clientWidth, height: canvas.clientHeight };
      if (!size.width || !size.height) return;
      paintPoster(source, compose, { width, height }, size);
      const next = texture(gpu, {
        kind: '2d',
        size: [width, height],
        format: 'rgba8unorm',
        usage: ['texture_binding', 'copy_dst', 'render_attachment'],
        label: 'type-poster-layers',
      });
      gpu.gpu.queue.copyExternalImageToTexture({ source }, { texture: next.gpu }, [width, height]);
      poster.set({ type_tex: next, params: { resolution: [size.width, size.height] } });
      layers?.destroy();
      layers = next;
    };
    const unsubscribe = canvasSurface.onResize(({ width, height }) => upload(width, height));
    // Fails here, not on the first frame, if the shader doesn't compile.
    await poster.compile(canvasSurface);

    // The pointer, measured from the poster's top left in CSS px.
    const pointer = { x: 0, y: 0 };
    const mouse = { x: 0, y: 0 };
    let hover = 0;
    let hoverTarget = 0;
    const arrive = (clientX: number, clientY: number) => {
      const bounds = container.getBoundingClientRect();
      pointer.x = clientX - bounds.left;
      pointer.y = clientY - bounds.top;
      hoverTarget = 1;
      canvas.dataset.hover = '1';
      if (reducedMotion) render();
    };
    const onPointer = (event: PointerEvent) => arrive(event.clientX, event.clientY);
    const onTouch = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch) arrive(touch.clientX, touch.clientY);
    };
    container.addEventListener('pointermove', onPointer);
    container.addEventListener('touchstart', onTouch, { passive: true });
    container.addEventListener('touchmove', onTouch, { passive: true });

    const start = performance.now();
    let last = start;
    const render = () => {
      const now = performance.now();
      const elapsed = Math.min(0.1, (now - last) / 1000);
      last = now;
      if (reducedMotion) {
        mouse.x = pointer.x;
        mouse.y = pointer.y;
        hover = hoverTarget;
      } else {
        const damping = 1 - (1 - MOUSE_DAMPING) ** (elapsed * 60);
        mouse.x += (pointer.x - mouse.x) * damping;
        mouse.y += (pointer.y - mouse.y) * damping;
        hover += (hoverTarget - hover) * (1 - Math.exp(-elapsed / HOVER_EASE));
      }
      poster.set({
        params: {
          mouse: [mouse.x, mouse.y],
          time: reducedMotion ? 0 : (now - start) / 1000,
          hover,
        },
      });
      frame(gpu, (current) => {
        current.pass(canvasSurface, poster);
      });
    };

    // Draw every frame while the poster is on screen; with reduced motion,
    // only when something changes.
    let raf = 0;
    let visible = true;
    const tick = () => {
      render();
      raf = visible && !reducedMotion ? requestAnimationFrame(tick) : 0;
    };
    const resume = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    const intersection = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) resume();
      },
      { threshold: 0.1 },
    );
    intersection.observe(container);
    // The surface only notices a new size when a frame runs, so a resize
    // asks for one, even when the loop is idle.
    const resizes = new ResizeObserver(() => resume());
    resizes.observe(container);
    resume();

    let disposed = false;
    gpu.lost.then(() => {
      if (!disposed) onLost();
    });

    return {
      dispose: () => {
        disposed = true;
        cancelAnimationFrame(raf);
        intersection.disconnect();
        resizes.disconnect();
        container.removeEventListener('pointermove', onPointer);
        container.removeEventListener('touchstart', onTouch);
        container.removeEventListener('touchmove', onTouch);
        unsubscribe();
        gpu.dispose();
        canvas.remove();
      },
    };
  } catch (error) {
    gpu.dispose();
    canvas.remove();
    throw error;
  }
}
