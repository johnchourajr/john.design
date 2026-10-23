// WGSL port of ../shaders/loupeThree.ts (the GLSL is the WebGL fallback).
import { Params, layer, imageUv, imageAt, headlineAt, over } from "./layers.wgsl";

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var image: texture_2d<f32>;
@group(0) @binding(2) var headline: texture_2d<f32>;
@group(0) @binding(3) var samp: sampler;

// How far the portrait inside the lens blurs (in texture UV), behind the
// type, which stays sharp in front of it.
const LENS_BLUR = 0.006;

// Interleaved gradient noise: 0 to 1, a little different per pixel.
fn grain(fragCoord: vec2f) -> f32 {
  return fract(52.9829189 * fract(dot(fragCoord, vec2f(0.06711056, 0.00583715))));
}

// A disc blur of `radius` (texture UV): a golden-angle spiral of taps
// turned a little per pixel so they dissolve into grain instead of showing
// as copies, weighted toward the middle for a soft lens blur.
fn discBlur(fragCoord: vec2f, uv: vec2f, radius: f32) -> vec4f {
  let turn = 6.2831853 * grain(fragCoord);
  var color = vec4f(0.0);
  var total = 0.0;
  for (var i = 0; i < 32; i++) {
    let t = (f32(i) + 0.5) / 32.0;
    let angle = f32(i) * 2.39996 + turn;
    let weight = exp(-2.0 * t);
    color += imageAt(image, samp, uv + vec2f(cos(angle), sin(angle)) * sqrt(t) * radius) * weight;
    total += weight;
  }
  return color / total;
}

// How much the lens scales the portrait at its centre, easing back to 1 at
// the rim: under 1 shrinks it, like a concave lens. The type takes its own
// scale, enlarged, so the two play off each other.
const LENS_MAGNIFY = 0.7;
const TYPE_MAGNIFY = 1.45;
// How far each colour channel spreads around its own offset at the rim, as
// a share of the split: 0 is a hard edge, 1 a full smear.
const SPLIT_SOFT = 0.9;

