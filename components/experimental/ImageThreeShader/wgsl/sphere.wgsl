// WGSL port of ../shaders/sphereThree.ts (the GLSL is the WebGL fallback).
import { Params, layer, imageUv, imageAt, headlineAt, over } from "./layers.wgsl";

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var image: texture_2d<f32>;
@group(0) @binding(2) var headline: texture_2d<f32>;
@group(0) @binding(3) var samp: sampler;

// The type's depth-of-field blur inside the sphere: taps, and the disc's
// radius as a share of the type's font size, so it looks the same at every
// size the type steps to.
const BLUR_TAPS = 64;
const BLUR_EM = 0.19;
// How much the ball enlarges the type at its centre, easing back to 1 at
// its rim so the type meets the type outside.
const TYPE_MAGNIFY = 1.6;
// How far each colour channel of the portrait spreads around its own
// offset, as a share of the split: 0 is a hard edge, 1 a full smear.
const SPLIT_SOFT = 0.8;

// Interleaved gradient noise: 0 to 1, a little different per pixel.
fn grain(fragCoord: vec2f) -> f32 {
  return fract(52.9829189 * fract(dot(fragCoord, vec2f(0.06711056, 0.00583715))));
}

@fragment fn fs_main(
  @location(0) topUv: vec2f,
  @builtin(position) position: vec4f,
) -> @location(0) vec4f {
  let l = layer(params, topUv);
  let uv = l.uv;
  let resolution = params.resolution;
  let mouse = params.mouse;
  let time = params.time;
  let hover = params.hover;
  // gl_FragCoord's x and y, for the per-pixel grain. WebGPU's y runs down,
  // which only flips the grain's pattern.
  let fragCoord = position.xy;
  let screenAspect = resolution.x / resolution.y;

  let textureUV = imageUv(l, uv);

  var effectUV = uv;
  effectUV.x *= screenAspect;

  // Glass sphere parameters
  let radius = 0.165;
  let padding = radius + 0.02;

  // Clamp the mouse to keep the sphere inside the canvas. A headline on its
  // own has no image to keep it inside, so the sphere reaches every letter.
  var mouseUV = vec2f(mouse.x / resolution.x * screenAspect, 1.0 - mouse.y / resolution.y);
  if (params.hideImage < 0.5) {
    mouseUV.x = clamp(mouseUV.x, padding * screenAspect, screenAspect - padding * screenAspect);
    mouseUV.y = clamp(mouseUV.y, padding, 1.0 - padding);
  }

  let mouseTextureUV = vec2f(mouseUV.x / screenAspect, mouseUV.y);
  let dist = distance(effectUV, mouseUV) / screenAspect;
  let edgeSoftness = 0.005;

  // Smooth edge mask
  let sphereMask = smoothstep(radius + edgeSoftness, radius - edgeSoftness, dist);

  // Outside the sphere, just the image.
  let outsideColor = imageAt(image, samp, textureUV) * l.inFrame;
  let restingType = headlineAt(params, l, headline, samp, textureUV);
  if (sphereMask < 0.01) {
    return over(restingType, outsideColor);
  }

  // Direction from the sphere's centre
  var dir = effectUV - mouseUV;
  dir.x /= screenAspect;
  let normDir = select(vec2f(0.0), normalize(dir), length(dir) > 0.001);

  // Distance within the sphere, 0 to 1
  let normalizedDist = clamp(dist / radius, 0.0, 1.0);

  // Spherical depth
  let z = sqrt(max(0.0, 1.0 - normalizedDist * normalizedDist));
  let normal = normalize(vec3f(normDir * normalizedDist, z));

  // Glass ball refraction: the centre is clearer, the edges distort more.
  let sphereCenter = mouseTextureUV;
  let toPixel = textureUV - sphereCenter;

  // Refraction grows toward the edges (z = 1 at the centre, 0 at the rim).
  let edgeFactor = 1.0 - z;
  let refractionStrength = edgeFactor * edgeFactor * 0.12;

  // Slight magnification in the centre, compression at the edges
  let magnification = 1.0 + z * 0.08 - edgeFactor * 0.15;
  var sphereUV = sphereCenter + toPixel * magnification;

  // Refraction pushing outward at the edges
  sphereUV += normDir * refractionStrength;

  // Gentle oscillating variation
  let oscillation = sin(time * 0.8) * 0.5 + 0.5;
  let oscillateStrength = mix(0.01, 0.02, oscillation) * edgeFactor;
  sphereUV += normDir * oscillateStrength;

  // Chromatic aberration
  let chromatic = (1.0 - z) * 0.008;
  let redUV = sphereUV + normDir * chromatic;
  let blueUV = sphereUV - normDir * chromatic;

  // Each channel averages four samples spread along the split around its
  // own offset, shifted a little per pixel, so the fringes soften into
  // gradients instead of hard-edged copies.
  let jitter = grain(fragCoord) - 0.5;
  let spread = normDir * chromatic * SPLIT_SOFT;
  var redChannel = vec4f(0.0);
  var greenChannel = vec4f(0.0);
  var blueChannel = vec4f(0.0);
  for (var i = 0; i < 4; i++) {
    let offsetStep = spread * ((f32(i) + 0.5) / 4.0 - 0.5 + jitter * 0.25) * 2.0;
    redChannel += imageAt(image, samp, redUV + offsetStep);
    greenChannel += imageAt(image, samp, sphereUV + offsetStep);
    blueChannel += imageAt(image, samp, blueUV + offsetStep);
  }
  redChannel *= 0.25;
  greenChannel *= 0.25;
  blueChannel *= 0.25;

  var sphereColor = vec4f(redChannel.r, greenChannel.g, blueChannel.b, 1.0);

  // Lighting: the highlight follows the cursor, lit from the top left.
  let cursorOffset = (mouseTextureUV - 0.5) * 0.4;
  let lightDir = normalize(vec3f(-0.7 - cursorOffset.x, 0.8 + cursorOffset.y, 0.5));
  let viewDir = vec3f(0.0, 0.0, 1.0);
  let halfVec = normalize(lightDir + viewDir);

  // Fresnel: the edges are brighter, more reflective.
  let fresnel = pow(1.0 - z, 3.0);

  // Specular highlight
  let specular = pow(max(0.0, dot(normal, halfVec)), 48.0) * 0.2;

  // Rim light
  let rim = fresnel * 0.2;

  sphereColor = vec4f(sphereColor.rgb + specular + rim * vec3f(0.95, 0.97, 1.0), sphereColor.a);

  // Slight darkening at the edges (depth)
  sphereColor = vec4f(sphereColor.rgb * (0.9 + z * 0.1), sphereColor.a);

  // Blend with the smooth edge
  let imageColor = mix(outsideColor, sphereColor * l.inFrame, sphereMask);

  // The type reads as the near side of the glass, out of focus: the
  // refracted type, blurred, inside exactly the portrait's silhouette
  // (sphereMask), so the two share one edge. A golden-angle spiral, turned
  // a little per pixel and weighted toward the centre, gives a soft lens
  // blur. The type goes through a ball lens of its own: enlarged at the
  // centre and easing back to true size at the rim.
  let typeUV = sphereCenter + toPixel * mix(1.0 / TYPE_MAGNIFY, 1.0, edgeFactor * edgeFactor);
  var blurredType = vec4f(0.0);
  var blurWeight = 0.0;
  // In the type's own space, which the lens enlarges: divided back so the
  // blur is as wide on screen as BLUR_EM says.
  let blurRadius = BLUR_EM * params.headlineEm / resolution.y / TYPE_MAGNIFY;
  let turn = 6.2831853 * grain(fragCoord);
  for (var i = 0; i < BLUR_TAPS; i++) {
    let t = (f32(i) + 0.5) / f32(BLUR_TAPS);
    let angle = f32(i) * 2.39996 + turn;
    var offset = vec2f(cos(angle), sin(angle)) * sqrt(t) * blurRadius;
    offset.x /= screenAspect;
    let weight = exp(-2.0 * t);
    blurredType += headlineAt(params, l, headline, samp, typeUV + offset) * weight;
    blurWeight += weight;
  }
  blurredType /= blurWeight;
  blurredType = vec4f(blurredType.rgb * (0.9 + z * 0.1), blurredType.a);
  let type_ = mix(restingType, blurredType, sphereMask * hover);

  return over(type_, imageColor);
}
