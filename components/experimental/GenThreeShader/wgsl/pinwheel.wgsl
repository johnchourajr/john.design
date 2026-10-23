// WGSL port of ../shaders/pinwheelShader.ts (the GLSL is the WebGL fallback).
import { GenParams } from "./gen.wgsl";

@group(0) @binding(0) var<uniform> params: GenParams;

@fragment fn fs_main(@location(0) topUv: vec2f) -> @location(0) vec4f {
  let vUv = vec2f(topUv.x, 1.0 - topUv.y);
  let time = params.time;
  let rotationSpeed = params.rotationSpeed;

  // Center the coordinates
  let uv = vUv - 0.5;
  let dist = length(uv);
  let angle = atan2(uv.y, uv.x);

  // Create vortex effect
  let twist = angle + dist * params.vortexStrength + time * rotationSpeed;

  // Create pinwheel color pattern
  let pinwheelColor = vec3f(0.5) + vec3f(0.5) * vec3f(
    cos(twist + time),
    cos(twist + time * 0.3 + 2.0),
    cos(twist + time * 0.5 + 4.0),
  );

  // Create outer area pattern
  let outerAngle = angle * 4.0 + time * rotationSpeed * 0.5;
  let outerColor = vec3f(0.5) + vec3f(0.5) * vec3f(
    sin(outerAngle),
    sin(outerAngle + 2.0),
    sin(outerAngle + 4.0),
  );

  // Smooth transition between inner and outer areas
  let transitionStart = 0.3;
  let transitionEnd = 0.7;
  let blend = smoothstep(transitionStart, transitionEnd, dist);

  // Mix colors based on distance
  var color = mix(pinwheelColor, outerColor, blend);

  // Apply color intensity and fade
  color *= params.colorIntensity;

  // Add mouse interaction
  let mouseDistance = length(uv - (params.mouse - 0.5));
  let mouseFade = 1.0 - smoothstep(0.0, 0.2, mouseDistance);
  color += vec3f(mouseFade * 0.3);

  return vec4f(color, 1.0);
}
