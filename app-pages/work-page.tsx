'use client';

import LinkGridItem from '@/components/fragments/LinkGridItem';
import { DynamicJustifiedHeadlineInner } from '@/components/justified-headline';
import { getRandomParentAndChildClassesArray } from '@/components/justified-headline/data';
import { workContent } from '@/data/workContent';
import clsx from 'clsx';

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
        <DynamicJustifiedHeadlineInner
          className={clsx('leading-[1] w-full font-black pointer-events-none')}
          headline={[
            {
              text: 'Coming Soon',
              motionObject: getRandomParentAndChildClassesArray(8),
              className:
                '!text-[1rem] lg:!text-[1vw] !tracking-wider uppercase',
            },
          ]}
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
