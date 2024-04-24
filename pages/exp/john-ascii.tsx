// components/JohnAscii.tsx
import React, { useEffect, useRef } from "react";
import { useDrawing } from "@/context/DrawingContext";
import { draw, initWebGL } from "@/utils/webglUtils";

type JohnAsciiProps = {
  imageUrl?: string;
};

const IMAGE = "/me.png";
const DEFAULT_CANVAS_HEIGHT = 480;

const JohnAscii: React.FC<JohnAsciiProps> = ({ imageUrl = IMAGE }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    docSize: { width },
  } = useDrawing();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    const shaderProgram = initWebGL(gl, imageUrl);
    if (!shaderProgram) {
      console.error("Shader program initialization failed");
      return;
    }

    const render = () => {
      if (!gl) return;
      draw(gl, shaderProgram); // Update the draw function to handle parameters properly
      requestAnimationFrame(render);
    };

    requestAnimationFrame(render);

    return () => {
      if (gl.getExtension("WEBGL_lose_context")) {
        gl.getExtension("WEBGL_lose_context").loseContext();
      }
    };
  }, [imageUrl, width]);

  return (
    <canvas ref={canvasRef} width={width} height={DEFAULT_CANVAS_HEIGHT} />
  );
};

export default JohnAscii;
