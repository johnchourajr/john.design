// WGSL port of ../posters/outOfRegister.ts (the GLSL is the WebGL fallback).
import { Params, Frame, frame, fromSquare, toSquare, focus, noise, roughen, inkLaid, pressDensity, paperStock, inkAt, printAt } from "./prelude.wgsl";

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var type_tex: texture_2d<f32>;
@group(0) @binding(2) var samp: sampler;

fn ink(uv: vec2f) -> f32 { return inkAt(type_tex, samp, uv); }
fn smallPrint(uv: vec2f) -> f32 { return printAt(type_tex, samp, uv); }

const PAPER = vec3f(0.863, 0.867, 0.824);
const ORANGE = vec3f(0.957, 0.45, 0.13);
const BLUE = vec3f(0.05, 0.43, 0.68);
const PRINT_INK = vec3f(0.17, 0.22, 0.2);

@fragment fn fs_main(@location(0) topUv: vec2f) -> @location(0) vec4f {
  let f = frame(params, topUv);
  let uv = f.uv;
  let time = f.time;
  // At rest the plates breathe a little apart; the pointer pulls them.
  let rest = vec2f(0.5 + 0.12 * sin(time * 0.35), 0.5 + 0.1 * cos(time * 0.27));
  let pull = fromSquare(f, toSquare(f, focus(f, rest)) - toSquare(f, vec2f(0.5)));
  let drift = vec2f(0.006, -0.004) + pull * 0.05;
  // Each plate wobbles on its own, like paper stretching in the press.
  let wobble = vec2f(noise(uv * 3.0 + time * 0.2), noise(uv * 3.0 - time * 0.2)) - 0.5;
  let orangeAt = roughen(f, uv + drift + wobble * 0.004, 1.0, 1.0);
  let blueAt = roughen(f, uv - drift * 0.7 + vec2f(-drift.y, drift.x) * 0.4 - wobble * 0.004, 1.0, 2.0);
  let orange = inkLaid(f, ink(orangeAt), 1.0, 1.0) * pressDensity(f, 1.0, 1.0);
  let blue = inkLaid(f, ink(blueAt), 1.0, 2.0) * pressDensity(f, 1.0, 2.0);

  var colour = PAPER;
  colour *= mix(vec3f(1.0), ORANGE / PAPER, clamp(orange * 0.95, 0.0, 1.0));
  colour *= mix(vec3f(1.0), BLUE / PAPER, clamp(blue * 0.92, 0.0, 1.0));
  // The small print is a third, cleaner pass, still on the same stock.
  colour = mix(colour, PRINT_INK, inkLaid(f, smallPrint(roughen(f, uv, 0.5, 3.0)), 0.5, 3.0));
  return vec4f(paperStock(f, colour, 1.0), 1.0);
}
