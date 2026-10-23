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

    // How much of a block the letter must cover for it to light. Low, so a
    // partly covered row along the top or bottom of a letter fills in and
    // blocky type rounds up to full height rather than losing a row.
    #define BLOCK_FILL 0.25

    // The type as one block of \`size\`: lit when the letter covers enough
    // of it. A single sample at the block's centre drops the blocks along
    // the tops and bottoms of letters (the grid isn't lined up with them),
    // so blocky type came out a block shorter than the sharp type.
    vec4 typeBlock(vec2 textureUV, float size, float screenAspect) {
      vec2 corner = pixelate(textureUV, size, screenAspect, 0.0);
      vec2 cell = vec2(size / screenAspect, size);
      vec4 sum = vec4(0.0);
      for (int y = 0; y < 3; y++) {
        for (int x = 0; x < 3; x++) {
          sum += sampleHeadline(corner + cell * (vec2(float(x), float(y)) + 0.5) / 3.0);
        }
      }
      vec4 coverage = sum / 9.0;
      if (coverage.a < 0.001) return vec4(0.0);
      float lit = smoothstep(BLOCK_FILL - 0.05, BLOCK_FILL + 0.05, coverage.a);
      // Premultiplied: the type's own colour, solid where the block is lit.
      return vec4(coverage.rgb / coverage.a * lit, lit);
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

      // Sized with the other hero lenses: its visible ring at ~0.165 of the
      // frame's width.
      float innerRadius = 0.087;
      float outerRadius = 0.174;
      float basePixelSize = 0.055;
      float reveal = smoothstep(innerRadius, outerRadius, dist);
      float pixelSize = reveal * basePixelSize;
      pixelSize = pow(pixelSize, 1.5);

      // The image is pixelated everywhere but a clear window at the pointer.
      vec2 pixelated = dist < innerRadius
        ? textureUV
        : pixelate(textureUV, pixelSize, screenAspect, 0.0);

      pixelated = clamp(pixelated, vec2(0.001), vec2(0.999));

      // The headline is the inverse: sharp at rest, pixelated in the window,
      // so the pointer reads on the type as well as the portrait. Its blocks
      // keep one size, half the portrait's largest on the same grid, so four
      // fill each of the portrait's blocks; a size that shrank with distance
      // would smear thin type into streaks. The window's edge on the type is
      // a hard line (antialiased over ~1.5px) on the portrait's visible ring.
      // The portrait's small blocks blend into a smooth image across most of
      // its ramp, so its ring reads near the outer radius. A soft band would
      // show the sharp and blocky type at once.
      // Each block shows its centre, so the blocky type sits where the sharp
      // type does (a corner would shift it up and left by half a block).
      float typeEdge = mix(innerRadius, outerRadius, 0.9);
      float typeAa = 1.5 / resolution.x;
      float inWindow = 1.0 - smoothstep(typeEdge - typeAa, typeEdge + typeAa, dist);
      vec4 type = mix(
        sampleHeadline(textureUV),
        typeBlock(textureUV, pow(basePixelSize, 1.5) * 0.5, screenAspect),
        inWindow * hover
      );

      gl_FragColor = over(type, texture2D(image, pixelated) * g_inFrame);
    }
`;
