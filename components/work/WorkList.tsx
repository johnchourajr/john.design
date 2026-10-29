'use client';

import { CursorPreview, previewHandlers } from '@/components/fragments/CursorPreview';
import { type WorkItem, WorkRow } from '@/components/work/WorkRow';
import { useEffect, useState } from 'react';

/** The query parameter naming the open project, e.g. `/work?project=bueno-fund`. */
const PARAM = 'project';

/** Writes the open project into the URL, without adding a history entry. */
function writeOpenToUrl(slug: string | null) {
  const url = new URL(window.location.href);
  if (slug) url.searchParams.set(PARAM, slug);
  else url.searchParams.delete(PARAM);
  window.history.replaceState(window.history.state, '', url);
}

const rowOf = (slug: string) => document.querySelector(`[data-work-row="${CSS.escape(slug)}"]`);

/**
 * The work page's projects, newest first (#128), then the open-source ones
 * under their own heading. One row is open at a time across both lists,
 * and hovering a closed row with a mouse shows its cover beside the cursor.
 * The open row is kept in the URL (`?project=<slug>`), so a link or a reload
 * opens it again and scrolls to it.
 */
export function WorkList({ items, oss }: { items: WorkItem[]; oss: WorkItem[] }) {
  const all = [...items, ...oss];
  const [openSlug, setOpenSlugState] = useState<string | null>(null);
  const [hovered, setHovered] = useState<WorkItem | null>(null);
  // A project from the URL to scroll to once its row has opened.
  const [linked, setLinked] = useState<string | null>(null);

  const setOpenSlug = (slug: string | null) => {
    setOpenSlugState(slug);
    writeOpenToUrl(slug);
  };

  // Read after hydration: the page is static, so the server can't see it.
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get(PARAM);
    if (!slug || ![...items, ...oss].some((item) => item.slug === slug)) return;
    // The URL is only readable on the client, so this follows hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpenSlugState(slug);
    setLinked(slug);
  }, [items, oss]);

  // Scrolls once the strip has opened: before then the page can be too
  // short to bring a row near the bottom up to the top. Without a
  // transition (reduced motion), the timeout does it.
  useEffect(() => {
    const row = linked && rowOf(linked);
    if (!row) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scroll = () => {
      row.removeEventListener('transitionend', onEnd);
      clearTimeout(fallback);
      row.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    };
    const onEnd = (event: Event) => {
      if ((event as TransitionEvent).propertyName === 'grid-template-rows') scroll();
    };
    row.addEventListener('transitionend', onEnd);
    const fallback = setTimeout(scroll, reduceMotion ? 0 : 1000);
    return () => {
      row.removeEventListener('transitionend', onEnd);
      clearTimeout(fallback);
    };
  }, [linked]);

  // Escape closes the open row. Focus inside its strip goes back to the
  // row's button, so it isn't lost in content that is about to go inert.
  useEffect(() => {
    if (!openSlug) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      const row = rowOf(openSlug);
      if (row?.contains(document.activeElement)) {
        row.querySelector<HTMLElement>('[aria-expanded]')?.focus();
      }
      setOpenSlug(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [openSlug]);

  const cover = hovered && hovered.slug !== openSlug ? hovered.cover : null;

  const row = (item: WorkItem) => {
    const slug = item.slug ?? item.title;
    return (
      <div key={slug} {...previewHandlers(item, setHovered)}>
        <WorkRow
          {...item}
          open={openSlug === slug}
          onToggle={() => setOpenSlug(openSlug === slug ? null : slug)}
        />
      </div>
    );
  };

  return (
    <CursorPreview
      image={cover}
      preload={all.flatMap((item) => (item.cover ? [item.cover] : []))}
    >
      <div className="my-[10vw] flex flex-col gap-[10vw]">
        <section aria-label="Work">{items.map(row)}</section>
        {oss.length > 0 && (
          <section aria-labelledby="work-oss">
            <h2 id="work-oss" className="text-string mb-6 px-4">
              Open Source
            </h2>
            {oss.map(row)}
          </section>
        )}
      </div>
    </CursorPreview>
  );
}
