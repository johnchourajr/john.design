// WGSL port of ../posters/afterimage.ts (the GLSL is the WebGL fallback).
import { Params, Frame, frame, focus, paper, inkAt, printAt } from "./prelude.wgsl";

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var type_tex: texture_2d<f32>;
@group(0) @binding(2) var samp: sampler;

fn ink(uv: vec2f) -> f32 { return inkAt(type_tex, samp, uv); }
fn smallPrint(uv: vec2f) -> f32 { return printAt(type_tex, samp, uv); }

// The word's cap height and top, in poster heights: the same as CAP and TOP
// in ../posters/afterimage.ts, which lays the word out. Keep them in step.
const CAP = 0.075;
const TOP = 0.2;
const COPIES = 9;
const GUTTER = 0.008;

@fragment fn fs_main(@builtin(position) pixel: vec4f, @location(0) topUv: vec2f) -> @location(0) vec4f {
  let f = frame(params, topUv);
  let uv = f.uv;
  let time = f.time;
  // The word's band, in UV (y up).
  let wordTop = 1.0 - TOP + CAP * 0.04;
  let wordBottom = 1.0 - TOP - CAP - CAP * 0.04;
  var a = ink(uv);
  let lead = focus(f, vec2f(0.5 + 0.25 * sin(time * 0.4), 0.5)).x - 0.5;
  // Walk down the copies: each shorter than the last, cut from the bottom.
  var top = wordBottom - GUTTER;
  for (var k = 1; k <= COPIES; k++) {
    let i = f32(k);
    let height = (wordTop - wordBottom) * (1.0 - i * 0.095);
    let bottom = top - height;
    if (uv.y <= top && uv.y > bottom) {
      // The same distance down from the word's top, so the cut takes the
      // letters' feet.
      let y = wordTop - (top - uv.y);
      // Further behind the pointer, and swaying, the later the copy.
      let lag = lead * 0.05 * i * (0.4 + 0.6 * f.hover) + sin(time * 0.8 - i * 0.55) * 0.004 * i;
      var copy = ink(vec2f(uv.x + lag, y));
      // A hairline gap where each copy is cut.
      copy *= smoothstep(bottom, bottom + 0.002, uv.y);
      a = max(a, copy * (1.0 - i * 0.085));
    }
    top = bottom - GUTTER;
  }
  var colour = mix(vec3f(0.045), vec3f(0.95), a);
  colour = mix(colour, vec3f(0.8), smallPrint(uv));
  return vec4f(paper(colour, pixel.xy), 1.0);
}
