'use client';

import { TagsList } from '@/components/fragments/TagsList';
import { LoopingVideo } from '@/components/journal/LoopingVideo';
import type { WorkFrame } from '@/lib/pages/work-media';
import { formatDateYear } from '@/lib/utils/formatDate';
import type { PageItem } from '@/types/content-types';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useId, useState } from 'react';

export type WorkItem = PageItem & { frames: WorkFrame[] };

/** The strip's open height, in vh; image `sizes` are worked out from it. */
const OPEN_HEIGHT = 78;

function Frame({ frame, title }: { frame: WorkFrame; title: string }) {
  const media = 'h-full w-auto max-w-none select-none';
  return (
    <figure className="h-full shrink-0 snap-start overflow-hidden rounded-sm bg-current/5">
      {frame.kind === 'video' ? (
        <LoopingVideo
          sources={frame.sources}
          width={frame.width}
          height={frame.height}
          className={media}
        />
      ) : (
        <Image
          src={frame.src}
          alt={title}
          width={frame.width}
          height={frame.height}
          // A frame is as wide as its aspect ratio at the strip's open height.
          sizes={`${Math.ceil((OPEN_HEIGHT * frame.width) / frame.height)}vh`}
          className={media}
          draggable={false}
        />
      )}
    </figure>
  );
}

/**
 * One project on the work page: its name and details, then a strip of its
 * frames that scrolls sideways and opens in place to show them larger (#128).
 */
export function WorkRow({
  slug,
  title,
  date,
  tags,
  status,
  externalHref,
  frames,
}: WorkItem) {
  const [open, setOpen] = useState(false);
  const stripId = useId();

  return (
    <article className="border-t border-current/15 py-5" data-testid={`work-row-${slug}`}>
      <header className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 px-4">
        <div className="flex min-w-0 items-baseline gap-4">
          <h3 className="headline-display-xs">{title}</h3>
          {date && <p className="text-caption opacity-60">{formatDateYear(date)}</p>}
          {status && <p className="text-caption opacity-60">{status}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {tags && <TagsList tags={tags} />}
          {externalHref && (
            <Link
              href={externalHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-caption cursor-ne-resize underline-offset-2 hover:underline"
              data-testid={`work-row-visit-${slug}`}
            >
              Visit ↗
            </Link>
          )}
          {frames.length > 0 && (
            <button
              type="button"
              aria-expanded={open}
              aria-controls={stripId}
              onClick={() => setOpen((value) => !value)}
              className="text-caption underline-offset-2 hover:underline"
              data-testid={`work-row-toggle-${slug}`}
            >
              {open ? 'Close' : 'Open'}
            </button>
          )}
        </div>
      </header>
      {frames.length > 0 && (
        <div
          id={stripId}
          role="region"
          aria-label={`${title}, frames`}
          tabIndex={0}
          className={clsx(
            'mt-4 flex gap-2 overflow-x-auto overscroll-x-contain px-4 scroll-px-4 snap-x snap-proximity',
            // Opening grows on the slower step; closing is quicker.
            'transition-[height] ease-(--ease-smooth-out) motion-reduce:transition-none',
            open
              ? 'h-[60vh] duration-(--duration-slow) md:h-[78vh]'
              : 'h-[28vh] duration-(--duration-medium) md:h-[36vh]',
          )}
        >
          {frames.map((frame) => (
            <Frame key={frame.src} frame={frame} title={title} />
          ))}
        </div>
      )}
    </article>
  );
}
