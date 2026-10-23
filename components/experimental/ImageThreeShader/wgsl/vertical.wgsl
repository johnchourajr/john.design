// WGSL port of ../shaders/verticalThree.ts (the GLSL is the WebGL fallback).
import { Params, Layer, layer, imageUv, imageAt, headlineAt, over, overSplit } from "./layers.wgsl";

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var image: texture_2d<f32>;
@group(0) @binding(2) var headline: texture_2d<f32>;
@group(0) @binding(3) var samp: sampler;

// The type's wave height (in frame heights) at the middle of the hover.
// It ripples in step with the portrait's flutes; see fs_main.
const TYPE_AMPLITUDE = 0.005;
// How round and blobby the type goes at the middle of the hover, as a share
// of its font size, so it looks the same at every size; its edges stay crisp.
const TYPE_ROUND_EM = 0.135;
// How far the type's dithered blur reaches right under the pointer, as a
// share of its font size; it fades to nothing at the effect's edge.
const TYPE_DITHER_EM = 0.035;
// How far the type's colours split right under the pointer, as a share of
// its font size; like the grain, it fades to nothing at the edge.
const TYPE_SPLIT_EM = 0.03;

// The headline with its corners rounded: blurred over a disc of radius `r`
// (six rings of sixteen taps), then cut back to a crisp edge at half
// coverage. Straight edges land where they were; a corner pulls in round.
fn roundType(l: Layer, at: vec2f, r: vec2f) -> vec4f {
  var sum = headlineAt(params, l, headline, samp, at) * 1.5;
  var total = 1.5;
  for (var ring = 1; ring <= 6; ring++) {
    let radius = f32(ring) / 6.0;
    let weight = 1.25 - radius;
    for (var i = 0; i < 16; i++) {
      let a = (f32(i) + f32(ring) * 0.37) * 0.3926991;
      sum += headlineAt(params, l, headline, samp, at + vec2f(cos(a), sin(a)) * r * radius) * weight;
      total += weight;
    }
  }
  let blurred = sum / total;
  if (blurred.a < 0.0001) { return vec4f(0.0); }
  // About 0.7 CSS px of antialiasing (the blurred edge ramps over ~2r).
  let aa = clamp(0.18 / (r.y * params.resolution.y), 0.01, 0.5);
  let alpha = smoothstep(0.5 - aa, 0.5 + aa, blurred.a);
  // Premultiplied: the type's own colour at the new coverage.
  return vec4f(blurred.rgb / blurred.a * alpha, alpha);
}

fn sharpenWave(x: f32, power: f32) -> f32 {
  return pow(0.5 + 0.5 * sin(x), power) * 2.0 - 1.0;
}

@fragment fn fs_main(
  @location(0) topUv: vec2f,
  @builtin(position) fragCoord: vec4f,
) -> @location(0) vec4f {
  let l = layer(params, topUv);
  let uv = l.uv;
  let resolution = params.resolution;
  let mouse = params.mouse;
  let time = params.time;
  let hover = params.hover;
  let screenAspect = resolution.x / resolution.y;

  let textureUV = imageUv(l, uv);

  var effectUV = uv;
  effectUV.x *= screenAspect;

  let mouseUV = vec2f(mouse.x / resolution.x * screenAspect, 1.0 - mouse.y / resolution.y);
  let dist = distance(effectUV, mouseUV) / screenAspect;

  // Sized with the other hero lenses: the edge centred on ~0.165 of the
  // frame's width.
  let radius = 0.19;
  let falloff = 0.05;
  let distortionStrength = 0.02 * smoothstep(radius, radius - falloff, dist);

  let flutes = 300.0;
  let sharpness = 0.5;
  let baseWave = sharpenWave(effectUV.x * flutes + time * 0.2, sharpness);
  let detailWave = sharpenWave(effectUV.x * flutes * 1.25 + time * 0.1, sharpness);

  let wave = (baseWave + detailWave * 0.35) * distortionStrength;

  var direction = normalize(effectUV - mouseUV);
  direction.x /= screenAspect;
  let distortedUV = textureUV + direction * wave;

  // Chromatic aberration
  let chromaticOffset = 0.015;
  let redOffset = distortedUV + vec2f(wave * chromaticOffset, 0.0);
  let blueOffset = distortedUV - vec2f(wave * chromaticOffset, 0.0);

  // The image is opaque inside its bounds and clear outside them.
  let outside = distortedUV.x < 0.0 || distortedUV.x > 1.0 || distortedUV.y < 0.0 || distortedUV.y > 1.0;
  let imageAlpha = select(l.inFrame, 0.0, outside);
  let imageColor = vec3f(
    imageAt(image, samp, redOffset).r,
    imageAt(image, samp, distortedUV).g,
    imageAt(image, samp, blueOffset).b,
  ) * imageAlpha;

  // The type ripples where the portrait flutes, as far as the hover
  // reaches: a smooth, broad wave, straight up and down. Its corners round
  // off as it goes, with crisp edges. Rounding is costly, so it runs once.
  let reachType = smoothstep(radius, radius - falloff, dist);
  let rounding = reachType * hover;
  // In step with the portrait's base flutes, but smooth.
  let typeWave = sin(effectUV.x * flutes + time * 0.2) * TYPE_AMPLITUDE * rounding;
  let typeUV = textureUV + vec2f(0.0, typeWave);
  let type_ = headlineAt(params, l, headline, samp, typeUV);
  // The rounding grows with the reach and fades in from the plain type, so
  // there's no seam where the hover begins.
  if (rounding > 0.001) {
    // The font size in frame heights (resolution is the frame in CSS px).
    let em = params.headlineEm / resolution.y;
    let roundR = TYPE_ROUND_EM * em * max(rounding, 0.25) * vec2f(1.0 / screenAspect, 1.0);
    // A slight dithered blur: each pixel reads the rounded type from a
    // touch off its own spot, at random. An even hash, so no pattern shows.
    var p3 = fract(fragCoord.xyx * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    let grain = fract((p3.xx + p3.yz) * p3.zy) * 2.0 - 1.0;
    // It builds from nothing at the edge of the effect to the most right
    // under the pointer.
    let toCentre = clamp(1.0 - dist / radius, 0.0, 1.0);
    let ditherAmount = toCentre * toCentre * hover;
    let dither = grain * TYPE_DITHER_EM * em * ditherAmount * vec2f(1.0 / screenAspect, 1.0);
    // The colours split sideways, red one way and blue the other.
    let split = vec2f(TYPE_SPLIT_EM * em * ditherAmount / screenAspect, 0.0);
    let fadeIn = smoothstep(0.0, 0.35, rounding);
    let plain = type_;
    return overSplit(
      mix(plain, roundType(l, typeUV + dither + split, roundR), fadeIn),
      mix(plain, roundType(l, typeUV + dither, roundR), fadeIn),
      mix(plain, roundType(l, typeUV + dither - split, roundR), fadeIn),
      vec4f(imageColor, imageAlpha),
    );
  }

  return over(type_, vec4f(imageColor, imageAlpha));
}
