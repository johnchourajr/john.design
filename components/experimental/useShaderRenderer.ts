import { useReducedMotion } from 'motion/react';
import { useCallback, useEffect, useRef, type RefObject } from 'react';
import * as THREE from 'three';
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

/** What a shader's input (an image, a video) gets when the renderer builds. */
export type ShaderInputContext = {
  material: THREE.ShaderMaterial;
  /** Call once the input can be drawn: the plane joins the scene and a frame renders. */
  ready: () => void;
  /** The visitor prefers reduced motion: show a still, don't play. */
  reducedMotion: boolean;
};

export type ShaderInputHandle = {
  /** Return false to skip animation frames, e.g. while a video is paused. */
  shouldAnimate?: () => boolean;
  /** Runs before every render, e.g. to upload the next video frame. */
  beforeRender?: () => void;
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
  /** `pixels` from the container's top left, or `ndc` (-1 to 1, y up). */
  mouseSpace?: 'pixels' | 'ndc';
  /** Fraction of the way the mouse uniform moves toward the pointer per frame. 1 is undamped. */
  mouseDamping?: number;
};

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
 * The one WebGL renderer behind GenThreeShader, ImageThreeShader and
 * VideoThreeShader (#91). It owns the renderer, scene, camera and plane,
 * sizing and pixel ratio, the frame loop, pausing while off-screen,
 * `prefers-reduced-motion` (one still frame, no loop) and cleanup.
 *
 * It drives the `time`, `mouse` and `resolution` uniforms when the material
 * has them. Everything else comes from `baseUniforms`, `shaderConfig` and the
 * `input`.
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
    mouseSpace = 'pixels',
    mouseDamping = 1,
  }: ShaderRendererOptions,
) {
  // Fixed for the life of the component (motion reads it once).
  const reducedMotion = useReducedMotion() ?? false;
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const invalidateRef = useRef<() => void>(() => {});
  const captureRef = useRef<() => Promise<Blob | null>>(() =>
    Promise.resolve(null),
  );

  const uniformKeys = useShaderUniforms(materialRef, shaderConfig.uniforms);

  // useShaderUniforms has just written new values. When nothing is animating,
  // draw them once so a settings change still shows.
  useEffect(() => {
    invalidateRef.current();
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const animate = !reducedMotion;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms: { ...baseUniforms(), ...shaderConfig.uniforms },
      vertexShader: shaderConfig.vertexShader || defaultVertexShader,
      fragmentShader: shaderConfig.fragmentShader,
    });
    materialRef.current = material;
    const mesh = new THREE.Mesh(geometry, material);
    const uniforms = material.uniforms;

    const startTime = performance.now();
    const pointer = { x: 0, y: 0 };
    const mouse = { x: 0, y: 0 };
    let visible = true;
    let frameId = 0;
    let stillId = 0;
    let handle: ShaderInputHandle | null = null;

    const render = () => {
      if (uniforms.time) {
        uniforms.time.value = animate
          ? (performance.now() - startTime) * 0.001
          : 0;
      }
      uniforms.mouse?.value.set(mouse.x, mouse.y);
      handle?.beforeRender?.();
      renderer.render(scene, camera);
    };

    const tick = () => {
      if (!visible) {
        frameId = 0;
        return;
      }
      frameId = requestAnimationFrame(tick);
      if (handle?.shouldAnimate && !handle.shouldAnimate()) return;
      mouse.x += (pointer.x - mouse.x) * mouseDamping;
      mouse.y += (pointer.y - mouse.y) * mouseDamping;
      render();
    };

    const startLoop = () => {
      if (animate && visible && !frameId) frameId = requestAnimationFrame(tick);
    };

    // One frame on request, for when the loop isn't running to draw it.
    const invalidate = () => {
      const looping = frameId && handle?.shouldAnimate?.() !== false;
      if (looping || stillId) return;
      stillId = requestAnimationFrame(() => {
        stillId = 0;
        render();
      });
    };

    const resize = () => {
      const { width, height } = getSize(container);
      renderer.setSize(width, height);
      uniforms.resolution?.value.set(width, height);
      // setSize clears the canvas, so draw straight away.
      render();
    };

    const ready = () => {
      scene.add(mesh);
      resize();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        startLoop();
      },
      { threshold: 0.1 },
    );
    intersectionObserver.observe(container);

    const handleMouseMove = (event: MouseEvent) => {
      const bounds = container.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      if (mouseSpace === 'ndc') {
        pointer.x = (x / bounds.width) * 2 - 1;
        pointer.y = -(y / bounds.height) * 2 + 1;
      } else {
        pointer.x = x;
        pointer.y = y;
      }
    };
    container.addEventListener('mousemove', handleMouseMove);

    if (input) {
      handle = input({ material, ready, reducedMotion });
      resize();
    } else {
      ready();
    }
    startLoop();

    invalidateRef.current = invalidate;
    captureRef.current = () =>
      new Promise((resolve) => {
        render();
        renderer.domElement.toBlob(resolve, 'image/png');
      });

    return () => {
      invalidateRef.current = () => {};
      captureRef.current = () => Promise.resolve(null);
      cancelAnimationFrame(frameId);
      cancelAnimationFrame(stillId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      container.removeEventListener('mousemove', handleMouseMove);
      handle?.dispose();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      scene.clear();
      container.removeChild(renderer.domElement);
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
    mouseSpace,
    mouseDamping,
    reducedMotion,
  ]);

  const capture = useCallback(() => captureRef.current(), []);

  return { capture };
}
