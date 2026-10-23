// WGSL port of ../shaders/kaleidoscopeShader.ts (the GLSL is the WebGL fallback).
import { GenParams } from "./gen.wgsl";
import { snoise } from "./simplex.wgsl";

@group(0) @binding(0) var<uniform> params: GenParams;

@fragment fn fs_main(@location(0) topUv: vec2f) -> @location(0) vec4f {
  let vUv = vec2f(topUv.x, 1.0 - topUv.y);
  let uv = vUv;
  let noiseScale = params.noiseScale;
  let patternScale = params.patternScale;
  let warpIntensity = params.warpIntensity;
  let colorIntensity = params.colorIntensity;

  // Enhanced kaleidoscopic effect with variable segments
  var kaleidoUv = uv - 0.5;
  var angle = atan2(kaleidoUv.y, kaleidoUv.x);
  let radius = length(kaleidoUv);
  // GLSL mod: floored, so negative angles wrap positive.
  let turn = 3.14159 * 2.0;
  let segmented = angle * params.kaleidoSegments;
  angle = segmented - turn * floor(segmented / turn);
  kaleidoUv = vec2f(cos(angle), sin(angle)) * radius + 0.5;

  // Time-based animation controlled by motion speed
  let animTime = params.time * params.motionSpeed;

  // Scale-controlled noise layers
  let n1 = snoise(kaleidoUv * noiseScale * patternScale + animTime * 0.2);
  let n2 = snoise(kaleidoUv * (noiseScale * 1.4 * patternScale) - animTime * 0.15);
  let n3 = snoise(kaleidoUv * (noiseScale * 2.1 * patternScale) + animTime * 0.1);
  let n4 = snoise(uv * (noiseScale * 3.5 * patternScale) - animTime * 0.08);

  // Dynamic diffusion based on warp intensity
  let diffusion = snoise((kaleidoUv + sin(animTime * 0.5) * warpIntensity) * noiseScale);

  var finalNoise = n1 * 0.4 + n2 * 0.3 + n3 * 0.2 + n4 * 0.1;

  // Warping controlled by warp intensity
  finalNoise = mix(finalNoise, diffusion, warpIntensity * sin(animTime * 0.5));

  // Color generation with intensity control
  let color1 = vec3f(
    0.5 + 0.5 * sin(animTime + finalNoise * 5.0),
    0.5 + 0.5 * sin(animTime * 0.85 + finalNoise * 6.0 + 2.0),
    0.5 + 0.5 * sin(animTime * 0.7 + finalNoise * 7.0 + 4.0),
  );

  let colorMix = mix(vec3f(0.5), color1, colorIntensity);

  var finalColor = colorMix * (0.8 + 0.2 * finalNoise);

  // Interactive highlight
  let highlight = 0.15 / (length(uv - params.mouse) + 0.2);
  finalColor += vec3f(highlight * 0.3) * colorIntensity;

  return vec4f(finalColor, 1.0);
}
