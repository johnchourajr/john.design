'use client';
import { useState } from 'react';

import {
  fragmentThreeShaders,
  ShaderVariant,
} from '@/components/experimental/ImageThreeShader/shaders';
import {
  getSettingValue,
  SettingsGroup,
} from '@/components/experimental/SettingsComponents';
import InlineLink from '@/components/fragments/InlineLink';
import dynamic from 'next/dynamic';

const ImageThreeShader = dynamic(
  () =>
    import('@/components/experimental/ImageThreeShader').then(
      (mod) => mod.ImageThreeShader,
    ),
  {
    loading: () => <div className="aspect-[2000/1327]" />,
  },
);

const SETTINGS = [
  {
    name: 'Shader',
    type: 'Select',
    value: 'distortion',
    options: Object.keys(fragmentThreeShaders) as ShaderVariant[],
  },
];

export default function Page() {
  const [settings, setSettings] = useState(SETTINGS);
  const currentShader = getSettingValue(
    settings,
    'Shader',
    'distortion',
  ) as ShaderVariant;

  const shaderConfig = {
    fragmentShader: fragmentThreeShaders[currentShader],
  };

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
        shaderConfig={shaderConfig}
        aspectRatio="2000:1327"
      />
      <SettingsGroup settings={settings} setSettings={setSettings} />
    </>
  );
}
