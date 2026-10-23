// WGSL port of ../posters/vortices.ts (the GLSL is the WebGL fallback).
import { Params, Frame, frame, fromSquare, toSquare, focus, rotate, roughen, inkLaid, paperStock, inkAt, printAt } from "./prelude.wgsl";

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var type_tex: texture_2d<f32>;
@group(0) @binding(2) var samp: sampler;

fn ink(uv: vec2f) -> f32 { return inkAt(type_tex, samp, uv); }
fn smallPrint(uv: vec2f) -> f32 { return printAt(type_tex, samp, uv); }

const PAPER = vec3f(0.91, 0.902, 0.878);
const INK_COLOUR = vec3f(0.15);
// Ring width, in poster heights.
const RING = 0.052;

@fragment fn fs_main(@location(0) topUv: vec2f) -> @location(0) vec4f {
  let f = frame(params, topUv);
  let uv = f.uv;
  let time = f.time;
  // At rest the eye of the whirlpool circles the middle.
  let rest = vec2f(0.5, 0.45) + vec2f(cos(time * 0.2), sin(time * 0.2)) * 0.04;
  let eye = toSquare(f, focus(f, rest));
  let p = toSquare(f, uv);
  let r = distance(p, eye);
  // A whole number of rings, so no part ring leaves a stray seam.
  let rings = floor((0.46 + 0.08 * f.hover) / RING);
  let reach = rings * RING;
  let ring = floor(r / RING);
  // Each ring turns further than the one outside it.
  let depth = clamp(1.0 - ring / rings, 0.0, 1.0);
  let twist = (0.55 + 0.35 * sin(time * 0.3) + 0.5 * f.hover) * (0.12 + 0.88 * depth * depth) * 2.2;
  let turned = eye + rotate(twist) * (p - eye);
  let sampleUv = select(uv, fromSquare(f, turned), r < reach);
  // Black ink on uncoated stock: rough at the edge, a little patchy.
  var a = inkLaid(f, ink(roughen(f, sampleUv, 0.8, 1.0)), 0.7, 1.0);
  // A hairline of paper where each ring is cut.
  let edge = abs(fract(r / RING) - 0.5) * 2.0;
  let cut = select(0.0, smoothstep(0.985, 0.995, edge) * step(0.5, ring), r < reach);
  a *= 1.0 - cut;
  var colour = mix(PAPER, INK_COLOUR, a);
  colour = mix(colour, INK_COLOUR, inkLaid(f, smallPrint(roughen(f, uv, 0.4, 2.0)), 0.4, 2.0));
  return vec4f(paperStock(f, colour, 0.8), 1.0);
}
