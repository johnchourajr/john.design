import { layers } from './layers';

export const verticalShader = `
  precision highp float;
  uniform vec2 resolution;
  uniform vec2 mouse;
  uniform float time;
  uniform sampler2D image;
  uniform vec2 imageResolution;
  varying vec2 vUv;

  ${layers}

  float sharpenWave(float x, float power) {
    return pow(0.5 + 0.5 * sin(x), power) * 2.0 - 1.0;
  }

  void main() {
    vec2 uv = frameUv();
    float screenAspect = resolution.x / resolution.y;

    // Aspect-corrected UV for texture sampling
    vec2 textureUV = imageUv(uv);

    // Effect calculations with proper aspect ratio
    vec2 effectUV = uv;
    effectUV.x *= screenAspect;

    vec2 mouseUV = vec2(mouse.x / resolution.x * screenAspect, 1.0 - mouse.y / resolution.y);
    float dist = distance(effectUV, mouseUV) / screenAspect;

    float radius = 0.2;
    float falloff = 0.05;
    float distortionStrength = 0.02 * smoothstep(radius, radius - falloff, dist);

    float flutes = 300.0;
    float sharpness = 0.5;
    float baseWave = sharpenWave(effectUV.x * flutes + time * 0.2, sharpness);
    float detailWave = sharpenWave(effectUV.x * flutes * 1.25 + time * 0.1, sharpness);

    float wave = (baseWave + detailWave * 0.35) * distortionStrength;

    vec2 direction = normalize(effectUV - mouseUV);
    direction.x /= screenAspect;
    vec2 distortedUV = textureUV + direction * wave;

    // Chromatic aberration
    float chromaticOffset = 0.015;
    vec2 redOffset = distortedUV + vec2(wave * chromaticOffset, 0.0);
    vec2 blueOffset = distortedUV - vec2(wave * chromaticOffset, 0.0);

    // The image is opaque inside its bounds and clear outside them.
    float imageAlpha = distortedUV.x < 0.0 || distortedUV.x > 1.0 || distortedUV.y < 0.0 || distortedUV.y > 1.0
      ? 0.0
      : g_inFrame;
    vec3 imageColor = vec3(
      texture2D(image, redOffset).r,
      texture2D(image, distortedUV).g,
      texture2D(image, blueOffset).b
    ) * imageAlpha;

    // The type goes through the same flutes, as far as the hover reaches,
    // and each channel splits like the image's.
    float typeWave = wave * hover;
    vec2 typeUV = textureUV + direction * typeWave;
    vec4 redType = sampleHeadline(typeUV + vec2(typeWave * chromaticOffset, 0.0));
    vec4 greenType = sampleHeadline(typeUV);
    vec4 blueType = sampleHeadline(typeUV - vec2(typeWave * chromaticOffset, 0.0));

    gl_FragColor = vec4(
      redType.r + imageColor.r * (1.0 - redType.a),
      greenType.g + imageColor.g * (1.0 - greenType.a),
      blueType.b + imageColor.b * (1.0 - blueType.a),
      max(imageAlpha, max(redType.a, max(greenType.a, blueType.a)))
    );
  }
`;
