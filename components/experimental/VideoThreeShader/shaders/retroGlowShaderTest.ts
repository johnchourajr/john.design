export const retroGlowShaderTest = `
  uniform sampler2D image;
  uniform float time;
  uniform vec2 mouse;
  varying vec2 vUv;

  vec4 neon(vec4 color, float intensity) {
    vec3 neonColor = vec3(0.0);
    float brightness = dot(color.rgb, vec3(0.299, 0.587, 0.114));

    // Enhanced color palette
    vec3 highlightColor = vec3(1.0, 0.8, 0.8); // Hot pink
    vec3 midColor = vec3(0.2, 0.7, 1.0);       // Electric blue
    vec3 shadowColor = vec3(0.6, 0.0, 0.9);    // Deep purple

    // Enhanced glow effects
    neonColor += highlightColor * pow(brightness, 2.5);
    neonColor += midColor * pow(brightness, 2.0);
    neonColor += shadowColor * pow(brightness, 2.5);

    // Dynamic color shift
    float colorShift = sin(time) * 0.5 + 0.5;
    neonColor = mix(neonColor, neonColor.gbr, colorShift * 0.3);

    // Enhanced pulse effect
    float pulse = (sin(time * 2.0) * 0.5 + 0.5) * 0.2;
    float fastPulse = (sin(time * 8.0) * 0.5 + 0.5) * 0.1;

    // Enhanced mouse interaction
    float mouseDistance = distance(vUv, mouse);
    float mouseGlow = (1.0 - smoothstep(0.0, 0.6, mouseDistance)) * 0.8;
    vec3 mouseColor = vec3(1.0, 0.2, 0.5) * mouseGlow;

    // Light streaks
    float streak = pow(sin(vUv.x * 20.0 + time) * 0.5 + 0.5, 8.0) * 0.5;
    vec3 streakColor = vec3(1.0, 0.8, 0.9) * streak;

    // Combine all effects
    vec3 finalColor = mix(color.rgb, neonColor, intensity + pulse + fastPulse);
    finalColor += mouseColor + streakColor;

    // Enhanced bloom effect
    float bloomIntensity = pow(brightness, 3.0) * 0.5;
    finalColor += finalColor * bloomIntensity;

    // Color grading
    finalColor *= vec3(1.1, 0.9, 1.2); // Color balance

    return vec4(finalColor, color.a);
  }

  void main() {
    vec4 color = texture2D(image, vUv);
    gl_FragColor = neon(color, 0.5);
  }
`;
