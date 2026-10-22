import { layers } from './layers';

export const pixelShader = `
    precision highp float;
    uniform vec2 resolution;
    uniform vec2 mouse;
    uniform float time;
    uniform sampler2D image;
    uniform vec2 imageResolution;
    varying vec2 vUv;

    ${layers}

    // Snaps texture UV to square blocks of \`size\` (in frame heights),
    // sampling each block at its corner (\`at\` 0) or its centre (0.5).
    vec2 pixelate(vec2 textureUV, float size, float screenAspect, float at) {
      vec2 normalizedUV = textureUV;
      normalizedUV.x *= screenAspect;
      normalizedUV = (floor(normalizedUV / size) + at) * size;
      normalizedUV.x /= screenAspect;
      return normalizedUV;
    }

    void main() {
      vec2 uv = frameUv();
      float screenAspect = resolution.x / resolution.y;

      // Aspect-corrected UV for texture sampling
      vec2 textureUV = imageUv(uv);

      // Create normalized effect space
      vec2 effectUV = uv;
      effectUV.x *= screenAspect;

      vec2 mouseUV = vec2(mouse.x / resolution.x * screenAspect, 1.0 - mouse.y / resolution.y);
      float dist = distance(effectUV, mouseUV) / screenAspect;

      float innerRadius = 0.07;
      float outerRadius = 0.14;
      float basePixelSize = 0.055;
      float reveal = smoothstep(innerRadius, outerRadius, dist);
      float pixelSize = reveal * basePixelSize;
      pixelSize = pow(pixelSize, 1.5);

      // The image is pixelated everywhere but a clear window at the pointer.
      vec2 pixelated = dist < innerRadius
        ? textureUV
        : pixelate(textureUV, pixelSize, screenAspect, 0.0);

      float wobble = sin(time * 2.0 + dist * 10.0) * 0.002;
      pixelated += wobble * reveal;
      pixelated = clamp(pixelated, vec2(0.001), vec2(0.999));

      // The headline is the inverse: sharp at rest, pixelated in the window,
      // so the pointer reads on the type as well as the portrait. Its blocks
      // keep one size (the portrait's) and fade in across the window's edge;
      // a size that shrank with distance would smear thin type into streaks.
      // Each block shows its centre, so the blocky type sits where the sharp
      // type does (a corner would shift it up and left by half a block).
      vec2 typeBlocks = pixelate(textureUV, pow(basePixelSize, 1.5), screenAspect, 0.5);
      vec4 type = mix(
        sampleHeadline(textureUV),
        sampleHeadline(typeBlocks + wobble),
        (1.0 - reveal) * hover
      );

      gl_FragColor = over(type, texture2D(image, pixelated) * g_inFrame);
    }
`;
