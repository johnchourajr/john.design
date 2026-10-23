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

  // ── Print: offset printing's flaws, for posters that want to look
  // printed. All of it is measured in CSS px (\`sheetPx\`), so the texture
  // is the same physical size whether the poster hangs small or opens big.

  // How much of it shows, across every poster: each poster's own
  // \`amount\` is scaled by this, so the whole set can be turned up or down
  // in one place.
  #define PRINT_TEXTURE 0.55

  // This fragment in CSS px from the poster's bottom left.
  vec2 sheetPx() { return vUv * resolution; }

  float fbm(vec2 p) {
    float sum = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 4; i++) {
      sum += noise(p) * amp;
      p = rotate(0.6) * p * 2.03 + 11.7;
      amp *= 0.5;
    }
    return sum;
  }

  // Uncoated stock: cloudy where the sheet took more or less size, faint
  // fibres running with the grain, and a fine tooth. \`amount\` 1 is a
  // sheet you can feel; 0 leaves the colour as it is.
  vec3 paperStock(vec3 colour, float amount) {
    amount *= PRINT_TEXTURE;
    vec2 p = sheetPx();
    float cloud = fbm(p * 0.011) - 0.5;
    float fibres = smoothstep(0.72, 0.95, noise(rotate(0.35) * p * vec2(0.04, 1.1)));
    float tooth = hash(floor(p * 1.6)) - 0.5;
    vec3 sheet = colour * (1.0 + amount * (cloud * 0.06 - fibres * 0.015));
    return sheet + amount * tooth * 0.022;
  }

  // Moves a sample point by a few tenths of a CSS px, at random but fixed:
  // ink edges break up the way they do on uncoated paper instead of
  // staying vector-sharp. \`seed\` gives each plate its own edge.
  vec2 roughen(vec2 uv, float amount, float seed) {
    amount *= PRINT_TEXTURE;
    vec2 p = sheetPx() * 0.45 + seed * 31.7;
    vec2 n = vec2(noise(p), noise(p + 17.3)) - 0.5;
    vec2 m = vec2(noise(p * 3.1), noise(p * 3.1 + 5.9)) - 0.5;
    return uv + (n * 0.9 + m * 0.35) * amount / resolution;
  }

  // Ink as it lays down: \`coverage\` (0 to 1, from the type) becomes how
  // much ink is on the sheet. Solids thin out in patches (ink starvation),
  // the paper's tooth shows through as pinholes, and the edge sits a
  // little in or out with the mottle. \`amount\` 1 is a tired press.
  float inkLaid(float coverage, float amount, float seed) {
    amount *= PRINT_TEXTURE;
    vec2 p = sheetPx() + seed * 53.1;
    float mottle = fbm(p * 0.045);
    float edge = 0.5 + (mottle - 0.5) * 0.35 * amount;
    float laid = smoothstep(edge - 0.18, edge + 0.18, coverage);
    float starve = 1.0 - amount * 0.22 * smoothstep(0.45, 0.8, fbm(p * 0.02 + 3.0));
    // Pinholes: rare, soft specks a CSS px or two across, not single
    // pixels.
    float speck = noise(p * 0.55 + 41.0) * noise(p * 1.3 + 7.0);
    float pinhole = smoothstep(0.7 - amount * 0.05, 0.76, speck) * 0.7 * amount;
    return laid * starve * (1.0 - pinhole);
  }

  // How heavily the press ran across the sheet: a slow swell, ~1 on
  // average, so one corner can print fuller than the other.
  float pressDensity(float amount, float seed) {
    amount *= PRINT_TEXTURE;
    return 1.0 + amount * (fbm(vUv * 1.6 + seed * 7.3) - 0.5) * 0.3;
  }
`;
