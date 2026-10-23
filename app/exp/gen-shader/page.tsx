'use client';
import { Suspense, useRef, useState } from 'react';

import { useDisableDrawing } from '@/components/experimental/Drawing';
import { GenShader } from '@/components/experimental/GenThreeShader/GenShader';
import {
  genShaders,
  shaderSettings as SHADER_SETTINGS,
  ShaderVariant,
} from '@/components/experimental/GenThreeShader/shaders';
import {
  buttonSetting,
  getSettingValue,
  selectSetting,
  SettingsGroup,
  settingsToUniforms,
  type ButtonSetting,
  type SelectSetting,
  type SliderSetting,
} from '@/components/experimental/SettingsComponents';
import { ExpBackLink } from '@/components/experimental/ExpBackLink';
import { useLocationSearch } from '@/hooks/useLocationSearch';

const DEFAULT_SHADER: ShaderVariant = 'pinwheelShader';

type GenSetting =
  | SelectSetting<'shader', ShaderVariant>
  | ButtonSetting<'download'>
  | SliderSetting;

const SHADER_OPTIONS = Object.keys(genShaders) as ShaderVariant[];

const downloadSetting = buttonSetting({
  key: 'download',
  label: 'Download PNG',
});

// Keep the Shader select and Download button, and swap in the uniform
// settings for the chosen shader.
function withShaderSettings(
  settings: readonly GenSetting[],
  shader: ShaderVariant,
): GenSetting[] {
  const baseSettings = settings.filter(
    (s) => s.key === 'shader' || s.key === 'download',
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

  const [settings, setSettings] = useState<GenSetting[]>(() =>
    withShaderSettings(
      [
        selectSetting({
          key: 'shader',
          label: 'Shader',
          value: defaultShader,
          options: SHADER_OPTIONS,
        }),
        downloadSetting,
      ],
      defaultShader,
    ),
  );

  const currentShader = getSettingValue(settings, 'shader', DEFAULT_SHADER);

  const updateSettings = (next: GenSetting[]) => {
    const nextShader = getSettingValue(next, 'shader', DEFAULT_SHADER);
    setSettings(
      nextShader === currentShader
        ? next
        : withShaderSettings(next, nextShader),
    );
  };

  const visibleSettings = settings.map((setting) =>
    setting.kind === 'button' && setting.key === 'download'
      ? { ...setting, onClick: () => downloadRef.current?.() }
      : setting,
  );

  const uniforms = settingsToUniforms(settings);

  return (
    <Suspense fallback={<div />}>
      {!isIframe && (
        <ExpBackLink />
      )}

      <div className="relative w-screen h-auto">
        <GenShader
          variant={currentShader}
          uniforms={uniforms}
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
