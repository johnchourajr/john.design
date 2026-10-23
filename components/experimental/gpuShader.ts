import { cancelFrame, frame as frameLoop } from 'motion/react';
import {
  effect,
  frame,
  sampler,
  surface,
  target,
  texture,
  type Effect,
  type Gpu,
  type Texture,
} from 'vgpu';

import { headlineLayer, type HeadlineLayer } from './headlineLayer';
import { debugNumber as n, mountShaderDebug } from './shaderDebug';
import {
  layerRectOf,
  layoutShader,
  revealRadius,
  shaderPixelRatio,
  startReveal,
  type Reveal,
} from './shaderLayout';
import { trackShaderPointer } from './shaderPointer';
import { takeGpu } from './sharedGpu';
import type { ShaderFrame, ShaderSize } from './useShaderRenderer';

/** A prepared shader, as a `.wgsl` import gives it. */
export type GpuShaderProgram = Parameters<typeof effect>[1];

/**
 * The hero variants on WebGPU (#125), with vgpu: what useShaderRenderer
 * does for them on WebGL, so the two look and behave the same. The image
 * and the headline (#108) are the `image` and `headline` textures, sized
 * and placed by the same layout, pointer and swap reveal (shaderLayout,
 * shaderPointer); see wgsl/layers.wgsl for the uniforms.
 *
 * Browser-only, and rejects when WebGPU is missing or the shader doesn't
 * compile, so the caller can fall back to WebGL. Import it dynamically.
 */
export type GpuShaderOptions = {
  program: GpuShaderProgram;
  /** The image under the headline. Without one the frame is the image. */
  image?: string;
  /** The headline whose text is drawn into the shader. */
  getHeadline?: () => HTMLElement | null;
  reducedMotion: boolean;
  /** Canvas size in CSS px for the container. */
  getSize: (container: HTMLElement) => ShaderSize;
  getFrame?: (container: HTMLElement, size: ShaderSize) => ShaderFrame;
  maxPixelRatio: number;
  maxPixels: number;
  mouseDamping: number;
  restingMouse?: { x: number; y: number };
  pointerTarget?: 'container' | 'window';
  jumpOnEnter?: boolean;
  snapToPixels?: boolean;
  /** Another element whose size feeds `getSize`. */
  resizeWith?: () => Element | null;
  /** Read when a click lands on the canvas. */
  onCanvasClick: () => (() => void) | undefined;
  /** Shows the `?shader-debug` panel, headed with this label. */
  debug?: string;
  /** WebGPU stopped (device loss) after starting: fall back. */
  onLost: () => void;
};

export type GpuShader = {
  /** Swaps in another program, revealed over this one from the last click. */
  swap: (program: GpuShaderProgram) => Promise<void>;
  dispose: () => void;
};

type Params = {
  resolution: [number, number];
  mouse: [number, number];
  imageResolution: [number, number];
  time: number;
  hover: number;
  layerRect: [number, number, number, number];
  headlineRect: [number, number, number, number];
  hasHeadline: number;
  hideImage: number;
  headlineEm: number;
};

const loadImage = async (src: string) => {
  const image = new Image();
  image.src = src;
  await image.decode();
  return image;
};

