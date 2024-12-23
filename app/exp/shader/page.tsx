'use client';
import { useState } from 'react';

import { ImageShader } from '@/components/experimental/ImageShader';
import {
  SettingsGroup,
  getSettingValue,
} from '@/components/experimental/SettingsComponents';
import InlineLink from '@/components/fragments/InlineLink';
import { ShaderVariant } from '@/types/shaders';

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
    options: ['distortion', 'ripple', 'fluted', 'vertical'],
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
      <ImageShader
        className="w-screen h-[65vw]"
        src="/film/mission.jpg"
        variant={currentShader}
      />
      <SettingsGroup settings={settings} setSettings={setSettings} />
    </>
  );
}
