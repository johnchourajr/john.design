'use client';

import clsx from 'clsx';
import dynamic from 'next/dynamic';
import { useCallback, useMemo } from 'react';

import { GpuShaderCanvas, type GpuShaderCanvasOptions } from '../GpuShaderCanvas';
import { contentBoxSize } from '../shaderLayout';
import { savePng } from '../savePng';
import { genShaders, type ShaderVariant } from './shaders';
import { genGpuShaders } from './wgsl';

// three.js loads only for the fallback.
const GenThreeShader = dynamic(
  () => import('./GenThreeShader').then((mod) => mod.GenThreeShader),
  { ssr: false },
);

type GenShaderProps = {
  className?: string;
  variant: ShaderVariant;
  /** The settings panel's uniforms, as settingsToUniforms gives them. */
  uniforms: Record<string, { value: number }>;
  /** Gets the PNG download once the canvas can capture. */
  onDownload: (download: () => void) => void;
};

// As GenThreeShader: CSS px (pixel ratio 1), the pointer undamped.
const options: GpuShaderCanvasOptions = {
  getSize: contentBoxSize,
  maxPixelRatio: 1,
  maxPixels: Infinity,
  mouseDamping: 1,
};

/**
 * A generative shader on WebGPU where the browser has it (#129), and
 * GenThreeShader (WebGL) where it doesn't. The sliders' uniforms and the
 * PNG download work on both.
 */
export function GenShader({ className, variant, uniforms, onDownload }: GenShaderProps) {
  const values = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(uniforms).map(([key, uniform]) => [key, uniform.value]),
      ),
    [uniforms],
  );
  const shaderConfig = useMemo(
    () => ({ fragmentShader: genShaders[variant], uniforms }),
    [variant, uniforms],
  );
  const onCapture = useCallback(
    (capture: () => Promise<Blob | null>) => onDownload(() => savePng(capture)),
    [onDownload],
  );

  return (
    <GpuShaderCanvas
      shaders={genGpuShaders}
      variant={variant}
      options={options}
      uniforms={values}
      onCapture={onCapture}
      className={clsx('relative w-full h-full', className)}
      fallback={(onFirstFrame) => (
        <GenThreeShader
          className={className}
          shaderConfig={shaderConfig}
          onDownload={onDownload}
          onFirstFrame={onFirstFrame}
        />
      )}
    />
  );
}
