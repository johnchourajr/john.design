'use client';
import { Suspense, useState } from 'react';

import { SettingsGroup } from '@/components/experimental/SettingsComponents';
import InlineLink from '@/components/fragments/InlineLink';
import { JustifiedHeadlineInner } from '@/components/justified-headline';

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

type JustifiedHeadlineExperimentProps = {
  headlineData: {
    text: string;
    motionObject: { parent: string; child: string }[];
    className?: string;
  }[];
};

export function JustifiedHeadlineExperiment({
  headlineData,
}: JustifiedHeadlineExperimentProps) {
  const [settings, setSettings] = useState(SETTINGS);


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
