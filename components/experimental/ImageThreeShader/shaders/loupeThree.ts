import { layers } from './layers';

export const loupeShader = `
  precision highp float;
  uniform sampler2D image;
  uniform vec2 resolution;
  uniform vec2 mouse;
  uniform vec2 imageResolution;
  varying vec2 vUv;

  ${layers}

  // Pixelation function must be declared outside main
  vec4 getPixelated(vec2 uv) {
    float pixelSize = 100.0; // Adjust this value to change pixelation amount
    vec2 pixelatedUV = floor(uv * pixelSize) / pixelSize;
    return texture2D(image, pixelatedUV);
  }

  // Higher quality blur using separable Gaussian

  // How far the portrait inside the lens blurs (in texture UV), behind the
  // type, which stays sharp in front of it.
  #define LENS_BLUR 0.006

  // A disc blur of \`radius\` (texture UV): a golden-angle spiral of taps
  // turned a little per pixel so they dissolve into grain instead of
  // showing as copies, weighted toward the middle for a soft lens blur.
  vec4 discBlur(vec2 uv, float radius) {
    float turn = 6.2831853 * fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
    vec4 color = vec4(0.0);
    float total = 0.0;
    for (int i = 0; i < 32; i++) {
      float t = (float(i) + 0.5) / 32.0;
      float angle = float(i) * 2.39996 + turn;
      float weight = exp(-2.0 * t);
      color += texture2D(image, uv + vec2(cos(angle), sin(angle)) * sqrt(t) * radius) * weight;
      total += weight;
    }
    return color / total;
  }

  // How much the lens scales the portrait at its centre, easing back to 1
  // at the rim: under 1 shrinks it, like a concave lens. The type takes its
  // own scale, enlarged, so the two play off each other.
  #define LENS_MAGNIFY 0.7
  #define TYPE_MAGNIFY 1.45
  // How far each colour channel spreads around its own offset at the rim,
  // as a share of the split: 0 is a hard edge, 1 a full smear.
  #define SPLIT_SOFT 0.9

  void main() {
    vec2 uv = frameUv();
    float screenAspect = resolution.x / resolution.y;

    // Aspect-corrected UV for texture sampling
    vec2 textureUV = imageUv(uv);

    // Effect calculations with proper cursor mapping
    vec2 effectUV = uv;
    effectUV.x *= screenAspect;

    vec2 mouseUV = vec2(mouse.x / resolution.x * screenAspect, 1.0 - mouse.y / resolution.y);
    float dist = distance(effectUV, mouseUV) / screenAspect;

    // Sized with the other hero lenses (~0.165 of the frame's width).
    float radius = 0.165;
    float softness = 0.01; // Reduced softness for sharper edge

    // Create loupe magnification with corrected coordinates
    vec2 dir = normalize(effectUV - mouseUV);
    dir.x /= screenAspect;

    // Sharper edge transition
    float edge = smoothstep(radius + softness/2.0, radius - softness/2.0, dist);
    // Lens curvature: a convex profile, strongest at the centre and easing
    // back to true size at the rim, where the image compresses as it would
    // through curved glass.
    vec2 lensCentre = imageUv(vec2(mouseUV.x / screenAspect, mouseUV.y));
    float lensR = clamp(dist / radius, 0.0, 1.0);
    float lensZ = sqrt(max(0.0, 1.0 - lensR * lensR));
    float lensScale = mix(1.0, 1.0 / LENS_MAGNIFY, lensZ);
    float typeLensScale = mix(1.0, 1.0 / TYPE_MAGNIFY, lensZ);
    vec2 magnifiedUv = mix(textureUV, lensCentre + (textureUV - lensCentre) * lensScale, edge);

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

    // Sample colors with edge correction. Each channel averages four
    // samples spread along the split, shifted a little per pixel, so the
    // fringes are soft gradients rather than hard-edged copies.
    float jitter = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715)))) - 0.5;
    vec2 spread = normalizedDir * chromatic * edgeStrength * SPLIT_SOFT;
    vec4 redChannel = vec4(0.0);
    vec4 greenChannel = vec4(0.0);
    vec4 blueChannel = vec4(0.0);
    for (int i = 0; i < 4; i++) {
      vec2 step = spread * ((float(i) + 0.5) / 4.0 - 0.5 + jitter * 0.25) * 2.0;
      redChannel += texture2D(image, redOffsetCorrected + step);
      greenChannel += texture2D(image, correctedUV + step);
      blueChannel += texture2D(image, blueOffsetCorrected + step);
    }
    redChannel *= 0.25;
    greenChannel *= 0.25;
    blueChannel *= 0.25;

    // Fade out near edges
    float edgeFade = 1.0 - smoothstep(0.0, 0.1, length(edgeOffset));

    // Enhanced clarity in center with edge fade
    // The blur comes with the hover: the portrait is sharp until the
    // pointer arrives.
    vec4 clearColor = discBlur(magnifiedUv + edgeOffset, LENS_BLUR * hover);
    vec4 chromaticColor = vec4(redChannel.r, greenChannel.g, blueChannel.b, 1.0);
    vec4 magnifiedColor = mix(clearColor, chromaticColor, edgeStrength) * edgeFade;

    // Outside the lens the portrait stays as it is: the blur is only the
    // lens's.
    vec4 outsideColor = texture2D(image, textureUV);

    vec4 finalColor = mix(outsideColor, magnifiedColor, edge);

    // Subtle inner shadow only
    float innerShadow = smoothstep(radius - softness/2.0, radius, dist) * 0.2;
    finalColor *= 1.0 - (innerShadow * edge);

    // The headline goes through the same lens, as far as the hover reaches.
    // The edge corrections and the blur outside it belong to the image: the
    // type stays sharp outside the lens.
    float typeEdge = edge * hover;
    vec2 typeMagnified = mix(textureUV, lensCentre + (textureUV - lensCentre) * typeLensScale, typeEdge);
    vec2 typeDistorted = typeMagnified + normalizedDir * ripple * refraction * edgeStrength;
    vec4 redType = vec4(0.0);
    vec4 greenType = vec4(0.0);
    vec4 blueType = vec4(0.0);
    for (int i = 0; i < 4; i++) {
      vec2 step = spread * ((float(i) + 0.5) / 4.0 - 0.5 + jitter * 0.25) * 2.0;
      redType += sampleHeadline(typeDistorted + normalizedDir * chromatic * edgeStrength + step);
      greenType += sampleHeadline(typeDistorted + step);
      blueType += sampleHeadline(typeDistorted - normalizedDir * chromatic * edgeStrength + step);
    }
    redType *= 0.25;
    greenType *= 0.25;
    blueType *= 0.25;
    vec4 chromaticType = vec4(
      redType.r,
      greenType.g,
      blueType.b,
      max(redType.a, max(greenType.a, blueType.a))
    );
    vec4 magnifiedType = mix(sampleHeadline(typeMagnified), chromaticType, edgeStrength);
    vec4 type = mix(sampleHeadline(textureUV), magnifiedType, typeEdge);
    type *= 1.0 - (innerShadow * typeEdge);

    finalColor = over(type, finalColor * g_inFrame);

    gl_FragColor = finalColor;
  }
`;
