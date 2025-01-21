export const super8ShaderTest = `
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

  void main() {
    vec2 uv = vUv;

    // Film jitter
    float jitter = random(vec2(time * 2.0, 0.0)) * 0.002;
    uv.y += jitter;

    // Subtle gate weave
    float weave = sin(time * 1.5) * 0.001;
    uv.x += weave;

    // Film grain
    float grain = noise(uv * 500.0 + time) * 0.15;

    // Edge vignette
    vec2 vignetteUV = uv * 2.0 - 1.0;
    float vignette = 1.0 - dot(vignetteUV, vignetteUV) * 0.4;

    // Color sampling with slight misalignment (color fringing)
    float r = texture2D(image, uv + vec2(0.001, 0.0)).r;
    float g = texture2D(image, uv).g;
    float b = texture2D(image, uv - vec2(0.001, 0.0)).b;
    vec3 color = vec3(r, g, b);

    // Warm, vintage color grading
    color = mix(color, vec3(
      dot(color, vec3(0.393, 0.769, 0.189)),
      dot(color, vec3(0.349, 0.686, 0.168)),
      dot(color, vec3(0.272, 0.534, 0.131))
    ), 0.2);

    // Warm up the image
    color.r *= 1.1;
    color.b *= 0.9;

    // Add subtle sepia tone
    vec3 sepia = vec3(1.2, 1.0, 0.8);
    color *= sepia;

    // Burned edges effect
    float edge = 1.0 - smoothstep(0.4, 0.8, abs(sin(uv.y * 30.0 + time)));
    float burnIntensity = random(vec2(uv.y, time)) * edge * 0.1;

    // Hair and scratches
    float scratch = step(0.998, random(vec2(uv.x + time * 0.01, floor(time * 24.0))));
    float hair = step(0.995, random(vec2(uv.y, time)));

    // Combine effects
    color *= vignette;
    color += grain;
    color += vec3(scratch * 0.3);
    color += vec3(hair * 0.2);
    color += vec3(burnIntensity);

    // Contrast adjustment
    color = pow(color, vec3(1.1));

    gl_FragColor = vec4(color, 1.0);
  }
`;
