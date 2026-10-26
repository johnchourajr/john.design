'use client';

import { CursorPreview, previewHandlers } from '@/components/fragments/CursorPreview';
import { type WorkItem, WorkRow } from '@/components/work/WorkRow';
import { useEffect, useState } from 'react';

export type WorkSection = { title: string; list: WorkItem[] };

/**
 * The work page's projects, by section (#128). One row is open at a time,
 * and hovering a closed row with a mouse shows its cover beside the cursor.
 */
export function WorkList({ sections }: { sections: WorkSection[] }) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [hovered, setHovered] = useState<WorkItem | null>(null);

  // Escape closes the open row. Focus inside its strip goes back to the
  // row's button, so it isn't lost in content that is about to go inert.
  useEffect(() => {
    if (!openSlug) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      const row = document.querySelector(`[data-work-row="${openSlug}"]`);
      if (row?.contains(document.activeElement)) {
        row.querySelector<HTMLElement>('[aria-expanded]')?.focus();
      }
      setOpenSlug(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [openSlug]);

  const items = sections.flatMap((section) => section.list);
  const cover = hovered && hovered.slug !== openSlug ? hovered.cover : null;

  return (
    <CursorPreview
      image={cover}
      preload={items.flatMap((item) => (item.cover ? [item.cover] : []))}
    >
      {sections.map((section) => (
        <section key={section.title} className="my-[10vw]">
          <h2 className="text-string mb-6 px-4">{section.title}</h2>
          {section.list.map((item) => {
            const slug = item.slug ?? item.title;
            return (
              <div key={slug} {...previewHandlers(item, setHovered)}>
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
    </CursorPreview>
  );
}
