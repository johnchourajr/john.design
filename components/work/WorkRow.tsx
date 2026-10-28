'use client';

import { TagsList } from '@/components/fragments/TagsList';
import { LightLabel } from '@/components/work/LightLabel';
import { LoopingVideo } from '@/components/journal/LoopingVideo';
import type { WorkFrame, WorkMedia } from '@/lib/pages/work-media';
import { formatDateYear } from '@/lib/utils/formatDate';
import type { PageItem } from '@/types/content-types';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useId, useState } from 'react';

export type WorkItem = PageItem & WorkMedia;

/**
 * The strip's height: 40vh from `md` up, and on a phone short enough that a
 * landscape frame fits the screen's width (capped for landscape phones).
 * Image `sizes` are worked out from it.
 */
const STRIP_HEIGHT = { phone: 'min(56vw, 40svh)', md: '40vh' };

/** Frames in view as a row opens, which load straight away. */
const EAGER_FRAMES = 3;

function Frame({
  frame,
  title,
  eager,
}: {
  frame: WorkFrame;
  title: string;
  eager: boolean;
}) {
  const media = 'relative h-full w-auto max-w-none select-none';
  const aspect = (frame.width / frame.height).toFixed(3);
  const [loaded, setLoaded] = useState(false);
  return (
    <figure className="relative h-full shrink-0 snap-start overflow-hidden rounded-sm bg-current/5">
      {frame.placeholder && (
        // The frame at 16px, drawn as square pixels under it until it loads.
        // A video's stays under the video, whose poster covers it.
        // eslint-disable-next-line @next/next/no-img-element -- a data URL a few hundred bytes long, which the optimizer has nothing to do for.
        <img
          src={frame.placeholder}
          alt=""
          aria-hidden
          className={clsx(
            'absolute inset-0 size-full object-cover [image-rendering:pixelated] transition-opacity duration-(--duration-medium) motion-reduce:transition-none',
            loaded && 'opacity-0',
          )}
        />
      )}
      {frame.kind === 'video' ? (
        <LoopingVideo
          sources={frame.sources}
          width={frame.width}
          height={frame.height}
          className={media}
          poster={frame.poster}
          controls
          testId={`work-frame-toggle-${frame.src.split('/').pop()}`}
        />
      ) : (
        <Image
          src={frame.src}
          alt={title}
          width={frame.width}
          height={frame.height}
          // A frame is as wide as its aspect ratio at the strip's height.
          sizes={`(max-width: 767px) calc(${STRIP_HEIGHT.phone} * ${aspect}), calc(${STRIP_HEIGHT.md} * ${aspect})`}
          className={media}
          onLoad={() => setLoaded(true)}
          loading={eager ? 'eager' : 'lazy'}
          draggable={false}
        />
      )}
    </figure>
  );
}

/** `https://www.example.com/path/` as `example.com/path`. */
const displayUrl = (href: string) =>
  href.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

