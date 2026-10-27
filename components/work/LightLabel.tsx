import type { WorkLight } from '@/types/content-types';

// Pixel art on a 9×9 grid, in the spirit of the site's cursors: `#` is a
// filled pixel.
const ICONS: Record<WorkLight, string[]> = {
  moonlight: [
    '...####..',
    '.####....',
    '.###.....',
    '###......',
    '###......',
    '###......',
    '.###.....',
    '.####....',
    '...####..',
  ],
  daylight: [
    '....#....',
    '.#.....#.',
    '...###...',
    '..#####..',
    '#.#####.#',
    '..#####..',
    '...###...',
    '.#.....#.',
    '....#....',
  ],
};

const LABELS: Record<WorkLight, string> = {
  moonlight: 'Moonlight',
  daylight: 'Daylight',
};

function PixelIcon({ rows }: { rows: string[] }) {
  return (
    <svg
      viewBox={`0 0 ${rows[0].length} ${rows.length}`}
      // One CSS pixel per grid square keeps the pixels crisp.
      className="size-[9px] shrink-0"
      shapeRendering="crispEdges"
      aria-hidden
    >
      {rows.flatMap((row, y) =>
        [...row].map((pixel, x) =>
          pixel === '#' ? (
            <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="currentColor" />
          ) : null,
        ),
      )}
    </svg>
  );
}

/**
 * Whether a project was day-job work or made on my own time (#128): a moon
 * or a sun beside the word.
 */
export function LightLabel({ light }: { light: WorkLight }) {
  return (
    <span className="text-caption inline-flex items-center gap-1 opacity-60">
      <PixelIcon rows={ICONS[light]} />
      {LABELS[light]}
    </span>
  );
}
