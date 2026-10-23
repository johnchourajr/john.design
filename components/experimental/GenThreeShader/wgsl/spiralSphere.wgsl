// WGSL port of ../shaders/spiralSphereShader.ts (the GLSL is the WebGL fallback).
import { GenParams } from "./gen.wgsl";

@group(0) @binding(0) var<uniform> params: GenParams;

const PI = 3.14159265359;

fn rotate3D(uv: vec2f, rotX: f32, rotY: f32) -> vec2f {
  var pos = vec3f(uv, params.depth);

  // Rotate around X axis
  let sx = sin(rotX);
  let cx = cos(rotX);
  let yz = mat2x2f(cx, -sx, sx, cx) * pos.yz;
  pos = vec3f(pos.x, yz);

  // Rotate around Y axis
  let sy = sin(rotY);
  let cy = cos(rotY);
  let xz = mat2x2f(cy, -sy, sy, cy) * pos.xz;
  pos = vec3f(xz.x, pos.y, xz.y);

  return pos.xy / (1.0 + pos.z * 0.5);
}

@fragment fn fs_main(@location(0) topUv: vec2f) -> @location(0) vec4f {
  let resolution = params.resolution;
  let time = params.time;
  // gl_FragCoord.xy / resolution is this pixel in bottom-origin UV, which
  // is vUv; using it keeps device and CSS pixels out of it.
  let vUv = vec2f(topUv.x, 1.0 - topUv.y);
  var uv = vUv * 2.0 - 1.0;
  uv.x *= resolution.x / resolution.y;

  // Apply 3D rotation
  uv = rotate3D(uv, params.rotationX, params.rotationY);

  var finalColor = vec3f(0.0);
  let t = time * params.speed;

  for (var k = 0; k < 3; k++) {
    let i = f32(k);
    let r = length(uv);
    let theta = atan2(uv.y, uv.x) + t + i * 2.0 * PI / 3.0 + params.rotation;

    let spiral = sin(theta * params.density + r * 10.0 + t);
    let circle = 1.0 - smoothstep(0.0, params.width, abs(r - 0.5 + 0.2 * spiral));

    // Add depth shading
    let shade = 1.0 - (r * 0.5);
    let color = 0.5 + 0.5 * cos(time * params.randowSpeed + uv.xyx + vec3f(0.0, 2.0, 4.0));
    finalColor += circle * color * shade;
  }

  return vec4f(finalColor, 1.0);
}
