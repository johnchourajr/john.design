'use client';
import clsx from 'clsx';
import { useCallback, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { headlineTexture, headlineUniforms } from '../headlineTexture';
import {
  combineInputs,
  useShaderRenderer,
  type ShaderConfig,
  type ShaderInput,
  type ShaderSize,
} from '../useShaderRenderer';

/**
 * Aspect ratio values supported by the ImageThreeShader component
 * @type AspectRatio
 */
type AspectRatio =
  | '1:1'
  | '4:3'
  | '16:9'
  | '21:9'
  | '3:2'
  | '2:3'
  | '5:4'
  | '9:16'
  | '4:5'
  | '1200:600'
  | '2000:1327'
  | '1680:1050';

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
};

const calculateDimensions = (
  container: DOMRect,
  aspectRatio: string,
): ShaderSize => {
  const [numerator, denominator] = aspectRatio.split(':').map(Number);
  const targetRatio = numerator / denominator;

  let width = container.width;
  let height = container.width / targetRatio;

  if (container.width / container.height > targetRatio) {
    height = container.height;
    width = container.height * targetRatio;
  }

  return { width, height };
};

const aspectClass: Record<AspectRatio, string> = {
  '1:1': 'aspect-square',
  '4:3': 'aspect-4/3',
  '16:9': 'aspect-video',
  '21:9': 'aspect-21/9',
  '3:2': 'aspect-3/2',
  '2:3': 'aspect-2/3',
  '5:4': 'aspect-5/4',
  '9:16': 'aspect-9/16',
  '4:5': 'aspect-4/5',
  '1200:600': 'aspect-1200/600',
  '2000:1327': 'aspect-2000/1327',
  '1680:1050': 'aspect-1680/1050',
};

/** 3456 × 3456: the portrait's buffer at 2x on a 1728px-wide screen. */
const HERO_MAX_PIXELS = 3456 * 3456;

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
}: ImageThreeShaderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const input = useMemo(
    () =>
      getHeadline
        ? combineInputs(imageTexture(src), headlineTexture(getHeadline))
        : imageTexture(src),
    [src, getHeadline],
  );
  // The image's own box, from the canvas's top left.
  const getFrame = useCallback(
    (container: HTMLElement) => ({
      x: 0,
      y: 0,
      ...calculateDimensions(container.getBoundingClientRect(), aspectRatio),
    }),
    [aspectRatio],
  );
  const getSize = useCallback(
    (container: HTMLElement) => {
      const bounds = container.getBoundingClientRect();
      const size = calculateDimensions(bounds, aspectRatio);
      const headline = getHeadline?.()?.getBoundingClientRect();
      if (!headline) return size;
      // Grow down to the headline's bottom when it runs past the image.
      return {
        width: size.width,
        height: Math.max(size.height, Math.ceil(headline.bottom - bounds.top)),
      };
    },
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
  });

  return (
    <div
      ref={containerRef}
      className={clsx(
        'relative inline-block w-full h-full',
        aspectClass[aspectRatio],
        className,
      )}
    />
  );
};
