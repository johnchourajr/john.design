import { cancelFrame, frame as frameLoop, useReducedMotion } from 'motion/react';
import { useCallback, useEffect, useRef, type RefObject } from 'react';
import * as THREE from 'three';
import { debugNumber as n, mountShaderDebug } from './shaderDebug';
import { useShaderUniforms } from './useShaderUniforms';

/** A fullscreen-plane shader: the program plus any extra uniforms. */
export type ShaderConfig = {
  /** Optional vertex shader. Defaults to a plain UV pass-through. */
  vertexShader?: string;
  fragmentShader: string;
  /** Extra uniforms. Their values stay live through useShaderUniforms. */
  uniforms?: Record<string, THREE.IUniform>;
};

export type ShaderSize = { width: number; height: number };

/** A rectangle in CSS pixels, measured from the canvas's top left. */
export type ShaderFrame = ShaderSize & { x: number; y: number };

/** What a shader's input (an image, a video) gets when the renderer builds. */
export type ShaderInputContext = {
  material: THREE.ShaderMaterial;
  /** Call once the input can be drawn: the plane joins the scene and a frame renders. */
  ready: () => void;
  /** The visitor prefers reduced motion: show a still, don't play. */
  reducedMotion: boolean;
  /** The WebGL canvas, for inputs that line themselves up with the page. */
  canvas: HTMLCanvasElement;
  /** Asks for one frame when the loop isn't running, e.g. after new texture data. */
  invalidate: () => void;
};

export type ShaderInputHandle = {
  /** Return false to skip animation frames, e.g. while a video is paused. */
  shouldAnimate?: () => boolean;
  /** Runs before every render, e.g. to upload the next video frame. */
  beforeRender?: () => void;
  /** Runs after the canvas resizes, with its drawing buffer in device pixels. */
  resize?: (buffer: ShaderSize) => void;
  /** Lines for the `?shader-debug` panel. */
  debug?: () => string[];
  dispose: () => void;
};

/**
 * Loads the shader's input onto the material. Memoize it: a new identity
 * rebuilds the renderer. Without an input the plane draws straight away.
 */
export type ShaderInput = (context: ShaderInputContext) => ShaderInputHandle;

export type ShaderRendererOptions = {
  shaderConfig: ShaderConfig;
  /** Creates the uniforms the component owns. Keep it a stable function. */
  baseUniforms: () => Record<string, THREE.IUniform>;
  input?: ShaderInput;
  /** Canvas size in CSS pixels for the container. Keep it stable. */
  getSize?: (container: HTMLElement) => ShaderSize;
  antialias?: boolean;
  /** Upper bound on the device pixel ratio. 1 renders at CSS pixels. */
  maxPixelRatio?: number;
  /**
   * Upper bound on the drawing buffer's area in device pixels. The ratio
   * drops below the screen's once the canvas would pass it, so a very wide
   * window can't ask for an unbounded buffer.
   */
  maxPixels?: number;
  /** `pixels` from the container's top left, or `ndc` (-1 to 1, y up). */
  mouseSpace?: 'pixels' | 'ndc';
  /**
   * Fraction of the way the mouse uniform moves toward the pointer per 60th
   * of a second, whatever the frame rate. 1 is undamped.
   */
  mouseDamping?: number;
  /**
   * The part of the canvas the shader treats as its frame. `resolution` is
   * its size and `mouse` (in `pixels`) is measured from its top left, so a
   * shader written for a canvas of that size keeps its look when the canvas
   * grows past it. A material with a `layerRect` uniform gets the frame in
   * UV space: offset (x, and y from the bottom), then size. Defaults to the
   * whole canvas. Keep it stable.
   */
  getFrame?: (container: HTMLElement, size: ShaderSize) => ShaderFrame;
  /** The `mouse` value until the pointer first moves, in `pixels` from the frame. */
  restingMouse?: { x: number; y: number };
  /**
   * Where pointer moves are heard. `container` (the default) follows the
   * pointer only while it is over the canvas's container. `window` follows
   * it anywhere, for a canvas that sits under other content or ignores
   * pointer events.
   */
  pointerTarget?: 'container' | 'window';
  /** WebGL is unavailable, or the context was lost. Nothing draws; show a fallback. */
  onError?: () => void;
  /**
   * Line the canvas up with whole CSS pixels: nudge it by under a pixel and
   * draw the frame back where it was. The browser snaps an untransformed
   * canvas itself, but one inside a transform can land on a half pixel and
   * be resampled when composited, which softens text drawn into it. The
   * frame keeps its exact place on the page.
   */
  snapToPixels?: boolean;
  /** Another element whose size feeds `getSize`, e.g. content the canvas has to cover. */
  resizeWith?: () => Element | null;
  /**
   * Jump `mouse` straight to the pointer when it arrives over the canvas,
   * instead of gliding in from wherever it was. For effects that wait off
   * the canvas at rest. Touch always jumps.
   */
  jumpOnEnter?: boolean;
  /** Shows the `?shader-debug` panel, headed with this label. */
  debug?: string;
};

