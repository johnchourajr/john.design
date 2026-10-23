'use client';

import clsx from 'clsx';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import { blur, distance, duration, ease } from '@/lib/config/motion-tokens';

import type { Poster } from './posters';
import { TypePoster } from './TypePoster';

type GalleryPoster = Pick<Poster, 'slug' | 'title' | 'words' | 'paper' | 'concept'>;

type TypePosterGalleryProps = {
  posters: GalleryPoster[];
};

// A poster opens like a panel and closes on the next step down, so leaving
// is quicker than arriving (the transitions.dev scale).
const opening = { duration: duration.slow, ease: ease.smoothOut };
const closing = { duration: duration.medium, ease: ease.smoothOut };

// The caption's lines rise in one after another through a soft blur once
// the poster has landed, and leave with a fade that barely registers.
const captionLines = {
  hidden: {},
  shown: { transition: { delayChildren: duration.fast, staggerChildren: duration.stagger } },
};
const captionLine = {
  hidden: { opacity: 0, y: distance.medium, filter: `blur(${blur.medium}px)` },
  shown: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: duration.verySlow, ease: ease.inOut },
  },
};

/**
 * Where each poster hangs on the wall, in order: left and top as shares of
 * the wall, and the poster's height as a share of the wall's. A loose
 * salon hang on a Swiss rhythm: big and small, high and low, never on one
 * line. Literals, so Tailwind sees them.
 */
const HANG = [
  'left-[2%] top-[10%] h-[56%]',
  'left-[16%] top-[44%] h-[46%]',
  'left-[27%] top-[6%] h-[40%]',
  'left-[38%] top-[26%] h-[66%]',
  'left-[54%] top-[4%] h-[46%]',
  'left-[66%] top-[30%] h-[58%]',
  'left-[80%] top-[6%] h-[50%]',
  'left-[86%] top-[60%] h-[36%]',
];

/**
 * The wall's left edge, in CSS px, following the pointer across the
 * screen: at the screen's left edge the wall shows its own left end, at the
 * right its right end. It starts in the middle, so the wall runs off both
 * sides, and holds still while `paused`. `panTo` slides it to a poster,
 * for the keyboard.
 */
