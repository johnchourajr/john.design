import { kaleidoscopeShader } from './kaleidoscopeShader';
import { pinwheelShader } from './pinwheelShader';
import { spaceTimeShader } from './spaceTimeShader';
import { ShaderVariant } from './types';

export const genShaders: Record<ShaderVariant, string> = {
  kaleidoscopeShader,
  spaceTimeShader,
  pinwheelShader,
};

export type { ShaderVariant } from './types';