/** Seconds for `hover` to cover most of the way to its target. */
const HOVER_EASE = 0.18;

export const defaultVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/** The container's content box. */
export const contentBoxSize = (container: HTMLElement): ShaderSize => {
  const style = getComputedStyle(container);
  return {
    width:
      container.clientWidth -
      parseFloat(style.paddingLeft) -
      parseFloat(style.paddingRight),
    height:
      container.clientHeight -
      parseFloat(style.paddingTop) -
      parseFloat(style.paddingBottom),
  };
};

/**
 * Runs several inputs on one material, e.g. an image and a headline. The
 * plane joins the scene once every input has called `ready`.
 */
export const combineInputs =
  (...inputs: ShaderInput[]): ShaderInput =>
  (context) => {
    let pending = inputs.length;
    const handles = inputs.map((input) => {
      let called = false;
      return input({
        ...context,
        ready: () => {
          if (called) return;
          called = true;
          pending -= 1;
          if (pending === 0) context.ready();
        },
      });
    });
    // Plain loops: these run every frame and shouldn't allocate.
    return {
      shouldAnimate: () => {
        for (const handle of handles) {
          if (handle.shouldAnimate && !handle.shouldAnimate()) return false;
        }
        return true;
      },
      beforeRender: () => {
        for (const handle of handles) handle.beforeRender?.();
      },
      resize: (buffer) => {
        for (const handle of handles) handle.resize?.(buffer);
      },
      debug: () => handles.flatMap((handle) => handle.debug?.() ?? []),
      dispose: () => {
        for (const handle of handles) handle.dispose();
      },
    };
  };

/**
 * The one WebGL renderer behind GenThreeShader, ImageThreeShader and
 * VideoThreeShader (#91). It owns the renderer, scene, camera and plane,
 * sizing and pixel ratio, the frame loop, pausing while off-screen,
 * `prefers-reduced-motion` (one still frame, no loop) and cleanup.
 *
 * Every material gets a `resolution` uniform: the frame's size in CSS
 * pixels (the whole canvas unless `getFrame` says otherwise), kept current
 * as the container resizes (#103). The core also drives `time`, `mouse` and
 * `layerRect` when the material has them. Everything else comes from
 * `baseUniforms`, `shaderConfig` and the `input`.
 *
 * Returns `capture`, which renders a frame and reads it back as a PNG in the
 * same task. A WebGL drawing buffer is only guaranteed until the browser
 * composites, so the two must not be split up; doing both here keeps that
 * true without paying for `preserveDrawingBuffer` on every frame.
 */
