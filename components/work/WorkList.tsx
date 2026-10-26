'use client';

import { type WorkItem, WorkRow } from '@/components/work/WorkRow';
import { duration, ease, scale } from '@/lib/config/motion-tokens';
import {
  AnimatePresence,
  m,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'motion/react';
import clsx from 'clsx';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import type { WorkFrame } from '@/lib/pages/work-media';

export type WorkSection = { title: string; list: WorkItem[] };

/** The preview's width in px; its height follows the cover's aspect ratio. */
const PREVIEW_WIDTH = 288;

function CoverImage({ cover }: { cover: WorkFrame }) {
  return (
    <Image
      src={cover.src}
      alt=""
      width={PREVIEW_WIDTH}
      height={Math.round((PREVIEW_WIDTH * cover.height) / cover.width)}
      sizes={`${PREVIEW_WIDTH}px`}
      loading="eager"
      className="block h-auto w-72 max-w-none max-h-96 object-cover"
    />
  );
}

/**
 * The work page's projects, by section (#128). One row is open at a time,
 * and hovering a closed row with a mouse shows its cover beside the cursor.
 */
export function WorkList({ sections }: { sections: WorkSection[] }) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [hovered, setHovered] = useState<WorkItem | null>(null);
  // The covers load once the page is idle, so the first hover isn't empty.
  const [preloading, setPreloading] = useState(false);
  useEffect(() => {
    if (!('requestIdleCallback' in window)) {
      const timeout = setTimeout(() => setPreloading(true), 1000);
      return () => clearTimeout(timeout);
    }
    const idle = requestIdleCallback(() => setPreloading(true), { timeout: 2000 });
    return () => cancelIdleCallback(idle);
  }, []);

  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  // The preview trails the cursor a little; with reduced motion it sits on it.
  const springX = useSpring(x, { stiffness: 500, damping: 45, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 500, damping: 45, mass: 0.6 });

  // In the lower part of the screen the preview sits above the cursor, so it
  // never runs off the bottom.
  const [above, setAbove] = useState(false);

  const cover = hovered && hovered.slug !== openSlug ? hovered.cover : null;

  return (
    <div
      onPointerMove={(event) => {
        x.set(event.clientX);
        y.set(event.clientY);
        const lower = event.clientY > window.innerHeight * 0.55;
        if (lower !== above) setAbove(lower);
      }}
    >
      {sections.map((section) => (
        <section key={section.title} className="my-[10vw]">
          <h2 className="text-string mb-6 px-4">{section.title}</h2>
          {section.list.map((item) => {
            const slug = item.slug ?? item.title;
            return (
              <div
                key={slug}
                onPointerEnter={(event) => {
                  if (event.pointerType === 'mouse') setHovered(item);
                }}
                onPointerLeave={() => setHovered(null)}
              >
                <WorkRow
                  {...item}
                  open={openSlug === slug}
                  onToggle={() => setOpenSlug((current) => (current === slug ? null : slug))}
                />
              </div>
            );
          })}
        </section>
      ))}
      <m.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-40"
        style={{ x: reduceMotion ? x : springX, y: reduceMotion ? y : springY }}
      >
        <AnimatePresence>
          {cover && (
            <m.div
              key={cover.src}
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
              <CoverImage cover={cover} />
            </m.div>
          )}
        </AnimatePresence>
      </m.div>
      {preloading && (
        <div aria-hidden className="hidden">
          {sections.flatMap((section) =>
            section.list.flatMap((item) =>
              item.cover ? [<CoverImage key={item.cover.src} cover={item.cover} />] : [],
            ),
          )}
        </div>
      )}
    </div>
  );
}
