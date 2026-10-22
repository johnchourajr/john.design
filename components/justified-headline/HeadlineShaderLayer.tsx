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

// Until the pointer arrives, the effect waits off the canvas.
const offCanvas = { x: -1e4, y: -1e4 };

/**
 * The effects are sized from their frame. The home hero's frame is its
 * portrait, a square as wide as the viewport, so a headline on its own is
 * measured against the same square: the lens, sphere and cube come out the
 * same size in CSS pixels on every page.
 */
const viewportSquare = () => ({
  x: 0,
  y: 0,
  width: window.innerWidth,
  height: window.innerWidth,
});

type HeadlineShaderLayerProps = {
  /** The headline whose text is drawn. */
  getRoot: () => HTMLElement | null;
  fragmentShader: string;
  onError: () => void;
  /** Shows the `?shader-debug` panel, headed with this label. */
  debug?: string;
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
  debug,
}: HeadlineShaderLayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const input = useMemo(() => headlineTexture(getRoot), [getRoot]);
  const shaderConfig = useMemo(() => ({ fragmentShader }), [fragmentShader]);

  useShaderRenderer(containerRef, {
    shaderConfig,
    baseUniforms,
    input,
    // Multisampling only smooths polygon edges; this plane's are the canvas's.
    antialias: false,
    maxPixelRatio: 3,
    // A headline band is far smaller than the home portrait's square.
    maxPixels: 3456 * 3456,
    mouseDamping: 0.08,
    getFrame: viewportSquare,
    restingMouse: offCanvas,
    jumpOnEnter: true,
    // The canvas ignores the pointer so links and selection under it work.
    pointerTarget: 'window',
    onError,
    debug,
  });

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="absolute inset-0 pointer-events-none"
    />
  );
}
