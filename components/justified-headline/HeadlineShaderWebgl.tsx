'use client';

import { useMemo, useRef } from 'react';
import * as THREE from 'three';

import { headlineTexture, headlineUniforms } from '../experimental/headlineTexture';
import { useShaderRenderer } from '../experimental/useShaderRenderer';
import { HEADLINE_SHADER, offCanvas, viewportSquare } from './headlineShaderOptions';

const baseUniforms = () => ({
  image: { value: null },
  imageResolution: { value: new THREE.Vector2(1, 1) },
  mouse: { value: new THREE.Vector2() },
  time: { value: 0 },
  ...headlineUniforms(),
  // Type on its own: no image, and texture space is the canvas itself.
  hideImage: { value: 1 },
});

type HeadlineShaderWebglProps = {
  /** The headline whose text is drawn. */
  getRoot: () => HTMLElement | null;
  fragmentShader: string;
  onError: () => void;
  /** Shows the `?shader-debug` panel, headed with this label. */
  debug?: string;
  /** A click on the headline (the canvas itself ignores the pointer). */
  onCanvasClick?: () => void;
  /** The first frame is on screen. */
  onFirstFrame?: () => void;
};

/**
 * A canvas over a headline that draws the headline's text through one of
 * the hero shaders (#108), on WebGL: the fallback for HeadlineShaderLayer
 * (#125). Split out so three.js loads with it, only when it's needed.
 */
export default function HeadlineShaderWebgl({
  getRoot,
  fragmentShader,
  onError,
  debug,
  onCanvasClick,
  onFirstFrame,
}: HeadlineShaderWebglProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const input = useMemo(() => headlineTexture(getRoot), [getRoot]);
  const shaderConfig = useMemo(() => ({ fragmentShader }), [fragmentShader]);

  useShaderRenderer(containerRef, {
    shaderConfig,
    baseUniforms,
    input,
    // Multisampling only smooths polygon edges; this plane's are the canvas's.
    antialias: false,
    ...HEADLINE_SHADER,
    getFrame: viewportSquare,
    restingMouse: offCanvas,
    onError,
    debug,
    onCanvasClick,
    onFirstFrame,
  });

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="absolute inset-0 pointer-events-none"
    />
  );
}
