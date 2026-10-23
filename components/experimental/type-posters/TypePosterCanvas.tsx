'use client';

import { useReducedMotion } from 'motion/react';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

import type { PosterGpu, PosterShader } from './posterGpu';
import { posters } from './posters';
import { posterShaders } from './wgsl';

// three.js, and the GLSL shaders, load only for the fallback.
const TypePosterWebgl = dynamic(() => import('./TypePosterWebgl'), { ssr: false });

type Renderer = 'webgpu' | 'webgl';

/**
 * WebGPU unless the browser has none, or `?poster-renderer=webgl` asks for
 * the fallback (to compare the two). Client only: this component never
 * renders on the server.
 */
const preferredRenderer = (slug: string): Renderer => {
  const forced = new URLSearchParams(window.location.search).get('poster-renderer');
  if (forced === 'webgl' || !('gpu' in navigator) || !posterShaders[slug]) return 'webgl';
  return 'webgpu';
};

type TypePosterCanvasProps = {
  slug: string;
  onError: () => void;
};

/**
 * One poster's canvas (#123): on WebGPU with vgpu, falling back to WebGL
 * when WebGPU is missing, doesn't start, or is lost. The canvas mirrors
 * which one is drawing as `data-renderer`.
 */
export default function TypePosterCanvas({ slug, onError }: TypePosterCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = !!useReducedMotion();
  const [renderer, setRenderer] = useState<Renderer>(() => preferredRenderer(slug));

  useEffect(() => {
    const container = containerRef.current;
    const poster = posters.find((item) => item.slug === slug);
    const loadShader = posterShaders[slug];
    if (renderer !== 'webgpu' || !container || !poster || !loadShader) return;
    let cancelled = false;
    let handle: PosterGpu | null = null;
    const fallBack = () => {
      handle?.dispose();
      handle = null;
      if (!cancelled) setRenderer('webgl');
    };
    Promise.all([import('./posterGpu'), loadShader()])
      .then(([{ startPosterGpu }, shader]) =>
        startPosterGpu(container, {
          shader: shader.default as PosterShader,
          compose: poster.compose,
          reducedMotion,
          onLost: fallBack,
        }),
      )
      .then((started) => {
        if (cancelled) started.dispose();
        else handle = started;
      })
      .catch(fallBack);
    return () => {
      cancelled = true;
      handle?.dispose();
    };
  }, [renderer, slug, reducedMotion]);

  if (renderer === 'webgl') return <TypePosterWebgl slug={slug} onError={onError} />;
  return (
    <div ref={containerRef} aria-hidden data-renderer="webgpu" className="absolute inset-0" />
  );
}
