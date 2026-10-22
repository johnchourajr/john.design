'use client';
import { useMemo, useState } from 'react';

import { useDisableDrawing } from '@/components/experimental/Drawing';
import { pinwheelShaderSettings } from '@/components/experimental/GenThreeShader/shaders/pinwheelShader';
import {
  getSettingValue,
  SettingsGroup,
} from '@/components/experimental/SettingsComponents';
import {
  type Renderer,
  VgpuPinwheel,
} from '@/components/experimental/VgpuShader/VgpuPinwheel';
import InlineLink from '@/components/fragments/InlineLink';

const RENDERER_LABEL: Record<Renderer, string> = {
  pending: 'Starting renderer…',
  webgpu: 'WebGPU (vgpu)',
  webgl: 'WebGL fallback (three.js)',
};

// Proof of concept: the gen-shader pinwheel ported to WGSL and rendered with
// vgpu. Not linked from /exp; the original experiments are unchanged.
export default function Page() {
  useDisableDrawing();

  const [settings, setSettings] = useState<any[]>(pinwheelShaderSettings);
  const [renderer, setRenderer] = useState<Renderer>('pending');

  const rotationSpeed = getSettingValue(settings, 'Rotation Speed', 1.0);
  const vortexStrength = getSettingValue(settings, 'Vortex Strength', 5.0);
  const colorIntensity = getSettingValue(settings, 'Color Intensity', 0.7);

  const params = useMemo(
    () => ({ rotationSpeed, vortexStrength, colorIntensity }),
    [rotationSpeed, vortexStrength, colorIntensity],
  );

  return (
    <>
      <InlineLink
        href="/exp/"
        className="no-underline [[data-iframe]_&]:hidden"
        underline={false}
      >
        <h2 className="m-4">
          &larr; <span>Back</span>
        </h2>
      </InlineLink>

      <p className="mx-4 mb-4 text-sm opacity-60">{RENDERER_LABEL[renderer]}</p>

      <div className="relative w-screen h-auto">
        <VgpuPinwheel
          params={params}
          className="aspect-square"
          onRenderer={setRenderer}
        />
        <SettingsGroup settings={settings} setSettings={setSettings} />
      </div>
    </>
  );
}
