'use client';

import { TagsList } from '@/components/fragments/TagsList';
import { LoopingVideo } from '@/components/journal/LoopingVideo';
import type { WorkFrame, WorkMedia } from '@/lib/pages/work-media';
import { formatDateYear } from '@/lib/utils/formatDate';
import type { PageItem } from '@/types/content-types';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useId, useState } from 'react';

export type WorkItem = PageItem & WorkMedia;

/** The strip's height, in vh; image `sizes` are worked out from it. */
const STRIP_HEIGHT = 40;

function Frame({ frame, title }: { frame: WorkFrame; title: string }) {
  const media = 'h-full w-auto max-w-none select-none';
  return (
    <figure className="h-full shrink-0 overflow-hidden rounded-sm bg-current/5">
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
          // A frame is as wide as its aspect ratio at the strip's height.
          sizes={`${Math.ceil((STRIP_HEIGHT * frame.width) / frame.height)}vh`}
          className={media}
          draggable={false}
        />
      )}
    </figure>
  );
}

export type WorkRowProps = WorkItem & {
  open: boolean;
  onToggle: () => void;
};

/**
 * One project on the work page: its name and details, then its frames in a
 * strip that opens in place and scrolls sideways (#128). The list keeps one
 * row open at a time.
 */
export function WorkRow({
  slug,
  title,
  date,
  tags,
  status,
  externalHref,
  frames,
  open,
  onToggle,
}: WorkRowProps) {
  const stripId = useId();
  // Frames load the first time the row opens, then stay for closing.
  const [opened, setOpened] = useState(open);
  if (open && !opened) setOpened(true);

  const hasFrames = frames.length > 0;
  const name = <h3 className="headline-display-xs text-left">{title}</h3>;

  return (
    <article className="border-t border-current/15" data-testid={`work-row-${slug}`}>
      <header className="group/row relative flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 px-4 py-5">
        {hasFrames ? (
          <button
            type="button"
            aria-expanded={open}
            aria-controls={stripId}
            onClick={onToggle}
            // Stretched over the whole row, so anywhere on it opens the
            // project; the Visit link sits above it.
            className="flex min-w-0 grow items-baseline gap-4 underline-offset-4 group-hover/row:underline after:absolute after:inset-0"
            data-testid={`work-row-toggle-${slug}`}
          >
            {name}
            {date && <span className="text-caption opacity-60">{formatDateYear(date)}</span>}
          </button>
        ) : (
          <div className="flex min-w-0 grow items-baseline gap-4">
            {name}
            {date && <span className="text-caption opacity-60">{formatDateYear(date)}</span>}
            {status && <span className="text-caption opacity-60">{status}</span>}
          </div>
        )}
        <div className="flex flex-wrap items-center gap-4">
          {tags && <TagsList tags={tags} />}
          {externalHref && (
            <Link
              href={externalHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-caption relative z-10 cursor-ne-resize underline-offset-2 hover:underline"
              data-testid={`work-row-visit-${slug}`}
            >
              Visit ↗
            </Link>
          )}
        </div>
      </header>
      {hasFrames && (
        <div
          id={stripId}
          inert={!open}
          className={clsx(
            'grid ease-(--ease-smooth-out) transition-[grid-template-rows] motion-reduce:transition-none',
            // Opening grows on the slower step; closing is quicker.
            open
              ? 'grid-rows-[1fr] duration-(--duration-slow)'
              : 'grid-rows-[0fr] duration-(--duration-medium)',
          )}
        >
          <div className="overflow-hidden">
            <div
              role="region"
              aria-label={`${title}, frames`}
              tabIndex={open ? 0 : -1}
              className="flex h-[30vh] gap-2 overflow-x-auto overscroll-x-contain px-4 pb-5 md:h-[40vh]"
            >
              {opened &&
                frames.map((frame) => (
                  <Frame key={frame.src} frame={frame} title={title} />
                ))}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
