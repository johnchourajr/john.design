'use client';
import clsx from 'clsx';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

import { pinwheelShader } from '../GenThreeShader/shaders/pinwheelShader';
import type { PinwheelController, PinwheelParams } from './startPinwheel';

// The WebGL version, loaded only when WebGPU is unavailable.
const GenThreeShader = dynamic(
  () => import('../GenThreeShader').then((mod) => mod.GenThreeShader),
  { ssr: false },
);

export type Renderer = 'pending' | 'webgpu' | 'webgl';

type VgpuPinwheelProps = {
  className?: string;
  params: PinwheelParams;
  onRenderer?: (renderer: Renderer) => void;
};

const noop = () => {};

/**
 * Pinwheel shader rendered with vgpu (WebGPU), falling back to the existing
 * three.js GenThreeShader when `navigator.gpu` is missing or init fails.
 */
export const VgpuPinwheel = ({
  className,
  params,
  onRenderer,
}: VgpuPinwheelProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controllerRef = useRef<PinwheelController | null>(null);
  const paramsRef = useRef(params);
  const onRendererRef = useRef(onRenderer);
  const [renderer, setRenderer] = useState<Renderer>('pending');

  useEffect(() => {
    paramsRef.current = params;
    onRendererRef.current = onRenderer;
  });

  useEffect(() => {
    onRendererRef.current?.(renderer);
  }, [renderer]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;

    Promise.resolve()
      .then(() => {
        // Skip downloading vgpu at all when WebGPU is missing.
        if (!('gpu' in navigator)) throw new Error('navigator.gpu is missing');
        return import('./startPinwheel');
      })
      .then(({ startPinwheel }) => startPinwheel(canvas, paramsRef.current))
      .then((controller) => {
        if (cancelled) {
          controller.dispose();
          return;
        }
        controllerRef.current = controller;
        setRenderer('webgpu');
      })
      .catch((error) => {
        if (cancelled) return;
        console.warn('WebGPU unavailable, using WebGL fallback:', error);
        setRenderer('webgl');
      });

    const handleMouseMove = (event: MouseEvent) => {
      const bounds = canvas.getBoundingClientRect();
      controllerRef.current?.setMouse(
        (event.clientX - bounds.left) / bounds.width,
        1 - (event.clientY - bounds.top) / bounds.height,
      );
    };
    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelled = true;
      canvas.removeEventListener('mousemove', handleMouseMove);
      controllerRef.current?.dispose();
      controllerRef.current = null;
    };
  }, []);

  useEffect(() => {
    controllerRef.current?.setParams(params);
  }, [params]);

  if (renderer === 'webgl') {
    return (
      <GenThreeShader
        className={className}
        shaderConfig={{
          fragmentShader: pinwheelShader,
          uniforms: {
            rotationSpeed: { value: params.rotationSpeed },
            vortexStrength: { value: params.vortexStrength },
            colorIntensity: { value: params.colorIntensity },
          },
        }}
        onDownload={noop}
      />
    );
  }

  return (
    <div className={clsx('relative w-full h-full', className)}>
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};
