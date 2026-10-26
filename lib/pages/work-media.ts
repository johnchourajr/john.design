import { getMediaSize, getVideoSources, isVideoSrc } from '@/lib/pages/journal-media';
import type { VideoSource } from '@/lib/pages/journal-media';
import fs from 'fs';
import { join } from 'path';

/**
 * Build-time listing of each project's frames for the work page's strips
 * (#128). A project's media is every file in `public/work-images/<slug>/`,
 * named `<slug>-<kind>-<n>` by the capture scripts or by hand; a WebM beside
 * an MP4 of the same name is that video's smaller source, not a frame.
 */

export type WorkFrame = {
  src: string;
  width: number;
  height: number;
} & ({ kind: 'image' } | { kind: 'video'; sources: VideoSource[] });

const directory = join(process.cwd(), 'public', 'work-images');

const FRAME_PATTERN = /\.(jpe?g|png|webp|gif|mp4|webm|mov)$/i;

// The site comes first (its recording, then its pages), then the brand work
// and photography around it.
const KIND_ORDER = [
  'scroll',
  'desktop',
  'mobile',
  'release',
  'demo',
  'slice',
  'brand',
  'gfb',
  'art',
  'bag',
  'photo',
  'archive',
];

function rank(slug: string, file: string): number {
  const kind = file.slice(slug.length + 1).split('-')[0];
  const index = KIND_ORDER.indexOf(kind);
  return index === -1 ? KIND_ORDER.length : index;
}

export function getWorkFrames(slug: string): WorkFrame[] {
  let files: string[];
  try {
    // Only runs while prerendering; don't trace public/ into the server bundle.
    files = fs.readdirSync(/*turbopackIgnore: true*/ join(directory, slug));
  } catch {
    return [];
  }

  const names = new Set(files);
  return files
    .filter((file) => FRAME_PATTERN.test(file))
    .filter((file) => !(/\.webm$/i.test(file) && names.has(file.replace(/\.webm$/i, '.mp4'))))
    .sort((a, b) => rank(slug, a) - rank(slug, b) || a.localeCompare(b, 'en', { numeric: true }))
    .flatMap((file): WorkFrame[] => {
      const src = `/work-images/${slug}/${file}`;
      const size = getMediaSize(src);
      if (!size) return [];
      return isVideoSrc(src)
        ? [{ kind: 'video', src, ...size, sources: getVideoSources(src) }]
        : [{ kind: 'image', src, ...size }];
    });
}
