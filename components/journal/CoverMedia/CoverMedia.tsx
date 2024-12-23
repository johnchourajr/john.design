import Image from 'next/image';

interface CoverMediaProps {
  videoCover?: string;
  cover?: string;
}

export const CoverMedia = ({ videoCover, cover }: CoverMediaProps) => {
  if (!videoCover && !cover) return null;

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
          src={cover!}
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
