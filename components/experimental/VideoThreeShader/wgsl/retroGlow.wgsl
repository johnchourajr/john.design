// WGSL port of ../shaders/retroGlowShader.ts (the GLSL is the WebGL fallback).
import { Params, imageAt } from "../../ImageThreeShader/wgsl/layers.wgsl";

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var image: texture_2d<f32>;
@group(0) @binding(3) var samp: sampler;

fn neon(vUv: vec2f, color: vec4f, intensity: f32) -> vec4f {
  let time = params.time;
  let mouse = params.mouse;
  let resolution = params.resolution;
  var neonColor = vec3f(0.0);
  let brightness = dot(color.rgb, vec3f(0.299, 0.587, 0.114));

  // Enhanced pink-purple glow for bright areas
  neonColor += vec3f(1.0, 0.2, 0.8) * pow(brightness, 1.1);
  // Enhanced blue glow for mid tones
  neonColor += vec3f(0.2, 0.4, 1.0) * pow(brightness, 1.3);

  // Increased pulse effect
  let pulse = (sin(time * 6.0) * 0.5 + 0.5) * 0.9;

  // Glow around the pointer. The mouse is in NDC (-1 to 1, y up), so it
  // maps straight onto vUv. Distances are in canvas widths, with x scaled
  // by the aspect ratio so the glow stays round.
  let screenAspect = resolution.x / resolution.y;
  let effectUV = vec2f(vUv.x * screenAspect, vUv.y);
  var mouseUV = mouse * 0.5 + 0.5;
  mouseUV.x *= screenAspect;
  let mouseDistance = distance(effectUV, mouseUV) / screenAspect;
  let mouseGlow = (1.0 - smoothstep(0.0, 0.2, mouseDistance)) * 0.7;

  // A base glow the look was tuned with (see the GLSL, #103); the pointer
  // adds to it.
  let baseGlow = 0.7;

  // Combine effects with wash out
  var finalColor = mix(color.rgb, neonColor, intensity + baseGlow + pulse + mouseGlow);
  finalColor = mix(finalColor, vec3f(1.0), 0.05);

  // Add scanlines
  let scanline = sin(vUv.y * 200.0) * 0.02;
  finalColor *= (1.0 - scanline);

  // Add chromatic aberration
  let aberration = 0.003;
  let r = imageAt(image, samp, vUv + vec2f(aberration, 0.0));
  let b = imageAt(image, samp, vUv - vec2f(aberration, 0.0));
  finalColor.r = mix(finalColor.r, r.r, 0.5);
  finalColor.b = mix(finalColor.b, b.b, 0.5);

  return vec4f(finalColor, color.a);
}

@fragment fn fs_main(@location(0) topUv: vec2f) -> @location(0) vec4f {
  let vUv = vec2f(topUv.x, 1.0 - topUv.y);
  let color = imageAt(image, samp, vUv);
  return neon(vUv, color, 0.4);
}
