import clsx from 'clsx';
import dynamic from 'next/dynamic';

import LinkGridItem from '@/components/fragments/LinkGridItem';
import { getRandomParentAndChildClassesArray } from '@/components/justified-headline/data';
import { PageItem } from '@/types/content-types';

const DynamicJustifiedHeadlineInner = dynamic(() =>
  import('@/components/justified-headline').then(
    (mod) => mod.JustifiedHeadlineInner,
  ),
);

export default function ExpPage({ content: expData }: { content: PageItem[] }) {
  const newItems = expData.filter((item) => item.status === 'NEW');
  const regularItems = expData.filter((item) => item.status !== 'NEW');

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

      {newItems.length > 0 && (
        <section className="my-[10vw] px-4">
          <h2 className="text-string mb-8">Latest</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {newItems.map((item, i) => (
              <LinkGridItem key={`new-${i}`} {...item} />
            ))}
          </div>
        </section>
      )}

      {regularItems.length > 0 && (
        <section className="my-[10vw] px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {regularItems.map((item, i) => (
              <LinkGridItem key={`regular-${i}`} {...item} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