@fragment fn fs_main(
  @location(0) topUv: vec2f,
  @builtin(position) position: vec4f,
) -> @location(0) vec4f {
  let l = layer(params, topUv);
  let uv = l.uv;
  let resolution = params.resolution;
  let mouse = params.mouse;
  let hover = params.hover;
  // gl_FragCoord's x and y, for the per-pixel grain. WebGPU's y runs down,
  // which only flips the grain's pattern.
  let fragCoord = position.xy;
  let screenAspect = resolution.x / resolution.y;

  let textureUV = imageUv(l, uv);

  var effectUV = uv;
  effectUV.x *= screenAspect;

  let mouseUV = vec2f(mouse.x / resolution.x * screenAspect, 1.0 - mouse.y / resolution.y);
  let dist = distance(effectUV, mouseUV) / screenAspect;

  // Sized with the other hero lenses (~0.165 of the frame's width).
  let radius = 0.165;
  let softness = 0.01;

  // Sharper edge transition
  let edge = smoothstep(radius + softness / 2.0, radius - softness / 2.0, dist);
  // Lens curvature: a convex profile, strongest at the centre and easing
  // back to true size at the rim.
  let lensCentre = imageUv(l, vec2f(mouseUV.x / screenAspect, mouseUV.y));
  let lensR = clamp(dist / radius, 0.0, 1.0);
  let lensZ = sqrt(max(0.0, 1.0 - lensR * lensR));
  let lensScale = mix(1.0, 1.0 / LENS_MAGNIFY, lensZ);
  let typeLensScale = mix(1.0, 1.0 / TYPE_MAGNIFY, lensZ);
  let magnifiedUv = mix(textureUV, lensCentre + (textureUV - lensCentre) * lensScale, edge);

  // Glass-like refraction
  let refraction = 0.3;
  var normalizedDir = normalize(effectUV - mouseUV);
  normalizedDir.x /= screenAspect;

  // A sharper transition for edge effects: a clear centre.
  let innerRadius = radius * 0.9;
  let edgeStrength = smoothstep(innerRadius, radius, dist);

  // The ripple only affects the edges
  let ripple = sin(dist * 30.0) * 0.02 * edgeStrength;
  let distortedUV = magnifiedUv + normalizedDir * ripple * refraction * edgeStrength;

  // Chromatic aberration only on edges
  let chromatic = 0.008;
  let redOffset = mix(distortedUV, distortedUV + normalizedDir * chromatic, edgeStrength);
  let blueOffset = mix(distortedUV, distortedUV - normalizedDir * chromatic, edgeStrength);

  // Edge sampling with offset correction
  var edgeOffset = vec2f(0.0);
  if (distortedUV.x < 0.0) { edgeOffset.x = -distortedUV.x; }
  if (distortedUV.x > 1.0) { edgeOffset.x = 1.0 - distortedUV.x; }
  if (distortedUV.y < 0.0) { edgeOffset.y = -distortedUV.y; }
  if (distortedUV.y > 1.0) { edgeOffset.y = 1.0 - distortedUV.y; }

  let correctedUV = distortedUV + edgeOffset;
  let redOffsetCorrected = redOffset + edgeOffset;
  let blueOffsetCorrected = blueOffset + edgeOffset;

  // Each channel averages four samples spread along the split, shifted a
  // little per pixel, so the fringes are soft gradients rather than
  // hard-edged copies.
  let jitter = grain(fragCoord) - 0.5;
  let spread = normalizedDir * chromatic * edgeStrength * SPLIT_SOFT;
  var redChannel = vec4f(0.0);
  var greenChannel = vec4f(0.0);
  var blueChannel = vec4f(0.0);
  for (var i = 0; i < 4; i++) {
    let offsetStep = spread * ((f32(i) + 0.5) / 4.0 - 0.5 + jitter * 0.25) * 2.0;
    redChannel += imageAt(image, samp, redOffsetCorrected + offsetStep);
    greenChannel += imageAt(image, samp, correctedUV + offsetStep);
    blueChannel += imageAt(image, samp, blueOffsetCorrected + offsetStep);
  }
  redChannel *= 0.25;
  greenChannel *= 0.25;
  blueChannel *= 0.25;

  // Fade out near edges
  let edgeFade = 1.0 - smoothstep(0.0, 0.1, length(edgeOffset));

  // The blur comes with the hover: the portrait is sharp until the pointer
  // arrives.
  let clearColor = discBlur(fragCoord, magnifiedUv + edgeOffset, LENS_BLUR * hover);
  let chromaticColor = vec4f(redChannel.r, greenChannel.g, blueChannel.b, 1.0);
  let magnifiedColor = mix(clearColor, chromaticColor, edgeStrength) * edgeFade;

  // Outside the lens the portrait stays as it is: the blur is only the
  // lens's.
  let outsideColor = imageAt(image, samp, textureUV);

  var finalColor = mix(outsideColor, magnifiedColor, edge);

  // Subtle inner shadow only
  let innerShadow = smoothstep(radius - softness / 2.0, radius, dist) * 0.2;
  finalColor *= 1.0 - (innerShadow * edge);

  // The headline goes through the same lens, as far as the hover reaches.
  // The edge corrections and the blur belong to the image: the type stays
  // sharp outside the lens.
  let typeEdge = edge * hover;
  let typeMagnified = mix(textureUV, lensCentre + (textureUV - lensCentre) * typeLensScale, typeEdge);
  let typeDistorted = typeMagnified + normalizedDir * ripple * refraction * edgeStrength;
  var redType = vec4f(0.0);
  var greenType = vec4f(0.0);
  var blueType = vec4f(0.0);
  for (var i = 0; i < 4; i++) {
    let offsetStep = spread * ((f32(i) + 0.5) / 4.0 - 0.5 + jitter * 0.25) * 2.0;
    redType += headlineAt(params, l, headline, samp, typeDistorted + normalizedDir * chromatic * edgeStrength + offsetStep);
    greenType += headlineAt(params, l, headline, samp, typeDistorted + offsetStep);
    blueType += headlineAt(params, l, headline, samp, typeDistorted - normalizedDir * chromatic * edgeStrength + offsetStep);
  }
  redType *= 0.25;
  greenType *= 0.25;
  blueType *= 0.25;
  let chromaticType = vec4f(
    redType.r,
    greenType.g,
    blueType.b,
    max(redType.a, max(greenType.a, blueType.a)),
  );
  let magnifiedType = mix(headlineAt(params, l, headline, samp, typeMagnified), chromaticType, edgeStrength);
  var type_ = mix(headlineAt(params, l, headline, samp, textureUV), magnifiedType, typeEdge);
  type_ *= 1.0 - (innerShadow * typeEdge);

  return over(type_, finalColor * l.inFrame);
}
