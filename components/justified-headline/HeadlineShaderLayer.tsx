'use client';

import { useMemo, useRef } from 'react';
import * as THREE from 'three';

import { headlineTexture, headlineUniforms } from '../experimental/headlineTexture';
import { useShaderRenderer } from '../experimental/useShaderRenderer';

const baseUniforms = () => ({
  image: { value: null },
  imageResolution: { value: new THREE.Vector2(1, 1) },
  mouse: { value: new THREE.Vector2() },
  time: { value: 0 },
  ...headlineUniforms(),
  // Type on its own: no image, and texture space is the canvas itself.
  hideImage: { value: 1 },
});

// Until the pointer moves, the effect waits off the canvas, clear of the type.
const offCanvas = { x: -1e4, y: -1e4 };

type HeadlineShaderLayerProps = {
  /** The headline whose text is drawn. */
  getRoot: () => HTMLElement | null;
  fragmentShader: string;
  onError: () => void;
};

/**
 * A canvas over a headline that draws the headline's text through one of
 * the hero shaders (#108). Split out so three.js loads with it, after the
 * page. See HeadlineShader.
 */
export default function HeadlineShaderLayer({
  getRoot,
  fragmentShader,
  onError,
}: HeadlineShaderLayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const input = useMemo(() => headlineTexture(getRoot), [getRoot]);
  const shaderConfig = useMemo(() => ({ fragmentShader }), [fragmentShader]);

  useShaderRenderer(containerRef, {
    shaderConfig,
    baseUniforms,
    input,
    antialias: true,
    maxPixelRatio: 3,
    mouseDamping: 0.08,
    restingMouse: offCanvas,
    // The canvas ignores the pointer so links and selection under it work.
    pointerTarget: 'window',
    onError,
  });

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="absolute inset-0 pointer-events-none"
    />
  );
}
