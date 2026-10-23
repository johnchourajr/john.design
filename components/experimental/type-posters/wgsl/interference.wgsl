// WGSL port of ../posters/interference.ts (the GLSL is the WebGL fallback).
import { Params, Frame, frame, fromSquare, toSquare, focus, rotate, roughen, inkLaid, paperStock, inkAt, printAt } from "./prelude.wgsl";

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var type_tex: texture_2d<f32>;
@group(0) @binding(2) var samp: sampler;

fn ink(uv: vec2f) -> f32 { return inkAt(type_tex, samp, uv); }
fn smallPrint(uv: vec2f) -> f32 { return printAt(type_tex, samp, uv); }

const ORANGE = vec3f(0.94, 0.31, 0.14);
const WHITE = vec3f(0.98, 0.95, 0.92);
const BLACK = vec3f(0.08, 0.05, 0.04);

// The type blurred, as a height: 1 deep inside a letter, falling to 0
// across its edge, for the stripes to ride over.
fn bevel(f: Frame, uv: vec2f) -> f32 {
  var sum = ink(uv) * 2.0;
  var total = 2.0;
  for (var i = 0; i < 12; i++) {
    let a = f32(i) * 0.5235988;
    for (var ring = 1; ring <= 2; ring++) {
      let offset = vec2f(cos(a), sin(a)) * 0.018 * f32(ring) / 2.0;
      sum += ink(uv + fromSquare(f, offset));
      total += 1.0;
    }
  }
  return sum / total;
}

@fragment fn fs_main(@location(0) topUv: vec2f) -> @location(0) vec4f {
  let f = frame(params, topUv);
  let uv = f.uv;
  let time = f.time;
  let p = toSquare(f, uv);
  let source = toSquare(f, focus(f, vec2f(0.78 + 0.08 * sin(time * 0.3), 0.18 + 0.06 * cos(time * 0.23))));
  let r = distance(p, source);
  // The rings: spreading outward, fading with distance.
  let rings = step(0.25, sin(r * 140.0 - time * 2.4)) * smoothstep(0.75, 0.15, r);
  // The stripes, lifted over each letter's bevel so they curve like ribbons.
  let h = bevel(f, uv);
  let q = rotate(0.62 + 0.15 * sin(time * 0.2)) * p;
  let stripes = step(0.0, sin(q.y * 150.0 + h * 9.0));
  // The letters print with a rough edge, their stripes a little dry.
  let inside = inkLaid(f, ink(roughen(f, uv, 0.7, 1.0)), 0.6, 1.0);
  // Where one is on and the other off, the paper shows.
  let crossed = abs(stripes - rings);
  var colour = mix(ORANGE, WHITE, rings * 0.9);
  colour = mix(colour, mix(WHITE, BLACK, crossed * inkLaid(f, 1.0, 0.8, 4.0)), inside);
  colour = mix(colour, BLACK, smallPrint(uv));
  return vec4f(paperStock(f, colour, 0.6), 1.0);
}
