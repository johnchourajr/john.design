import {
  getHostedMediaSize,
  hasHostedMedia,
  isHostedMedia,
  mediaUrl,
} from '@/lib/media/hosted';
import { type MediaSize, readImageSize, readVideoSize } from '@/lib/media/read-size';
import fs from 'fs';
import { join } from 'path';

/**
 * Build-time helpers for the media embedded in journal posts. They read files
 * from `public/` so the markdown can stay a plain `![size](/path)` while the
 * page still knows each asset's intrinsic size (no layout shift, and
 * `next/image` needs it) and which video formats exist. See #87.
 *
 * Hosted media (`/journal-images/…`, see #88) is answered from the committed
 * manifest and served from the media origin; anything else still in `public/`
 * is read from disk.
 */

export type { MediaSize };
export type VideoSource = { src: string; type: string };

const publicDirectory = join(process.cwd(), 'public');
const sizeCache = new Map<string, MediaSize | null>();

const VIDEO_PATTERN = /\.(mp4|webm|mov)(\?.*)?$/i;

export function isVideoSrc(src: string): boolean {
  return VIDEO_PATTERN.test(src);
}

function localPath(src: string): string | null {
  if (!src.startsWith('/') || src.startsWith('//')) return null;
  const path = join(publicDirectory, decodeURI(src.split('?')[0]));
  if (!path.startsWith(publicDirectory)) return null;
  // Only runs while prerendering; don't trace public/ into the server bundle.
  return fs.existsSync(/*turbopackIgnore: true*/ path) ? path : null;
}

function hasMedia(src: string): boolean {
  return isHostedMedia(src) ? hasHostedMedia(src) : localPath(src) !== null;
}

/**
 * The videos to offer for `src`, best first: a WebM sibling (same name, kept
 * only where it is clearly smaller than the MP4), then the MP4 itself.
 */
export function getVideoSources(src: string): VideoSource[] {
  const sources: VideoSource[] = [];
  if (/\.mp4$/i.test(src)) {
    const webm = src.replace(/\.mp4$/i, '.webm');
    if (hasMedia(webm)) sources.push({ src: mediaUrl(webm), type: 'video/webm' });
    sources.push({ src: mediaUrl(src), type: 'video/mp4' });
  } else if (/\.webm$/i.test(src)) {
    sources.push({ src: mediaUrl(src), type: 'video/webm' });
  } else {
    sources.push({ src: mediaUrl(src), type: 'video/quicktime' });
  }
  return sources;
}

/** Intrinsic size of a hosted or local image or video, or null if unknown. */
export function getMediaSize(src: string): MediaSize | null {
  if (isHostedMedia(src)) return getHostedMediaSize(src);
  if (sizeCache.has(src)) return sizeCache.get(src)!;
  let size: MediaSize | null = null;
  const path = localPath(src);
  if (path) {
    try {
      const buffer = fs.readFileSync(/*turbopackIgnore: true*/ path);
      size = isVideoSrc(src) ? readVideoSize(buffer) : readImageSize(buffer);
    } catch {
      size = null;
    }
  }
  sizeCache.set(src, size);
  return size;
}
