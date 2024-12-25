'use client';
import clsx from 'clsx';
import { useEffect, useRef } from 'react';

import {
  AspectRatio,
  fragmentShaders,
  ShaderVariant,
} from '@/components/experimental/ImageShader/shaders';

export const ImageShader = ({
  className,
  src,
  variant = 'distortion',
  aspectRatio = '1:1',
}: {
  className?: string;
  src: string;
  variant?: ShaderVariant;
  aspectRatio?: AspectRatio;
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const glRef = useRef<WebGLRenderingContext | null>(null);

  const vertexShader = `
    attribute vec2 position;
    void main() {
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  // Extract resize function
  const handleResize = () => {
    const canvas = canvasRef.current;
    const gl = glRef.current;
    if (!canvas || !gl) return;

    const container = canvas.parentElement;
    if (!container) return;

    const containerBounds = container.getBoundingClientRect();
    const containerWidth = containerBounds.width;
    const containerHeight = containerBounds.height;

    const [numerator, denominator] = aspectRatio.split(':').map(Number);
    const targetRatio = numerator / denominator;

    let width, height;

    if (containerWidth / containerHeight > targetRatio) {
      height = containerHeight;
      width = containerHeight * targetRatio;
    } else {
      width = containerWidth;
      height = containerWidth / targetRatio;
    }

    canvas.width = Math.round(width);
    canvas.height = Math.round(height);
    canvas.style.width = `${canvas.width}px`;
    canvas.style.height = `${canvas.height}px`;

    gl.viewport(0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext('webgl');
    if (!gl) return;

    glRef.current = gl;

    const program = createProgram(gl, vertexShader, fragmentShaders[variant]);
    gl.useProgram(program);

    const image = new Image();
    image.src = src;
    image.onload = () => {
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        image,
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      // Pass image dimensions to shader
      gl.uniform2f(imageResolutionLocation, image.width, image.height);
    };

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'position');
    const resolutionLocation = gl.getUniformLocation(program, 'resolution');
    const mouseLocation = gl.getUniformLocation(program, 'mouse');
    const timeLocation = gl.getUniformLocation(program, 'time');
    const imageResolutionLocation = gl.getUniformLocation(
      program,
      'imageResolution',
    );

    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    window.addEventListener('resize', handleResize);
    handleResize();

    let startTime = performance.now();
    const render = () => {
      const time = (performance.now() - startTime) * 0.001;
      if (canvas) {
        gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
        gl.uniform2f(mouseLocation, mouseRef.current.x, mouseRef.current.y);
      }
      gl.uniform1f(timeLocation, time);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      gl.deleteProgram(program);
    };
  }, [variant, src, vertexShader, aspectRatio]);

  // Add effect to handle resize when variant changes
  useEffect(() => {
    handleResize();
  }, [variant]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();

    // Calculate scale factor between displayed size and actual canvas size
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    // Apply scaling to mouse coordinates
    mouseRef.current = {
      x: (e.clientX - rect.left) * scaleX,
      y: canvas.height - (e.clientY - rect.top) * scaleY,
    };
  };

  const createProgram = (
    gl: WebGLRenderingContext,
    vertexSource: string,
    fragmentSource: string,
  ): WebGLProgram => {
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    if (!vertexShader) throw new Error('Failed to create vertex shader');

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fragmentShader) throw new Error('Failed to create fragment shader');

    gl.shaderSource(vertexShader, vertexSource);
    gl.compileShader(vertexShader);

    gl.shaderSource(fragmentShader, fragmentSource);
    gl.compileShader(fragmentShader);

    const program = gl.createProgram();
    if (!program) throw new Error('Failed to create program');

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    return program;
  };

  const aspect = {
    '1:1': 'aspect-square',
    '4:3': 'aspect-[4/3]',
    '2000:1327': 'aspect-[2000/1327]',
  };

  return (
    <div className="relative inline-block w-full h-full">
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        className={clsx(
          'w-full h-full object-contain',
          aspect[aspectRatio],
          className,
        )}
      />
    </div>
  );
};
