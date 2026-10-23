'use client';

import { useReducedMotion } from 'motion/react';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';

import type { GpuShader, GpuShaderOptions, GpuShaderProgram } from './gpuShader';
import { ShaderLoader } from './ShaderLoader';

/** Each variant's WGSL, loaded when it runs on WebGPU. */
export type GpuShaderLoaders = Partial<
  Record<string, () => Promise<{ default: unknown }>>
>;

/**
 * Whether to try WebGPU: only when `?shader-renderer=webgpu` asks for it,
 * and the browser has it. WebGL is the default (#130): on this site's
 * single full-screen passes WebGPU drew the same pixels but started
 * slower (a first-visit pipeline compile WebGL's program cache avoids)
 * and copied every video frame, which vgpu 0.6 can't avoid. The type
 * posters choose their own renderer and stay on WebGPU.
 * Neither changes while the page is open. On the server, and while the
 * page hydrates, it's null: nothing is chosen until the client knows.
 */
const wantsGpu = () =>
  'gpu' in navigator &&
  new URLSearchParams(window.location.search).get('shader-renderer') === 'webgpu';
const unchanging = () => () => {};
const notYet = () => null;

const loadProgram = async (shaders: GpuShaderLoaders, variant: string) => {
  const load = shaders[variant];
  if (!load) throw new Error(`no WGSL for ${variant}`);
  return (await load()).default as GpuShaderProgram;
};

export type GpuShaderCanvasOptions = Omit<
  GpuShaderOptions,
  'program' | 'reducedMotion' | 'onLost' | 'onCanvasClick' | 'uniforms' | 'onFirstFrame'
>;

type GpuShaderCanvasProps = {
  /** Keep it a module constant. */
  shaders: GpuShaderLoaders;
  variant: string;
  /** Memoize it: a new identity rebuilds the canvas. */
  options: GpuShaderCanvasOptions;
  /** Extra `params` fields; new values reach the live canvas. */
  uniforms?: Record<string, number>;
  onCanvasClick?: () => void;
  /** Gets the canvas's PNG capture once it's running. */
  onCapture?: (capture: () => Promise<Blob | null>) => void;
  className?: string;
  /**
   * Covers the canvas's place with ShaderLoader until the first frame
   * (default). Off where something else already stands in, like the DOM
   * headline or the home portrait's poster. It sits at `absolute inset-0`
   * in the nearest positioned ancestor, which should be the canvas's box.
   */
  loader?: boolean;
  /** The first frame is on screen, on whichever renderer drew it. */
  onFirstFrame?: () => void;
  /**
   * The WebGL canvas, for when WebGPU is missing, fails or is lost. It's
   * handed the first-frame callback to pass to its renderer.
   */
  fallback: (onFirstFrame: () => void) => ReactNode;
};

/**
 * A shader on WebGPU with vgpu (#125, #129), falling back to `fallback`
 * (the WebGL canvas) when WebGPU is missing, doesn't start, or is lost. A
 * new variant swaps in on the live canvas, revealed from the click.
 */
export function GpuShaderCanvas({
  shaders,
  variant,
  options,
  uniforms,
  onCanvasClick,
  onCapture,
  className,
  loader = true,
  onFirstFrame,
  fallback,
}: GpuShaderCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = !!useReducedMotion();
  const wants = useSyncExternalStore(unchanging, wantsGpu, notYet);
  // WebGPU failed to start, or was lost: WebGL from here on.
  const [failed, setFailed] = useState(false);
  const handleRef = useRef<GpuShader | null>(null);
  // The variant the live canvas shows, or is swapping to.
  const shownRef = useRef<string | null>(null);
  const variantRef = useRef(variant);
  const onClickRef = useRef(onCanvasClick);
  const uniformsRef = useRef(uniforms);
  const onCaptureRef = useRef(onCapture);
  const onFirstFrameRef = useRef(onFirstFrame);
  const [drawn, setDrawn] = useState(false);
  const handleFirstFrame = useCallback(() => setDrawn(true), []);

  useEffect(() => {
    variantRef.current = variant;
    onClickRef.current = onCanvasClick;
    uniformsRef.current = uniforms;
    onCaptureRef.current = onCapture;
    onFirstFrameRef.current = onFirstFrame;
  });

  // A variant without WGSL shows the fallback until one with it comes back.
  const onGpu = wants === true && !failed && !!shaders[variant];

  useEffect(() => {
    const container = containerRef.current;
    if (!onGpu || !container) return;
    let cancelled = false;
    const fallBack = (reason?: unknown) => {
      // Says why in the console, so a fallback isn't silent.
      if (!cancelled) console.warn('WebGPU shader fell back to WebGL:', reason);
      handleRef.current?.dispose();
      handleRef.current = null;
      if (!cancelled) setFailed(true);
    };
    const first = variantRef.current;
    Promise.all([import('./gpuShader'), loadProgram(shaders, first)])
      .then(([{ startGpuShader }, program]) =>
        startGpuShader(container, {
          ...options,
          program,
          uniforms: uniformsRef.current,
          reducedMotion,
          onLost: fallBack,
          onFirstFrame: handleFirstFrame,
          onCanvasClick: () => onClickRef.current,
        }),
      )
      .then((started) => {
        if (cancelled) {
          started.dispose();
          return;
        }
        handleRef.current = started;
        shownRef.current = first;
        onCaptureRef.current?.(started.capture);
        // The variant moved on while WebGPU was starting.
        if (variantRef.current !== first) {
          shownRef.current = variantRef.current;
          loadProgram(shaders, variantRef.current).then(started.swap).catch(fallBack);
        }
      })
      .catch(fallBack);
    return () => {
      cancelled = true;
      handleRef.current?.dispose();
      handleRef.current = null;
      shownRef.current = null;
    };
  }, [onGpu, shaders, options, reducedMotion, handleFirstFrame]);

  // A new variant swaps in on the live canvas.
  useEffect(() => {
    const handle = handleRef.current;
    if (!handle || shownRef.current === variant || !shaders[variant]) return;
    shownRef.current = variant;
    loadProgram(shaders, variant)
      .then(handle.swap)
      .catch(() => setFailed(true));
  }, [shaders, variant]);

  useEffect(() => {
    if (drawn) onFirstFrameRef.current?.();
  }, [drawn]);

  // Settings reach the live canvas without rebuilding it.
  useEffect(() => {
    if (uniforms) handleRef.current?.setUniforms(uniforms);
  }, [uniforms]);

  // Until the client has chosen, hold the canvas's place.
  let body: ReactNode;
  if (wants === null) body = <div className={className} />;
  else if (!onGpu) body = fallback(handleFirstFrame);
  else body = <div ref={containerRef} className={className} />;

  return (
    <>
      {body}
      {loader && <ShaderLoader visible={!drawn} />}
    </>
  );
}
