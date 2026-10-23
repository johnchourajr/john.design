'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

import {
  GpuShaderCanvas,
  type GpuShaderCanvasOptions,
} from '../experimental/GpuShaderCanvas';
import { imageGpuShaders } from '../experimental/ImageThreeShader/wgsl';
import { fragmentThreeShaders, type ShaderVariant } from '../experimental/ImageThreeShader/shaders';
import { contentBoxSize } from '../experimental/useShaderRenderer';
import { HEADLINE_SHADER, offCanvas, viewportSquare } from './headlineShaderOptions';

// three.js loads only for the fallback.
const HeadlineShaderWebgl = dynamic(() => import('./HeadlineShaderWebgl'), {
  ssr: false,
});

type HeadlineShaderLayerProps = {
  /** The headline whose text is drawn. */
  getRoot: () => HTMLElement | null;
  variant: ShaderVariant;
  onError: () => void;
  /** Shows the `?shader-debug` panel, headed with this label. */
  debug?: string;
  /** A click on the headline (the canvas itself ignores the pointer). */
  onCanvasClick?: () => void;
};

/**
 * A canvas over a headline that draws the headline's text through one of
 * the hero shaders (#108): on WebGPU where the browser has it (#125), on
 * WebGL where it doesn't. See HeadlineShader.
 */
export default function HeadlineShaderLayer({
  getRoot,
  variant,
  onError,
  debug,
  onCanvasClick,
}: HeadlineShaderLayerProps) {
  const options = useMemo<GpuShaderCanvasOptions>(
    () => ({
      ...HEADLINE_SHADER,
      getHeadline: getRoot,
      getSize: contentBoxSize,
      getFrame: viewportSquare,
      restingMouse: offCanvas,
      debug,
    }),
    [getRoot, debug],
  );

  return (
    <GpuShaderCanvas
      shaders={imageGpuShaders}
      variant={variant}
      options={options}
      onCanvasClick={onCanvasClick}
      className="absolute inset-0 pointer-events-none"
      fallback={
        <HeadlineShaderWebgl
          getRoot={getRoot}
          fragmentShader={fragmentThreeShaders[variant]}
          onError={onError}
          debug={debug}
          onCanvasClick={onCanvasClick}
        />
      }
    />
  );
}
