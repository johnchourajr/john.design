// WGSL port of ../posters/massBendsLight.ts (the GLSL is the WebGL fallback).
import { Params, Frame, frame, fromSquare, toSquare, focus, sq, inkAt, printAt, gridAt } from "./prelude.wgsl";

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var type_tex: texture_2d<f32>;
@group(0) @binding(2) var samp: sampler;

fn ink(uv: vec2f) -> f32 { return inkAt(type_tex, samp, uv); }
fn smallPrint(uv: vec2f) -> f32 { return printAt(type_tex, samp, uv); }
fn grid(uv: vec2f) -> f32 { return gridAt(type_tex, samp, uv); }

const SPACE = vec3f(0.04);

@fragment fn fs_main(@location(0) topUv: vec2f) -> @location(0) vec4f {
  let f = frame(params, topUv);
  let uv = f.uv;
  let time = f.time;
  let accent = f.accent;
  // At rest the mass drifts slowly across the words.
  let rest = vec2f(0.5 + 0.3 * sin(time * 0.13), 0.36 + 0.12 * sin(time * 0.21));
  let lens = toSquare(f, focus(f, rest));
  let p = toSquare(f, uv);
  let d = p - lens;
  let r2 = max(dot(d, d), 1e-5);
  // The Einstein radius: heavier once the pointer is holding it.
  let einstein = 0.075 + 0.045 * f.hover;
  // The lens equation: light seen at p left the poster at `source`.
  let source = p - einstein * einstein * d / r2;
  // Each colour bends a hair differently, so the ring fringes.
  let spread = d / r2 * einstein * einstein * 0.03;
  let type_r = ink(fromSquare(f, source + spread));
  let type_g = ink(fromSquare(f, source));
  let type_b = ink(fromSquare(f, source - spread));
  let lines = grid(fromSquare(f, source));
  var colour = SPACE + accent * lines * 0.28;
  colour = mix(colour, accent, type_g);
  colour.r = mix(colour.r, accent.r, type_r);
  colour.b = mix(colour.b, accent.b, type_b);
  // Nothing comes back from inside the horizon.
  let r = sqrt(r2);
  colour *= smoothstep(einstein * 0.3, einstein * 0.36, r);
  // A faint photon ring on the horizon's edge.
  colour += accent * 0.25 * exp(-sq((r - einstein * 0.37) / 0.004));
  // The small print is set on the grid, so it bends with it.
  colour = mix(colour, vec3f(0.6), smallPrint(fromSquare(f, source)));
  return vec4f(colour, 1.0);
}
