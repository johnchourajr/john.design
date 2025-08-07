'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';

import { useDrawing } from '@/components/experimental/Drawing';
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

const DEFAULT_SHADER = 'pinwheelShader';

export default function Page() {
  const searchParams = useSearchParams();
  const isIframe = searchParams.get('iframe') !== null;
  const { setEnableDrawing } = useDrawing();

  useEffect(() => {
    setEnableDrawing(false);

    return () => {
      setEnableDrawing(true);
    };
  }, [setEnableDrawing]);

  const hideSettings = searchParams.get('hideSettings') !== null;
  const defaultShader =
    (searchParams.get('shader') as ShaderVariant) || DEFAULT_SHADER;

  const downloadRef = useRef<(() => void) | null>(null);

  const SETTINGS = [
    {
      name: 'Shader',
      type: 'Select',
      value: undefined,
      options: Object.keys(genShaders),
    },
    {
      name: 'Download',
      type: 'Button',
      onClick: () => downloadRef.current?.(),
      label: 'Download PNG',
    },
  ];

  const [settings, setSettings] = useState(() => {
    const baseSettings = SETTINGS.map((setting) =>
      setting.name === 'Shader'
        ? { ...setting, value: defaultShader }
        : setting,
    );

    return [
      ...baseSettings,
      ...SHADER_SETTINGS[defaultShader as ShaderVariant],
    ];
  });

  const currentShader = getSettingValue(
    settings,
    'Shader',
    DEFAULT_SHADER,
  ) as ShaderVariant;

  useEffect(() => {
    const baseSettings = settings.filter(
      (s) => s.name === 'Shader' || s.name === 'Download',
    );
    setSettings([...baseSettings, ...SHADER_SETTINGS[currentShader]]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentShader]);

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
            settings={settings}
            setSettings={setSettings}
            className="relative z-10"
          />
        )}
      </div>
    </Suspense>
  );
}
