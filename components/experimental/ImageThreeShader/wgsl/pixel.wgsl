// WGSL port of ../shaders/pixelThree.ts (the GLSL is the WebGL fallback).
import { Params, Layer, layer, imageUv, imageAt, headlineAt, over } from "./layers.wgsl";

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var image: texture_2d<f32>;
@group(0) @binding(2) var headline: texture_2d<f32>;
@group(0) @binding(3) var samp: sampler;

// Snaps texture UV to square blocks of `size` (in frame heights), sampling
// each block at its corner (`at` 0) or its centre (0.5).
fn pixelate(textureUV: vec2f, size: f32, screenAspect: f32, at: f32) -> vec2f {
  var normalizedUV = textureUV;
  normalizedUV.x *= screenAspect;
  normalizedUV = (floor(normalizedUV / size) + at) * size;
  normalizedUV.x /= screenAspect;
  return normalizedUV;
}

// How much of a block the letter must cover for it to light. Low, so a
// partly covered row along the top or bottom of a letter fills in.
const BLOCK_FILL = 0.25;

// The type as one block of `size`: lit when the letter covers enough of it.
fn typeBlock(l: Layer, textureUV: vec2f, size: f32, screenAspect: f32) -> vec4f {
  let corner = pixelate(textureUV, size, screenAspect, 0.0);
  let cell = vec2f(size / screenAspect, size);
  var sum = vec4f(0.0);
  for (var y = 0; y < 3; y++) {
    for (var x = 0; x < 3; x++) {
      sum += headlineAt(params, l, headline, samp, corner + cell * (vec2f(f32(x), f32(y)) + 0.5) / 3.0);
    }
  }
  let coverage = sum / 9.0;
  if (coverage.a < 0.001) { return vec4f(0.0); }
  let lit = smoothstep(BLOCK_FILL - 0.05, BLOCK_FILL + 0.05, coverage.a);
  // Premultiplied: the type's own colour, solid where the block is lit.
  return vec4f(coverage.rgb / coverage.a * lit, lit);
}

@fragment fn fs_main(@location(0) topUv: vec2f) -> @location(0) vec4f {
  let l = layer(params, topUv);
  let uv = l.uv;
  let resolution = params.resolution;
  let mouse = params.mouse;
  let screenAspect = resolution.x / resolution.y;

  let textureUV = imageUv(l, uv);

  var effectUV = uv;
  effectUV.x *= screenAspect;

  let mouseUV = vec2f(mouse.x / resolution.x * screenAspect, 1.0 - mouse.y / resolution.y);
  let dist = distance(effectUV, mouseUV) / screenAspect;

  // Sized with the other hero lenses: its visible ring at ~0.165 of the
  // frame's width.
  let innerRadius = 0.087;
  let outerRadius = 0.174;
  let basePixelSize = 0.055;
  let reveal = smoothstep(innerRadius, outerRadius, dist);
  let pixelSize = pow(reveal * basePixelSize, 1.5);

  // The image is pixelated everywhere but a clear window at the pointer.
  var pixelated = select(pixelate(textureUV, pixelSize, screenAspect, 0.0), textureUV, dist < innerRadius);
  pixelated = clamp(pixelated, vec2f(0.001), vec2f(0.999));

  // The headline is the inverse: sharp at rest, pixelated in the window.
  // See the GLSL for why the blocks keep one size and a hard edge.
  let typeEdge = mix(innerRadius, outerRadius, 0.9);
  let typeAa = 1.5 / resolution.x;
  let inWindow = 1.0 - smoothstep(typeEdge - typeAa, typeEdge + typeAa, dist);
  let type_ = mix(
    headlineAt(params, l, headline, samp, textureUV),
    typeBlock(l, textureUV, pow(basePixelSize, 1.5) * 0.5, screenAspect),
    inWindow * params.hover,
  );

  return over(type_, imageAt(image, samp, pixelated) * l.inFrame);
}
