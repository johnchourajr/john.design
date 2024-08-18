'use client';

import { DynamicJustifiedHeadlineInner } from '@/components/justified-headline/JustifiedHeadlineInner';
import { getRandomParentAndChildClassesArray } from '@/components/justified-headline/data';
import { colophonData } from '@/data/colophonContent';
import clsx from 'clsx';

export default function ColophonPage({
  title,
  description,
  summary,
  dependencies,
  devDependencies,
  fontsCss,
}: typeof colophonData) {
  return (
    <>
      <section className="my-[4vw] max-w-[100vw] overflow-hidden">
        <DynamicJustifiedHeadlineInner
          className={clsx('leading-[1] w-full font-black pointer-events-none')}
          headline={[
            {
              text: title,
              motionObject: getRandomParentAndChildClassesArray(8),
            },
          ]}
          iterations={8}
          letters={true}
        />
      </section>
      <section className="mt-[8vw] px-4">
        <h2 className="text-string">{description}</h2>
      </section>
      <section className="grid grid-cols-1 px-4 md:grid-cols-3 font-mono">
        {summary && (
          <div className="my-[4vw]">
            <h2 className="mb-6">{'//'} summary</h2>
            <p className="w-[80%] max-w-[24em]">{summary}</p>
          </div>
        )}
        {dependencies && (
          <div>
            <div className="mt-[4vw] ">
              <h2 className="mb-6">{'//'} package.json</h2>
              <h3>dependencies: {'{'}</h3>
              <ul className="flex flex-col pl-4 whitespace-pre overflow-scroll">
                {Object.keys(dependencies).map((item, i) => (
                  <li
                    key={i}
                    className="no-underline group-hover:underline underline-offset-4 decoration-2"
                  >
                    {item}: {dependencies[item]}
                  </li>
                ))}
              </ul>
              <p>{'}'}</p>
            </div>
            <div className="mt-6 font-mono">
              <h3>devDependencies: {'{'}</h3>
              <ul className="flex flex-col pl-4 whitespace-pre overflow-scroll">
                {Object.keys(devDependencies).map((item, i) => (
                  <li
                    key={i}
                    className="no-underline group-hover:underline underline-offset-4 decoration-2"
                  >
                    {item}: {devDependencies[item]}
                  </li>
                ))}
              </ul>
              <p>{'}'}</p>
            </div>
          </div>
        )}
        {fontsCss && (
          <div className="my-[4vw] font-mono">
            <h2>
              {'/*'} fonts.css {'*/'}
            </h2>
            <pre className="overflow-scroll">{fontsCss}</pre>
          </div>
        )}
      </section>
    </>
  );
}
