'use client';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

import { useDrawing } from '@/components/experimental/Drawing';
import {
  genShaders,
  ShaderVariant,
} from '@/components/experimental/GenThreeShader/shaders';
import {
  getSettingValue,
  SettingsGroup,
} from '@/components/experimental/SettingsComponents';
import InlineLink from '@/components/fragments/InlineLink';

const GenThreeShader = dynamic(() =>
  import('@/components/experimental/GenThreeShader').then(
    (mod) => mod.GenThreeShader,
  ),
);

const SHADER_SETTINGS: Record<ShaderVariant, any[]> = {
  kaleidoscopeShader: [
    {
      name: 'Pattern Scale',
      type: 'Slider',
      value: 1.0,
      min: 0.1,
      max: 5.0,
      step: 0.1,
      uniform: 'patternScale',
    },
    {
      name: 'Kaleidoscope Segments',
      type: 'Slider',
      value: 6.0,
      min: 2.0,
      max: 12.0,
      step: 1.0,
      uniform: 'kaleidoSegments',
    },
    {
      name: 'Color Intensity',
      type: 'Slider',
      value: 0.7,
      min: 0.1,
      max: 1.0,
      step: 0.05,
      uniform: 'colorIntensity',
    },
  ],
  spaceTimeShader: [
    {
      name: 'Pattern Scale',
      type: 'Slider',
      value: 1.0,
      min: 0.1,
      max: 5.0,
      step: 0.1,
      uniform: 'patternScale',
    },
    {
      name: 'Motion Speed',
      type: 'Slider',
      value: 1.0,
      min: 0.1,
      max: 2.0,
      step: 0.1,
      uniform: 'motionSpeed',
    },
    {
      name: 'Warp Intensity',
      type: 'Slider',
      value: 0.5,
      min: 0.0,
      max: 1.0,
      step: 0.05,
      uniform: 'warpIntensity',
    },
    {
      name: 'Color Intensity',
      type: 'Slider',
      value: 0.7,
      min: 0.1,
      max: 1.0,
      step: 0.05,
      uniform: 'colorIntensity',
    },
  ],
  pinwheelShader: [
    {
      name: 'Rotation Speed',
      type: 'Slider',
      value: 1.0,
      min: 0.1,
      max: 2.0,
      step: 0.1,
      uniform: 'rotationSpeed',
    },
    {
      name: 'Vortex Strength',
      type: 'Slider',
      value: 5.0,
      min: 1.0,
      max: 10.0,
      step: 0.5,
      uniform: 'vortexStrength',
    },
    {
      name: 'Color Intensity',
      type: 'Slider',
      value: 0.7,
      min: 0.1,
      max: 1.0,
      step: 0.05,
      uniform: 'colorIntensity',
    },
  ],
};

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
    (searchParams.get('shader') as ShaderVariant) || 'kaleidoscopeShader';

  const SETTINGS = [
    {
      name: 'Shader',
      type: 'Select',
      value: undefined,
      options: Object.keys(genShaders),
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
    'kaleidoscopeShader',
  ) as ShaderVariant;

  useEffect(() => {
    const baseSettings = settings.filter((s) => s.name === 'Shader');
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
        <GenThreeShader shaderConfig={shaderConfig} className="aspect-square" />
      </div>

      {!hideSettings && (
        <SettingsGroup settings={settings} setSettings={setSettings} />
      )}
    </Suspense>
  );
}
