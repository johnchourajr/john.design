// WGSL port of ../shaders/wavesShader.ts (the GLSL is the WebGL fallback).
import { GenParams } from "./gen.wgsl";

@group(0) @binding(0) var<uniform> params: GenParams;

fn hsl2rgb(c: vec3f) -> vec3f {
  let k = c.x * 6.0 + vec3f(0.0, 4.0, 2.0);
  // GLSL mod: floored.
  let wrapped = k - 6.0 * floor(k / 6.0);
  let rgb = clamp(abs(wrapped - 3.0) - 1.0, vec3f(0.0), vec3f(1.0));
  return c.z + c.y * (rgb - 0.5) * (1.0 - abs(2.0 * c.z - 1.0));
}

fn wave(uv: vec2f, scale: f32, speed: f32, distortion: f32) -> f32 {
  let time = params.time;
  let x = uv.x;
  let y = uv.y;
  let diagonal = dot(uv, vec2f(cos(x * distortion), -sin(y * distortion)));
  let wave1 = sin(diagonal * scale + time * speed + sin(x + y));
  let wave2 = cos(diagonal * scale * 0.7 + time * (speed * 0.8) + cos(x - y));
  let wave3 = sin(diagonal * scale * 1.3 + time * (speed * 1.2) + sin(x * 0.7 + y * 1.3));
  return (wave1 + wave2 + wave3) * 0.5 + 0.5;
}

@fragment fn fs_main(@location(0) topUv: vec2f) -> @location(0) vec4f {
  let resolution = params.resolution;
  let time = params.time;
  let scale = params.scale;
  let speed = params.speed;
  let distortion = params.distortion;
  // gl_FragCoord.xy / resolution is this pixel in bottom-origin UV, which
  // is vUv; using it keeps device and CSS pixels out of it.
  let vUv = vec2f(topUv.x, 1.0 - topUv.y);
  var uv = vUv * 2.0 - 1.0;
  uv.x *= resolution.x / resolution.y;

  let w1 = wave(uv, scale * 3.0, speed * 0.5, distortion * 0.3);
  let w2 = wave(uv * 1.2, scale * 4.0, speed * -0.3, distortion * 0.5);
  let w3 = wave(uv * 0.8, scale * 5.0, speed * 0.2, distortion * 0.7);

  let s = w1 * 0.5 + w2 * 0.3 + w3 * 0.2;
  let waves = s * s;
  let depthMix = waves * 0.7 + 0.3;

  let color1 = hsl2rgb(vec3f(time * 0.1, 0.5, 0.3));
  let color2 = hsl2rgb(vec3f(time * 0.1 + 0.33, 0.4, 0.7));
  let color3 = hsl2rgb(vec3f(time * 0.1 + 0.66, 0.6, 0.5));

  var finalColor = mix(color1, color2, waves);
  finalColor = mix(finalColor, color3, depthMix);
  finalColor *= params.colorIntensity;

  return vec4f(finalColor, 1.0);
}
