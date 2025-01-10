import { kaleidoscopeShader } from './kaleidoscopeShader';
import { pinwheelShader } from './pinwheelShader';
import { spaceTimeShader } from './spaceTimeShader';
import { ShaderVariant } from './types';
import { wavesShader } from './wavesShader';

export const genShaders: Record<ShaderVariant, string> = {
  kaleidoscopeShader,
  spaceTimeShader,
  pinwheelShader,
  wavesShader,
};

export type { ShaderVariant } from './types';
