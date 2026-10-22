'use client';
import { Suspense, useState } from 'react';

import { ImageThreeShader } from '@/components/experimental/ImageThreeShader';
import {
  fragmentThreeShaders,
  ShaderVariant,
} from '@/components/experimental/ImageThreeShader/shaders';
import {
  booleanSetting,
  getSettingValue,
  selectSetting,
  SettingsGroup,
} from '@/components/experimental/SettingsComponents';
import InlineLink from '@/components/fragments/InlineLink';
import { useLocationSearch } from '@/hooks/useLocationSearch';

function PageContent({ searchParams }: { searchParams: URLSearchParams }) {
  const isIframe = searchParams.get('iframe') !== null;
  const hideSettings = searchParams.get('hideSettings') !== null;
  const defaultShader =
    (searchParams.get('shader') as ShaderVariant) || 'distortion';
  const defaultOverlay = searchParams.get('overlay') !== 'false';

  const [settings, setSettings] = useState(() => [
    selectSetting({
      key: 'shader',
      label: 'Shader',
      value: defaultShader,
      options: Object.keys(fragmentThreeShaders) as ShaderVariant[],
    }),
    booleanSetting({ key: 'overlay', label: 'Overlay', value: defaultOverlay }),
  ]);

  const currentShader = getSettingValue(settings, 'shader', 'distortion');

  const hasOverlay = getSettingValue(settings, 'overlay', true);

  const shaderConfig = {
    fragmentShader: fragmentThreeShaders[currentShader],
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

// Query params are read after hydration so the page stays statically rendered.
// Keying on them remounts with the right initial state once they're known.
export default function Page() {
  const search = useLocationSearch();

  return (
    <PageContent key={search} searchParams={new URLSearchParams(search)} />
  );
}
