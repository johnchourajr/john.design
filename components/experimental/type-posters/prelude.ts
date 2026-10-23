/**
 * Shared by every type poster. Paste it at the top of a poster's fragment
 * shader.
 *
 * - `type` is the poster's composition (posterTexture): red is the
 *   expressive type, green the small print, blue an optional grid, on black.
 * - `accent` is the site's accent colour (`--root-color`).
 * - `mouse` is the pointer in CSS pixels from the poster's top left, damped;
 *   `hover` eases from 0 to 1 the first time it arrives, then holds, so a
 *   poster blends from its resting motion to the pointer.
 * - `time` is in seconds, and stays at 0 with reduced motion: every poster
 *   has to read as a finished composition on its first frame.
 */
export const prelude = `
  precision highp float;
  uniform sampler2D type;
  uniform vec2 resolution;
  uniform vec2 mouse;
  uniform float time;
  uniform float hover;
  uniform vec3 accent;
  varying vec2 vUv;

  // Width over height.
  float aspect() { return resolution.x / resolution.y; }

  // UV to a space where distances are the same both ways: x runs 0 to the
  // aspect, y 0 to 1.
  vec2 toSquare(vec2 uv) { return vec2(uv.x * aspect(), uv.y); }
  vec2 fromSquare(vec2 p) { return vec2(p.x / aspect(), p.y); }

  // The pointer in UV (y up).
  vec2 pointerUv() {
    return vec2(mouse.x / resolution.x, 1.0 - mouse.y / resolution.y);
  }

  // Where the effect is centred: \`rest\` (UV) until the pointer arrives,
  // easing over to the pointer.
  vec2 focus(vec2 rest) { return mix(rest, pointerUv(), hover); }

  // The expressive type at a point, 0 outside the poster.
  float ink(vec2 uv) {
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) return 0.0;
    return texture2D(type, uv).r;
  }

  // The small print at a point.
  float print(vec2 uv) { return texture2D(type, uv).g; }

  // The grid layer at a point, 0 outside the poster.
  float grid(vec2 uv) {
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) return 0.0;
    return texture2D(type, uv).b;
  }

  mat2 rotate(float a) {
    float c = cos(a);
    float s = sin(a);
    return mat2(c, -s, s, c);
  }

  float hash(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  // Paper: a faint, fixed grain, so flat colour reads as printed.
  vec3 paper(vec3 colour) {
    return colour * (0.97 + 0.03 * hash(floor(gl_FragCoord.xy)));
  }
`;
