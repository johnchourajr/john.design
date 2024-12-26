import { distortionThreeShader } from './distortionThree';
import { flutedShader } from './flutedThree';
import { pixelShader } from './pixelThree';
import { rippleShader } from './rippleThree';
import { twistShader } from './twistThree';
import { ShaderVariant } from './types';
import { verticalShader } from './verticalThree';
import { zoomThree } from './zoomThree';

export const fragmentThreeShaders: Record<ShaderVariant, string> = {
  distortion: distortionThreeShader,
  ripple: rippleShader,
  fluted: flutedShader,
  vertical: verticalShader,
  twist: twistShader,
  pixel: pixelShader,
  zoom: zoomThree,
};

export type { AspectRatio, ShaderVariant } from './types';
