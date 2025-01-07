'use client';
import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';

import { SettingsGroup } from '@/components/experimental/SettingsComponents';
import { getRandomParentAndChildClassesArray } from '@/components/justified-headline/data';

const DynamicJustifiedHeadlineInner = dynamic(() =>
  import('@/components/justified-headline').then(
    (mod) => mod.JustifiedHeadlineInner,
  ),
);

const InlineLink = dynamic(() => import('@/components/fragments/InlineLink'), {
  ssr: false,
});

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
      <DynamicJustifiedHeadlineInner
        settings={settings}
        headline={headlineData}
        iterations={8}
      />
      <SettingsGroup settings={settings} setSettings={setSettings} />
    </>
  );
}
