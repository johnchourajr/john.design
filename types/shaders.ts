export type ShaderVariant = 'distortion' | 'ripple' | 'fluted' | 'smoke';

export const fragmentShaders: Record<ShaderVariant, string> = {
  distortion: `
    precision highp float;
    uniform vec2 resolution;
    uniform vec2 mouse;
    uniform float time;
    uniform sampler2D image;
    uniform vec2 imageResolution;

    void main() {
      vec2 uv = vec2(gl_FragCoord.x, resolution.y - gl_FragCoord.y) / resolution.xy;
      float aspect = resolution.x / resolution.y;
      vec2 adjustedUV = aspect > 1.0 ?
        vec2((uv.x - 0.5) * aspect + 0.5, uv.y) :
        vec2(uv.x, (uv.y - 0.5) / aspect + 0.5);

      vec2 mouseUV = vec2(mouse.x / resolution.x, 1.0 - mouse.y / resolution.y);
      float dist = distance(adjustedUV, mouseUV);
      float strength = smoothstep(0.2, 0.0, dist);
      vec2 displacement = normalize(adjustedUV - mouseUV) * strength * 0.1;

      vec4 color = texture2D(image, adjustedUV - displacement);
      float noise = fract(sin(dot(adjustedUV, vec2(12.9898, 78.233))) * 43758.5453);
      vec2 pos = adjustedUV + displacement * noise * sin(time) * 1.5;

      gl_FragColor = adjustedUV.x < 0.0 || adjustedUV.x > 1.0 || adjustedUV.y < 0.0 || adjustedUV.y > 1.0
        ? vec4(0.0)
        : texture2D(image, pos);
    }
  `,

  ripple: `
    precision highp float;
    uniform vec2 resolution;
    uniform vec2 mouse;
    uniform float time;
    uniform sampler2D image;
    uniform vec2 imageResolution;

    void main() {
      vec2 uv = vec2(gl_FragCoord.x, resolution.y - gl_FragCoord.y) / resolution.xy;
      float aspect = resolution.x / resolution.y;
      vec2 adjustedUV = aspect > 1.0 ?
        vec2((uv.x - 0.5) * aspect + 0.5, uv.y) :
        vec2(uv.x, (uv.y - 0.5) / aspect + 0.5);

      vec2 mouseUV = vec2(mouse.x / resolution.x, 1.0 - mouse.y / resolution.y);
      float dist = distance(adjustedUV, mouseUV);
      vec2 direction = normalize(adjustedUV - mouseUV);

      // Create waves that follow the cursor
      float wave = sin(dist * 30.0 - time * 3.0) * 0.015;
      wave *= smoothstep(0.5, 0.0, dist); // fade out with distance
      vec2 newUV = adjustedUV - direction * wave;

      gl_FragColor = newUV.x < 0.0 || newUV.x > 1.0 || newUV.y < 0.0 || newUV.y > 1.0
        ? vec4(0.0)
        : texture2D(image, newUV);
    }
  `,

  fluted: `
    precision highp float;
    uniform vec2 resolution;
    uniform vec2 mouse;
    uniform float time;
    uniform sampler2D image;
    uniform vec2 imageResolution;

    void main() {
      vec2 uv = vec2(gl_FragCoord.x, resolution.y - gl_FragCoord.y) / resolution.xy;
      float aspect = resolution.x / resolution.y;
      vec2 adjustedUV = aspect > 1.0 ?
        vec2((uv.x - 0.5) * aspect + 0.5, uv.y) :
        vec2(uv.x, (uv.y - 0.5) / aspect + 0.5);

      // Mouse-following fluted effect
      vec2 mouseUV = vec2(mouse.x / resolution.x, 1.0 - mouse.y / resolution.y);
      float dist = distance(adjustedUV, mouseUV);
      vec2 direction = normalize(adjustedUV - mouseUV);

      // Create radial flutes that follow the cursor
      float flutes = 50.0;
      float angle = atan(direction.y, direction.x);
      float distortionStrength = 0.045 * smoothstep(0.5, 0.0, dist);

      // Main fluted pattern relative to cursor
      float wave = sin(angle * flutes + dist * 20.0 + time * 0.2) * distortionStrength;
      wave += sin(angle * flutes * 1.5 + dist * 15.0 + time * 0.1) * distortionStrength * 0.5;

      // Apply distortion relative to cursor position
      vec2 distortedUV = adjustedUV;
      distortedUV += direction * wave;

      // Chromatic aberration following cursor
      vec2 redOffset = distortedUV + direction * wave * 0.02;
      vec2 blueOffset = distortedUV - direction * wave * 0.02;

      // Final color with cursor-relative chromatic aberration
      vec4 redChannel = texture2D(image, redOffset);
      vec4 greenChannel = texture2D(image, distortedUV);
      vec4 blueChannel = texture2D(image, blueOffset);
      vec4 finalColor = vec4(redChannel.r, greenChannel.g, blueChannel.b, 1.0);

      gl_FragColor = distortedUV.x < 0.0 || distortedUV.x > 1.0 || distortedUV.y < 0.0 || distortedUV.y > 1.0
        ? vec4(0.0)
        : finalColor;
    }
  `,

  smoke: `
    precision highp float;
    uniform vec2 resolution;
    uniform vec2 mouse;
    uniform float time;
    uniform sampler2D image;
    uniform vec2 imageResolution;

    // Improved random functions for more organic feel
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    vec2 random2(vec2 st) {
      st = vec2(dot(st,vec2(127.1,311.7)), dot(st,vec2(269.5,183.3)));
      return -1.0 + 2.0 * fract(sin(st)*43758.5453123);
    }

    // Organic cellular noise
    float organicNoise(vec2 st) {
      vec2 i_st = floor(st);
      vec2 f_st = fract(st);

      float minDist = 1.;
      float secondMinDist = 1.;

      for (int y = -2; y <= 2; y++) {
        for (int x = -2; x <= 2; x++) {
          vec2 neighbor = vec2(float(x),float(y));
          vec2 point = random2(i_st + neighbor);

          // Add organic movement
          point = 0.5 + 0.5 * sin(time * 0.3 + 6.2831 * point);
          point += 0.1 * sin(time * 0.2 + 4.2831 * point.yx); // Cross movement

          vec2 diff = neighbor + point - f_st;
          float dist = length(diff) * (1.0 + 0.1 * random(i_st + neighbor));

          if (dist < minDist) {
            secondMinDist = minDist;
            minDist = dist;
          } else if (dist < secondMinDist) {
            secondMinDist = dist;
          }
        }
      }

      // Create soft edges between cells
      float h = smoothstep(0.0, 1.0, 0.5 + 0.5 * (secondMinDist - minDist));
      return mix(minDist, secondMinDist, h);
    }

    void main() {
      vec2 uv = vec2(gl_FragCoord.x, resolution.y - gl_FragCoord.y) / resolution.xy;
      float aspect = resolution.x / resolution.y;
      vec2 adjustedUV = aspect > 1.0 ?
        vec2((uv.x - 0.5) * aspect + 0.5, uv.y) :
        vec2(uv.x, (uv.y - 0.5) / aspect + 0.5);

      vec2 mouseUV = vec2(mouse.x / resolution.x, 1.0 - mouse.y / resolution.y);
      float dist = distance(adjustedUV, mouseUV);

      // More organic particle diffusion
      float scale = 12.0; // Reduced scale for larger particles
      vec2 noiseCoord = adjustedUV * scale;
      float particle = organicNoise(noiseCoord + time * 0.2);

      // Soften the particle edges
      particle = smoothstep(0.2, 0.8, particle);
      particle *= smoothstep(0.8, 0.2, particle);

      float mouseStrength = smoothstep(0.4, 0.0, dist);
      vec2 pushDir = normalize(adjustedUV - mouseUV);

      // More fluid movement
      float noise = random(adjustedUV + time * 0.15);
      vec2 particleOffset = pushDir * mouseStrength * 0.35;
      particleOffset += vec2(
        sin(noise * 4.28 + time * 0.7) * 0.015,
        cos(noise * 3.28 + time * 0.6) * 0.015
      ) * smoothstep(0.6, 0.0, particle);

      // Smoother swirling
      float swirl = sin(noise * 4.28 + time * 1.5) * 0.7 + 0.3;
      mat2 rotation = mat2(
        cos(swirl), -sin(swirl),
        sin(swirl), cos(swirl)
      );
      particleOffset = rotation * particleOffset;

      vec2 finalUV = adjustedUV + particleOffset * mix(0.8, particle, 0.9);
      finalUV += (random2(finalUV + time * 0.15) * mouseStrength * 0.06);

      vec4 color = texture2D(image, finalUV);
      float density = smoothstep(0.1, 0.9, particle);
      color.rgb *= mix(1.0, density, mouseStrength * 0.8);

      gl_FragColor = finalUV.x < 0.0 || finalUV.x > 1.0 || finalUV.y < 0.0 || finalUV.y > 1.0
        ? vec4(0.0)
        : color;
    }
  `,
};
