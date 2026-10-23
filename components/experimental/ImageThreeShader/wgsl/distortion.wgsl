// WGSL port of ../shaders/distortionThree.ts (the GLSL is the WebGL fallback).
import { Params, layer, imageUv, imageAt, headlineAt, over } from "./layers.wgsl";

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var image: texture_2d<f32>;
@group(0) @binding(2) var headline: texture_2d<f32>;
@group(0) @binding(3) var samp: sampler;

@fragment fn fs_main(@location(0) topUv: vec2f) -> @location(0) vec4f {
  let l = layer(params, topUv);
  let uv = l.uv;
  let resolution = params.resolution;
  let mouse = params.mouse;
  let time = params.time;
  let screenAspect = resolution.x / resolution.y;

  let textureUV = imageUv(l, uv);

  var effectUV = uv;
  effectUV.x *= screenAspect;

  let mouseUV = vec2f(mouse.x / resolution.x * screenAspect, 1.0 - mouse.y / resolution.y);
  let dist = distance(effectUV, mouseUV) / screenAspect;
  // Sized with the other hero lenses: the falloff reaches 0.25 so the
  // visible core spans ~0.165 of the frame's width.
  let strength = smoothstep(0.25, 0.0, dist);
  var displacement = normalize(effectUV - mouseUV) * strength * 0.1;
  displacement.x /= screenAspect;

  let noise = fract(sin(dot(effectUV, vec2f(1.0, 78.233))) * 43758.5453);
  let pos = textureUV + displacement * noise * sin(time) * 1.5;

  let outside = pos.x < 0.0 || pos.x > 1.0 || pos.y < 0.0 || pos.y > 1.0;
  let imageColor = select(imageAt(image, samp, pos), vec4f(0.0), outside);

  // The type scatters the same way, but never fades to nothing as
  // sin(time) crosses zero, so a hover always shows.
  let typePulse = 0.75 + 0.25 * sin(time);
  let typePos = textureUV + displacement * noise * typePulse * 1.5 * params.hover;
  return over(headlineAt(params, l, headline, samp, typePos), imageColor * l.inFrame);
}
