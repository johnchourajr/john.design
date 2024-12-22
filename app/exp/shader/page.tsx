'use client';

import { FunShaderV1 } from '@/components/experimental/FunShader';
import {
  SettingsGroup,
  getSettingValue,
} from '@/components/experimental/SettingsComponents';
import InlineLink from '@/components/fragments/InlineLink';
import { ShaderVariant } from '@/types/shaders';
import { useState } from 'react';

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
        <h2 className="my-8">
          &larr; <span className="underline">Back</span>
        </h2>
      </InlineLink>
      <FunShaderV1
        className="w-screen h-[65vw]"
        src="/film/mission.jpg"
        variant={currentShader}
      />
      <SettingsGroup settings={settings} setSettings={setSettings} />
    </>
  );
}
