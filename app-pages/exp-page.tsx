import clsx from 'clsx';

import LinkGridItem from '@/components/fragments/LinkGridItem';
import { JustifiedHeadlineInner } from '@/components/justified-headline';
import { getRandomParentAndChildClassesArray } from '@/components/justified-headline/data';
import { PageItem } from '@/types/content-types';
import { Suspense } from 'react';

export default function ExpPage({ content: expData }: { content: PageItem[] }) {
  const newItems = expData.filter((item) => item.status === 'NEW');
  const regularItems = expData.filter((item) => item.status !== 'NEW');

  return (
    <>
      <section className="my-[4vw] max-w-[100vw] overflow-hidden">
        <Suspense fallback={<div className="bg-black aspect-square w-full" />}>
          <JustifiedHeadlineInner
            className={clsx(
              'leading-[1] w-full font-black pointer-events-none',
            )}
            headline={[
              {
                text: 'Experiments',
                motionObject: getRandomParentAndChildClassesArray(8),
              },
            ]}
            letters={true}
            iterations={8}
          />
        </Suspense>
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
