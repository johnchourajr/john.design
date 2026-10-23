// WGSL port of ../posters/everythingFalls.ts (the GLSL is the WebGL fallback).
import { Params, Frame, frame, aspect, focus, noise, sq, inkAt, printAt } from "./prelude.wgsl";

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var type_tex: texture_2d<f32>;
@group(0) @binding(2) var samp: sampler;

fn ink(uv: vec2f) -> f32 { return inkAt(type_tex, samp, uv); }
fn smallPrint(uv: vec2f) -> f32 { return printAt(type_tex, samp, uv); }

const STEPS = 48;

@fragment fn fs_main(@location(0) topUv: vec2f) -> @location(0) vec4f {
  let f = frame(params, topUv);
  let uv = f.uv;
  let time = f.time;
  let at = focus(f, vec2f(0.5 + 0.35 * sin(time * 0.17), 0.5));
  // How far each column has fallen: broad swells, narrow jags, always
  // shifting, deepest under the pointer.
  let broad = noise(vec2f(uv.x * 6.0, time * 0.35));
  let jag = noise(vec2f(uv.x * 38.0, time * 0.9));
  let pulse = 0.5 + 0.5 * sin(time * 1.3 + uv.x * 11.0);
  let under = exp(-sq((uv.x - at.x) * aspect(f) / 0.18));
  let fall = 0.03 + 0.42 * broad * broad + 0.12 * jag * pulse + 0.4 * under * (0.4 + 0.6 * f.hover);

  // The face: the word where it was set, white, always on top.
  let face = ink(uv);
  // The extrusion: march up to the first letter above this point.
  var trail = 0.0;
  var shade = 0.0;
  for (var i = 1; i <= STEPS; i++) {
    let t = f32(i) / f32(STEPS);
    if (ink(uv + vec2f(0.0, t * fall)) > 0.5) {
      trail = 1.0;
      shade = t;
      break;
    }
  }
  // It decays hard, with fine banding like a stepped extrusion.
  let bands = 0.88 + 0.12 * step(0.5, fract(shade * 18.0));
  let trailColour = vec3f(pow(1.0 - shade, 3.2) * 0.72 * bands);
  var colour = vec3f(0.02);
  colour = mix(colour, trailColour, trail);
  colour = mix(colour, vec3f(0.97), smoothstep(0.3, 0.7, face));
  colour = mix(colour, vec3f(0.85), smallPrint(uv));
  return vec4f(colour, 1.0);
}
