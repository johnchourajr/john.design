'use client';
import clsx from 'clsx';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

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
  | '2000:1327';

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

const defaultVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const calculateDimensions = (container: DOMRect, aspectRatio: string) => {
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

    // Load texture and setup material
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(src, (texture) => {
      const geometry = new THREE.PlaneGeometry(2, 2);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          ...baseUniforms,
          ...shaderConfig.uniforms,
        },
        vertexShader: shaderConfig.vertexShader || defaultVertexShader,
        fragmentShader: shaderConfig.fragmentShader,
      });

      material.uniforms.image.value = texture;
      material.uniforms.imageResolution.value.set(
        texture.image.width,
        texture.image.height,
      );

      materialRef.current = material;

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // Initial render
      const { width, height } = calculateDimensions(
        container.getBoundingClientRect(),
        aspectRatio,
      );
      renderer.setSize(width, height);
      material.uniforms.resolution.value.set(width, height);
      renderer.render(scene, camera);
    });

    // Sizing
    const handleResize = () => {
      const bounds = container.getBoundingClientRect();
      const { width, height } = calculateDimensions(bounds, aspectRatio);

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

    // Animation frame management
    let animationFrameId: number;
    const startTime = performance.now();

    const animate = () => {
      const mesh = scene.children[0] as THREE.Mesh;
      if (mesh?.material instanceof THREE.ShaderMaterial) {
        const uniforms = mesh.material.uniforms;
        uniforms.time.value = (performance.now() - startTime) * 0.001;
        uniforms.mouse.value.set(mouseRef.current.x, mouseRef.current.y);
      }
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    // Event listeners
    window.addEventListener('resize', handleResize);
    container.addEventListener('mousemove', handleMouseMove);
    handleResize();
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      scene.clear();
      container.removeChild(renderer.domElement);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, [src, aspectRatio, shaderConfig, baseUniforms]);

  const aspect = {
    '1:1': 'aspect-square',
    '4:3': 'aspect-[4/3]',
    '16:9': 'aspect-[16/9]',
    '21:9': 'aspect-[21/9]',
    '3:2': 'aspect-[3/2]',
    '2:3': 'aspect-[2/3]',
    '5:4': 'aspect-[5/4]',
    '9:16': 'aspect-[9/16]',
    '4:5': 'aspect-[4/5]',
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
