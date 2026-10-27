import manifest from '@/data/media-manifest.json';

import type { MediaSize } from './read-size';

/**
 * Journal and work media live in the `john-design-media` R2 bucket, served
 * from this origin, instead of `public/` (see #88 and #128). Pages keep
 * writing root-relative paths like `/journal-images/images/x.jpg`;
 * `mediaUrl` points them here.
 */
export const MEDIA_ORIGIN = 'https://media.john.design';

const HOSTED_PREFIXES = ['/journal-images/', '/work-images/'];

type ManifestEntry = MediaSize & { bytes: number };

const entries = manifest as Record<string, ManifestEntry | { bytes: number }>;

/** The root-relative path for a hosted URL or path, e.g. `/journal-images/…`. */
export function mediaPath(src: string): string {
  return src.startsWith(MEDIA_ORIGIN) ? src.slice(MEDIA_ORIGIN.length) : src;
}

export function isHostedMedia(src: string): boolean {
  const path = mediaPath(src).split('?')[0];
  return HOSTED_PREFIXES.some((prefix) => path.startsWith(prefix));
}

/** Absolute URL for hosted media; anything else is returned unchanged. */
export function mediaUrl(src: string): string;
export function mediaUrl(src: string | null): string | null;
export function mediaUrl(src: string | null): string | null {
  if (!src || !isHostedMedia(src)) return src;
  return MEDIA_ORIGIN + mediaPath(src);
}

/** Whether the bucket has this object, according to the committed manifest. */
export function hasHostedMedia(src: string): boolean {
  return mediaPath(src).split('?')[0] in entries;
}

/** Every hosted path under a prefix, e.g. `/work-images/<slug>/`. */
export function hostedMediaPaths(prefix: string): string[] {
  return Object.keys(entries).filter((path) => path.startsWith(prefix));
}

/** Intrinsic size recorded in the manifest, or null for SVGs and unknowns. */
export function getHostedMediaSize(src: string): MediaSize | null {
  const entry = entries[mediaPath(src).split('?')[0]];
  return entry && 'width' in entry
    ? { width: entry.width, height: entry.height }
    : null;
}