export function useShaderRenderer(
  containerRef: RefObject<HTMLElement | null>,
  {
    shaderConfig,
    baseUniforms,
    input,
    getSize = contentBoxSize,
    antialias = false,
    maxPixelRatio = 1,
    maxPixels = Infinity,
    mouseSpace = 'pixels',
    mouseDamping = 1,
    getFrame,
    restingMouse,
    pointerTarget = 'container',
    onError,
    snapToPixels = false,
    resizeWith,
    jumpOnEnter = false,
    debug,
  }: ShaderRendererOptions,
) {
  // Fixed for the life of the component (motion reads it once).
  const reducedMotion = useReducedMotion() ?? false;
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const invalidateRef = useRef<() => void>(() => {});
  const captureRef = useRef<() => Promise<Blob | null>>(() =>
    Promise.resolve(null),
  );
  // Read when it fires, so a new callback doesn't rebuild the renderer.
  const onErrorRef = useRef(onError);

  const uniformKeys = useShaderUniforms(materialRef, shaderConfig.uniforms);

  // useShaderUniforms has just written new values. When nothing is animating,
  // draw them once so a settings change still shows.
  useEffect(() => {
    onErrorRef.current = onError;
    invalidateRef.current();
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const animate = !reducedMotion;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias });
    } catch {
      // No WebGL: blocked, unsupported or out of contexts. Nothing mounts,
      // so whatever the page renders without the shader stays.
      onErrorRef.current?.();
      return;
    }
    const pixelRatio = (width = 1, height = 1) =>
      Math.min(
        window.devicePixelRatio,
        maxPixelRatio,
        Math.sqrt(maxPixels / Math.max(1, width * height)),
      );
    renderer.setPixelRatio(pixelRatio());
    const canvas = renderer.domElement;
    container.appendChild(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        resolution: { value: new THREE.Vector2() },
        ...baseUniforms(),
        ...shaderConfig.uniforms,
      },
      vertexShader: shaderConfig.vertexShader || defaultVertexShader,
      fragmentShader: shaderConfig.fragmentShader,
    });
    materialRef.current = material;
    const mesh = new THREE.Mesh(geometry, material);
    const uniforms = material.uniforms;

    const startTime = performance.now();
    const pointer = { x: restingMouse?.x ?? 0, y: restingMouse?.y ?? 0 };
    const mouse = { ...pointer };
    const frame: ShaderFrame = { x: 0, y: 0, width: 0, height: 0 };
    // How far the canvas is nudged onto the pixel grid, in CSS pixels.
    const snap = { x: 0, y: 0 };
    const buffer = new THREE.Vector2();
    let visible = true;
    let isReady = false;
    let lost = false;
    let looping = false;
    let stillPending = false;
    // `hover`: 1 while a pointer or finger is over the canvas, eased.
    let hover = 0;
    let hoverTarget = 0;
    let lastTick = performance.now();
    let handle: ShaderInputHandle | null = null;

    let renders = 0;
    const draw = () => {
      renders += 1;
      if (uniforms.time) {
        uniforms.time.value = animate
          ? (performance.now() - startTime) * 0.001
          : 0;
      }
      uniforms.mouse?.value.set(mouse.x, mouse.y);
      if (uniforms.hover) uniforms.hover.value = hover;
      // Inputs prepare a frame only once the plane is drawn, so nothing
      // swaps itself out for a canvas that is still empty.
      if (isReady) handle?.beforeRender?.();
      renderer.render(scene, camera);
    };
    // With the debug panel up, a failing frame is recorded, not thrown.
    let recordError: ((message: string) => void) | null = null;
    const render = debug
      ? () => {
          try {
            draw();
          } catch (error) {
            recordError?.(`render: ${String(error)}`);
          }
        }
      : draw;

    // Frames run on motion's frame loop, after it has written this frame's
    // styles (postRender), so an input that reads the page, such as the
    // headline mid-animation, sees the same frame the page shows.
    const stopLoop = () => {
      looping = false;
      cancelFrame(tick);
    };

    const tick = () => {
      if (!visible || lost) {
        stopLoop();
        return;
      }
      if (handle?.shouldAnimate && !handle.shouldAnimate()) return;
      const now = performance.now();
      const elapsed = Math.min((now - lastTick) / 1000, 0.25);
      lastTick = now;
      // Both ease by elapsed time, so they move as fast at 30, 60 or 120
      // frames a second. mouseDamping is the share per 60th of a second.
      hover += (hoverTarget - hover) * (1 - Math.exp(-elapsed / HOVER_EASE));
      if (Math.abs(hoverTarget - hover) < 0.001) hover = hoverTarget;
      const follow = 1 - Math.pow(1 - mouseDamping, elapsed * 60);
      mouse.x += (pointer.x - mouse.x) * follow;
      mouse.y += (pointer.y - mouse.y) * follow;
      render();
    };

    const startLoop = () => {
      if (animate && visible && !lost && !looping) {
        looping = true;
        frameLoop.postRender(tick, true);
      }
    };

    const still = () => {
      stillPending = false;
      if (!lost) render();
    };

    // One frame on request, for when the loop isn't running to draw it.
    // Off-screen, it waits: the loop or the next visible frame draws it.
    const invalidate = () => {
      const animating = looping && handle?.shouldAnimate?.() !== false;
      if (animating || stillPending || lost || !visible) return;
      stillPending = true;
      frameLoop.postRender(still);
    };

    const resize = () => {
      const size = getSize(container);
      let { width, height } = size;
      Object.assign(
        frame,
        getFrame ? getFrame(container, size) : { x: 0, y: 0, width, height },
      );
      if (snapToPixels) {
        const bounds = container.getBoundingClientRect();
        const left = bounds.left + window.scrollX;
        const top = bounds.top + window.scrollY;
        snap.x = Math.round(left) - left;
        snap.y = Math.round(top) - top;
        canvas.style.transform = `translate(${snap.x}px, ${snap.y}px)`;
        frame.x -= snap.x;
        frame.y -= snap.y;
        width = Math.ceil(width + Math.abs(snap.x));
        height = Math.ceil(height + Math.abs(snap.y));
      }
      // Zoom and moving between screens change the ratio, and both resize.
      renderer.setPixelRatio(pixelRatio(width, height));
      renderer.setSize(width, height);
      uniforms.resolution.value.set(frame.width, frame.height);
      uniforms.layerRect?.value.set(
        frame.x / width,
        1 - (frame.y + frame.height) / height,
        frame.width / width,
        frame.height / height,
      );
      renderer.getDrawingBufferSize(buffer);
      handle?.resize?.({ width: buffer.x, height: buffer.y });
      // setSize clears the canvas, so draw straight away.
      render();
    };

    const ready = () => {
      isReady = true;
      scene.add(mesh);
      resize();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    const alsoResize = resizeWith?.();
    if (alsoResize) resizeObserver.observe(alsoResize);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        startLoop();
        // Without the loop, catch up on anything that changed off-screen.
        if (!animate) invalidate();
      },
      { threshold: 0.1 },
    );
    intersectionObserver.observe(container);

    const setPointer = (clientX: number, clientY: number) => {
      const bounds = container.getBoundingClientRect();
      const x = clientX - bounds.left;
      const y = clientY - bounds.top;
      if (mouseSpace === 'ndc') {
        pointer.x = (x / bounds.width) * 2 - 1;
        pointer.y = -(y / bounds.height) * 2 + 1;
      } else {
        pointer.x = x - frame.x - snap.x;
        pointer.y = y - frame.y - snap.y;
      }
    };

    const isOverCanvas = (clientX: number, clientY: number) => {
      const area = canvas.getBoundingClientRect();
      return (
        clientX >= area.left &&
        clientX <= area.right &&
        clientY >= area.top &&
        clientY <= area.bottom
      );
    };

    // Mirrored on the canvas as data-hover, for tests and devtools. Only
    // written when it changes.
    const setHoverTarget = (next: number) => {
      if (hoverTarget === next) return;
      hoverTarget = next;
      canvas.dataset.hover = String(next);
    };

    // The effect eases in the first time a pointer arrives, then stays:
    // when the pointer leaves or a finger lifts, the lens holds its last
    // place, like an object left on the page.
    const arrive = (clientX: number, clientY: number, jump: boolean) => {
      setPointer(clientX, clientY);
      // Arriving from rest: start where the pointer is, not where it was.
      if (jump && hover < 0.05) {
        mouse.x = pointer.x;
        mouse.y = pointer.y;
      }
      setHoverTarget(1);
    };

    // A mouse or pen. Touch has its own handler below.
    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      // Heard on the container, the pointer is over it. Heard on the
      // window, it only counts over the canvas.
      if (
        pointerTarget === 'container' ||
        isOverCanvas(event.clientX, event.clientY)
      ) {
        arrive(event.clientX, event.clientY, jumpOnEnter);
      }
    };

    // A finger drives the effect while it's down on the canvas, scrolling
    // included (touch events keep coming while the page scrolls). Listeners
    // are passive, so scrolling is never held up.
    const handleTouch = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch && isOverCanvas(touch.clientX, touch.clientY)) {
        arrive(touch.clientX, touch.clientY, true);
      }
    };

    const pointerSource: HTMLElement | Window =
      pointerTarget === 'window' ? window : container;
    const listen = { passive: true };
    pointerSource.addEventListener(
      'pointermove',
      handlePointerMove as EventListener,
      listen,
    );
    window.addEventListener('touchstart', handleTouch, listen);
    window.addEventListener('touchmove', handleTouch, listen);

    // A lost context draws nothing, so hand back to the fallback. Disposing
    // the input first lets it restore anything it hid.
    const handleContextLost = () => {
      lost = true;
      stopLoop();
      handle?.dispose();
      handle = null;
      onErrorRef.current?.();
    };
    canvas.addEventListener('webglcontextlost', handleContextLost);

    if (input) {
      handle = input({ material, ready, reducedMotion, canvas, invalidate });
      resize();
    } else {
      ready();
    }
    startLoop();

    let panel: ReturnType<typeof mountShaderDebug> | null = null;
    if (debug) {
      const gl = renderer.getContext();
      const maxRenderbuffer = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);
      const maxViewport = gl.getParameter(gl.MAX_VIEWPORT_DIMS) as Int32Array;
      let lastRenders = 0;
      let lastTime = performance.now();
      let fps = 0;
      panel = mountShaderDebug(() => {
        const now = performance.now();
        fps = ((renders - lastRenders) * 1000) / Math.max(1, now - lastTime);
        lastRenders = renders;
        lastTime = now;
        const box = canvas.getBoundingClientRect();
        const agent = navigator.userAgent
          .replace(/Mozilla\/5\.0 |\(KHTML, like Gecko\) |AppleWebKit\/[\d.]+ /g, '')
          .slice(0, 110);
        return [
          `shader ${debug}`,
          `window ${window.innerWidth}x${window.innerHeight} @${window.devicePixelRatio}`,
          `canvas css ${n(box.width)}x${n(box.height)} at ${n(box.left)},${n(box.top)}`,
          `buffer ${canvas.width}x${canvas.height} (gl ${gl.drawingBufferWidth}x${gl.drawingBufferHeight}) ratio ${n(renderer.getPixelRatio(), 2)}`,
          `max renderbuffer ${maxRenderbuffer}, viewport ${maxViewport?.[0]}x${maxViewport?.[1]}`,
          `lost ${lost || gl.isContextLost()} looping ${looping} visible ${visible} ready ${isReady}`,
          `fps ${n(fps)} (renders ${renders})`,
          `hover ${n(hover, 2)} -> ${hoverTarget}`,
          `pointer ${n(pointer.x)},${n(pointer.y)} mouse ${n(mouse.x)},${n(mouse.y)}`,
          `frame ${n(frame.x)},${n(frame.y)} ${n(frame.width)}x${n(frame.height)} snap ${n(snap.x, 2)},${n(snap.y, 2)}`,
          ...(handle?.debug?.() ?? []),
          agent,
        ];
      });
      recordError = panel.record;
    }

    invalidateRef.current = invalidate;
    captureRef.current = () =>
      new Promise((resolve) => {
        render();
        canvas.toBlob(resolve, 'image/png');
      });

    return () => {
      panel?.dispose();
      invalidateRef.current = () => {};
      captureRef.current = () => Promise.resolve(null);
      stopLoop();
      cancelFrame(still);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      pointerSource.removeEventListener(
        'pointermove',
        handlePointerMove as EventListener,
      );
      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('touchmove', handleTouch);
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      handle?.dispose();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      scene.clear();
      container.removeChild(canvas);
      materialRef.current = null;
    };
    // Rebuild only when the program, the input or the renderer options
    // change. Uniform values reach the live material through
    // useShaderUniforms, so shaderConfig.uniforms is left out on purpose.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    containerRef,
    shaderConfig.fragmentShader,
    shaderConfig.vertexShader,
    uniformKeys,
    baseUniforms,
    input,
    getSize,
    antialias,
    maxPixelRatio,
    maxPixels,
    mouseSpace,
    mouseDamping,
    getFrame,
    restingMouse,
    pointerTarget,
    snapToPixels,
    resizeWith,
    jumpOnEnter,
    debug,
    reducedMotion,
  ]);

  const capture = useCallback(() => captureRef.current(), []);

  return { capture };
}
