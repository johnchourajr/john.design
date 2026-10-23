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
 * WebGL, unless `?poster-renderer=webgpu` asks for the WebGPU port and the
 * browser has it (#131): WebGPU drew the same posters but started slower.
 * Client only: this component never renders on the server.
 */
const preferredRenderer = (slug: string): Renderer => {
  const forced = new URLSearchParams(window.location.search).get('poster-renderer');
  if (forced !== 'webgpu' || !('gpu' in navigator) || !posterShaders[slug]) return 'webgl';
  return 'webgpu';
};

type TypePosterCanvasProps = {
  slug: string;
  onError: () => void;
  /** The first frame is on screen, on whichever renderer drew it. */
  onFirstFrame?: () => void;
};

/**
 * One poster's canvas: on WebGL (#131), or on the WebGPU port with vgpu
 * (#123) when asked, falling back to WebGL when WebGPU is missing, doesn't
 * start, or is lost. The canvas mirrors which one is drawing as
 * `data-renderer`.
 */
export default function TypePosterCanvas({ slug, onError, onFirstFrame }: TypePosterCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = !!useReducedMotion();
  const [renderer, setRenderer] = useState<Renderer>(() => preferredRenderer(slug));
  // Read when the frame lands, so a new callback doesn't restart WebGPU.
  const onFirstFrameRef = useRef(onFirstFrame);
  useEffect(() => {
    onFirstFrameRef.current = onFirstFrame;
  });

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
          onFirstFrame: () => onFirstFrameRef.current?.(),
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

  if (renderer === 'webgl') {
    return <TypePosterWebgl slug={slug} onError={onError} onFirstFrame={onFirstFrame} />;
  }
  return (
    <div ref={containerRef} aria-hidden data-renderer="webgpu" className="absolute inset-0" />
  );
}
