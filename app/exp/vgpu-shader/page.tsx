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
import { ExpBackLink } from '@/components/experimental/ExpBackLink';

const RENDERER_LABEL: Record<Renderer, string> = {
  pending: 'Starting renderer…',
  webgpu: 'WebGPU (vgpu)',
  webgl: 'WebGL fallback (three.js)',
};

// Proof of concept: the gen-shader pinwheel ported to WGSL and rendered with
// vgpu. Not linked from /exp; the original experiments are unchanged.
export default function Page() {
  useDisableDrawing();

  const [settings, setSettings] = useState(pinwheelShaderSettings);
  const [renderer, setRenderer] = useState<Renderer>('pending');

  const rotationSpeed = getSettingValue(settings, 'rotationSpeed', 1.0);
  const vortexStrength = getSettingValue(settings, 'vortexStrength', 5.0);
  const colorIntensity = getSettingValue(settings, 'colorIntensity', 0.7);

  const params = useMemo(
    () => ({ rotationSpeed, vortexStrength, colorIntensity }),
    [rotationSpeed, vortexStrength, colorIntensity],
  );

  return (
    <>
      <ExpBackLink />

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