function Overview({
  slug,
  overview,
  deliverables,
  externalHref,
  siteNote,
}: Pick<PageItem, 'slug' | 'overview' | 'deliverables' | 'externalHref' | 'siteNote'>) {
  return (
    // Above the frames on a phone; the strip's first card from `md` up.
    <div className="mx-4 flex flex-col justify-between gap-4 rounded-sm border border-current/15 p-5 md:mx-0 md:h-full md:w-[min(30rem,85vw)] md:shrink-0 md:overflow-y-auto">
      {overview && <p className="text-paragraph max-md:text-base">{overview}</p>}
      <div className="flex flex-col gap-4">
        {deliverables && deliverables.length > 0 && (
          <div>
            <h4 className="text-caption mb-2 opacity-60">Deliverables</h4>
            <ul className="text-caption grid grid-cols-2 gap-x-4 gap-y-1">
              {deliverables.map((deliverable) => (
                <li key={deliverable}>{deliverable}</li>
              ))}
            </ul>
          </div>
        )}
        {externalHref && (
          <Link
            href={externalHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-caption cursor-ne-resize self-start normal-case underline-offset-2 hover:underline"
            data-testid={`work-overview-visit-${slug}`}
          >
            {displayUrl(externalHref)} ↗
          </Link>
        )}
        {!externalHref && siteNote && <p className="text-caption opacity-60">{siteNote}</p>}
      </div>
    </div>
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
  light,
  tags,
  status,
  externalHref,
  overview,
  deliverables,
  siteNote,
  frames,
  open,
  onToggle,
}: WorkRowProps) {
  const stripId = useId();
  // Frames load the first time the row opens, then stay for closing.
  const [opened, setOpened] = useState(open);
  if (open && !opened) setOpened(true);

  const hasOverview = Boolean(overview || deliverables?.length);
  const hasFrames = frames.length > 0 || hasOverview;
  const details = (
    <>
      <h3 className="headline-display-xs text-left">{title}</h3>
      {date && <span className="text-caption opacity-60">{formatDateYear(date)}</span>}
      {light && <LightLabel light={light} />}
    </>
  );

  return (
    <article
      // Clear of the fixed header when a link scrolls to it.
      className="scroll-mt-20 border-t border-current/15"
      data-work-row={slug ?? title}
      data-testid={`work-row-${slug}`}
    >
      <header
        className={clsx(
          'group/row relative flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 px-4 py-5',
          // A dim wash of the accent while the row is hovered or focused from
          // the keyboard; a tap's focus would leave it on.
          hasFrames &&
            'transition-colors duration-(--duration-fast) ease-(--ease-smooth-out) hover:bg-root/10 has-[:focus-visible]:bg-root/10 motion-reduce:transition-none',
        )}
      >
        {hasFrames ? (
          <button
            type="button"
            aria-expanded={open}
            aria-controls={stripId}
            onClick={onToggle}
            // Stretched over the whole row, so anywhere on it opens the
            // project; the Visit link sits above it.
            className={clsx(
              'flex min-w-0 grow flex-wrap items-baseline gap-x-4 gap-y-1 outline-none after:absolute after:inset-0',
              open ? 'minus-cursor' : 'plus-cursor',
            )}
            data-testid={`work-row-toggle-${slug}`}
          >
            {details}
          </button>
        ) : (
          <div className="flex min-w-0 grow flex-wrap items-baseline gap-x-4 gap-y-1">
            {details}
            {status && <span className="text-caption opacity-60">{status}</span>}
          </div>
        )}
        <div className="flex flex-wrap items-center gap-4">
          {hasFrames && (
            // The button already announces its state; this is for the eye,
            // with a mouse or keyboard. A touch screen has no hover to show it.
            <span
              aria-hidden
              className="text-caption opacity-0 transition-opacity duration-(--duration-fast) group-hover/row:opacity-100 group-has-[:focus-visible]/row:opacity-100 pointer-coarse:hidden motion-reduce:transition-none"
            >
              {open ? 'Close' : 'Open'}
            </span>
          )}
          {tags && <TagsList tags={tags} className="" />}
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
              aria-label={`${title}, overview and frames`}
              tabIndex={open ? 0 : -1}
              className="flex flex-col gap-4 pt-4 pb-5 md:h-[40vh] md:flex-row md:gap-2 md:overflow-x-auto md:overscroll-x-contain md:px-4"
            >
              {hasOverview && (
                <Overview
                  slug={slug}
                  overview={overview}
                  deliverables={deliverables}
                  externalHref={externalHref}
                  siteNote={siteNote}
                />
              )}
              {/* Its own sideways scroll on a phone, snapping frame by frame;
                  from `md` up the frames join the strip beside the overview. */}
              <div className="flex h-[min(56vw,40svh)] snap-x snap-mandatory scroll-px-4 gap-2 overflow-x-auto overscroll-x-contain px-4 empty:hidden md:contents">
                {opened &&
                  frames.map((frame, index) => (
                    <Frame
                      key={frame.src}
                      frame={frame}
                      title={title}
                      eager={index < EAGER_FRAMES}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
