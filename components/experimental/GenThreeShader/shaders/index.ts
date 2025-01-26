import {
  kaleidoscopeShader,
  kaleidoscopeShaderSettings,
} from './kaleidoscopeShader';
import { pinwheelShader, pinwheelShaderSettings } from './pinwheelShader';
import { spaceTimeShader, spaceTimeShaderSettings } from './spaceTimeShader';
import {
  spiralSphereShader,
  spiralSphereShaderSettings,
} from './spiralSphereShader';
import { wavesShader, wavesShaderSettings } from './wavesShader';

import type { ShaderVariant } from './types';

export const genShaders: Record<ShaderVariant, string> = {
  kaleidoscopeShader,
  spaceTimeShader,
  pinwheelShader,
  wavesShader,
  spiralSphereShader,
};

export const shaderSettings: Record<ShaderVariant, any[]> = {
  kaleidoscopeShader: kaleidoscopeShaderSettings,
  spaceTimeShader: spaceTimeShaderSettings,
  pinwheelShader: pinwheelShaderSettings,
  wavesShader: wavesShaderSettings,
  spiralSphereShader: spiralSphereShaderSettings,
};

export type { ShaderVariant } from './types';
