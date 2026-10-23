import { ImageShader } from '@/components/experimental/ImageThreeShader/ImageShader';
import { LoopingVideo } from '@/components/journal/LoopingVideo';
import { getMediaSize, getVideoSources } from '@/lib/pages/journal-media';
import Image from 'next/image';

interface CoverMediaProps {
  videoCover?: string;
  cover?: string;
  template?: string;
}

function isSvg(src: string | undefined): boolean {
  if (!src) return false;
  return src.toLowerCase().includes('.svg');
}

export const CoverMedia = ({
  videoCover,
  cover,
  template,
}: CoverMediaProps) => {
  if (template === 'shader') {
    return (
      <div className="relative w-full my-6">
        <div className="absolute bg-root z-10 mix-blend-darken pointer-events-none rounded overflow-clip aspect-1200/600 inset-0" />
        <ImageShader
          src={cover!}
          variant="distortion"
          aspectRatio="1200:600"
          className="overflow-clip rounded"
        />
      </div>
    );
  }

  if (!videoCover && !cover) return <div className="w-full my-6" />;

  const videoSize = videoCover ? getMediaSize(videoCover) : null;
  const coverSize = (cover && getMediaSize(cover)) || {
    width: 1200,
    height: 600,
  };

  return (
    <div className="w-full my-6">
      {videoCover ? (
        <LoopingVideo
          sources={getVideoSources(videoCover)}
          width={videoSize?.width}
          height={videoSize?.height}
          lazy={false}
          className="w-full overflow-hidden rounded border-[0.5px] border-[#ffffff30] select-none pointer-events-none"
        />
      ) : isSvg(cover) ? (
        // SVGs are already resolution independent; serve the file as-is.
        <Image
          src={cover!}
          alt=""
          width={1200}
          height={600}
          unoptimized
          className="w-full overflow-hidden rounded border-[0.5px] border-[#ffffff30] select-none pointer-events-none"
        />
      ) : (
        <Image
          src={cover! || ''}
          alt=""
          width={coverSize.width}
          height={coverSize.height}
          // The cover spans the full article width.
          sizes="100vw"
          className="w-full overflow-hidden rounded border-[0.5px] border-[#ffffff30] select-none pointer-events-none"
          priority
          loading="eager"
        />
      )}
    </div>
  );
};
