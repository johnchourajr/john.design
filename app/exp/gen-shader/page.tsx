'use client';
import { Suspense, useRef, useState } from 'react';

import { useDisableDrawing } from '@/components/experimental/Drawing';
import { GenThreeShader } from '@/components/experimental/GenThreeShader';
import {
  genShaders,
  shaderSettings as SHADER_SETTINGS,
  ShaderVariant,
} from '@/components/experimental/GenThreeShader/shaders';
import {
  getSettingValue,
  SettingsGroup,
} from '@/components/experimental/SettingsComponents';
import InlineLink from '@/components/fragments/InlineLink';
import { useLocationSearch } from '@/hooks/useLocationSearch';

const DEFAULT_SHADER = 'pinwheelShader';

const BASE_SETTINGS = [
  {
    name: 'Shader',
    type: 'Select',
    value: undefined as ShaderVariant | undefined,
    options: Object.keys(genShaders),
  },
  {
    name: 'Download',
    type: 'Button',
    label: 'Download PNG',
  },
];

// Keep the Shader select and Download button, and swap in the uniform
// settings for the chosen shader.
function withShaderSettings(settings: any[], shader: ShaderVariant) {
  const baseSettings = settings.filter(
    (s) => s.name === 'Shader' || s.name === 'Download',
  );
  return [...baseSettings, ...SHADER_SETTINGS[shader]];
}

function PageContent({ searchParams }: { searchParams: URLSearchParams }) {
  const isIframe = searchParams.get('iframe') !== null;
  useDisableDrawing();

  const hideSettings = searchParams.get('hideSettings') !== null;
  const defaultShader =
    (searchParams.get('shader') as ShaderVariant) || DEFAULT_SHADER;

  const downloadRef = useRef<(() => void) | null>(null);

  const [settings, setSettings] = useState<any[]>(() =>
    withShaderSettings(
      BASE_SETTINGS.map((setting) =>
        setting.name === 'Shader'
          ? { ...setting, value: defaultShader }
          : setting,
      ),
      defaultShader,
    ),
  );

  const currentShader = getSettingValue(
    settings,
    'Shader',
    DEFAULT_SHADER,
  ) as ShaderVariant;

  const updateSettings = (next: any[]) => {
    const nextShader = getSettingValue(
      next,
      'Shader',
      DEFAULT_SHADER,
    ) as ShaderVariant;
    setSettings(
      nextShader === currentShader
        ? next
        : withShaderSettings(next, nextShader),
    );
  };

  const visibleSettings = settings.map((setting) =>
    setting.name === 'Download'
      ? { ...setting, onClick: () => downloadRef.current?.() }
      : setting,
  );

  const shaderConfig = {
    fragmentShader: genShaders[currentShader],
    uniforms: Object.fromEntries(
      settings
        .filter((setting: any) => setting.uniform)
        .map((setting: any) => [setting.uniform, { value: setting.value }]),
    ),
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
        <GenThreeShader
          shaderConfig={shaderConfig}
          className="aspect-square"
          onDownload={(fn) => {
            downloadRef.current = fn;
          }}
        />
        {/* Add this to debug settings */}
        {!hideSettings && (
          <SettingsGroup
            settings={visibleSettings}
            setSettings={updateSettings}
            className="relative z-10"
          />
        )}
      </div>
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
