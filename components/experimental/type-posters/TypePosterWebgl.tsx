'use client';

import { useMemo, useRef } from 'react';
import * as THREE from 'three';

import { useShaderRenderer } from '../useShaderRenderer';
import { posterTexture } from './posterTexture';
import { posters } from './posters';

/** The site's accent colour, as the shader's `accent`. */
const accentColour = () => {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue('--root-color')
    .trim();
  return new THREE.Color(value || '#ff0000');
};

const baseUniforms = () => ({
  type: { value: null },
  mouse: { value: new THREE.Vector2() },
  time: { value: 0 },
  hover: { value: 0 },
  accent: { value: accentColour() },
});

type TypePosterWebglProps = {
  slug: string;
  onError: () => void;
};

/**
 * One poster on WebGL: its composition drawn into a texture, through its
 * GLSL shader. The default renderer (#131), and the fallback for the
 * WebGPU port (#123); split out so three.js loads after the page.
 */
export default function TypePosterWebgl({ slug, onError }: TypePosterWebglProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const poster = posters.find((item) => item.slug === slug);
  const compose = poster?.compose;
  const fragmentShader = poster?.fragment ?? '';
  const input = useMemo(() => (compose ? posterTexture(compose) : undefined), [compose]);
  const shaderConfig = useMemo(() => ({ fragmentShader }), [fragmentShader]);

  useShaderRenderer(containerRef, {
    shaderConfig,
    baseUniforms,
    input,
    antialias: false,
    maxPixelRatio: 2,
    mouseDamping: 0.06,
    onError,
  });

  return <div ref={containerRef} aria-hidden data-renderer="webgl" className="absolute inset-0" />;
}
