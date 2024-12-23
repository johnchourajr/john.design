export type ShaderVariant = 'distortion' | 'ripple' | 'fluted' | 'vertical';

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
      float noise = fract(sin(dot(adjustedUV, vec2(1, 78.233))) * 43758.5453);
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
        vec2((uv.x - 0.15) * aspect + 0.15, uv.y) :
        vec2(uv.x, (uv.y - 0.5) / aspect + 0.5);

      vec2 mouseUV = vec2(mouse.x / resolution.x, 1.0 - mouse.y / resolution.y);
      float dist = distance(adjustedUV, mouseUV);
      vec2 direction = normalize(adjustedUV - mouseUV);

      // Create waves that follow the cursor
      float wave = sin(dist * 60.0 - time * 3.0) * 0.2;
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

  vertical: `
    precision highp float;
    uniform vec2 resolution;
    uniform vec2 mouse;
    uniform float time;
    uniform sampler2D image;
    uniform vec2 imageResolution;

    float sharpenWave(float x, float power) {
      return pow(0.5 + 0.5 * sin(x), power) * 2.0 - 1.0;
    }

    void main() {
      vec2 uv = vec2(gl_FragCoord.x, resolution.y - gl_FragCoord.y) / resolution.xy;
      float aspect = resolution.x / resolution.y;
      vec2 adjustedUV = aspect > 1.0 ?
        vec2((uv.x - 0.5) * aspect + 0.5, uv.y) :
        vec2(uv.x, (uv.y - 0.5) / aspect + 0.5);

      vec2 mouseUV = vec2(mouse.x / resolution.x, 1.0 - mouse.y / resolution.y);
      float dist = distance(adjustedUV, mouseUV);
      vec2 direction = normalize(adjustedUV - mouseUV);

      // Reduced radius of effect
      float radius = 0.2; // Smaller radius (was implicitly 0.5 before)
      float falloff = 0.05; // Sharper falloff for the effect edge
      float distortionStrength = 0.02 * smoothstep(radius, radius - falloff, dist);

      // Vertical fluted pattern with sharper definition
      float flutes = 300.0;

      // Sharper wave pattern
      float sharpness = 0.5; // Controls the crispness of the lines
      float baseWave = sharpenWave(adjustedUV.x * flutes + time * 0.2, sharpness);
      float detailWave = sharpenWave(adjustedUV.x * flutes * 1.25 + time * 0.1, sharpness);

      float wave = baseWave * distortionStrength;
      wave += detailWave * distortionStrength * 0.35; // Reduced secondary wave influence

      // Apply distortion with vertical emphasis
      vec2 distortedUV = adjustedUV;
      distortedUV.x += wave;

      // Tighter mouse interaction area
      distortedUV += direction * wave * smoothstep(radius, radius - falloff, dist);

      // Sharper chromatic aberration
      float chromaticOffset = 0.015; // Reduced chromatic aberration for cleaner look
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
  `,
};
