export const vhsShader = `
  uniform sampler2D image;
  uniform float time;
  uniform vec2 mouse;
  varying vec2 vUv;

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  vec2 crt_curve(vec2 uv) {
    uv = uv * 2.0 - 1.0;
    vec2 offset = abs(uv.yx) / vec2(6.0, 4.0);
    uv = uv + uv * offset * offset;
    uv = uv * 0.5 + 0.5;
    return uv;
  }

  void main() {
    vec2 uv = vUv;

    // CRT curve effect
    uv = crt_curve(uv);

    // Intense color bleeding
    float colorBleedWidth = 0.005 + sin(time) * 0.002;
    float r = texture2D(image, vec2(uv.x + colorBleedWidth, uv.y)).r;
    float g = texture2D(image, uv).g;
    float b = texture2D(image, vec2(uv.x - colorBleedWidth, uv.y)).b;

    // VHS tracking distortion
    float tracking = sin(uv.y * 10.0 + time) * 0.003;
    uv.x += tracking;

    // Vertical hold jump
    float verticalHold = step(0.99, random(vec2(time * 0.3, 0.0))) * 0.3;
    uv.y = mod(uv.y + verticalHold, 1.0);

    // Scanlines (reduced intensity)
    float scanlineIntensity = 0.08;
    float scanline = sin(uv.y * 800.0) * scanlineIntensity;

    // Horizontal noise bands (reduced frequency)
    float noiseBands = step(0.99, random(vec2(uv.y * 100.0, time))) * 0.2;

    // Glitch blocks (reduced intensity)
    float glitchPos = floor(uv.y * 20.0);
    float glitchNoise = random(vec2(glitchPos, floor(time * 20.0)));
    float glitchShift = (glitchNoise - 0.5) * 0.02;
    uv.x += glitchShift;

    // Mouse interaction
    float mouseDistance = distance(uv, mouse);
    float mouseInfluence = (1.0 - smoothstep(0.0, 0.4, mouseDistance));

    // Combine effects
    vec4 color = vec4(r, g, b, 1.0);

    // Apply scanlines and noise bands
    color.rgb *= (1.0 - scanline);
    color.rgb = mix(color.rgb, vec3(1.0), noiseBands);

    // Color adjustments (reduced intensity)
    color.rgb *= 1.05; // Slight brightness boost
    color.r *= 1.05; // Slight red boost
    color.b *= 0.95; // Slight blue reduction

    // VHS color palette adjustment (reduced intensity)
    color.rgb = mix(color.rgb, vec3(
      dot(color.rgb, vec3(0.393, 0.769, 0.189)),
      dot(color.rgb, vec3(0.349, 0.686, 0.168)),
      dot(color.rgb, vec3(0.272, 0.534, 0.131))
    ), 0.1);

    // Add subtle interference
    float interference = sin(uv.y * 100.0 + time * 10.0) * 0.01;
    color.rgb += interference;

    // Mouse effect
    color.rgb = mix(color.rgb, color.rgb * 1.2, mouseInfluence * 0.2);

    gl_FragColor = color;
  }
`;
