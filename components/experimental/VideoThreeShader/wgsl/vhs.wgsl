// WGSL port of ../shaders/vhsShader.ts (the GLSL is the WebGL fallback).
import { Params, imageAt } from "../../ImageThreeShader/wgsl/layers.wgsl";

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var image: texture_2d<f32>;
@group(0) @binding(3) var samp: sampler;

fn random(st: vec2f) -> f32 {
  return fract(sin(dot(st, vec2f(12.9898, 78.233))) * 43758.5453123);
}

fn noise(st: vec2f) -> f32 {
  let i = floor(st);
  let f = fract(st);
  let a = random(i);
  let b = random(i + vec2f(1.0, 0.0));
  let c = random(i + vec2f(0.0, 1.0));
  let d = random(i + vec2f(1.0, 1.0));
  let u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

fn crt_curve(uvIn: vec2f) -> vec2f {
  var uv = uvIn * 2.0 - 1.0;
  let offset = abs(uv.yx) / vec2f(6.0, 4.0);
  uv = uv + uv * offset * offset;
  return uv * 0.5 + 0.5;
}

@fragment fn fs_main(@location(0) topUv: vec2f) -> @location(0) vec4f {
  let vUv = vec2f(topUv.x, 1.0 - topUv.y);
  let time = params.time;
  let mouse = params.mouse;

  // CRT curve effect
  var uv = crt_curve(vUv);

  // Intense color bleeding
  let colorBleedWidth = 0.005 + sin(time) * 0.002;
  let r = imageAt(image, samp, vec2f(uv.x + colorBleedWidth, uv.y)).r;
  let g = imageAt(image, samp, uv).g;
  let b = imageAt(image, samp, vec2f(uv.x - colorBleedWidth, uv.y)).b;

  // VHS tracking distortion
  let tracking = sin(uv.y * 10.0 + time) * 0.003;
  uv.x += tracking;

  // Vertical hold jump. GLSL mod: floor form, since uv.y can be negative.
  let verticalHold = step(0.99, random(vec2f(time * 0.3, 0.0))) * 0.3;
  let held = uv.y + verticalHold;
  uv.y = held - floor(held);

  // Scanlines (reduced intensity)
  let scanlineIntensity = 0.08;
  let scanline = sin(uv.y * 800.0) * scanlineIntensity;

  // Horizontal noise bands (reduced frequency)
  let noiseBands = step(0.99, random(vec2f(uv.y * 100.0, time))) * 0.2;

  // Glitch blocks (reduced intensity)
  let glitchPos = floor(uv.y * 20.0);
  let glitchNoise = random(vec2f(glitchPos, floor(time * 20.0)));
  let glitchShift = (glitchNoise - 0.5) * 0.02;
  uv.x += glitchShift;

  // Mouse interaction
  let mouseDistance = distance(uv, mouse);
  let mouseInfluence = 1.0 - smoothstep(0.0, 0.4, mouseDistance);

  // Combine effects
  var rgb = vec3f(r, g, b);

  // Apply scanlines and noise bands
  rgb *= (1.0 - scanline);
  rgb = mix(rgb, vec3f(1.0), noiseBands);

  // Color adjustments (reduced intensity)
  rgb *= 1.05; // Slight brightness boost
  rgb.r *= 1.05; // Slight red boost
  rgb.b *= 0.95; // Slight blue reduction

  // VHS color palette adjustment (reduced intensity)
  rgb = mix(rgb, vec3f(
    dot(rgb, vec3f(0.393, 0.769, 0.189)),
    dot(rgb, vec3f(0.349, 0.686, 0.168)),
    dot(rgb, vec3f(0.272, 0.534, 0.131)),
  ), 0.1);

  // Add subtle interference
  let interference = sin(uv.y * 100.0 + time * 10.0) * 0.01;
  rgb += interference;

  // Mouse effect
  rgb = mix(rgb, rgb * 1.2, mouseInfluence * 0.2);

  return vec4f(rgb, 1.0);
}
