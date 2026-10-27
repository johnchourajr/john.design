'use client';

import { duration, ease, scale } from '@/lib/config/motion-tokens';
import { useIdle } from '@/lib/hooks/useIdle';
import clsx from 'clsx';
import {
  AnimatePresence,
  m,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'motion/react';
import Image from 'next/image';
import { type ReactNode, useState } from 'react';

export type PreviewImage = { src: string; width: number; height: number };

/** The preview's width in px; its height follows the image's aspect ratio. */
const PREVIEW_WIDTH = 288;

function PreviewImg({ image }: { image: PreviewImage }) {
  return (
    <Image
      src={image.src}
      alt=""
      width={PREVIEW_WIDTH}
      height={Math.round((PREVIEW_WIDTH * image.height) / image.width)}
      sizes={`${PREVIEW_WIDTH}px`}
      loading="eager"
      // Preflight caps images at their parent's width, and the preview's
      // wrapper has none of its own.
      className="block h-auto w-72 max-w-none max-h-96 object-cover"
    />
  );
}

/**
 * An area whose rows show an image beside the cursor while hovered: the work
 * and experiments lists (#128). The list decides which image is showing;
 * this follows the cursor with it. The preview trails the cursor a little
 * (on it, with reduced motion) and sits above it in the lower part of the
 * screen, so it never runs off the bottom. `preload` images load once the
 * page is idle, so the first hover isn't empty.
 */
export function CursorPreview({
  image,
  preload = [],
  children,
}: {
  image: PreviewImage | null;
  preload?: PreviewImage[];
  children: ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 500, damping: 45, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 500, damping: 45, mass: 0.6 });
  const [above, setAbove] = useState(false);

  const preloading = useIdle();

  return (
    <div
      onPointerMove={(event) => {
        x.set(event.clientX);
        y.set(event.clientY);
        const lower = event.clientY > window.innerHeight * 0.55;
        if (lower !== above) setAbove(lower);
      }}
    >
      {children}
      <m.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-40"
        style={{ x: reduceMotion ? x : springX, y: reduceMotion ? y : springY }}
      >
        <AnimatePresence>
          {image && (
            <m.div
              key={image.src}
              className={clsx(
                'absolute left-4 overflow-hidden rounded-sm shadow-xl',
                above ? 'bottom-4' : 'top-4',
              )}
              initial={{ opacity: 0, scale: scale.small }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: scale.small }}
              transition={{
                duration: reduceMotion ? 0 : duration.fast,
                ease: ease.smoothOut,
              }}
            >
              <PreviewImg image={image} />
            </m.div>
          )}
        </AnimatePresence>
      </m.div>
      {preloading && (
        <div aria-hidden className="hidden">
          {preload.map((item) => (
            <PreviewImg key={item.src} image={item} />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Pointer handlers for a row in a `CursorPreview` area: it shows its image
 * while a mouse is over it (touch has no hover, so taps go straight through).
 */
export function previewHandlers<T>(item: T, setHovered: (item: T | null) => void) {
  return {
    onPointerEnter: (event: React.PointerEvent) => {
      if (event.pointerType === 'mouse') setHovered(item);
    },
    onPointerLeave: () => setHovered(null),
  };
}
