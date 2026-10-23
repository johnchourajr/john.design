'use client';
import clsx from 'clsx';
import { useCallback, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { savePng } from '../savePng';
import { useShaderRenderer, type ShaderConfig } from '../useShaderRenderer';

/**
 * Props for the GenThreeShader component
 * @type GenThreeShaderProps
 */
type GenThreeShaderProps = {
  /** Optional CSS class name to apply to the container */
  className?: string;
  /** Shader configuration object */
  shaderConfig: ShaderConfig;
  /** Optional download action */
  onDownload: (ref: () => void) => void;
  /** The first frame is on screen. */
  onFirstFrame?: () => void;
};

const baseUniforms = () => ({
  mouse: { value: new THREE.Vector2() },
  time: { value: 0 },
  noiseScale: { value: 3.0 },
  colorSpeed: { value: 1.0 },
  kaleidoSegments: { value: 6.0 },
  patternScale: { value: 1.0 },
  colorIntensity: { value: 0.7 },
  motionSpeed: { value: 1.0 },
  warpIntensity: { value: 0.5 },
});

export const GenThreeShader = ({
  className,
  shaderConfig,
  onDownload,
  onFirstFrame,
}: GenThreeShaderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { capture } = useShaderRenderer(containerRef, {
    shaderConfig,
    baseUniforms,
    onFirstFrame,
  });

  const download = useCallback(() => savePng(capture), [capture]);

  useEffect(() => {
    onDownload(download);
  }, [onDownload, download]);

  return (
    <div
      ref={containerRef}
      className={clsx('relative w-full h-full', className)}
    />
  );
};
