import { getImageProps } from 'next/image';

import placeholders from '@/data/media-placeholders.json';
import { hasHostedMedia, mediaUrl } from '@/lib/media/hosted';
import { getMediaSize, getVideoSources, isVideoSrc } from '@/lib/pages/journal-media';
import type { VideoSource } from '@/lib/pages/journal-media';

/**
 * Build-time listing of each project's frames for the work page's strips
 * (#128). A project's `media` in data/workContent.ts names its files in
 * `/work-images/<slug>/` (hosted on R2, see lib/media/hosted.ts), in the
 * order the strip shows them. A video's still lives at
 * `posters/<name>.jpg` beside it, and a WebM of the same name is its smaller
 * source; neither is listed.
 */

const blurs = placeholders as Record<string, string>;

/**
 * A video poster's display width. The optimizer serves it at 2x (1080px),
 * about a 40vh strip on a high-density screen.
 */
const POSTER_WIDTH = 540;

export type WorkFrame = {
  src: string;
  width: number;
  height: number;
  /** A blurred 16px still (the poster's, for a video), shown while it loads. */
  placeholder: string | null;
} & (
  | { kind: 'image' }
  | {
      kind: 'video';
      sources: VideoSource[];
      /** A still of its opening, from `posters/<name>.jpg`, shown until it plays. */
      poster: string | null;
    }
);

export type WorkMedia = {
  frames: WorkFrame[];
  /** The still shown beside the cursor while a closed row is hovered. */
  cover: { src: string; width: number; height: number } | null;
};

/**
 * The frames for `slug`, in `media` order. `hoverImage` names the file whose
 * still is the hover cover, listed or not (a video's poster, say, as
 * `posters/<name>.jpg`); without it, the first image (or, failing that, the
 * first video's poster) is. A name that isn't uploaded fails the build, so a
 * typo can't quietly drop a frame.
 */
export function getWorkMedia(slug: string, media: string[] = [], hoverImage?: string): WorkMedia {
  const prefix = `/work-images/${slug}/`;
  const path = (file: string) => {
    if (!hasHostedMedia(`${prefix}${file}`)) {
      throw new Error(
        `work media: ${slug} lists "${file}", which isn't in data/media-manifest.json. ` +
          'Check the name, or run `pnpm media:upload .media && pnpm media:manifest .media`.',
      );
    }
    return `${prefix}${file}`;
  };

  const frameOf = (file: string): WorkFrame => {
    const src = path(file);
    const size = getMediaSize(src);
    if (!size) throw new Error(`work media: no size recorded for ${src}`);
    if (!isVideoSrc(src)) {
      return { kind: 'image', src: mediaUrl(src), ...size, placeholder: blurs[src] ?? null };
    }
    const poster = `${prefix}posters/${file.replace(/\.\w+$/, '.jpg')}`;
    const hasPoster = hasHostedMedia(poster);
    return {
      kind: 'video',
      src: mediaUrl(src),
      ...size,
      sources: getVideoSources(src),
      // Through the image optimizer, like the strip's images: a <video>
      // poster is a plain URL, so it gets one size.
      poster: hasPoster ? posterUrl(mediaUrl(poster), size) : null,
      placeholder: hasPoster ? (blurs[poster] ?? null) : null,
    };
  };
  const frames = media.map(frameOf);
  const posterOriginal = (frame: WorkFrame) =>
    frame.kind === 'video' && frame.poster
      ? mediaUrl(`${prefix}posters/${frame.src.split('/').pop()!.replace(/\.\w+$/, '.jpg')}`)
      : null;

  const coverOf = (frame: WorkFrame | undefined): WorkMedia['cover'] => {
    if (!frame) return null;
    if (frame.kind === 'image') return frame;
    const poster = posterOriginal(frame);
    return poster ? { src: poster, width: frame.width, height: frame.height } : null;
  };
  const cover = hoverImage
    ? coverOf(frameOf(hoverImage))
    : (coverOf(frames.find((frame) => frame.kind === 'image')) ?? coverOf(frames[0]));

  return { frames, cover };
}

/** The optimizer's URL for a poster at `POSTER_WIDTH` (the 2x candidate). */
function posterUrl(src: string, size: { width: number; height: number }) {
  const width = Math.min(POSTER_WIDTH, size.width);
  const { props } = getImageProps({
    src,
    alt: '',
    width,
    height: Math.round((width * size.height) / size.width),
  });
  return props.src;
}
