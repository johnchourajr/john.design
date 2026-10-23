// WGSL port of ../shaders/spaceTimeShader.ts (the GLSL is the WebGL fallback).
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
  let animTime = params.time * params.motionSpeed;

  // Create spiral coordinates
  let angle = atan2(uv.y - 0.5, uv.x - 0.5);
  let dist = length(uv - 0.5);

  // Spiral warping
  let spiral = angle * params.kaleidoSegments + dist * 10.0 * patternScale + animTime;
  let warpedUv = vec2f(cos(spiral) * dist + 0.5, sin(spiral) * dist + 0.5);

  // Layer multiple noise patterns
  let n1 = snoise(warpedUv * noiseScale * patternScale + animTime * 0.3);
  let n2 = snoise(warpedUv * (noiseScale * 2.0 * patternScale) - animTime * 0.2);
  let n3 = snoise(uv * (noiseScale * 3.0 * patternScale) + animTime * 0.1);

  // Combine noise with warping
  let finalNoise = (n1 * 0.5 + n2 * 0.3 + n3 * 0.2) * warpIntensity;

  // Create dynamic color pattern
  let color1 = vec3f(
    0.5 + 0.5 * sin(finalNoise * 3.0 + animTime),
    0.5 + 0.5 * sin(finalNoise * 4.0 + animTime * 1.2 + 2.0),
    0.5 + 0.5 * sin(finalNoise * 5.0 + animTime * 0.8 + 4.0),
  );

  // Add spiral highlights
  let highlight = 0.5 + 0.5 * sin(spiral * 0.5);
  let spaceColor = mix(color1, vec3f(highlight), 0.3 * warpIntensity);

  // Apply color intensity
  var finalColor = mix(vec3f(0.5), spaceColor, colorIntensity);

  // Add mouse interaction highlight
  let mouseGlow = 0.15 / (length(uv - params.mouse) + 0.2);
  finalColor += vec3f(mouseGlow * 0.3) * colorIntensity;

  return vec4f(finalColor, 1.0);
}
