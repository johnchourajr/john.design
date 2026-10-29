import {
  HeadlineShader,
  JustifiedHeadlineInner,
} from '@/components/justified-headline';
import { getRandomParentAndChildClassesArray } from '@/components/justified-headline/data';
import { WorkList } from '@/components/work/WorkList';
import type { WorkItem } from '@/components/work/WorkRow';
import clsx from 'clsx';
import { Suspense } from 'react';

export default function WorkPage({ items, oss }: { items: WorkItem[]; oss: WorkItem[] }) {
  return (
    <>
      <h1 className="sr-only">Work</h1>
      <section className="-mt-[8vw] -mb-[12vw] max-w-[100vw] overflow-hidden">
        <HeadlineShader>
          <Suspense fallback={<div className="bg-black aspect-square w-full" />}>
            <JustifiedHeadlineInner
              className={clsx(
                'leading-none w-full font-black pointer-events-none',
              )}
              headline={[
                {
                  text: 'Work',
                  motionObject: getRandomParentAndChildClassesArray(8),
                },
              ]}
              iterations={8}
              letters={true}
            />
          </Suspense>
        </HeadlineShader>
      </section>
      <WorkList items={items} oss={oss} />
    </>
  );
}
