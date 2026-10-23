'use client';
import { Suspense, useState } from 'react';

import {
  getSettingValue,
  selectSetting,
  SettingsGroup,
} from '@/components/experimental/SettingsComponents';
import { VideoThreeShader } from '@/components/experimental/VideoThreeShader';
import { fragmentThreeVideoShaders } from '@/components/experimental/VideoThreeShader/shaders';
import { ExpBackLink } from '@/components/experimental/ExpBackLink';
import { useLocationSearch } from '@/hooks/useLocationSearch';

type ShaderVariant = keyof typeof fragmentThreeVideoShaders;

function PageContent({ searchParams }: { searchParams: URLSearchParams }) {
  const isIframe = searchParams.get('iframe') !== null;
  const hideSettings = searchParams.get('hideSettings') !== null;
  const defaultShader = (searchParams.get('shader') as ShaderVariant) || 'vhs';

  const [settings, setSettings] = useState(() => [
    selectSetting({
      key: 'shader',
      label: 'Shader',
      value: defaultShader,
      options: Object.keys(fragmentThreeVideoShaders) as ShaderVariant[],
    }),
  ]);

  const currentShader = getSettingValue(settings, 'shader', 'vhs');

  const shaderConfig = {
    fragmentShader: fragmentThreeVideoShaders[currentShader],
  };

  return (
    <Suspense fallback={<div />}>
      {!isIframe && (
        <ExpBackLink />
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

// Query params are read after hydration so the page stays statically rendered.
// Keying on them remounts with the right initial state once they're known.
export default function Page() {
  const search = useLocationSearch();

  return (
    <PageContent key={search} searchParams={new URLSearchParams(search)} />
  );
}
