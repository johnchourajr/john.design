export const buildDitherShader = `
  uniform sampler2D image;
  uniform float time;
  uniform vec2 resolution;
  varying vec2 vUv;

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  void main() {
    vec2 uv = vUv;

    // Calculate wave for distortion strength
    float loopTime = mod(time, 15.0);
    float waveStrength = (sin(loopTime * 0.4) + 1.0) * 0.5; // normalized to 0-1

    // Create noise-based distortion
    vec2 noise = vec2(
      random(uv + time * 0.5),
      random(uv + time * 0.5 + 1.0)
    ) * 2.0 - 1.0;

    // Apply noise distortion modulated by wave
    vec2 distortedUV = uv + (noise * 0.03 * waveStrength);

    gl_FragColor = texture2D(image, distortedUV);
  }
`;
