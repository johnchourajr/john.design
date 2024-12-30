export const loupeShader = `
  precision highp float;
  uniform sampler2D image;
  uniform vec2 resolution;
  uniform vec2 mouse;
  uniform vec2 imageResolution;
  varying vec2 vUv;

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
    float softness = 0.03;

    // Create loupe magnification with corrected coordinates
    vec2 dir = normalize(effectUV - mouseUV);
    dir.x /= screenAspect;

    float edge = smoothstep(radius + softness, radius - softness, dist);
    vec2 magnifiedUv = textureUV + (textureUV - vec2(mouse.x / resolution.x, 1.0 - mouse.y / resolution.y)) * edge * -0.5;

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

    // Adjust fresnel to be stronger at edges
    float fresnelPower = 3.0; // Increased power for sharper edge highlight
    float fresnel = pow(edgeStrength, fresnelPower) * 0.5;
    vec4 lightEffect = vec4(1.0) * fresnel;

    // Enhanced high-quality blur for non-magnified area
    vec4 blurredColor = vec4(0.0);
    float blurSize = 0.002; // Reduced blur size for higher quality
    float totalWeight = 0.0;

    // Gaussian weights for better blur quality
    for(float i = -3.0; i <= 3.0; i++) {
      for(float j = -3.0; j <= 3.0; j++) {
        float weight = exp(-(i*i + j*j) / 8.0); // Gaussian distribution
        vec2 offset = vec2(i, j) * blurSize;
        blurredColor += texture2D(image, textureUV + offset) * weight;
        totalWeight += weight;
      }
    }
    blurredColor /= totalWeight;

    // Slightly darken the blurred area
    blurredColor *= 0.7; // Reduce brightness of outer area

    // Adjust fresnel to be more subtle
    fresnelPower = 1.0; // Increased power for sharper falloff
    fresnel = pow(edgeStrength, fresnelPower) * 0.3; // Reduced fresnel intensity
    lightEffect = vec4(1.0) * fresnel;

    // Final color mixing with enhanced glass effect
    vec4 finalColor = mix(blurredColor, magnifiedColor, edge) * edgeFade;
    finalColor += lightEffect * (1.0 - 0.5 * (1.0 - edge)) * edgeFade;

    // Add subtle inner shadow with improved falloff
    float innerShadow = smoothstep(radius - softness * 2.0, radius, dist) * 0.4;
    finalColor *= (1.0 - innerShadow * edge);

    gl_FragColor = finalColor;
  }
`;
