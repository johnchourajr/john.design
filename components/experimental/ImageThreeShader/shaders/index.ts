import { distortionThreeShader } from './distortionThree';
import { flutedShader } from './flutedThree';
import { loupeShader } from './loupeThree';
import { pixelShader } from './pixelThree';
import { rippleShader } from './rippleThree';
import { ShaderVariant } from './types';
import { verticalShader } from './verticalThree';

export const fragmentThreeShaders: Record<ShaderVariant, string> = {
  distortion: distortionThreeShader,
  ripple: rippleShader,
  fluted: flutedShader,
  vertical: verticalShader,
  pixel: pixelShader,
  loupe: loupeShader,
};

export type { AspectRatio, ShaderVariant } from './types';
