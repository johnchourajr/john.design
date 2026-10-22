'use client';

import { useEffect, useRef } from 'react';

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
};

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
}: LoopingVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    // React sets `muted` as a property only after hydration; autoplay needs it.
    video.muted = true;

    const play = () => {
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

  return (
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
    >
      {sources.map((source) => (
        <source key={source.src} src={source.src} type={source.type} />
      ))}
    </video>
  );
}
