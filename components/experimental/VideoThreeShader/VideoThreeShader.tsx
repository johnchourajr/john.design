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
import { aspectClass, type AspectRatio } from './videoAspect';

type VideoThreeShaderProps = {
  className?: string;
  src: string;
  aspectRatio: AspectRatio;
  shaderConfig?: Partial<ShaderConfig>;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  /** The first frame with the video in is on screen. */
  onFirstFrame?: () => void;
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
  onFirstFrame,
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
    onFirstFrame,
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
