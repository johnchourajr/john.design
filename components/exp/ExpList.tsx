'use client';

import {
  CursorPreview,
  type PreviewImage,
  previewHandlers,
} from '@/components/fragments/CursorPreview';
import type { PageItem } from '@/types/content-types';
import Link from 'next/link';
import { useState } from 'react';

export type ExpItem = PageItem & { preview: PreviewImage | null };
export type ExpSection = { title?: string; list: ExpItem[] };

/**
 * The experiments index, laid out like the work page's rows (#128): each row
 * links to its experiment, and hovering one with a mouse shows a still of it
 * beside the cursor.
 */
export function ExpList({ sections }: { sections: ExpSection[] }) {
  const [hovered, setHovered] = useState<ExpItem | null>(null);
  const items = sections.flatMap((section) => section.list);

  return (
    <CursorPreview
      image={hovered?.preview ?? null}
      preload={items.flatMap((item) => (item.preview ? [item.preview] : []))}
    >
      {sections.map((section, index) => (
        <section key={section.title ?? index} className="my-[10vw]">
          {section.title && <h2 className="text-string mb-6 px-4">{section.title}</h2>}
          {section.list.map((item) => (
            <Link
              key={item.href}
              href={item.href ?? ''}
              {...previewHandlers(item, setHovered)}
              className="group/row flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t border-current/15 px-4 py-5 transition-colors duration-(--duration-fast) ease-(--ease-smooth-out) hover:bg-root/10 focus-visible:bg-root/10 focus-visible:outline-none motion-reduce:transition-none"
              data-testid={`exp-row-${item.href?.split('/').pop()}`}
            >
              <div className="flex min-w-0 items-baseline gap-4">
                <h3 className="headline-display-xs">{item.title}</h3>
                {item.status === 'NEW' && <span className="text-caption opacity-60">New</span>}
              </div>
              <div className="flex items-baseline gap-4">
                {item.description && (
                  <p className="text-caption max-w-[36em] opacity-60">{item.description}</p>
                )}
                <span
                  aria-hidden
                  className="text-caption opacity-0 transition-opacity duration-(--duration-fast) group-hover/row:opacity-100 group-focus-visible/row:opacity-100 motion-reduce:transition-none"
                >
                  View →
                </span>
              </div>
            </Link>
          ))}
        </section>
      ))}
    </CursorPreview>
  );
}
