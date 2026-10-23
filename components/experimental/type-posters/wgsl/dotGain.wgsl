// WGSL port of ../posters/dotGain.ts (the GLSL is the WebGL fallback).
import { Params, Frame, frame, fromSquare, toSquare, focus, rotate, noise, sq, sheetPx, inkLaid, paperStock, inkAt, printAt, gridAt } from "./prelude.wgsl";

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var type_tex: texture_2d<f32>;
@group(0) @binding(2) var samp: sampler;

fn ink(uv: vec2f) -> f32 { return inkAt(type_tex, samp, uv); }
fn smallPrint(uv: vec2f) -> f32 { return printAt(type_tex, samp, uv); }
fn grid(uv: vec2f) -> f32 { return gridAt(type_tex, samp, uv); }

const PAPER = vec3f(0.945, 0.937, 0.91);
const INK_COLOUR = vec3f(0.07);
const RED = vec3f(0.9, 0.16, 0.1);
// The screen's cell, in poster heights, and its angle.
const CELL = 0.018;
const ANGLE = 0.2618;

@fragment fn fs_main(@location(0) topUv: vec2f) -> @location(0) vec4f {
  let f = frame(params, topUv);
  let uv = f.uv;
  let time = f.time;
  let p = rotate(ANGLE) * toSquare(f, uv);
  let cell = floor(p / CELL);
  let centre = (cell + 0.5) * CELL;
  let centreUv = fromSquare(f, rotate(-ANGLE) * centre);
  // How much ink the cell holds: the type averaged over it.
  var tone = 0.0;
  for (var y = -1; y <= 1; y++) {
    for (var x = -1; x <= 1; x++) {
      tone += ink(centreUv + fromSquare(f, rotate(-ANGLE) * vec2f(f32(x), f32(y)) * CELL * 0.33));
    }
  }
  tone /= 9.0;
  // The gain: a little everywhere, breathing, and a lot under the pointer.
  let at = focus(f, vec2f(0.3 + 0.2 * sin(time * 0.2), 0.3));
  let near = exp(-sq(distance(toSquare(f, uv), toSquare(f, at)) / 0.22));
  let gain = 1.0 + 0.12 * sin(time * 0.6) + 0.9 * near * (0.35 + 0.65 * f.hover);
  // A dot's area is the tone, so its radius goes with the square root.
  let radius = sqrt(tone) * CELL * 0.62 * gain;
  // Each dot's edge wavers a little, as real halftone dots do.
  let d = distance(p, centre) + (noise(sheetPx(f) * 0.6) - 0.5) * CELL * 0.08;
  let aa = CELL * 0.06;
  var dotInk = 1.0 - smoothstep(radius - aa, radius + aa, d);
  dotInk *= step(0.02, tone);
  dotInk = inkLaid(f, dotInk, 0.5, 1.0);
  var colour = mix(PAPER, INK_COLOUR, dotInk);
  colour = mix(colour, RED, grid(uv));
  colour = mix(colour, INK_COLOUR, smallPrint(uv));
  return vec4f(paperStock(f, colour, 0.8), 1.0);
}
