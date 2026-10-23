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

  // The type's wave: a smooth sine, far broader than the portrait's sharp
  // flutes, so letters undulate instead of tearing into spikes. TYPE_WAVES
  // is ripples across the frame, TYPE_AMPLITUDE their height (in frame
  // heights) at the middle of the hover.
  #define TYPE_WAVES 90.0
  #define TYPE_AMPLITUDE 0.005
  // How round and blobby the type goes at the middle of the hover, as a
  // share of its font size, so it looks the same at every size the type
  // steps to; its edges stay crisp.
  #define TYPE_ROUND_EM 0.135

  // The headline with its corners rounded: blurred over a disc of radius
  // \`r\` (six rings of sixteen taps; fewer show as chop at a crisp edge), then cut back
  // to a crisp edge at half coverage. Straight edges land where they were;
  // a corner has less ink around it, so it pulls in round.
  vec4 roundType(vec2 at, vec2 r) {
    vec4 sum = sampleHeadline(at) * 1.5;
    float total = 1.5;
    for (int ring = 1; ring <= 6; ring++) {
      float radius = float(ring) / 6.0;
      float weight = 1.25 - radius;
      for (int i = 0; i < 16; i++) {
        float a = (float(i) + float(ring) * 0.37) * 0.3926991;
        sum += sampleHeadline(at + vec2(cos(a), sin(a)) * r * radius) * weight;
        total += weight;
      }
    }
    vec4 blurred = sum / total;
    if (blurred.a < 0.0001) return vec4(0.0);
    // About 0.7 CSS px of antialiasing (the blurred edge ramps over ~2r):
    // crisp, but wide enough that the taps' steps don't show as chop.
    float aa = clamp(0.18 / (r.y * resolution.y), 0.01, 0.5);
    float alpha = smoothstep(0.5 - aa, 0.5 + aa, blurred.a);
    // Premultiplied: the type's own colour at the new coverage.
    return vec4(blurred.rgb / blurred.a * alpha, alpha);
  }

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

    // The type goes round and blobby as far as the hover reaches; it
    // doesn't flute. Rounding is the costly part, so it runs once.
    float reachType = smoothstep(radius, radius - falloff, dist);
    // The rounding grows with the reach and fades in from the plain type,
    // so there's no seam where the hover begins.
    float rounding = reachType * hover;
    vec4 type = sampleHeadline(textureUV);
    if (rounding > 0.001) {
      // The font size in frame heights (resolution is the frame in CSS px).
      float em = headlineEm / resolution.y;
      vec2 round = TYPE_ROUND_EM * em * max(rounding, 0.25) * vec2(1.0 / screenAspect, 1.0);
      type = mix(type, roundType(textureUV, round), smoothstep(0.0, 0.35, rounding));
    }

    gl_FragColor = over(type, vec4(imageColor, imageAlpha));
  }
`;