export async function startGpuShader(
  container: HTMLElement,
  options: GpuShaderOptions,
): Promise<GpuShader> {
  const { reducedMotion, debug } = options;
  if (!('gpu' in navigator)) throw new Error('navigator.gpu is missing');
  const device = takeGpu();
  let gpu: Gpu;
  try {
    gpu = await device.gpu;
  } catch (error) {
    device.release();
    throw error;
  }

  const canvas = document.createElement('canvas');
  canvas.className = 'block';
  canvas.dataset.renderer = 'webgpu';
  const owned: { destroy?: () => void; dispose?: () => void }[] = [];
  let headline: HeadlineLayer | null = null;

  try {
    const canvasSurface = surface(gpu, canvas, {
      autoResize: false,
      size: [1, 1],
      // The page shows through wherever the shader draws nothing.
      alphaMode: 'premultiplied',
      clearColor: [0, 0, 0, 0],
      label: 'hero-shader',
    });
    owned.push(canvasSurface);
    const format = canvasSurface.format;
    // The two frames a swap reveals between.
    const swapFrom = target(gpu, { size: [1, 1], format, clearColor: [0, 0, 0, 0] });
    const swapTo = target(gpu, { size: [1, 1], format, clearColor: [0, 0, 0, 0] });
    const samp = sampler(gpu, { minFilter: 'linear', magFilter: 'linear' });

    // A 1px transparent texture where there's no image or headline yet.
    const blank = () =>
      texture(gpu, {
        kind: '2d',
        size: [1, 1],
        format: 'rgba8unorm',
        usage: ['texture_binding', 'copy_dst'],
      });
    const textures: { image: Texture; headline: Texture } = {
      image: blank(),
      headline: blank(),
    };
    const params: Params = {
      resolution: [1, 1],
      mouse: [0, 0],
      imageResolution: [1, 1],
      time: 0,
      hover: 0,
      layerRect: [0, 0, 1, 1],
      headlineRect: [0, 0, 1, 1],
      hasHeadline: 0,
      hideImage: options.image ? 0 : 1,
      headlineEm: 0,
    };
    // Every program shares these bindings, so a swap starts where the last
    // one is.
    const bind = (program: Effect) =>
      program.set({ params, image: textures.image, headline: textures.headline, samp });

    let current = effect(gpu, options.program, { label: 'hero-shader' });
    bind(current);
    // Fails here, not on the first frame, if the shader doesn't compile.
    await current.compile(canvasSurface);
    const revealer = effect(gpu, (await import('./ImageThreeShader/wgsl/reveal.wgsl')).default as GpuShaderProgram, {
      label: 'hero-shader-reveal',
      set: { from_tex: swapFrom, to_tex: swapTo, samp },
    });
    let outgoing: Effect | null = null;
    let swap: Reveal | null = null;

    // An upload: premultiplied, as the canvas composites.
    const upload = (
      source: HTMLImageElement | HTMLCanvasElement,
      width: number,
      height: number,
      into: Texture,
    ) =>
      gpu.gpu.queue.copyExternalImageToTexture(
        { source },
        { texture: into.gpu, premultipliedAlpha: true },
        [width, height],
      );
    const replace = (key: keyof typeof textures, width: number, height: number) => {
      textures[key].destroy();
      textures[key] = texture(gpu, {
        kind: '2d',
        size: [width, height],
        format: 'rgba8unorm',
        usage: ['texture_binding', 'copy_dst', 'render_attachment'],
        label: `hero-shader-${key}`,
      });
      current.set({ [key]: textures[key] });
      outgoing?.set({ [key]: textures[key] });
      return textures[key];
    };

    const frameBox: ShaderFrame = { x: 0, y: 0, width: 0, height: 0 };
    const snap = { x: 0, y: 0 };
    const buffer: ShaderSize = { width: 0, height: 0 };
    const cursor = trackShaderPointer({
      container,
      canvas,
      pointerTarget: options.pointerTarget,
      jumpOnEnter: options.jumpOnEnter,
      restingMouse: options.restingMouse,
      mouseDamping: options.mouseDamping,
      offset: () => ({ x: frameBox.x + snap.x, y: frameBox.y + snap.y }),
      onClick: options.onCanvasClick,
    });
    owned.push(cursor);

    const animate = !reducedMotion;
    const startTime = performance.now();
    let lastTick = startTime;
    let visible = true;
    let looping = false;
    let stillPending = false;
    let lost = false;
    let renders = 0;
    // Nothing draws until the image is in: an empty frame would flash the
    // headline without its portrait.
    let isReady = !options.image;

    const draw = () => {
      renders += 1;
      params.time = animate ? (performance.now() - startTime) * 0.001 : 0;
      params.mouse = [cursor.mouse.x, cursor.mouse.y];
      params.hover = cursor.hover();
      headline?.beforeRender();
      current.set({ params });
      const radius = outgoing && swap ? revealRadius(swap) : null;
      if (outgoing && radius === null) {
        outgoing.dispose();
        outgoing = null;
      }
      if (outgoing) outgoing.set({ params });
      frame(gpu, (f) => {
        if (!outgoing || radius === null || !swap) {
          f.pass(canvasSurface, current);
          return;
        }
        f.pass(swapFrom, outgoing);
        f.pass(swapTo, current);
        revealer.set({
          reveal: {
            origin: swap.origin,
            size: [buffer.width, buffer.height],
            radius,
            feather: swap.feather,
          },
        });
        f.pass(canvasSurface, revealer);
      });
    };
    // With the debug panel up, a failing frame is recorded, not thrown.
    let recordError: ((message: string) => void) | null = null;
    const render = () => {
      if (!isReady || lost || !buffer.width) return;
      try {
        draw();
      } catch (error) {
        if (!recordError) throw error;
        recordError(`render: ${String(error)}`);
      }
    };

    // Frames run on motion's frame loop, after it has written this frame's
    // styles (postRender), so the headline mid-animation is read as the
    // page shows it.
    const stopLoop = () => {
      looping = false;
      cancelFrame(tick);
    };
    const tick = () => {
      if (!visible || lost) {
        stopLoop();
        return;
      }
      const now = performance.now();
      const elapsed = Math.min((now - lastTick) / 1000, 0.25);
      lastTick = now;
      cursor.step(elapsed);
      render();
    };
    const startLoop = () => {
      if (animate && visible && !lost && !looping) {
        looping = true;
        lastTick = performance.now();
        frameLoop.postRender(tick, true);
      }
    };
    const still = () => {
      stillPending = false;
      render();
    };
    // One frame on request, for when the loop isn't running to draw it.
    const invalidate = () => {
      if (looping || stillPending || lost || !visible) return;
      stillPending = true;
      frameLoop.postRender(still);
    };

    const resize = () => {
      const size = layoutShader(
        container,
        canvas,
        {
          getSize: options.getSize,
          getFrame: options.getFrame,
          snapToPixels: !!options.snapToPixels,
        },
        frameBox,
        snap,
      );
      const ratio = shaderPixelRatio(size.width, size.height, options.maxPixelRatio, options.maxPixels);
      // As three.js sizes its drawing buffer.
      buffer.width = Math.max(1, Math.floor(size.width * ratio));
      buffer.height = Math.max(1, Math.floor(size.height * ratio));
      canvas.style.width = `${size.width}px`;
      canvas.style.height = `${size.height}px`;
      canvasSurface.resize([buffer.width, buffer.height]);
      swapFrom.resize([buffer.width, buffer.height]);
      swapTo.resize([buffer.width, buffer.height]);
      params.resolution = [frameBox.width, frameBox.height];
      params.layerRect = layerRectOf(frameBox, size);
      headline?.resize(buffer);
      render();
    };

    container.appendChild(canvas);

    if (options.getHeadline) {
      headline = headlineLayer(
        options.getHeadline(),
        reducedMotion,
        { canvas, invalidate },
        {
          band: ([x, y, width, height]) => {
            params.headlineRect = [x, y, width, height];
            replace('headline', headline?.surface.width ?? 1, headline?.surface.height ?? 1);
          },
          drawn: () => {
            const band = headline?.surface;
            if (band) upload(band, band.width, band.height, textures.headline);
          },
          live: (live) => {
            params.hasHeadline = live ? 1 : 0;
          },
          em: (em) => {
            params.headlineEm = em;
          },
        },
      );
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    const alsoResize = options.resizeWith?.();
    if (alsoResize) resizeObserver.observe(alsoResize);
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        startLoop();
        if (!animate) invalidate();
      },
      { threshold: 0.1 },
    );
    intersectionObserver.observe(container);

    let disposed = false;
    if (options.image) {
      loadImage(options.image)
        .then((image) => {
          if (disposed) return;
          params.imageResolution = [image.naturalWidth, image.naturalHeight];
          upload(image, image.naturalWidth, image.naturalHeight, replace('image', image.naturalWidth, image.naturalHeight));
          isReady = true;
          resize();
        })
        .catch(() => {
          // An image that won't load leaves the type on its own, as WebGL
          // would show nothing at all: hand back.
          if (!disposed) options.onLost();
        });
    }
    resize();
    startLoop();

    gpu.lost.then(() => {
      lost = true;
      // A lost device can't be shared any more: the next shader asks anew.
      device.forget();
      if (!disposed) options.onLost();
    });

    let panel: ReturnType<typeof mountShaderDebug> | null = null;
    if (debug) {
      let lastRenders = 0;
      let lastTime = performance.now();
      panel = mountShaderDebug(() => {
        const now = performance.now();
        const fps = ((renders - lastRenders) * 1000) / Math.max(1, now - lastTime);
        lastRenders = renders;
        lastTime = now;
        const box = canvas.getBoundingClientRect();
        return [
          `shader ${debug} (webgpu)`,
          `window ${window.innerWidth}x${window.innerHeight} @${window.devicePixelRatio}`,
          `canvas css ${n(box.width)}x${n(box.height)} at ${n(box.left)},${n(box.top)}`,
          `buffer ${canvas.width}x${canvas.height} format ${format}`,
          `lost ${lost} looping ${looping} visible ${visible} ready ${isReady}`,
          `fps ${n(fps)} (renders ${renders})`,
          `hover ${n(cursor.hover(), 2)} -> ${cursor.hoverTarget()}`,
          `pointer ${n(cursor.pointer.x)},${n(cursor.pointer.y)} mouse ${n(cursor.mouse.x)},${n(cursor.mouse.y)}`,
          `frame ${n(frameBox.x)},${n(frameBox.y)} ${n(frameBox.width)}x${n(frameBox.height)} snap ${n(snap.x, 2)},${n(snap.y, 2)}`,
          `hasHeadline ${params.hasHeadline}`,
          ...(headline?.debug() ?? []),
        ];
      });
      recordError = panel.record;
    }

    return {
      swap: async (program) => {
        const next = effect(gpu, program, { label: 'hero-shader' });
        bind(next);
        await next.compile(canvasSurface);
        if (disposed) {
          next.dispose();
          return;
        }
        // A swap mid-swap starts again from what was showing.
        outgoing?.dispose();
        outgoing = null;
        const previous = current;
        current = next;
        if (!animate || !isReady || !buffer.width) {
          previous.dispose();
          invalidate();
          return;
        }
        outgoing = previous;
        swap = startReveal(canvas, buffer, cursor.lastClick());
        startLoop();
      },
      dispose: () => {
        disposed = true;
        panel?.dispose();
        stopLoop();
        cancelFrame(still);
        resizeObserver.disconnect();
        intersectionObserver.disconnect();
        // Hands the headline back to the DOM.
        headline?.dispose();
        current.dispose();
        outgoing?.dispose();
        revealer.dispose();
        textures.image.destroy();
        textures.headline.destroy();
        // The device is shared and outlives this canvas, so free the
        // targets' textures now (Target's type leaves destroy out).
        for (const item of [swapFrom, swapTo] as unknown as { destroy?: () => void }[]) {
          item.destroy?.();
        }
        for (const item of owned) item.dispose?.();
        canvas.remove();
        device.release();
      },
    };
  } catch (error) {
    headline?.dispose();
    for (const item of owned) item.dispose?.();
    canvas.remove();
    device.release();
    throw error;
  }
}
