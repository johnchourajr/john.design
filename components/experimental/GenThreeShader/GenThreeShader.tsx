'use client';
import clsx from 'clsx';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

/**
 * Configuration object for defining shader properties
 * @type ShaderConfig
 */
type ShaderConfig = {
  /** Optional vertex shader code. If not provided, a default vertex shader will be used */
  vertexShader?: string;
  /** Required fragment shader code */
  fragmentShader: string;
  /** Optional additional uniforms to pass to the shader */
  uniforms?: Record<string, THREE.IUniform>;
};

/**
 * Props for the GenThreeShader component
 * @type GenThreeShaderProps
 */
type GenThreeShaderProps = {
  /** Optional CSS class name to apply to the container */
  className?: string;
  /** Shader configuration object */
  shaderConfig: ShaderConfig;
  /** Optional download action */
  onDownload: (ref: () => void) => void;
};

const defaultVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const GenThreeShader = ({
  className,
  shaderConfig,
  onDownload,
}: GenThreeShaderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const downloadHandlerRef = useRef<(() => void) | null>(null);
  const sizeRef = useRef<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  const baseUniforms = useMemo(
    () => ({
      resolution: { value: new THREE.Vector2() },
      mouse: { value: new THREE.Vector2() },
      time: { value: 0 },
      noiseScale: { value: 3.0 },
      colorSpeed: { value: 1.0 },
      kaleidoSegments: { value: 6.0 },
      patternScale: { value: 1.0 },
      colorIntensity: { value: 0.7 },
      motionSpeed: { value: 1.0 },
      warpIntensity: { value: 0.5 },
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

    // Setup geometry and material
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        ...baseUniforms,
        ...shaderConfig.uniforms,
      },
      vertexShader: shaderConfig.vertexShader || defaultVertexShader,
      fragmentShader: shaderConfig.fragmentShader,
    });

    materialRef.current = material;
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Sizing with ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        sizeRef.current = {
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        };
        renderer.setSize(sizeRef.current.width, sizeRef.current.height);
        material.uniforms.resolution.value.set(
          sizeRef.current.width,
          sizeRef.current.height,
        );
        renderer.render(scene, camera);
      }
    });

    resizeObserver.observe(container);

    // Mouse handling
    const handleMouseMove = (event: MouseEvent) => {
      const bounds = container.getBoundingClientRect();
      mouseRef.current = {
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      };
    };

    // Animation frame management
    let animationFrameId: number;
    const startTime = performance.now();

    const animate = () => {
      material.uniforms.time.value = (performance.now() - startTime) * 0.001;
      material.uniforms.mouse.value.set(mouseRef.current.x, mouseRef.current.y);
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    // Store download handler in ref
    downloadHandlerRef.current = () => {
      renderer.render(scene, camera);
      renderer.domElement.toBlob((blob) => {
        if (blob) {
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = `shader-${Date.now()}.png`;
          link.click();
        }
      });
    };

    // Pass the ref's current value
    onDownload(() => downloadHandlerRef.current?.());

    // Start animation
    animate();

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      scene.clear();
      container.removeChild(renderer.domElement);
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, [shaderConfig, baseUniforms]); // Remove onDownload from deps

  return (
    <div
      ref={containerRef}
      className={clsx('relative w-full h-full', className)}
    />
  );
};
