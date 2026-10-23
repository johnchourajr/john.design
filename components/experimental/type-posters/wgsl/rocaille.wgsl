// WGSL port of ../posters/rocaille.ts (the GLSL is the WebGL fallback).
import { Params, Frame, frame, aspect, fromSquare, toSquare, pointerUv, rotate, noise, roughen, inkLaid, paperStock, inkAt, printAt } from "./prelude.wgsl";

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var type_tex: texture_2d<f32>;
@group(0) @binding(2) var samp: sampler;

fn ink(uv: vec2f) -> f32 { return inkAt(type_tex, samp, uv); }
fn smallPrint(uv: vec2f) -> f32 { return printAt(type_tex, samp, uv); }

const PAPER = vec3f(0.906, 0.886, 0.855);

// Turns p around `centre` by `strength` at the centre, fading with
// distance: a whirl.
fn whirl(p: vec2f, centre: vec2f, strength: f32, size: f32) -> vec2f {
  let d = p - centre;
  let falloff = exp(-dot(d, d) / (size * size));
  return centre + rotate(strength * falloff) * d;
}

// The chain of whirls, one after another, so the curls interlock.
fn curl(f: Frame, start: vec2f) -> vec2f {
  let t = f.time * 0.25;
  let a = aspect(f);
  var p = whirl(start, vec2f(0.3 * a, 0.7), 2.2 * sin(t), 0.22);
  p = whirl(p, vec2f(0.72 * a, 0.42), -2.6 * sin(t * 0.8 + 1.0), 0.2);
  p = whirl(p, vec2f(0.45 * a, 0.2), 1.8 * sin(t * 1.1 + 2.0), 0.18);
  p = whirl(p, toSquare(f, pointerUv(f)), -3.2 * f.hover, 0.16);
  return p;
}

@fragment fn fs_main(@location(0) topUv: vec2f) -> @location(0) vec4f {
  let f = frame(params, topUv);
  let uv = f.uv;
  let p = curl(f, toSquare(f, uv));
  let warped = fromSquare(f, p);
  // Silver ink sits thin on the sheet: soft-edged, and patchy.
  let a = inkLaid(f, ink(roughen(f, warped, 0.5, 1.0)), 0.45, 1.0);
  // Silver: bands of light and dark that follow the warp.
  let sheen = 0.5 + 0.5 * sin(p.y * 38.0 + p.x * 12.0 + noise(p * 6.0) * 3.0);
  let silver = mix(vec3f(0.18), vec3f(0.82), pow(sheen, 1.8));
  // A wide white brushstroke curling behind the words.
  let brush = curl(f, toSquare(f, uv) * 0.92 + 0.04);
  let stroke = smoothstep(0.05, 0.0, abs(length(brush - vec2f(0.5 * aspect(f), 0.5)) - 0.3 + 0.06 * noise(brush * 4.0)));
  var colour = mix(PAPER, vec3f(1.0), stroke * 0.75);
  colour = mix(colour, silver, a);
  colour = mix(colour, vec3f(0.25), smallPrint(uv));
  // A heavy, cloudy rag sheet.
  return vec4f(paperStock(f, colour, 1.0), 1.0);
}
