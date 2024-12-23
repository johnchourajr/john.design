import LinkGridItem from '@/components/fragments/LinkGridItem';
import { getRandomParentAndChildClassesArray } from '@/components/justified-headline/data';
import { expData } from '@/data/expContent';
import clsx from 'clsx';
import dynamic from 'next/dynamic';

const DynamicJustifiedHeadlineInner = dynamic(() =>
  import('@/components/justified-headline').then(
    (mod) => mod.JustifiedHeadlineInner,
  ),
);

export default function ExpPage() {
  return (
    <>
      <section className="my-[4vw] max-w-[100vw] overflow-hidden">
        <DynamicJustifiedHeadlineInner
          className={clsx('leading-[1] w-full font-black pointer-events-none')}
          headline={[
            {
              text: 'Experiments',
              motionObject: getRandomParentAndChildClassesArray(8),
            },
          ]}
          letters={true}
          iterations={8}
        />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 my-[10vw] px-4">
        {expData.map((item, i) => (
          <LinkGridItem key={i} {...item} />
        ))}
      </section>
    </>
  );
}
