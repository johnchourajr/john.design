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

const ImageThreeShader = dynamic(() =>
  import('@/components/experimental/ImageThreeShader').then(
    (mod) => mod.ImageThreeShader,
  ),
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

      <div className="relative w-screen h-auto ">
        <ImageThreeShader
          src="/film/clouds.jpg"
          shaderConfig={shaderConfig}
          aspectRatio="1680:1050"
        />
        <div className="absolute bg-root z-10 inset-0 mix-blend-darken aspect-[1680/1050] pointer-events-none" />
      </div>
      <SettingsGroup settings={settings} setSettings={setSettings} />
    </>
  );
}
