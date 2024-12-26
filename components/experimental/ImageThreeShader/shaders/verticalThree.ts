export const verticalShader = `
  precision highp float;
  uniform vec2 resolution;
  uniform vec2 mouse;
  uniform float time;
  uniform sampler2D image;
  uniform vec2 imageResolution;
  varying vec2 vUv;

  float sharpenWave(float x, float power) {
    return pow(0.5 + 0.5 * sin(x), power) * 2.0 - 1.0;
  }

  void main() {
    vec2 uv = vUv;

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

    vec4 redChannel = texture2D(image, redOffset);
    vec4 greenChannel = texture2D(image, distortedUV);
    vec4 blueChannel = texture2D(image, blueOffset);
    vec4 finalColor = vec4(redChannel.r, greenChannel.g, blueChannel.b, 1.0);

    gl_FragColor = distortedUV.x < 0.0 || distortedUV.x > 1.0 || distortedUV.y < 0.0 || distortedUV.y > 1.0
      ? vec4(0.0)
      : finalColor;
  }
`;
