'use client';

import clsx from 'clsx';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import {
  useShaderRenderer,
  type ShaderConfig,
  type ShaderInput,
  type ShaderSize,
} from '../useShaderRenderer';
import { defaultFragmentShader } from './shaders';

export type AspectRatio =
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
  | '1680:1050'
  | '1280:720';

type VideoThreeShaderProps = {
  className?: string;
  src: string;
  aspectRatio: AspectRatio;
  shaderConfig?: Partial<ShaderConfig>;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
};

export const aspectClass: Record<AspectRatio, string> = {
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
  '1280:720': 'aspect-1280/720',
};

// `resolution` comes from useShaderRenderer.
const baseUniforms = () => ({
  image: { value: null },
  imageResolution: { value: new THREE.Vector2() },
  mouse: { value: new THREE.Vector2() },
  time: { value: 0 },
});

const clientSize = (container: HTMLElement): ShaderSize => ({
  width: container.clientWidth,
  height: container.clientHeight,
});

type VideoOptions = {
  src: string;
  autoplay: boolean;
  muted: boolean;
  loop: boolean;
};

/**
 * Plays `src` into the `image` texture. Animation frames only render while
 * the video plays. With reduced motion it shows the first frame and doesn't
 * play.
 */
const videoTexture =
  ({ src, autoplay, muted, loop }: VideoOptions): ShaderInput =>
  ({ material, ready, reducedMotion }) => {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.src = src;
    video.autoplay = autoplay && !reducedMotion;
    video.muted = muted;
    video.loop = loop;
    video.playsInline = true;

    let texture: THREE.VideoTexture | null = null;

    const handleLoadedData = () => {
      if (texture) return;
      texture = new THREE.VideoTexture(video);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.format = THREE.RGBAFormat;

      material.uniforms.image.value = texture;
      material.uniforms.imageResolution.value.set(
        video.videoWidth,
        video.videoHeight,
      );

      if (!reducedMotion) {
        video.play().catch((error) => {
          console.warn('Video autoplay failed:', error);
        });
      }
      ready();
    };
    video.addEventListener('loadeddata', handleLoadedData);

    return {
      shouldAnimate: () => !video.paused,
      beforeRender: () => {
        if (texture) texture.needsUpdate = true;
      },
      dispose: () => {
        video.removeEventListener('loadeddata', handleLoadedData);
        // Stop the download as well as playback.
        video.pause();
        video.removeAttribute('src');
        video.load();
        texture?.dispose();
      },
    };
  };

export const VideoThreeShader = ({
  className,
  src,
  aspectRatio = '16:9',
  shaderConfig = {},
  autoplay = true,
  muted = true,
  loop = true,
}: VideoThreeShaderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const input = useMemo(
    () => videoTexture({ src, autoplay, muted, loop }),
    [src, autoplay, muted, loop],
  );

  useShaderRenderer(containerRef, {
    shaderConfig: {
      ...shaderConfig,
      fragmentShader: shaderConfig.fragmentShader || defaultFragmentShader,
    },
    baseUniforms,
    input,
    getSize: clientSize,
    mouseSpace: 'ndc',
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
