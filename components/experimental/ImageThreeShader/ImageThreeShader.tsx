'use client';
import clsx from 'clsx';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { headlineTexture, headlineUniforms } from '../headlineTexture';
import {
  combineInputs,
  useShaderRenderer,
  type ShaderConfig,
  type ShaderInput,
} from '../useShaderRenderer';
import {
  aspectClass,
  HERO_MAX_PIXELS,
  imageShaderLayout,
  type AspectRatio,
} from './imageLayout';

/**
 * Props for the ImageThreeShader component
 * @type ImageThreeShaderProps
 */
type ImageThreeShaderProps = {
  /** Optional CSS class name to apply to the container */
  className?: string;
  /** URL or path of the image to be processed */
  src: string;
  /** Aspect ratio of the container. Supported values: 1:1, 4:3, 16:9, 21:9, 3:2, 2:3, 5:4, 9:16, 4:5, 2000:1327 */
  aspectRatio: AspectRatio;
  /** Shader configuration object */
  shaderConfig: ShaderConfig;
  /**
   * Text to draw into the shader with the image, so the effects warp it too
   * (#108). The canvas grows down past the image to cover it; the image
   * keeps its place and size. The shader must sample the `headline` layer
   * (see shaders/layers.ts).
   */
  getHeadline?: () => HTMLElement | null;
  /** WebGL is unavailable or was lost. */
  onError?: () => void;
  /** Shows the `?shader-debug` panel, headed with this label. */
  debug?: string;
  /**
   * A click on the canvas. A new shaderConfig then swaps in on the live
   * canvas, revealed from where the click landed.
   */
  onCanvasClick?: () => void;
  /** The first frame with the image in is on screen. */
  onFirstFrame?: () => void;
};

const baseUniforms = () => ({
  image: { value: null },
  imageResolution: { value: new THREE.Vector2() },
  mouse: { value: new THREE.Vector2() },
  time: { value: 0 },
  ...headlineUniforms(),
});

/** Loads `src` as the `image` texture. */
const imageTexture =
  (src: string): ShaderInput =>
  ({ material, ready }) => {
    let disposed = false;
    let texture: THREE.Texture | null = null;

    new THREE.TextureLoader().load(src, (loaded) => {
      // The image can finish loading after unmount.
      if (disposed) {
        loaded.dispose();
        return;
      }
      // The canvas composites premultiplied, so the image has to be too:
      // straight, the portrait's feathered bottom shows at full strength and
      // ends on a hard line where its alpha reaches zero.
      loaded.premultiplyAlpha = true;
      texture = loaded;
      material.uniforms.image.value = loaded;
      material.uniforms.imageResolution.value.set(
        loaded.image.width,
        loaded.image.height,
      );
      ready();
    });

    return {
      dispose: () => {
        disposed = true;
        texture?.dispose();
      },
    };
  };

/**
 * A React component that applies WebGL shaders to images using Three.js
 *
 * @component
 * @example
 * // Basic usage with a simple color manipulation shader
 * const colorShader = {
 *   fragmentShader: `
 *     uniform sampler2D image;
 *     varying vec2 vUv;
 *     void main() {
 *       vec4 color = texture2D(image, vUv);
 *       gl_FragColor = vec4(color.r, color.g * 0.5, color.b, color.a);
 *     }
 *   `
 * };
 *
 * <ImageThreeShader
 *   src="/path/to/image.jpg"
 *   aspectRatio="1:1"
 *   shaderConfig={colorShader}
 * />
 *
 * @example
 * // Advanced usage with custom uniforms and mouse interaction
 * const waveShader = {
 *   fragmentShader: `
 *     uniform sampler2D image;
 *     uniform vec2 mouse;
 *     uniform float time;
 *     varying vec2 vUv;
 *
 *     void main() {
 *       vec2 uv = vUv;
 *       uv.x += sin(uv.y * 10.0 + time) * 0.1;
 *       vec4 color = texture2D(image, uv);
 *       gl_FragColor = color;
 *     }
 *   `,
 *   uniforms: {
 *     intensity: { value: 1.0 }
 *   }
 * };
 *
 * <ImageThreeShader
 *   src="/path/to/image.jpg"
 *   aspectRatio="4:3"
 *   shaderConfig={waveShader}
 *   className="my-custom-class"
 * />
 */
export const ImageThreeShader = ({
  className,
  src,
  aspectRatio = '1:1',
  shaderConfig,
  getHeadline,
  onError,
  debug,
  onCanvasClick,
  onFirstFrame,
}: ImageThreeShaderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const input = useMemo(
    () =>
      getHeadline
        ? combineInputs(imageTexture(src), headlineTexture(getHeadline))
        : imageTexture(src),
    [src, getHeadline],
  );
  const { getFrame, getSize } = useMemo(
    () => imageShaderLayout(aspectRatio, getHeadline),
    [aspectRatio, getHeadline],
  );

  useShaderRenderer(containerRef, {
    shaderConfig,
    baseUniforms,
    input,
    getSize,
    getFrame,
    // Multisampling only smooths polygon edges, and this plane's edges are
    // the canvas's. With the headline the canvas is larger, so skip it.
    antialias: !getHeadline,
    // The type has to be as sharp as the DOM's, so render at the screen's
    // full ratio when it's in here, within the buffer the hero has always
    // drawn on a 1728px-wide screen at 2x.
    maxPixelRatio: getHeadline ? 3 : 2,
    maxPixels: getHeadline ? HERO_MAX_PIXELS : undefined,
    mouseDamping: 0.08,
    resizeWith: getHeadline,
    // The image's box is translated and can sit on a half pixel, where the
    // canvas would be resampled and the type softened.
    snapToPixels: !!getHeadline,
    onError,
    debug,
    onCanvasClick,
    onFirstFrame,
  });

  return (
    <div
      ref={containerRef}
      className={clsx(
        onCanvasClick && 'cursor-pointer',
        'relative inline-block w-full h-full',
        aspectClass[aspectRatio],
        className,
      )}
    />
  );
};
