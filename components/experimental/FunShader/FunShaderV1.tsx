'use client';

import clsx from 'clsx';
import { useEffect, useRef } from 'react';

export const FunShaderV1 = ({ className }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const vertexShader = `
    attribute vec2 position;
    void main() {
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  const fragmentShader = `
    precision highp float;
    uniform vec2 resolution;
    uniform vec2 mouse;
    uniform float time;
    uniform sampler2D image;
    uniform vec2 imageResolution;

    void main() {
      vec2 uv = vec2(gl_FragCoord.x, resolution.y - gl_FragCoord.y) / resolution.xy;

      // Force 1:1 aspect ratio
      float aspect = resolution.x / resolution.y;
      vec2 adjustedUV = uv;

      if (aspect > 1.0) {
        // Width is larger than height
        adjustedUV.x = (uv.x - 0.5) * aspect + 0.5;
      } else {
        // Height is larger than width
        adjustedUV.y = (uv.y - 0.5) / aspect + 0.5;
      }

      // Center the effect
      vec2 mouseUV = mouse.xy / resolution.xy;
      mouseUV.y = 1.0 - mouseUV.y;

      // Rest of the shader calculations
      float dist = distance(adjustedUV, mouseUV);
      float strength = smoothstep(0.2, 0.0, dist); // Increased radius from 0.1 to 0.2
      vec2 displacement = normalize(adjustedUV - mouseUV) * strength * 0.1; // Increased from 0.1 to 0.25

      vec4 color = texture2D(image, adjustedUV - displacement);
      float noise = fract(sin(dot(adjustedUV, vec2(12.9898, 78.233))) * 43758.5453);
      vec2 pos = adjustedUV + displacement * noise * sin(time) * 1.5; // Added multiplier for stronger effect

      if (adjustedUV.x < 0.0 || adjustedUV.x > 1.0 || adjustedUV.y < 0.0 || adjustedUV.y > 1.0) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
      } else {
        gl_FragColor = texture2D(image, pos);
      }
    }
  `;

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext('webgl');
    if (!gl) return;

    const program = createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);

    const image = new Image();
    image.src = '/me-alpha-moody.png';
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

    const resize = () => {
      // Make canvas square using the minimum dimension
      const size = Math.min(window.innerWidth, window.innerHeight);
      if (canvas) {
        canvas.width = size;
        canvas.height = size;
        gl.viewport(0, 0, size, size);
      }
    };
    window.addEventListener('resize', resize);
    resize();

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
      window.removeEventListener('resize', resize);
      gl.deleteProgram(program);
    };
  }, []);

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

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      className={clsx('aspect-square', className)}
    />
  );
};
