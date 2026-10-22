export const retroGlowShader = `
  uniform sampler2D image;
  uniform float time;
  uniform vec2 mouse;
  uniform vec2 resolution;
  varying vec2 vUv;

  vec4 neon(vec4 color, float intensity) {
    vec3 neonColor = vec3(0.0);
    float brightness = dot(color.rgb, vec3(0.299, 0.587, 0.114));

    // Enhanced pink-purple glow for bright areas
    neonColor += vec3(1.0, 0.2, 0.8) * pow(brightness, 1.1); // Reduced power for more glow
    // Enhanced blue glow for mid tones
    neonColor += vec3(0.2, 0.4, 1.0) * pow(brightness, 1.3); // Reduced power for more glow

    // Increased pulse effect
    float pulse = (sin(time * 6.0) * 0.5 + 0.5) * 0.9; // Increased from 0.7 to 0.9

    // Glow around the pointer. The renderer gives the mouse in NDC (-1 to 1,
    // y up), so it maps straight onto vUv. Distances are in canvas widths,
    // with x scaled by the aspect ratio so the glow stays round.
    float screenAspect = resolution.x / resolution.y;
    vec2 effectUV = vec2(vUv.x * screenAspect, vUv.y);
    vec2 mouseUV = mouse * 0.5 + 0.5;
    mouseUV.x *= screenAspect;
    float mouseDistance = distance(effectUV, mouseUV) / screenAspect;
    float mouseGlow = (1.0 - smoothstep(0.0, 0.2, mouseDistance)) * 0.7;

    // Until #103, resolution read (0, 0), the distance came out NaN and the
    // mouse glow was its full 0.7 across the whole frame. The look was tuned
    // with that, so it stays as a base glow and the pointer adds to it.
    float baseGlow = 0.7;

    // Combine effects with wash out
    vec3 finalColor = mix(color.rgb, neonColor, intensity + baseGlow + pulse + mouseGlow);
    finalColor = mix(finalColor, vec3(1.0), 0.05); // Add wash out effect

    // Add scanlines
    float scanline = sin(vUv.y * 200.0) * 0.02;
    finalColor *= (1.0 - scanline);

    // Add chromatic aberration
    float aberration = 0.003;
    vec4 r = texture2D(image, vUv + vec2(aberration, 0.0));
    vec4 b = texture2D(image, vUv - vec2(aberration, 0.0));
    finalColor.r = mix(finalColor.r, r.r, 0.5);
    finalColor.b = mix(finalColor.b, b.b, 0.5);

    return vec4(finalColor, color.a);
  }

  void main() {
    vec4 color = texture2D(image, vUv);
    gl_FragColor = neon(color, 0.4);
  }
`;