function useCursorPan(
  view: React.RefObject<HTMLElement | null>,
  wall: React.RefObject<HTMLElement | null>,
  paused: boolean,
) {
  const reducedMotion = useReducedMotion();
  const target = useMotionValue(0);
  const eased = useSpring(target, { stiffness: 60, damping: 20, mass: 0.8 });
  const left = reducedMotion ? target : eased;

  const overflow = () =>
    Math.max(0, (wall.current?.offsetWidth ?? 0) - (view.current?.clientWidth ?? 0));

  // Centred once, on arrival. Not on a pause: an open poster freezes the
  // wall where it is.
  useEffect(() => {
    target.jump(-overflow() / 2);
    eased.jump(-overflow() / 2);
    // Arrival only; the motion values and refs are stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // A cursor steers the wall by where it is across the screen. A finger
  // has no resting position, so it drags the wall instead, one to one.
  const dragged = useRef(false);
  useEffect(() => {
    if (paused) return;
    const clamp = (x: number) => Math.min(0, Math.max(-overflow(), x));
    let touch: { x: number; from: number } | null = null;
    const down = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') return;
      touch = { x: event.clientX, from: target.get() };
      dragged.current = false;
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') {
        const share = Math.min(1, Math.max(0, event.clientX / window.innerWidth));
        target.set(-overflow() * share);
        return;
      }
      if (!touch) return;
      const dx = event.clientX - touch.x;
      if (Math.abs(dx) > 6) dragged.current = true;
      target.set(clamp(touch.from + dx));
    };
    const up = () => {
      touch = null;
    };
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    return () => {
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
    // Only the pause re-arms it; the motion values and refs are stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused]);

  // Brings a point on the wall (CSS px from its left edge) to the middle
  // of the screen, as far as the wall reaches.
  const panTo = (x: number) => {
    const middle = (view.current?.clientWidth ?? 0) / 2;
    target.set(Math.min(0, Math.max(-overflow(), middle - x)));
  };

  return { left, panTo, dragged };
}

/**
 * How loosely each poster hangs: the stiffness of the spring that carries
 * it after the wall. Lower trails further and settles later, so the posters
 * drift apart a little as the wall slides, each on its own delay.
 */
const SWAY = [70, 46, 92, 54, 80, 40, 64, 100];

type WallPosterProps = {
  poster: GalleryPoster;
  index: number;
  /** The wall's left edge, which the poster trails. */
  wallLeft: MotionValue<number>;
  isOpen: boolean;
  isSettling: boolean;
  /** Its shader runs, rather than its snapshot alone. */
  isLive: boolean;
  onOpen: () => void;
  onSettled: () => void;
};

/**
 * One poster in its slot on the wall. It trails the wall on its own spring
 * (offset by how far behind it is) and leans a touch into the slide. The
 * offset sits on the poster's own box, not its slot: a transform on the
 * slot would become the open poster's containing block.
 */
function WallPoster({
  poster,
  index,
  wallLeft,
  isOpen,
  isSettling,
  isLive,
  onOpen,
  onSettled,
}: WallPosterProps) {
  const reducedMotion = useReducedMotion();
  const trailing = useSpring(wallLeft, {
    stiffness: SWAY[index % SWAY.length],
    damping: 16,
    mass: 1,
  });
  const lag = useTransform(() => (reducedMotion ? 0 : trailing.get() - wallLeft.get()));
  const x = useTransform(lag, (value) => (isOpen ? 0 : value * 0.15));
  const rotate = useTransform(lag, (value) =>
    isOpen ? 0 : Math.max(-1.2, Math.min(1.2, value * -0.005)),
  );

  return (
    <div className={clsx('absolute aspect-3/4', HANG[index % HANG.length])}>
      <motion.button
        type="button"
        layout
        transition={reducedMotion ? { duration: 0 } : isOpen ? opening : closing}
        // Motion values: the trail follows the wall frame by frame.
        style={{ x, rotate }}
        onClick={onOpen}
        onLayoutAnimationComplete={() => {
          if (!isOpen) onSettled();
        }}
        aria-label={isOpen ? undefined : `Open poster ${index + 1}, ${poster.title}`}
        aria-expanded={isOpen}
        data-testid={`type-poster-open-${poster.slug}`}
        className={clsx(
          'block text-left',
          isOpen
            ? 'fixed inset-0 m-auto z-70 h-[min(86vh,120vw)] aspect-3/4 cursor-auto'
            : 'absolute inset-0 w-full h-full cursor-zoom-in',
          // Before it opens, a poster answers the pointer: it lifts a
          // little and its edge takes the page's colour.
          !isOpen && 'group',
          !isOpen && isSettling && 'z-70',
        )}
      >
        <TypePoster
          slug={poster.slug}
          title={poster.title}
          words={poster.words}
          paper={poster.paper}
          live={isLive}
          // A hairline edge, so dark posters stand off the black wall.
          className={clsx(
            'h-full ring-1 ring-white/20 transition-[box-shadow,scale] duration-(--duration-fast) ease-(--ease-smooth-out) motion-reduce:transition-none',
            !isOpen &&
              'group-hover:ring-root group-hover:scale-[1.02] group-focus-visible:ring-root group-focus-visible:scale-[1.02]',
          )}
        />
        {/* The caption sits off the open poster's left side, on its bottom edge. */}
        <AnimatePresence>
          {isOpen && (
            <motion.span
              // Counter-scaled while the poster's box animates, so it never
              // stretches with the box.
              layout
              variants={reducedMotion ? undefined : captionLines}
              initial="hidden"
              animate="shown"
              exit={{ opacity: 0, transition: { duration: duration.micro } }}
              className={clsx(
                'absolute flex flex-col gap-1 text-left text-string text-root pointer-events-none',
                // Beside the poster where there's room; under it on a phone.
                'right-full bottom-0 mr-6 w-[22em] max-w-[calc((100vw-100%)/2-2.5rem)]',
                'max-md:right-auto max-md:left-0 max-md:bottom-auto max-md:top-full max-md:mr-0 max-md:mt-4 max-md:w-full max-md:max-w-none',
              )}
            >
              <motion.span variants={reducedMotion ? undefined : captionLine}>
                {String(index + 1).padStart(2, '0')} {poster.title}
              </motion.span>
              <motion.span variants={reducedMotion ? undefined : captionLine}>
                <span className="opacity-60">{poster.concept}</span>
              </motion.span>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}

/**
 * The posters hung on a wall wider than the screen, which slides as the
 * pointer moves across it. A click on one brings it to the middle of the
 * screen, on its own; a click anywhere outside it (or Esc) puts it back.
 * The page itself doesn't scroll.
 *
 * The poster doesn't move to a new element: its own box goes fixed and
 * motion animates the change, so its canvas carries on drawing the whole
 * way, with no remount or blank frame. Its slot on the wall holds the
 * space meanwhile. The wall moves by `left`, not a transform, which would
 * become the open poster's containing block and pin it inside the wall.
 */
export function TypePosterGallery({ posters }: TypePosterGalleryProps) {
  const [open, setOpenSlug] = useState<string | null>(null);
  // Posters that have been opened. The wall shows each poster's snapshot,
  // and its shader only loads once it's opened; it then stays, so closing
  // doesn't jump from the live frame back to the still.
  const [opened, setOpened] = useState<ReadonlySet<string>>(() => new Set());
  const setOpen = (slug: string | null) => {
    setOpenSlug(slug);
    if (slug) setOpened((current) => (current.has(slug) ? current : new Set(current).add(slug)));
  };
  // Kept above the others until it has settled back into its slot.
  const [settling, setSettling] = useState<string | null>(null);
  const active = posters.find((poster) => poster.slug === open);
  const viewRef = useRef<HTMLElement>(null);
  const wallRef = useRef<HTMLDivElement>(null);
  const { left, panTo, dragged } = useCursorPan(viewRef, wallRef, !!open);
  // The poster the arrow keys are on, while none is open.
  const focused = useRef(-1);

  // The page doesn't scroll: the wall is the whole screen.
  useEffect(() => {
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = 'hidden';
    return () => {
      root.style.overflow = overflow;
    };
  }, []);

  // The keyboard: with none open, the arrows step from poster to poster,
  // sliding the wall to each, and Enter opens it (it's a button). With one
  // open, the arrows go straight to the next or previous, and Esc closes.
  useEffect(() => {
    const button = (slug: string) =>
      document.querySelector<HTMLElement>(`[data-testid="type-poster-open-${slug}"]`);
    const keydown = (event: KeyboardEvent) => {
      const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
      if (open && event.key === 'Escape') {
        setOpen(null);
        return;
      }
      if (!step) return;
      event.preventDefault();
      const count = posters.length;
      if (open) {
        const index = posters.findIndex((poster) => poster.slug === open);
        const next = posters[(index + step + count) % count].slug;
        focused.current = (index + step + count) % count;
        setSettling(next);
        setOpen(next);
        return;
      }
      const start = focused.current < 0 ? (step > 0 ? -1 : count) : focused.current;
      focused.current = (start + step + count) % count;
      const target = button(posters[focused.current].slug);
      const wall = wallRef.current;
      if (!target || !wall) return;
      const slot = target.parentElement!.getBoundingClientRect();
      panTo(slot.left - wall.getBoundingClientRect().left + slot.width / 2);
      target.focus({ preventScroll: true });
    };
    window.addEventListener('keydown', keydown);
    return () => window.removeEventListener('keydown', keydown);
    // panTo reads refs and stable motion values.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, posters]);

  const select = (slug: string) => {
    // The end of a drag across the wall isn't a tap on a poster.
    if (open || dragged.current) return;
    setSettling(slug);
    setOpen(slug);
  };

  return (
    <section
      ref={viewRef}
      data-testid="type-poster-wall"
      // Above the back link while a poster is open, so the backdrop covers it.
      // A finger drags the wall, so the browser mustn't take the gesture.
      className={clsx('fixed inset-0 overflow-hidden pt-20 pb-14 touch-none', open && 'z-61')}
    >
      <motion.div
        ref={wallRef}
        // Room at both ends, so the first and last posters hang clear of
        // the screen's edges.
        className="relative h-full w-max px-[18vw]"
        // Motion value, not a static style: the wall follows the pointer.
        style={{ left }}
      >
        <div className="relative h-full w-[300svh]">
        {posters.map((poster, index) => (
          <WallPoster
            key={poster.slug}
            poster={poster}
            index={index}
            wallLeft={left}
            isOpen={poster.slug === open}
            isSettling={poster.slug === settling}
            isLive={opened.has(poster.slug)}
            onOpen={() => select(poster.slug)}
            onSettled={() =>
              setSettling((current) => (current === poster.slug ? null : current))
            }
          />
        ))}
        </div>
      </motion.div>
      {/*
        Inside the wall's section: it is fixed, so it is its own stacking
        context, and the open poster can only rise above a backdrop in it.
      */}
      <AnimatePresence>
        {active && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: duration.fast, ease: ease.smoothOut } }}
            exit={{ opacity: 0, transition: { duration: duration.quick, ease: ease.smoothOut } }}
            onClick={() => setOpen(null)}
            data-testid="type-poster-backdrop"
            className="fixed inset-0 z-65 bg-black/85 cursor-zoom-out"
          />
        )}
      </AnimatePresence>
    </section>
  );
}
