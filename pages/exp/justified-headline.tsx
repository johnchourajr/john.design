import { SettingsGroup } from '@/components/experimental/SettingsComponents';
import InlineLink from '@/components/fragments/InlineLink';
import { DynamicJustifiedHeadlineInner } from '@/components/justified-headline/JustifiedHeadlineInner';
import { getRandomParentAndChildClassesArray } from '@/components/justified-headline/data';
import React from 'react';

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
  const [settings, setSettings] = React.useState(SETTINGS);

  const headlineData = React.useMemo(() => {
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
      <InlineLink href="/exp/" className="no-underline">
        <h2 className="my-8 font-sans">
          &larr; <span className="underline">Back</span>
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
