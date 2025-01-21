export const videoProcessShader = `
  uniform sampler2D image;
  uniform float time;
  uniform vec2 resolution;
  varying vec2 vUv;

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  void main() {
    vec2 uv = vUv;

    // Random glitch blocks
    float blockThreshold = 0.995;
    float blockNoise = random(vec2(floor(uv.y * 10.0), floor(time * 2.0)));
    float glitchOffset = step(blockThreshold, blockNoise) * 0.003 * sin(time);

    // Horizontal line glitch
    float lineNoise = random(vec2(floor(uv.y * 50.0), time));
    float lineOffset = step(0.996, lineNoise) * 0.004;

    // Apply glitch displacement
    uv.x += glitchOffset + lineOffset;

    // Color channel splitting
    float colorShift = sin(time * 2.0) * 0.001;
    vec4 color;
    color.r = texture2D(image, uv + vec2(colorShift, 0.0)).r;
    color.g = texture2D(image, uv).g;
    color.b = texture2D(image, uv - vec2(colorShift, 0.0)).b;
    color.a = 1.0;

    // Add dynamic grain
    float grain = random(uv + time) * 0.1 - 0.05;
    color.rgb += grain;

    // Random color aberration
    float aberrationChance = step(0.99, random(vec2(time * 0.5, 0.0)));
    color.rb *= (1.0 + aberrationChance * 0.2);

    gl_FragColor = color;
  }
`;
