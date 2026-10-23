'use client';

import { useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';

import type { GpuShader, GpuShaderOptions, GpuShaderProgram } from '../gpuShader';
import type { ShaderVariant } from './shaders/types';
import { heroGpuShaders } from './wgsl';

type Renderer = 'webgpu' | 'webgl';

/**
 * WebGPU unless the browser has none, the variant has no WGSL, or
 * `?shader-renderer=webgl` asks for the fallback (to compare the two).
 * Client only: read once, when the canvas first mounts.
 */
const preferredRenderer = (variant: ShaderVariant): Renderer => {
  const forced = new URLSearchParams(window.location.search).get('shader-renderer');
  if (forced === 'webgl' || !('gpu' in navigator) || !heroGpuShaders[variant]) return 'webgl';
  return 'webgpu';
};

const loadProgram = async (variant: ShaderVariant) => {
  const load = heroGpuShaders[variant];
  if (!load) throw new Error(`no WGSL for ${variant}`);
  return (await load()).default as GpuShaderProgram;
};

export type HeroShaderGpuOptions = Omit<
  GpuShaderOptions,
  'program' | 'reducedMotion' | 'onLost' | 'onCanvasClick'
>;

type HeroShaderCanvasProps = {
  variant: ShaderVariant;
  /** Memoize it: a new identity rebuilds the canvas. */
  options: HeroShaderGpuOptions;
  onCanvasClick?: () => void;
  className?: string;
  /** The WebGL canvas, for when WebGPU is missing, fails or is lost. */
  fallback: ReactNode;
};

/**
 * A hero shader (#125): on WebGPU with vgpu, falling back to `fallback`
 * (the WebGL canvas) when WebGPU is missing, doesn't start, or is lost. A
 * new variant swaps in on the live canvas, revealed from the click.
 */
export function HeroShaderCanvas({
  variant,
  options,
  onCanvasClick,
  className,
  fallback,
}: HeroShaderCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = !!useReducedMotion();
  const [renderer, setRenderer] = useState<Renderer>(() => preferredRenderer(variant));
  const handleRef = useRef<GpuShader | null>(null);
  // The variant the live canvas shows, or is swapping to.
  const shownRef = useRef<ShaderVariant | null>(null);
  const variantRef = useRef(variant);
  const onClickRef = useRef(onCanvasClick);

  useEffect(() => {
    variantRef.current = variant;
    onClickRef.current = onCanvasClick;
  });

  useEffect(() => {
    const container = containerRef.current;
    if (renderer !== 'webgpu' || !container) return;
    let cancelled = false;
    const fallBack = () => {
      handleRef.current?.dispose();
      handleRef.current = null;
      if (!cancelled) setRenderer('webgl');
    };
    const first = variantRef.current;
    Promise.all([import('../gpuShader'), loadProgram(first)])
      .then(([{ startGpuShader }, program]) =>
        startGpuShader(container, {
          ...options,
          program,
          reducedMotion,
          onLost: fallBack,
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
        // The variant moved on while WebGPU was starting.
        if (variantRef.current !== first) {
          shownRef.current = variantRef.current;
          loadProgram(variantRef.current).then(started.swap).catch(fallBack);
        }
      })
      .catch(fallBack);
    return () => {
      cancelled = true;
      handleRef.current?.dispose();
      handleRef.current = null;
      shownRef.current = null;
    };
  }, [renderer, options, reducedMotion]);

  // A new variant swaps in on the live canvas.
  useEffect(() => {
    const handle = handleRef.current;
    if (!handle || shownRef.current === variant) return;
    shownRef.current = variant;
    loadProgram(variant)
      .then(handle.swap)
      .catch(() => setRenderer('webgl'));
  }, [variant]);

  if (renderer === 'webgl') return <>{fallback}</>;
  return <div ref={containerRef} className={className} />;
}
