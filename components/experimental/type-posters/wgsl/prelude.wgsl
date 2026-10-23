// The type posters' shared WGSL, ported from ../prelude.ts (the GLSL the
// WebGL fallback still runs). Keep the two in step.
//
// A pure module: vgpu only lets the entry shader declare bindings, so each
// poster declares `params`, `type_tex` and `samp`, builds a `Frame` once,
// and passes it (and the texture) to these helpers.
//
// Coordinates match the GLSL: `uv` grows upward from the bottom left, so
// every poster's maths ports line for line. vgpu's own uv is top-origin;
// `frame()` flips it once, and the texture helpers flip back when they
// sample the uploaded canvas.

// What the renderer sends every poster.
export struct Params {
  // The poster in CSS px.
  resolution: vec2f,
  // The pointer in CSS px from the poster's top left, damped.
  mouse: vec2f,
  // Seconds; 0 with reduced motion.
  time: f32,
  // 0 to 1: eases in the first time the pointer arrives, then holds.
  hover: f32,
  // The site's accent colour (--root-color).
  accent: vec3f,
}

// One fragment's view of the poster.
export struct Frame {
  uv: vec2f,
  resolution: vec2f,
  mouse: vec2f,
  time: f32,
  hover: f32,
  accent: vec3f,
}

// From vgpu's top-origin uv to the GLSL's bottom-origin one.
export fn frame(p: Params, topUv: vec2f) -> Frame {
  return Frame(vec2f(topUv.x, 1.0 - topUv.y), p.resolution, p.mouse, p.time, p.hover, p.accent);
}

// Width over height.
export fn aspect(f: Frame) -> f32 { return f.resolution.x / f.resolution.y; }

// UV to a space where distances are the same both ways: x runs 0 to the
// aspect, y 0 to 1.
export fn toSquare(f: Frame, uv: vec2f) -> vec2f { return vec2f(uv.x * aspect(f), uv.y); }
export fn fromSquare(f: Frame, p: vec2f) -> vec2f { return vec2f(p.x / aspect(f), p.y); }

// The pointer in UV (y up).
export fn pointerUv(f: Frame) -> vec2f {
  return vec2f(f.mouse.x / f.resolution.x, 1.0 - f.mouse.y / f.resolution.y);
}

// Where the effect is centred: `rest` (UV) until the pointer arrives,
// easing over to the pointer.
export fn focus(f: Frame, rest: vec2f) -> vec2f { return mix(rest, pointerUv(f), f.hover); }

// The poster's composition at a point (bottom-origin uv), sampled from the
// uploaded canvas, which is top-origin. Red is the expressive type, green
// the small print, blue the grid. Explicit level 0, so it's safe to call
// anywhere, including inside branches.
fn layers(t: texture_2d<f32>, s: sampler, uv: vec2f) -> vec4f {
  return textureSampleLevel(t, s, vec2f(uv.x, 1.0 - uv.y), 0.0);
}

fn inside(uv: vec2f) -> bool {
  return uv.x >= 0.0 && uv.x <= 1.0 && uv.y >= 0.0 && uv.y <= 1.0;
}

// The expressive type, 0 outside the poster.
export fn inkAt(t: texture_2d<f32>, s: sampler, uv: vec2f) -> f32 {
  return select(0.0, layers(t, s, uv).r, inside(uv));
}

// The small print.
export fn printAt(t: texture_2d<f32>, s: sampler, uv: vec2f) -> f32 {
  return layers(t, s, uv).g;
}

// The grid layer, 0 outside the poster.
export fn gridAt(t: texture_2d<f32>, s: sampler, uv: vec2f) -> f32 {
  return select(0.0, layers(t, s, uv).b, inside(uv));
}

export fn rotate(a: f32) -> mat2x2f {
  let c = cos(a);
  let s = sin(a);
  return mat2x2f(c, -s, s, c);
}

