import {
  HeadlineShader,
  JustifiedHeadlineInner,
} from '@/components/justified-headline';
import { getRandomParentAndChildClassesArray } from '@/components/justified-headline/data';
import { type WorkItem, WorkRow } from '@/components/work/WorkRow';
import clsx from 'clsx';
import { Suspense } from 'react';

type WorkSection = { title: string; list: WorkItem[] };

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
      {[moonlight, daylight].map((section) => (
        <section key={section.title} className="my-[10vw]">
          <h2 className="text-string mb-6 px-4">{section.title}</h2>
          {section.list.map((item) => (
            <WorkRow key={item.slug ?? item.title} {...item} />
          ))}
        </section>
      ))}
    </>
  );
}
