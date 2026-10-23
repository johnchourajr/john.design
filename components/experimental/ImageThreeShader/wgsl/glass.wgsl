// WGSL port of ../shaders/glassThree.ts (the GLSL is the WebGL fallback).
import { Params, layer, imageAt } from "./layers.wgsl";

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var image: texture_2d<f32>;
// Unused here, but every image variant shares the one binding layout.
@group(0) @binding(2) var headline: texture_2d<f32>;
@group(0) @binding(3) var samp: sampler;

// The image fitted to the canvas, as the GLSL does it (no layers frame).
fn fitUv(uv: vec2f, imageAspect: f32, screenAspect: f32) -> vec2f {
  var textureUV = uv;
  if (screenAspect < imageAspect) {
    let scale = screenAspect / imageAspect;
    textureUV.x = (uv.x - 0.5) / scale + 0.5;
  } else {
    let scale = imageAspect / screenAspect;
    textureUV.y = (uv.y - 0.5) / scale + 0.5;
  }
  return textureUV;
}

fn outside(p: vec2f) -> bool {
  return p.x < 0.0 || p.x > 1.0 || p.y < 0.0 || p.y > 1.0;
}

@fragment fn fs_main(@location(0) topUv: vec2f) -> @location(0) vec4f {
  let l = layer(params, topUv);
  let uv = l.vUv;
  let resolution = params.resolution;
  let mouse = params.mouse;
  let time = params.time;
  let imageResolution = params.imageResolution;

  let imageAspect = imageResolution.x / imageResolution.y;
  let screenAspect = resolution.x / resolution.y;

  // Aspect-corrected UV for texture sampling
  let textureUV = fitUv(uv, imageAspect, screenAspect);

  var effectUV = uv;
  effectUV.x *= screenAspect;

  let mouseUV = vec2f(mouse.x / resolution.x * screenAspect, 1.0 - mouse.y / resolution.y);
  let dist = distance(effectUV, mouseUV) / screenAspect;

  // Glass refraction effect
  let radius = 0.18;
  let strength = smoothstep(radius, 0.0, dist);

  // Direction from mouse to pixel
  var dir = normalize(effectUV - mouseUV);
  dir.x /= screenAspect;

  // Thick glass refraction: bends light toward center
  let refraction = strength * 0.08;
  let edgeBend = pow(dist / radius, 2.0) * strength;

  let refractedUV = textureUV - dir * refraction * (1.0 - edgeBend);

  // Subtle chromatic aberration at edges
  let chromatic = strength * 0.006 * (1.0 - strength);
  let redUV = refractedUV + dir * chromatic;
  let blueUV = refractedUV - dir * chromatic;

  let redChannel = imageAt(image, samp, redUV);
  let greenChannel = imageAt(image, samp, refractedUV);
  let blueChannel = imageAt(image, samp, blueUV);

  // Subtle brightness boost in center (caustic-like)
  let caustic = pow(strength, 3.0) * 0.15;
  let color = vec4f(vec3f(redChannel.r, greenChannel.g, blueChannel.b) + caustic, 1.0);

  return select(color, vec4f(0.0), outside(refractedUV));
}
