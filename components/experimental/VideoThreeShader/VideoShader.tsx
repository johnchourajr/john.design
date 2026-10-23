'use client';

import clsx from 'clsx';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';

import { GpuShaderCanvas, type GpuShaderCanvasOptions } from '../GpuShaderCanvas';
import type { ShaderSize } from '../useShaderRenderer';
import { aspectClass, type AspectRatio } from './videoAspect';
import { fragmentThreeVideoShaders } from './shaders';
import { videoGpuShaders } from './wgsl';

// three.js loads only for the fallback.
const VideoThreeShader = dynamic(
  () => import('./VideoThreeShader').then((mod) => mod.VideoThreeShader),
  { ssr: false },
);

type VideoShaderVariant = keyof typeof fragmentThreeVideoShaders;

type VideoShaderProps = {
  className?: string;
  src: string;
  aspectRatio: AspectRatio;
  variant: VideoShaderVariant;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
};

const clientSize = (container: HTMLElement): ShaderSize => ({
  width: container.clientWidth,
  height: container.clientHeight,
});

/**
 * A video shader on WebGPU where the browser has it (#129), and
 * VideoThreeShader (WebGL) where it doesn't.
 */
export function VideoShader({
  className,
  src,
  aspectRatio,
  variant,
  autoplay = true,
  muted = true,
  loop = true,
}: VideoShaderProps) {
  // As VideoThreeShader: CSS px, the pointer in NDC, undamped.
  const options = useMemo<GpuShaderCanvasOptions>(
    () => ({
      video: { src, autoplay, muted, loop },
      getSize: clientSize,
      maxPixelRatio: 1,
      maxPixels: Infinity,
      mouseDamping: 1,
      mouseSpace: 'ndc',
    }),
    [src, autoplay, muted, loop],
  );
  const shaderConfig = useMemo(
    () => ({ fragmentShader: fragmentThreeVideoShaders[variant] }),
    [variant],
  );

  return (
    <GpuShaderCanvas
      shaders={videoGpuShaders}
      variant={variant}
      options={options}
      className={clsx('relative inline-block w-full h-full', aspectClass[aspectRatio], className)}
      fallback={(onFirstFrame) => (
        <VideoThreeShader
          className={className}
          src={src}
          aspectRatio={aspectRatio}
          shaderConfig={shaderConfig}
          autoplay={autoplay}
          muted={muted}
          loop={loop}
          onFirstFrame={onFirstFrame}
        />
      )}
    />
  );
}
