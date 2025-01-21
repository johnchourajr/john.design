import { retroGlowShader } from './retroGlowShader';
import { vhsShader } from './vhsShader';

export const fragmentThreeVideoShaders = {
  vhs: vhsShader,
  retroGlow: retroGlowShader,
};

export const defaultFragmentShader = vhsShader;
