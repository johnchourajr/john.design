'use client';
import { Suspense, useState } from 'react';

import {
  getSettingValue,
  SettingsGroup,
} from '@/components/experimental/SettingsComponents';
import { VideoThreeShader } from '@/components/experimental/VideoThreeShader';
import { fragmentThreeVideoShaders } from '@/components/experimental/VideoThreeShader/shaders';
import InlineLink from '@/components/fragments/InlineLink';
import { useSearchParams } from 'next/navigation';

type ShaderVariant = keyof typeof fragmentThreeVideoShaders;

export default function Page() {
  const searchParams = useSearchParams();
  const isIframe = searchParams.get('iframe') !== null;
  const hideSettings = searchParams.get('hideSettings') !== null;
  const defaultShader = (searchParams.get('shader') as ShaderVariant) || 'vhs';
  const defaultOverlay = searchParams.get('overlay') !== 'false';

  const SETTINGS = [
    {
      name: 'Shader',
      type: 'Select',
      value: undefined,
      options: Object.keys(fragmentThreeVideoShaders),
    },
  ];

  const [settings, setSettings] = useState(
    SETTINGS.map((setting) =>
      setting.name === 'Shader'
        ? { ...setting, value: defaultShader }
        : setting.name === 'Overlay'
        ? { ...setting, value: defaultOverlay }
        : setting,
    ),
  );

  const currentShader = getSettingValue(
    settings,
    'Shader',
    'vhs',
  ) as ShaderVariant;

  const shaderConfig = {
    fragmentShader: fragmentThreeVideoShaders[currentShader],
  };

  return (
    <Suspense fallback={<div />}>
      {!isIframe && (
        <InlineLink href="/exp/" className="no-underline" underline={false}>
          <h2 className="m-4">
            &larr; <span>Back</span>
          </h2>
        </InlineLink>
      )}

      <div className="relative w-screen h-auto">
        <VideoThreeShader
          src="/meme.mp4"
          shaderConfig={shaderConfig}
          aspectRatio="1280:720"
          autoplay
          muted
          loop
        />
      </div>
      {!hideSettings && (
        <SettingsGroup settings={settings} setSettings={setSettings} />
      )}
    </Suspense>
  );
}
