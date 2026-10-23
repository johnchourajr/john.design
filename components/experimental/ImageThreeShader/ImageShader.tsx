'use client';

import clsx from 'clsx';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';

import { GpuShaderCanvas, type GpuShaderCanvasOptions } from '../GpuShaderCanvas';
import { imageGpuShaders } from './wgsl';
import {
  aspectClass,
  HERO_MAX_PIXELS,
  imageShaderLayout,
  type AspectRatio,
} from './imageLayout';
import { fragmentThreeShaders } from './shaders';
import type { ShaderVariant } from './shaders/types';

// three.js loads only for the fallback.
const ImageThreeShader = dynamic(
  () => import('./ImageThreeShader').then((mod) => mod.ImageThreeShader),
  { ssr: false },
);

type ImageShaderProps = {
  className?: string;
  src: string;
  aspectRatio: AspectRatio;
  variant: ShaderVariant;
  /** Text drawn into the shader with the image (#108). */
  getHeadline?: () => HTMLElement | null;
  /** Shows the `?shader-debug` panel, headed with this label. */
  debug?: string;
  onCanvasClick?: () => void;
  /** Cover the canvas with ShaderLoader until it draws (default true). */
  loader?: boolean;
  /** The first frame is on screen. */
  onFirstFrame?: () => void;
};

/**
 * ImageThreeShader's hero variants on WebGPU where the browser has it
 * (#125), and ImageThreeShader itself (WebGL) where it doesn't. Sized,
 * capped and snapped the same way on both.
 */
export function ImageShader({
  className,
  src,
  aspectRatio,
  variant,
  getHeadline,
  debug,
  onCanvasClick,
  loader,
  onFirstFrame,
}: ImageShaderProps) {
  const options = useMemo<GpuShaderCanvasOptions>(
    () => ({
      ...imageShaderLayout(aspectRatio, getHeadline),
      image: src,
      getHeadline,
      // As ImageThreeShader: the type as sharp as the DOM's when it's in.
      maxPixelRatio: getHeadline ? 3 : 2,
      maxPixels: getHeadline ? HERO_MAX_PIXELS : Infinity,
      mouseDamping: 0.08,
      resizeWith: getHeadline,
      snapToPixels: !!getHeadline,
      debug,
    }),
    [aspectRatio, getHeadline, src, debug],
  );
  const shaderConfig = useMemo(
    () => ({ fragmentShader: fragmentThreeShaders[variant] }),
    [variant],
  );

  return (
    <GpuShaderCanvas
      shaders={imageGpuShaders}
      variant={variant}
      options={options}
      onCanvasClick={onCanvasClick}
      loader={loader}
      onFirstFrame={onFirstFrame}
      className={clsx(
        onCanvasClick && 'cursor-pointer',
        'relative inline-block w-full h-full',
        aspectClass[aspectRatio],
        className,
      )}
      fallback={(onFirstFrame) => (
        <ImageThreeShader
          className={className}
          src={src}
          aspectRatio={aspectRatio}
          shaderConfig={shaderConfig}
          getHeadline={getHeadline}
          debug={debug}
          onCanvasClick={onCanvasClick}
          onFirstFrame={onFirstFrame}
        />
      )}
    />
  );
}
