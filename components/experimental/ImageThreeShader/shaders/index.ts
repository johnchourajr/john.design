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

/**
 * The heroes' set, on home and on every justified headline. Each one also
 * draws the headline layer, and warps it while the pointer is over it (#108).
 */
export const heroShaderVariants: ShaderVariant[] = [
  'pixel',
  'distortion',
  'vertical',
  'loupe',
  'sphere',
  'prism',
];

/**
 * A random variant from `variants`. `?shader=<variant>` pins any hero
 * variant, for review and screenshots. Client only, after mount: it reads
 * the URL and is random.
 */
export function pickShaderVariant(variants: ShaderVariant[]): ShaderVariant {
  const pinned = new URLSearchParams(window.location.search).get('shader');
  if (pinned && heroShaderVariants.includes(pinned as ShaderVariant)) {
    return pinned as ShaderVariant;
  }
  return variants[Math.floor(Math.random() * variants.length)];
}

/** `?shader-text=off` leaves the headline in the DOM, to compare against. */
export function isHeadlineInShader(): boolean {
  return (
    new URLSearchParams(window.location.search).get('shader-text') !== 'off'
  );
}

export type { AspectRatio, ShaderVariant } from './types';
