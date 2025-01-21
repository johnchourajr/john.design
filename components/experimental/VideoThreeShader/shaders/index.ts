import { retroGlowShader } from './retroGlowShader';
import { vhsShader } from './vhsShader';
import { videoProcessShader } from './videoProcessShader';

export const fragmentThreeVideoShaders = {
  vhs: vhsShader,
  retroGlow: retroGlowShader,
  videoProcess: videoProcessShader,
};

export const defaultFragmentShader = vhsShader;
