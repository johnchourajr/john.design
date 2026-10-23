// WGSL port of ../shaders/edgeDetectThree.ts (the GLSL is the WebGL fallback).
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
  let strength = smoothstep(0.3, 0.0, dist);

  // Sobel edge detection
  let texelSize = vec2f(1.0 / imageResolution.x, 1.0 / imageResolution.y);

  // Sample surrounding pixels
  let topLeft = imageAt(image, samp, textureUV + vec2f(-texelSize.x, -texelSize.y));
  let top = imageAt(image, samp, textureUV + vec2f(0.0, -texelSize.y));
  let topRight = imageAt(image, samp, textureUV + vec2f(texelSize.x, -texelSize.y));
  let left = imageAt(image, samp, textureUV + vec2f(-texelSize.x, 0.0));
  let right = imageAt(image, samp, textureUV + vec2f(texelSize.x, 0.0));
  let bottomLeft = imageAt(image, samp, textureUV + vec2f(-texelSize.x, texelSize.y));
  let bottom = imageAt(image, samp, textureUV + vec2f(0.0, texelSize.y));
  let bottomRight = imageAt(image, samp, textureUV + vec2f(texelSize.x, texelSize.y));

  // Calculate gradients
  let gx = -topLeft.r - 2.0 * left.r - bottomLeft.r + topRight.r + 2.0 * right.r + bottomRight.r;
  let gy = -topLeft.r - 2.0 * top.r - topRight.r + bottomLeft.r + 2.0 * bottom.r + bottomRight.r;

  let edge = clamp(sqrt(gx * gx + gy * gy) * 3.0, 0.0, 1.0);

  let originalColor = imageAt(image, samp, textureUV);

  // Mix edge detection with original based on mouse distance
  let edgeColor = vec4f(edge, edge, edge, 1.0);
  let mixed = mix(originalColor, edgeColor, strength * 0.7);

  // Add color to edges
  return vec4f(mix(mixed.rgb, vec3f(1.0, 1.0, 0.0), edge * strength * 0.3), mixed.a);
}
