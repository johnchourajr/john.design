import { distortionShader } from './distortion';
import { flutedShader } from './fluted';
import { pixelShader } from './pixel';
import { rippleShader } from './ripple';
import { twistShader } from './twist';
import { ShaderVariant } from './types';
import { verticalShader } from './vertical';
import { zoomShader } from './zoom';

export const fragmentShaders: Record<ShaderVariant, string> = {
  distortion: distortionShader,
  ripple: rippleShader,
  fluted: flutedShader,
  vertical: verticalShader,
  twist: twistShader,
  pixel: pixelShader,
  zoom: zoomShader,
};

export type { AspectRatio, ShaderVariant } from './types';
