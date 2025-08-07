import { ImageThreeShader } from '@/components/experimental/ImageThreeShader';
import { fragmentThreeShaders } from '@/components/experimental/ImageThreeShader/shaders';
import Image from 'next/image';

interface CoverMediaProps {
  videoCover?: string;
  cover?: string;
  template?: string;
}

export const CoverMedia = ({
  videoCover,
  cover,
  template,
}: CoverMediaProps) => {
  if (template === 'shader') {
    return (
      <div className="relative w-full my-6">
        <div className="absolute bg-root z-10 mix-blend-darken pointer-events-none rounded overflow-clip aspect-[1200/600] inset-0" />
        <ImageThreeShader
          src={cover!}
          shaderConfig={{
            fragmentShader: fragmentThreeShaders['distortion'],
          }}
          aspectRatio="1200:600"
          className="overflow-clip rounded"
        />
      </div>
    );
  }

  if (!videoCover && !cover) return <div className="w-full my-6" />;

  return (
    <div className="w-full my-6">
      {videoCover ? (
        <video
          src={videoCover}
          controls={false}
          muted
          autoPlay
          playsInline
          loop
          className="w-full overflow-hidden rounded border-[0.5px] border-[#ffffff30] select-none pointer-events-none"
        />
      ) : (
        <Image
          src={cover! || ''}
          alt=""
          width={1200}
          height={600}
          sizes="(max-width: 640px) 100vw, 640px"
          className="w-full overflow-hidden rounded border-[0.5px] border-[#ffffff30] select-none pointer-events-none"
          priority
          loading="eager"
        />
      )}
    </div>
  );
};
