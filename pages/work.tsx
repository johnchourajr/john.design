import LinkGridItem from '@/components/LinkGridItem';
import { Typography } from '@/components/Typography';
import { JustifiedHeadlineInner } from '@/components/justified-headline/JustifiedHeadlineInner';
import { getRandomParentAndChildClassesArray } from '@/components/justified-headline/data';
import clsx from 'clsx';
import { workContent } from '../data/workContent';

export default function WorkPage() {
  const { daylightData, moonlightData } = workContent;

  return (
    <>
      <section className="my-[4vw]">
        <JustifiedHeadlineInner
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
        <JustifiedHeadlineInner
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
        <Typography size="sm">Daylight Work</Typography>
        <div className="grid grid-cols-1 md:grid-cols-3 my-8 gap-8">
          {daylightData.list.map((item, i) => (
            <LinkGridItem key={i} {...item} />
          ))}
        </div>
      </section>
      <section className="my-[10vw] px-4">
        <Typography size="sm">Moonlight Work</Typography>
        <div className="grid grid-cols-1 md:grid-cols-3 my-8 gap-8">
          {moonlightData.list.map((item, i) => (
            <LinkGridItem key={i} {...item} />
          ))}
        </div>
      </section>
    </>
  );
}
