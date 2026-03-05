'use client';

import { useDrawing } from '@/components/experimental/Drawing';
import clsx from 'clsx';
import { motion } from 'motion/react';
import type { ComponentProps } from 'react';

export const GRADIENT_ANGLES = {
  top: 0,
  right: 90,
  bottom: 180,
  left: 270,
} as const;

export type ProgressiveBlurProps = {
  direction?: keyof typeof GRADIENT_ANGLES;
  blurLayers?: number;
  className?: string;
  blurIntensity?: number;
} & ComponentProps<typeof motion.div>;

export function ProgressiveBlur({
  direction = 'bottom',
  blurLayers = 10,
  className,
  blurIntensity = 0.5,
  ...props
}: ProgressiveBlurProps) {
  const { isIframe } = useDrawing();
  if (isIframe) return null;

  const layers = Math.max(blurLayers, 2);
  const segmentSize = 1 / (blurLayers + 1);

  return (
    <div
      className={clsx(
        'fixed left-0 right-0 top-0 z-40 overflow-hidden pointer-events-none',
        className,
      )}
      aria-hidden
    >
      {Array.from({ length: layers }).map((_, index) => {
        const angle = GRADIENT_ANGLES[direction];
        const gradientStops = [
          index * segmentSize,
          (index + 1) * segmentSize,
          (index + 2) * segmentSize,
          (index + 3) * segmentSize,
        ].map(
          (pos, posIndex) =>
            `rgba(255, 255, 255, ${posIndex === 1 || posIndex === 2 ? 1 : 0}) ${pos * 100}%`,
        );

        const gradient = `linear-gradient(${angle}deg, ${gradientStops.join(', ')})`;

        return (
          <motion.div
            key={index}
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{
              maskImage: gradient,
              WebkitMaskImage: gradient,
              backdropFilter: `blur(${index * blurIntensity}px)`,
              WebkitBackdropFilter: `blur(${index * blurIntensity}px)`,
            }}
            {...props}
          />
        );
      })}
    </div>
  );
}
