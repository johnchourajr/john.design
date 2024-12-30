---
template: "shader"
slug: "/journal/web-shaders"
date: "2024-12-27"
title: "Getting Creative with GLSL Shaders"
cover: /journal-images/web-shaders/shader.jpg
thumb: /journal-images/web-shaders/shader.**jpg**
hidden: true
tags:
  - Dev
---

## For some time now, I’ve wanted to explore shaders.

> What is a shader?
> A program that runs on your GPU rather than your CPU. Shaders create those mesmerizing visual effects you see in modern video games and interactive websites by manipulating pixels in real-time.

## Obstacle

The main challenge in my journey with shaders has been the GLSL language itself. While it shares some similarities with JavaScript, it's more akin to older programming languages and trickier to grasp. Thankfully, with the emergence of AI tools like GPTs and Copilot, this world has become much more approachable.

So over this wonderful holiday break, I decided to dive into this space.

## The Prompt

> Help me write a simple distortion shader, where I pass in an image, and the cursor controls the distortion.

Simple enough, but with some trial and error (LLMs aren't perfect), I achieved my result. Surprisingly, one of the toughest challenges was handling varying aspect ratios of images.


<iframe
  src="/exp/simple-shader?iframe"
  class="w-full aspect-[1680/1050]"
  scrolling="no"
></iframe>

The idea itself is pretty straightforward too, load an image, pass it to a shader, and let the magic happen. The implementation, however, is a bit more complex. Here's a simplified version of the code (and this doesn't even include the fragment shader code):

```tsx
// ImageShader.tsx

import { useEffect, useRef } from "react";
import { distortionShader } from "./distortion";

export const ImageShader = ({ className, src, aspectRatio = "4:3" }) => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const glRef = useRef(null);

  const handleResize = () => {
    // Adjust canvas size and WebGL viewport
  };

  const handleMouseMove = (e) => {
    // Update mouse coordinates for interaction
  };

  const createProgram = (gl, vertexSource, fragmentSource) => {
    // Compile shaders and link program
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl");
    if (!gl) return;

    glRef.current = gl;
    const program = createProgram(gl, vertexShader, distortionShader);
    gl.useProgram(program);

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = src;
    image.onload = () => {
      // Create texture and bind image
    };

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Configure shader attributes and uniforms
    window.addEventListener("resize", handleResize);
    handleResize();

    const render = () => {
      // Render animation loop
      requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      gl.deleteProgram(program);
    };
  }, [src, aspectRatio]);

  return (
    <div className="shader-outer">
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        className={className}
      />
    </div>
  );
};
```

[View codesandbox demo](https://codesandbox.io/p/sandbox/simple-react-glsl-shader-tj83dh).

[View source code on GitHub](https://github.com/johnchourajr/john.design/blob/1a43af2dd39bd75cd33e6c3c13b63f8e115c61df/components/experimental/ImageShader/ImageShader.tsx).

## Going Further

But I didn't stop there—I wanted to make this more portable and reusable for future projects, envisioning it as a component (perhaps an NPM package someday).

One of the great things about shaders is their native browser support—they work right out of the box with WebGL APIs and HTML, no third-party libraries needed. Though Three.js does make the code composition much more straightforward.

Instead of building handlers and programs from scratch, I leverage Three.js's battle-tested methods.

```tsx
// ImageThreeShader.tsx

export const ImageThreeShader = ({ className, src, aspectRatio = '1:1', shaderConfig }) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const materialRef = useRef(null);

  const baseUniforms = useMemo(() => ({
    image: { value: null },
    resolution: { value: new THREE.Vector2() },
    imageResolution: { value: new THREE.Vector2() },
    mouse: { value: new THREE.Vector2() },
    time: { value: 0 },
  }), []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Initialize scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    sceneRef.current = scene;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // Load texture and create material
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(src, (texture) => {
      const geometry = new THREE.PlaneGeometry(2, 2);
      const material = new THREE.ShaderMaterial({
        uniforms: { ...baseUniforms, ...shaderConfig.uniforms },
        vertexShader: shaderConfig.vertexShader || defaultVertexShader,
        fragmentShader: shaderConfig.fragmentShader,
      });
      material.uniforms.image.value = texture;
      material.uniforms.imageResolution.value.set(texture.image.width, texture.image.height);
      materialRef.current = material;

      // Add mesh to scene
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // Render initial frame
      const { width, height } = calculateDimensions(container.getBoundingClientRect(), aspectRatio);
      renderer.setSize(width, height);
      material.uniforms.resolution.value.set(width, height);
      renderer.render(scene, camera);
    });

    // Handle resize
    const handleResize = () => {
      const bounds = container.getBoundingClientRect();
      const { width, height } = calculateDimensions(bounds, aspectRatio);
      renderer.setSize(width, height);
      renderer.render(scene, camera);
    };

    // Handle mouse movement
    const handleMouseMove = (e) => {
      const bounds = container.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - bounds.left, y: e.clientY - bounds.top };
    };

    // Animation loop
    let animationFrameId;
    const startTime = performance.now();
    const animate = () => {
      const mesh = scene.children[0];
      if (mesh?.material instanceof THREE.ShaderMaterial) {
        mesh.material.uniforms.time.value = (performance.now() - startTime) * 0.001;
        mesh.material.uniforms.mouse.value.set(mouseRef.current.x, mouseRef.current.y);
      }
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    // Attach listeners and start animation
    window.addEventListener('resize', handleResize);
    container.addEventListener('mousemove', handleMouseMove);
    handleResize();
    animate();

    return () => {
      // Cleanup
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      scene.clear();
      container.removeChild(renderer.domElement);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, [src, aspectRatio, shaderConfig, baseUniforms]);

  const aspectClasses = {
    '1:1': 'aspect-square',
    '4:3': 'aspect-[4/3]',
    '16:9': 'aspect-[16/9]',
    '21:9': 'aspect-[21/9]',
    // Other aspect ratios...
  };

  return (
    <div ref={containerRef} className={clsx('relative w-full h-full', aspectClasses[aspectRatio], className)} />
  );
};
```

My goal was to create a simple image component that could take an asset string, a few props, some shader code, and output something amazing.

I'm happy to say I achieved just that. With this shader component, the implementation becomes really straightforward:

```tsx
// SomePage.tsx

import { ImageThreeShader } from './ImageThreeShader';

const colorShader = {
  uniforms: {
    color: { value: new THREE.Color(0xff0000) },
  },
  fragmentShader: `
    uniform vec3 color;
    void main() {
      gl_FragColor = vec4(color, 1.0);
    }
  `,
};

// Basic usage with a simple color manipulation shader
<ImageThreeShader
  src="/path/to/image.jpg"
  aspectRatio="1:1"
  shaderConfig={colorShader}
/>
```

<iframe
  src="/exp/shader?iframe&shader=ripple"
  class="w-full aspect-[1680/1050]"
  scrolling="no"
></iframe>

[View source code on GitHub](https://github.com/johnchourajr/john.design/blob/main/components/experimental/ImageThreeShader/ImageThreeShader.tsx)

[View my experiment page](/exp/shader)

A few improvements I hope to make in the future would be creating a version without three.js, including image optimization (ideally for Next.js apps), and developing a version that works with video assets.

My main takeaway is that using LLMs to help write code in these creative pursuits jumpstarts my learning. I've always been a learn-by-doing type of person, and this just accelerates that.

Cheers and enjoy. ✌️