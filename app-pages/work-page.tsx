import LinkGridItem from '@/components/fragments/LinkGridItem';
import { getRandomParentAndChildClassesArray } from '@/components/justified-headline/data';
import { workContent } from '@/data/workContent';
import clsx from 'clsx';
import dynamic from 'next/dynamic';

const DynamicJustifiedHeadlineInner = dynamic(
  () =>
    import('@/components/justified-headline').then(
      (mod) => mod.JustifiedHeadlineInner,
    ),
  { ssr: true },
);

export default function WorkPage({
  daylightData,
  moonlightData,
}: {
  daylightData: typeof workContent.daylightData;
  moonlightData: typeof workContent.moonlightData;
}) {
  return (
    <>
      <section className="my-[4vw] max-w-[100vw] overflow-hidden">
        <DynamicJustifiedHeadlineInner
          className={clsx('leading-[1] w-full font-black pointer-events-none')}
          headline={[
            {
              text: 'Work',
              motionObject: getRandomParentAndChildClassesArray(8),
            },
          ]}
          iterations={8}
          letters={true}
        />
      </section>
      <section className="my-[10vw] px-4">
        <h2 className="text-string">Moonlight Work</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 my-8 gap-8">
          {moonlightData.list.map((item, i) => (
            <LinkGridItem key={i} {...item} />
          ))}
        </div>
      </section>
      <section className="my-[10vw] px-4">
        <h2 className="text-string">Daylight Work</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 my-8 gap-8">
          {daylightData.list.map((item, i) => (
            <LinkGridItem key={i} {...item} />
          ))}
        </div>
      </section>
    </>
  );
}
