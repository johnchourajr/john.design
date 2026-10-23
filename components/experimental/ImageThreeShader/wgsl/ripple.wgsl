// WGSL port of ../shaders/rippleThree.ts (the GLSL is the WebGL fallback).
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

  let radius = 0.2;
  let falloff = 0.05;
  let distortionStrength = smoothstep(radius, radius - falloff, dist);

  var direction = normalize(effectUV - mouseUV);
  direction.x /= screenAspect;  // Correct the direction aspect ratio

  // Create waves that follow the cursor
  let wave = sin(dist * 60.0 - time * 2.5) * 0.3 * distortionStrength;

  let newUV = textureUV + direction * wave;

  return select(imageAt(image, samp, newUV), vec4f(0.0), outside(newUV));
}
