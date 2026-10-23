// WGSL port of ../shaders/buildDitherShader.ts (the GLSL is the WebGL fallback).
import { Params, imageAt } from "../../ImageThreeShader/wgsl/layers.wgsl";

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var image: texture_2d<f32>;
@group(0) @binding(3) var samp: sampler;

fn random(st: vec2f) -> f32 {
  return fract(sin(dot(st, vec2f(12.9898, 78.233))) * 43758.5453123);
}

@fragment fn fs_main(@location(0) topUv: vec2f) -> @location(0) vec4f {
  let uv = vec2f(topUv.x, 1.0 - topUv.y);
  let time = params.time;

  // Calculate wave for distortion strength (GLSL mod, floor form).
  let loopTime = time - 15.0 * floor(time / 15.0);
  let waveStrength = (sin(loopTime * 0.4) + 1.0) * 0.5; // normalized to 0-1

  // Create noise-based distortion
  let noise = vec2f(
    random(uv + time * 0.5),
    random(uv + time * 0.5 + 1.0),
  ) * 2.0 - 1.0;

  // Apply noise distortion modulated by wave
  let distortedUV = uv + (noise * 0.03 * waveStrength);

  return imageAt(image, samp, distortedUV);
}
