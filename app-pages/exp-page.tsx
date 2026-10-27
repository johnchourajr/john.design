import clsx from 'clsx';

import { type ExpItem, ExpList } from '@/components/exp/ExpList';
import {
  HeadlineShader,
  JustifiedHeadlineInner,
} from '@/components/justified-headline';
import { getRandomParentAndChildClassesArray } from '@/components/justified-headline/data';
import { Suspense } from 'react';

export default function ExpPage({ content: expData }: { content: ExpItem[] }) {
  const newItems = expData.filter((item) => item.status === 'NEW');
  const regularItems = expData.filter((item) => item.status !== 'NEW');

  return (
    <>
      <h1 className="sr-only">Experiments</h1>
      <section className="-mt-[8vw] -mb-[12vw] max-w-[100vw] overflow-hidden">
        <HeadlineShader>
          <Suspense fallback={<div className="bg-black aspect-square w-full" />}>
            <JustifiedHeadlineInner
              className={clsx(
                'leading-none w-full font-black pointer-events-none',
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
        </HeadlineShader>
      </section>

      <ExpList
        sections={[
          { title: 'Latest', list: newItems },
          { list: regularItems },
        ].filter((section) => section.list.length > 0)}
      />
    </>
  );
}
