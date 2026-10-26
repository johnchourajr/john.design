import {
  HeadlineShader,
  JustifiedHeadlineInner,
} from '@/components/justified-headline';
import { getRandomParentAndChildClassesArray } from '@/components/justified-headline/data';
import { WorkList, type WorkSection } from '@/components/work/WorkList';
import clsx from 'clsx';
import { Suspense } from 'react';

export default function WorkPage({
  moonlight,
  daylight,
}: {
  moonlight: WorkSection;
  daylight: WorkSection;
}) {
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
      <WorkList sections={[moonlight, daylight]} />
    </>
  );
}
