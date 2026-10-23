// WGSL port of ../shaders/videoProcessShader.ts (the GLSL is the WebGL fallback).
import { Params, imageAt } from "../../ImageThreeShader/wgsl/layers.wgsl";

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var image: texture_2d<f32>;
@group(0) @binding(3) var samp: sampler;

fn random(st: vec2f) -> f32 {
  return fract(sin(dot(st, vec2f(12.9898, 78.233))) * 43758.5453123);
}

@fragment fn fs_main(@location(0) topUv: vec2f) -> @location(0) vec4f {
  var uv = vec2f(topUv.x, 1.0 - topUv.y);
  let time = params.time;

  // Random glitch blocks
  let blockThreshold = 0.995;
  let blockNoise = random(vec2f(floor(uv.y * 10.0), floor(time * 2.0)));
  let glitchOffset = step(blockThreshold, blockNoise) * 0.003 * sin(time);

  // Horizontal line glitch
  let lineNoise = random(vec2f(floor(uv.y * 50.0), time));
  let lineOffset = step(0.996, lineNoise) * 0.004;

  // Apply glitch displacement
  uv.x += glitchOffset + lineOffset;

  // Color channel splitting
  let colorShift = sin(time * 2.0) * 0.001;
  var color = vec4f(
    imageAt(image, samp, uv + vec2f(colorShift, 0.0)).r,
    imageAt(image, samp, uv).g,
    imageAt(image, samp, uv - vec2f(colorShift, 0.0)).b,
    1.0,
  );

  // Add dynamic grain
  let grain = random(uv + time) * 0.1 - 0.05;
  color = vec4f(color.rgb + grain, color.a);

  // Random color aberration
  let aberrationChance = step(0.99, random(vec2f(time * 0.5, 0.0)));
  color.r *= (1.0 + aberrationChance * 0.2);
  color.b *= (1.0 + aberrationChance * 0.2);

  return color;
}
