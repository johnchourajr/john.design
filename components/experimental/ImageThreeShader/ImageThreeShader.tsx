'use client';
import clsx from 'clsx';
import { useCallback, useMemo, useRef } from 'react';
import * as THREE from 'three';
import {
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
  '4:3': 'aspect-[4/3]',
  '16:9': 'aspect-[16/9]',
  '21:9': 'aspect-[21/9]',
  '3:2': 'aspect-[3/2]',
  '2:3': 'aspect-[2/3]',
  '5:4': 'aspect-[5/4]',
  '9:16': 'aspect-[9/16]',
  '4:5': 'aspect-[4/5]',
  '1200:600': 'aspect-[1200/600]',
  '2000:1327': 'aspect-[2000/1327]',
  '1680:1050': 'aspect-[1680/1050]',
};

const baseUniforms = () => ({
  image: { value: null },
  imageResolution: { value: new THREE.Vector2() },
  mouse: { value: new THREE.Vector2() },
  time: { value: 0 },
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
}: ImageThreeShaderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const input = useMemo(() => imageTexture(src), [src]);
  const getSize = useCallback(
    (container: HTMLElement) =>
      calculateDimensions(container.getBoundingClientRect(), aspectRatio),
    [aspectRatio],
  );

  useShaderRenderer(containerRef, {
    shaderConfig,
    baseUniforms,
    input,
    getSize,
    antialias: true,
    maxPixelRatio: 2,
    mouseDamping: 0.08,
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
