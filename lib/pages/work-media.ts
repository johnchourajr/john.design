import { hostedMediaPaths, mediaUrl } from '@/lib/media/hosted';
import { getMediaSize, getVideoSources, isVideoSrc } from '@/lib/pages/journal-media';
import type { VideoSource } from '@/lib/pages/journal-media';

/**
 * Build-time listing of each project's frames for the work page's strips
 * (#128). A project's media is every file under `/work-images/<slug>/` in the
 * media manifest (hosted on R2, see lib/media/hosted.ts), named
 * `<slug>-<kind>-<n>` by the capture scripts or by hand; a WebM beside an MP4
 * of the same name is that video's smaller source, not a frame.
 */

export type WorkFrame = {
  src: string;
  width: number;
  height: number;
  /** What the frame shows, from its name: `scroll`, `desktop`, `brand`… */
  group: string;
} & ({ kind: 'image' } | { kind: 'video'; sources: VideoSource[] });

export type WorkMedia = {
  frames: WorkFrame[];
  /** The still shown beside the cursor while a closed row is hovered. */
  cover: WorkFrame | null;
};

const FRAME_PATTERN = /\.(jpe?g|png|webp|gif|mp4|webm|mov)$/i;

// The site comes first (its recording, then its pages), then the brand work
// and photography around it.
const GROUP_ORDER = [
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

// A scroll recording already shows the site's pages, so its desktop
// screenshots would repeat it.
const COVERED_BY_SCROLL = ['desktop', 'slice'];

// The cover is the first still that shows the work rather than a page of the
// site, when there is one.
const COVER_ORDER = ['brand', 'bag', 'photo', 'art', 'gfb', 'archive', 'desktop', 'mobile', 'slice'];

const groupOf = (slug: string, file: string) => file.slice(slug.length + 1).split('-')[0];

function rank(order: string[], group: string): number {
  const index = order.indexOf(group);
  return index === -1 ? order.length : index;
}

export function getWorkMedia(slug: string): WorkMedia {
  const prefix = `/work-images/${slug}/`;
  // Files directly in the project's folder; anything nested is set aside.
  const files = hostedMediaPaths(prefix)
    .map((path) => path.slice(prefix.length))
    .filter((file) => !file.includes('/'));

  const names = new Set(files);
  const hasScroll = files.some((file) => groupOf(slug, file) === 'scroll');
  const frames = files
    .filter((file) => FRAME_PATTERN.test(file))
    .filter((file) => !(/\.webm$/i.test(file) && names.has(file.replace(/\.webm$/i, '.mp4'))))
    .filter((file) => !(hasScroll && COVERED_BY_SCROLL.includes(groupOf(slug, file))))
    .sort(
      (a, b) =>
        rank(GROUP_ORDER, groupOf(slug, a)) - rank(GROUP_ORDER, groupOf(slug, b)) ||
        a.localeCompare(b, 'en', { numeric: true }),
    )
    .flatMap((file): WorkFrame[] => {
      const path = `${prefix}${file}`;
      const size = getMediaSize(path);
      if (!size) return [];
      const group = groupOf(slug, file);
      const src = mediaUrl(path);
      return isVideoSrc(path)
        ? [{ kind: 'video', src, group, ...size, sources: getVideoSources(path) }]
        : [{ kind: 'image', src, group, ...size }];
    });

  const stills = frames.filter((frame) => frame.kind === 'image');
  const cover =
    [...stills].sort((a, b) => rank(COVER_ORDER, a.group) - rank(COVER_ORDER, b.group))[0] ??
    null;

  return { frames, cover };
}
