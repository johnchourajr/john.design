'use client';
import { Suspense, useState } from 'react';

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
import { useSearchParams } from 'next/navigation';

const ImageThreeShader = dynamic(() =>
  import('@/components/experimental/ImageThreeShader').then(
    (mod) => mod.ImageThreeShader,
  ),
);

export default function Page() {
  const searchParams = useSearchParams();
  const isIframe = searchParams.get('iframe') !== null;
  const hideSettings = searchParams.get('hideSettings') !== null;
  const defaultShader =
    (searchParams.get('shader') as ShaderVariant) || 'distortion';
  const defaultOverlay = searchParams.get('overlay') !== 'false';

  const SETTINGS = [
    {
      name: 'Shader',
      type: 'Select',
      value: undefined,
      options: Object.keys(fragmentThreeShaders).filter(
        (key) => key !== 'loupe' && (!isIframe || key === defaultShader),
      ) as ShaderVariant[],
    },
    {
      name: 'Overlay',
      type: 'Boolean',
      value: true,
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
    'distortion',
  ) as ShaderVariant;

  const hasOverlay = getSettingValue(settings, 'Overlay', true);

  const shaderConfig = {
    fragmentShader: fragmentThreeShaders[currentShader],
  };

  return (
    <Suspense fallback={<div />}>
      {!isIframe && (
        <InlineLink href="/exp/" className="no-underline">
          <h2 className="m-4">
            &larr; <span className="underline">Back</span>
          </h2>
        </InlineLink>
      )}

      <div className="relative w-screen h-auto">
        <ImageThreeShader
          src="/film/clouds.jpg"
          shaderConfig={shaderConfig}
          aspectRatio="1680:1050"
        />
        {!!hasOverlay && (
          <div className="absolute bg-root z-10 inset-0 mix-blend-darken aspect-[1680/1050] pointer-events-none" />
        )}
      </div>
      {!hideSettings && (
        <SettingsGroup settings={settings} setSettings={setSettings} />
      )}
    </Suspense>
  );
}
