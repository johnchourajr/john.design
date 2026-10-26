'use client';

import { useEffect, useRef, useState } from 'react';

import type { VideoSource } from '@/lib/pages/journal-media';

export type LoopingVideoProps = {
  sources: VideoSource[];
  width?: number;
  height?: number;
  className?: string;
  /** Layout hint from the markdown alt text (`xs`, `sm`, `lg`, `aside`). */
  size?: string;
  /**
   * Off-screen videos download nothing until they come near the viewport,
   * then play while visible. Turn off for above-the-fold media (the cover).
   */
  lazy?: boolean;
  /**
   * A play/pause button in the lower right corner, positioned against the
   * nearest positioned ancestor (the work page's frames, #128).
   */
  controls?: boolean;
  /** Stable hook for tests on the play/pause button. */
  testId?: string;
};

function PlayIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-3" aria-hidden>
      <path d="M4 2.5v11l9-5.5z" fill="currentColor" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-3" aria-hidden>
      <path d="M3.5 2.5h3v11h-3zM9.5 2.5h3v11h-3z" fill="currentColor" />
    </svg>
  );
}

/**
 * A muted, looping, inline video that stands in for an animated GIF. See #87.
 */
export function LoopingVideo({
  sources,
  width,
  height,
  className,
  size,
  lazy = true,
  controls = false,
  testId,
}: LoopingVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  // Paused with the button: stays paused when it scrolls back into view.
  const heldPaused = useRef(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    // React sets `muted` as a property only after hydration; autoplay needs it.
    video.muted = true;

    const play = () => {
      if (heldPaused.current) return;
      video.play().catch(() => {});
    };

    if (!lazy) {
      play();
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      video.preload = 'auto';
      play();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.preload = 'auto';
          play();
        } else if (!video.paused) {
          video.pause();
        }
      },
      { rootMargin: '400px 0px' },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [lazy]);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) {
      heldPaused.current = false;
      video.play().catch(() => {});
    } else {
      heldPaused.current = true;
      video.pause();
    }
  };

  const video = (
    <video
      ref={ref}
      className={className}
      data-size={size}
      width={width}
      height={height}
      style={width && height ? { aspectRatio: `${width} / ${height}` } : undefined}
      muted
      loop
      playsInline
      autoPlay={!lazy}
      preload={lazy ? 'none' : 'auto'}
      controls={false}
      disablePictureInPicture
      onPlay={() => setPlaying(true)}
      onPause={() => setPlaying(false)}
    >
      {sources.map((source) => (
        <source key={source.src} src={source.src} type={source.type} />
      ))}
    </video>
  );

  if (!controls) return video;

  return (
    <>
      {video}
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? 'Pause video' : 'Play video'}
        className="absolute right-2 bottom-2 flex size-7 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors duration-(--duration-fast) hover:bg-black/80 motion-reduce:transition-none"
        data-testid={testId}
      >
        {playing ? <PauseIcon /> : <PlayIcon />}
      </button>
    </>
  );
}
