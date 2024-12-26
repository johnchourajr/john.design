'use client';
import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { fragmentThreeShaders, ShaderVariant } from './shaders';

type AspectRatio = '1:1' | '4:3' | '2000:1327';

export const ImageThreeShader = ({
  className,
  src,
  aspectRatio = '1:1',
  variant = 'distortion',
}: {
  className?: string;
  src: string;
  aspectRatio: AspectRatio;
  variant?: ShaderVariant;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    let renderer = rendererRef.current;
    const container = containerRef.current;
    sceneRef.current = scene;

    // Check if renderer already exists
    if (!renderer) {
      renderer = new THREE.WebGLRenderer({ alpha: true });
      rendererRef.current = renderer;
      container.appendChild(renderer.domElement);
    }

    // Initial size setup
    const bounds = container.getBoundingClientRect();
    const [numerator, denominator] = aspectRatio.split(':').map(Number);
    const targetRatio = numerator / denominator;

    let width = bounds.width;
    let height = bounds.width / targetRatio;

    if (bounds.width / bounds.height > targetRatio) {
      height = bounds.height;
      width = bounds.height * targetRatio;
    }

    renderer.setSize(width, height);

    // Load texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(src, (texture) => {
      const geometry = new THREE.PlaneGeometry(2, 2);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          image: { value: texture },
          resolution: { value: new THREE.Vector2() },
          imageResolution: {
            value: new THREE.Vector2(texture.image.width, texture.image.height),
          },
          mouse: { value: new THREE.Vector2() },
          time: { value: 0 },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: fragmentThreeShaders[variant],
      });

      materialRef.current = material;

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // Force initial render after mesh is added
      if (renderer) {
        material.uniforms.resolution.value.set(width, height);
        renderer.render(scene, camera);
      }
    });

    // Sizing
    const handleResize = () => {
      const bounds = container.getBoundingClientRect();
      const [numerator, denominator] = aspectRatio.split(':').map(Number);
      const targetRatio = numerator / denominator;

      let width, height;
      if (bounds.width / bounds.height > targetRatio) {
        height = bounds.height;
        width = bounds.height * targetRatio;
      } else {
        width = bounds.width;
        height = bounds.width / targetRatio;
      }

      if (renderer) {
        renderer.setSize(width, height);
        const mesh = scene.children[0] as THREE.Mesh;
        if (mesh?.material instanceof THREE.ShaderMaterial) {
          mesh.material.uniforms.resolution.value.set(width, height);
        }

        // Ensure we render after resize
        renderer.render(scene, camera);
      }
    };

    // Mouse handling
    const handleMouseMove = (event: MouseEvent) => {
      const bounds = container.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      mouseRef.current = { x, y };
    };

    // Animation
    const startTime = performance.now();
    const animate = () => {
      const mesh = scene.children[0] as THREE.Mesh;
      if (mesh?.material instanceof THREE.ShaderMaterial) {
        const uniforms = mesh.material.uniforms;
        uniforms.time.value = (performance.now() - startTime) * 0.001;
        uniforms.mouse.value.set(mouseRef.current.x, mouseRef.current.y);
      }
      if (renderer) {
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      }
    };

    // Event listeners
    window.addEventListener('resize', handleResize);
    container.addEventListener('mousemove', handleMouseMove);
    handleResize();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      if (renderer) {
        renderer.dispose();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, aspectRatio]);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.fragmentShader = fragmentThreeShaders[variant];
      materialRef.current.needsUpdate = true;
    }
  }, [variant]);

  const aspect = {
    '1:1': 'aspect-square',
    '4:3': 'aspect-[4/3]',
    '2000:1327': 'aspect-[2000/1327]',
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