export fn hash(p: vec2f) -> f32 {
  var p3 = fract(vec3f(p.x, p.y, p.x) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

export fn noise(p: vec2f) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2f(1.0, 0.0)), u.x),
    mix(hash(i + vec2f(0.0, 1.0)), hash(i + vec2f(1.0, 1.0)), u.x),
    u.y
  );
}

// Paper: a faint, fixed grain, so flat colour reads as printed. `pixel` is
// the fragment's position in device pixels.
export fn paper(colour: vec3f, pixel: vec2f) -> vec3f {
  return colour * (0.97 + 0.03 * hash(floor(pixel)));
}

// x squared: the GLSL's pow(x, 2.0), which is undefined for a negative x.
export fn sq(x: f32) -> f32 { return x * x; }

// ── Print: offset printing's flaws, measured in CSS px so the texture is
// the same size at every poster size. See ../prelude.ts for the long form.

// How much of it shows, across every poster.
const PRINT_TEXTURE = 0.55;

// This fragment in CSS px from the poster's bottom left.
export fn sheetPx(f: Frame) -> vec2f { return f.uv * f.resolution; }

export fn fbm(start: vec2f) -> f32 {
  var p = start;
  var sum = 0.0;
  var amp = 0.5;
  for (var i = 0; i < 4; i++) {
    sum += noise(p) * amp;
    p = rotate(0.6) * p * 2.03 + 11.7;
    amp *= 0.5;
  }
  return sum;
}

// Uncoated stock: clouding, fibres with the grain, and a fine tooth.
export fn paperStock(f: Frame, colour: vec3f, strength: f32) -> vec3f {
  let amount = strength * PRINT_TEXTURE;
  let p = sheetPx(f);
  let cloud = fbm(p * 0.011) - 0.5;
  let fibres = smoothstep(0.72, 0.95, noise(rotate(0.35) * p * vec2f(0.04, 1.1)));
  let tooth = hash(floor(p * 1.6)) - 0.5;
  let sheet = colour * (1.0 + amount * (cloud * 0.06 - fibres * 0.015));
  return sheet + amount * tooth * 0.022;
}

// Moves a sample point by a few tenths of a CSS px, so ink edges break up.
export fn roughen(f: Frame, uv: vec2f, strength: f32, seed: f32) -> vec2f {
  let amount = strength * PRINT_TEXTURE;
  let p = sheetPx(f) * 0.45 + seed * 31.7;
  let n = vec2f(noise(p), noise(p + 17.3)) - 0.5;
  let m = vec2f(noise(p * 3.1), noise(p * 3.1 + 5.9)) - 0.5;
  return uv + (n * 0.9 + m * 0.35) * amount / f.resolution;
}

// Ink as it lays down: patchy solids, rare soft pinholes, a wavering edge.
export fn inkLaid(f: Frame, coverage: f32, strength: f32, seed: f32) -> f32 {
  let amount = strength * PRINT_TEXTURE;
  let p = sheetPx(f) + seed * 53.1;
  let mottle = fbm(p * 0.045);
  let edge = 0.5 + (mottle - 0.5) * 0.35 * amount;
  let laid = smoothstep(edge - 0.18, edge + 0.18, coverage);
  let starve = 1.0 - amount * 0.22 * smoothstep(0.45, 0.8, fbm(p * 0.02 + 3.0));
  let speck = noise(p * 0.55 + 41.0) * noise(p * 1.3 + 7.0);
  let pinhole = smoothstep(0.7 - amount * 0.05, 0.76, speck) * 0.7 * amount;
  return laid * starve * (1.0 - pinhole);
}

// How heavily the press ran across the sheet: a slow swell around 1.
export fn pressDensity(f: Frame, strength: f32, seed: f32) -> f32 {
  let amount = strength * PRINT_TEXTURE;
  return 1.0 + amount * (fbm(f.uv * 1.6 + seed * 7.3) - 0.5) * 0.3;
}
