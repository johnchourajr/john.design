'use client';
import { useState } from 'react';

import { ImageThreeShader } from '@/components/experimental/ImageThreeShader';
import { ShaderVariant } from '@/components/experimental/ImageThreeShader/shaders';
import {
  SettingsGroup,
  getSettingValue,
} from '@/components/experimental/SettingsComponents';
import InlineLink from '@/components/fragments/InlineLink';

const SETTINGS: {
  name: string;
  type: string;
  value: string | number;
  options?: ShaderVariant[];
}[] = [
  {
    name: 'Shader',
    type: 'Select',
    value: 'distortion',
    options: [
      'distortion',
      'ripple',
      'fluted',
      'vertical',
      'pixel',
      'zoom',
      'twist',
    ],
  },
];

export default function Page() {
  const [settings, setSettings] = useState(SETTINGS);
  const currentShader = getSettingValue(
    settings,
    'Shader',
    'distortion',
  ) as ShaderVariant;

  return (
    <>
      <InlineLink href="/exp/" className="no-underline">
        <h2 className="m-4">
          &larr; <span className="underline">Back</span>
        </h2>
      </InlineLink>

      <ImageThreeShader
        className="w-screen h-auto"
        src="/film/mission.jpg"
        variant={currentShader}
        aspectRatio="2000:1327"
      />
      <SettingsGroup settings={settings} setSettings={setSettings} />
    </>
  );
}
