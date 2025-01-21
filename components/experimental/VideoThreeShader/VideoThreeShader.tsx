'use client';

import clsx from 'clsx';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { defaultFragmentShader } from './shaders';

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
  | '1680:1050'
  | '1280:720';

type ShaderConfig = {
  vertexShader?: string;
  fragmentShader?: string;
  uniforms?: Record<string, THREE.IUniform>;
};

type VideoThreeShaderProps = {
  className?: string;
  src: string;
  aspectRatio: AspectRatio;
  shaderConfig?: ShaderConfig;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
};

const defaultVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

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
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  const baseUniforms = useMemo(
    () => ({
      image: { value: null },
      resolution: { value: new THREE.Vector2() },
      imageResolution: { value: new THREE.Vector2() },
      mouse: { value: new THREE.Vector2() },
      time: { value: 0 },
    }),
    [],
  );

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const container = containerRef.current;
    sceneRef.current = scene;

    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // Create and load video
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.src = src;
    video.autoplay = autoplay;
    video.muted = muted;
    video.loop = loop;
    video.playsInline = true;
    videoRef.current = video;

    // Wait for video to be loaded before creating texture
    video.addEventListener('loadeddata', () => {
      const videoTexture = new THREE.VideoTexture(video);
      videoTexture.minFilter = THREE.LinearFilter;
      videoTexture.magFilter = THREE.LinearFilter;
      videoTexture.format = THREE.RGBAFormat;

      const geometry = new THREE.PlaneGeometry(2, 2);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          ...baseUniforms,
          ...shaderConfig.uniforms,
        },
        vertexShader: shaderConfig.vertexShader || defaultVertexShader,
        fragmentShader: shaderConfig.fragmentShader || defaultFragmentShader,
      });

      material.uniforms.image.value = videoTexture;
      material.uniforms.imageResolution.value.set(
        video.videoWidth,
        video.videoHeight,
      );
      materialRef.current = material;

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // Start playing the video
      video.play().catch((error) => {
        console.warn('Video autoplay failed:', error);
      });

      handleResize();
    });

    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      rendererRef.current.setSize(clientWidth, clientHeight);
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = event;
      const { left, top, width, height } =
        containerRef.current.getBoundingClientRect();
      mouseRef.current.x = ((clientX - left) / width) * 2 - 1;
      mouseRef.current.y = -((clientY - top) / height) * 2 + 1;
    };

    window.addEventListener('resize', handleResize);
    container.addEventListener('mousemove', handleMouseMove);

    const startTime = performance.now();
    let animationFrameId: number;

    const animate = () => {
      if (videoRef.current && !videoRef.current.paused) {
        const mesh = scene.children[0] as THREE.Mesh;
        if (mesh?.material instanceof THREE.ShaderMaterial) {
          const uniforms = mesh.material.uniforms;
          uniforms.time.value = (performance.now() - startTime) * 0.001;
          uniforms.mouse.value.set(mouseRef.current.x, mouseRef.current.y);
          if (uniforms.image.value) {
            (uniforms.image.value as THREE.VideoTexture).needsUpdate = true;
          }
        }
        renderer.render(scene, camera);
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      scene.clear();
      container.removeChild(renderer.domElement);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.remove();
      }
    };
  }, [src, aspectRatio, shaderConfig, baseUniforms, autoplay, muted, loop]);

  const aspect: Record<AspectRatio, string> = {
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
    '1280:720': 'aspect-[1280/720]',
  };

  return (
    <div
      ref={containerRef}
      className={clsx(
        'relative inline-block w-full h-full',
        aspect[aspectRatio],
        className,
      )}
    />
  );
};
