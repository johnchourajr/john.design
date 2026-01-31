import { distortionThreeShader } from './distortionThree';
import { edgeDetectShader } from './edgeDetectThree';
import { flutedShader } from './flutedThree';
import { glassShader } from './glassThree';
import { liquidShader } from './liquidThree';
import { loupeShader } from './loupeThree';
import { pixelShader } from './pixelThree';
import { prismShader } from './prismThree';
import { rippleShader } from './rippleThree';
import { sphereShader } from './sphereThree';
import { ShaderVariant } from './types';
import { verticalShader } from './verticalThree';

export const fragmentThreeShaders: Record<ShaderVariant, string> = {
  distortion: distortionThreeShader,
  ripple: rippleShader,
  fluted: flutedShader,
  vertical: verticalShader,
  pixel: pixelShader,
  loupe: loupeShader,
  edgeDetect: edgeDetectShader,
  glass: glassShader,
  liquid: liquidShader,
  sphere: sphereShader,
  prism: prismShader,
};

export type { AspectRatio, ShaderVariant } from './types';
