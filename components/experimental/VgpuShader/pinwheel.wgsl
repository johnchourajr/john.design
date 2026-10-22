// WGSL port of components/experimental/GenThreeShader/shaders/pinwheelShader.ts
// (proof of concept for vgpu; the GLSL original stays the WebGL fallback).

struct Params {
  time: f32,
  rotationSpeed: f32,
  vortexStrength: f32,
  colorIntensity: f32,
  // Normalized pointer position, bottom-origin like the GLSL vUv.
  mouse: vec2f,
}

@group(0) @binding(0) var<uniform> params: Params;

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  // vgpu's fullscreen uv is top-origin; flip once so the pattern matches the
  // GLSL version, whose vUv grows upward.
  let p = vec2f(uv.x, 1.0 - uv.y) - 0.5;
  let dist = length(p);
  let angle = atan2(p.y, p.x);
  let t = params.time;

  // Vortex twist
  let twist = angle + dist * params.vortexStrength + t * params.rotationSpeed;

  // Inner pinwheel colors
  let pinwheelColor = vec3f(0.5) + vec3f(0.5) * cos(vec3f(
    twist + t,
    twist + t * 0.3 + 2.0,
    twist + t * 0.5 + 4.0,
  ));

  // Outer area pattern
  let outerAngle = angle * 4.0 + t * params.rotationSpeed * 0.5;
  let outerColor = vec3f(0.5) + vec3f(0.5) * sin(vec3f(
    outerAngle,
    outerAngle + 2.0,
    outerAngle + 4.0,
  ));

  // Smooth transition between inner and outer areas
  let blend = smoothstep(0.3, 0.7, dist);
  var color = mix(pinwheelColor, outerColor, blend) * params.colorIntensity;

  // Pointer highlight
  let mouseDistance = length(p - (params.mouse - 0.5));
  let mouseFade = 1.0 - smoothstep(0.0, 0.2, mouseDistance);
  color += vec3f(mouseFade * 0.3);

  return vec4f(color, 1.0);
}
