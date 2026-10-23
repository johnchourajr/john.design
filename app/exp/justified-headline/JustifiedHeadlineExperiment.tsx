'use client';
import { Suspense, useState } from 'react';

import {
  booleanSetting,
  SettingsGroup,
  sliderSetting,
} from '@/components/experimental/SettingsComponents';
import { ExpBackLink } from '@/components/experimental/ExpBackLink';
import {
  JustifiedHeadlineInner,
  type HeadlineSetting,
} from '@/components/justified-headline';
import type { TextStructure } from '@/types/content-types';

const SETTINGS: HeadlineSetting[] = [
  booleanSetting({ key: 'slant', label: 'Add Slant', value: false }),
  booleanSetting({ key: 'letters', label: 'Letters', value: false }),
  sliderSetting({
    key: 'speed',
    label: 'Speed',
    value: 1000,
    min: 500,
    max: 3000,
  }),
];

type JustifiedHeadlineExperimentProps = {
  headlineData: TextStructure[];
};

export function JustifiedHeadlineExperiment({
  headlineData,
}: JustifiedHeadlineExperimentProps) {
  const [settings, setSettings] = useState(SETTINGS);

  return (
    <>
      <ExpBackLink />
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
