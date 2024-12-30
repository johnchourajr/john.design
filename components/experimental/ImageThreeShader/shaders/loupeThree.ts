export const loupeShader = `
  precision highp float;
  uniform sampler2D image;
  uniform vec2 resolution;
  uniform vec2 mouse;
  uniform vec2 imageResolution;
  varying vec2 vUv;

  // Pixelation function must be declared outside main
  vec4 getPixelated(vec2 uv) {
    float pixelSize = 100.0; // Adjust this value to change pixelation amount
    vec2 pixelatedUV = floor(uv * pixelSize) / pixelSize;
    return texture2D(image, pixelatedUV);
  }

  // Higher quality blur using separable Gaussian
  vec4 getBlurredColor(vec2 uv) {
    float sigma = 3.0; // Blur spread
    float blurSize = 0.003; // Overall blur size

    // Gaussian weights
    float weights[5];
    weights[0] = 0.2270270270;
    weights[1] = 0.1945945946;
    weights[2] = 0.1216216216;
    weights[3] = 0.0540540541;
    weights[4] = 0.0162162162;

    vec4 color = texture2D(image, uv) * weights[0];

    // Horizontal pass
    for (int i = 1; i < 5; i++) {
      vec2 offset = vec2(float(i) * blurSize, 0.0);
      color += texture2D(image, uv + offset) * weights[i];
      color += texture2D(image, uv - offset) * weights[i];
    }

    // Vertical pass
    vec4 finalColor = color * weights[0];
    for (int i = 1; i < 5; i++) {
      vec2 offset = vec2(0.0, float(i) * blurSize);
      finalColor += texture2D(image, uv + offset) * weights[i];
      finalColor += texture2D(image, uv - offset) * weights[i];
    }

    return finalColor;
  }

  void main() {
    vec2 uv = vUv;

    // Apply aspect ratio correction
    float imageAspect = imageResolution.x / imageResolution.y;
    float screenAspect = resolution.x / resolution.y;

    // Aspect-corrected UV for texture sampling
    vec2 textureUV = uv;
    if (screenAspect < imageAspect) {
      float scale = screenAspect / imageAspect;
      textureUV.x = (uv.x - 0.5) / scale + 0.5;
    } else {
      float scale = imageAspect / screenAspect;
      textureUV.y = (uv.y - 0.5) / scale + 0.5;
    }

    // Effect calculations with proper cursor mapping
    vec2 effectUV = uv;
    effectUV.x *= screenAspect;

    vec2 mouseUV = vec2(mouse.x / resolution.x * screenAspect, 1.0 - mouse.y / resolution.y);
    float dist = distance(effectUV, mouseUV) / screenAspect;

    float radius = 0.15;
    float softness = 0.01; // Reduced softness for sharper edge

    // Create loupe magnification with corrected coordinates
    vec2 dir = normalize(effectUV - mouseUV);
    dir.x /= screenAspect;

    // Sharper edge transition
    float edge = smoothstep(radius + softness/2.0, radius - softness/2.0, dist);
    vec2 magnifiedUv = textureUV + (textureUV - vec2(mouse.x / resolution.x, 1.0 - mouse.y / resolution.y)) * edge * -0.2;

    // Enhanced glass-like refraction
    float refraction = 0.3; // Adjust for stronger/weaker effect
    vec2 normalizedDir = normalize(effectUV - mouseUV);
    normalizedDir.x /= screenAspect;

    // Create a sharper transition for edge effects
    float innerRadius = radius * 0.9; // 80% of the radius for clear center
    float edgeStrength = smoothstep(innerRadius, radius, dist);
    float centerClarity = 1.0 - edgeStrength;

    // Modify ripple to only affect the edges
    float ripple = sin(dist * 30.0) * 0.02 * edgeStrength;
    vec2 distortedUV = magnifiedUv + normalizedDir * ripple * refraction * edgeStrength;

    // Chromatic aberration only on edges
    float chromatic = 0.008; // Reduced overall chromatic strength
    vec2 redOffset = mix(
      distortedUV,
      distortedUV + normalizedDir * chromatic,
      edgeStrength
    );
    vec2 blueOffset = mix(
      distortedUV,
      distortedUV - normalizedDir * chromatic,
      edgeStrength
    );

    // Improve edge sampling with offset correction
    vec2 edgeOffset = vec2(0.0);
    if (distortedUV.x < 0.0) edgeOffset.x = -distortedUV.x;
    if (distortedUV.x > 1.0) edgeOffset.x = 1.0 - distortedUV.x;
    if (distortedUV.y < 0.0) edgeOffset.y = -distortedUV.y;
    if (distortedUV.y > 1.0) edgeOffset.y = 1.0 - distortedUV.y;

    // Apply edge correction to all UV coordinates
    vec2 correctedUV = distortedUV + edgeOffset;
    vec2 redOffsetCorrected = redOffset + edgeOffset;
    vec2 blueOffsetCorrected = blueOffset + edgeOffset;

    // Sample colors with edge correction
    vec4 redChannel = texture2D(image, redOffsetCorrected);
    vec4 greenChannel = texture2D(image, correctedUV);
    vec4 blueChannel = texture2D(image, blueOffsetCorrected);

    // Fade out near edges
    float edgeFade = 1.0 - smoothstep(0.0, 0.1, length(edgeOffset));

    // Enhanced clarity in center with edge fade
    vec4 clearColor = texture2D(image, magnifiedUv + edgeOffset);
    vec4 chromaticColor = vec4(redChannel.r, greenChannel.g, blueChannel.b, 1.0);
    vec4 magnifiedColor = mix(clearColor, chromaticColor, edgeStrength) * edgeFade;

    // Enhanced clarity in center
    clearColor = texture2D(image, magnifiedUv);
    chromaticColor = vec4(redChannel.r, greenChannel.g, blueChannel.b, 1.0);
    magnifiedColor = mix(clearColor, chromaticColor, edgeStrength);

    // Remove all fresnel and light effects
    vec4 outsideColor = texture2D(image, textureUV);
    vec4 blurredColor = getBlurredColor(textureUV);

    // Clean transition between blurred and magnified
    float blurStrength = 0.8;
    vec4 outsideBlurred = mix(outsideColor, blurredColor, blurStrength);

    // Direct color mixing without any additional effects
    vec4 finalColor = mix(outsideBlurred, magnifiedColor, edge);

    // Subtle inner shadow only
    float innerShadow = smoothstep(radius - softness/2.0, radius, dist) * 0.2;
    finalColor *= 1.0 - (innerShadow * edge);

    gl_FragColor = finalColor;
  }
`;
