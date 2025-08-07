'use client';
import { Suspense, useMemo, useState } from 'react';

import { SettingsGroup } from '@/components/experimental/SettingsComponents';
import InlineLink from '@/components/fragments/InlineLink';
import { JustifiedHeadlineInner } from '@/components/justified-headline';
import { getRandomParentAndChildClassesArray } from '@/components/justified-headline/data';

const SETTINGS = [
  {
    name: 'Add Slant',
    type: 'Boolean',
    value: false,
  },
  {
    name: 'Letters',
    type: 'Boolean',
    value: false,
  },
  {
    name: 'Speed',
    type: 'Slider',
    value: 1000,
    min: 500,
    max: 3000,
  },
];

export default function JustifiedHeadline() {
  const [settings, setSettings] = useState(SETTINGS);

  const headlineData = useMemo(() => {
    return [
      {
        text: 'John Is',
        motionObject: getRandomParentAndChildClassesArray(8),
        className:
          'z-[100] relative !text-[1rem] lg:!text-[1vw] !tracking-wider uppercase',
      },
      {
        text: 'Working On',
        motionObject: getRandomParentAndChildClassesArray(8),
      },
      {
        text: 'The *Internet*',
        motionObject: getRandomParentAndChildClassesArray(8),
      },
    ];
  }, []);

  return (
    <>
      <InlineLink href="/exp/" className="no-underline" underline={false}>
        <h2 className="m-4 font-sans">
          &larr; <span>Back</span>
        </h2>
      </InlineLink>
      <Suspense fallback={<div className="bg-black aspect-square w-full" />}>
        <JustifiedHeadlineInner
          settings={settings}
          headline={headlineData}
          iterations={8}
        />
      </Suspense>
      <SettingsGroup settings={settings} setSettings={setSettings} />
    </>
  );
}
