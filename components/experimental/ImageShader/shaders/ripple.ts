export const rippleShader = `
    precision highp float;
    uniform vec2 resolution;
    uniform vec2 mouse;
    uniform float time;
    uniform sampler2D image;
    uniform vec2 imageResolution;

    void main() {
      vec2 uv = gl_FragCoord.xy / resolution.xy;
      uv.y = 1.0 - uv.y;

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

      // Effect calculations
      vec2 effectUV = uv;
      effectUV.x *= screenAspect;

      vec2 mouseUV = vec2(mouse.x / resolution.x * screenAspect, 1.0 - mouse.y / resolution.y);
      float dist = distance(effectUV, mouseUV) / screenAspect;

      float radius = 0.2;
      float falloff = 0.05;
      float distortionStrength = smoothstep(radius, radius - falloff, dist);

      vec2 direction = normalize(effectUV - mouseUV);
      direction.x /= screenAspect;  // Correct the direction aspect ratio

      // Create waves that follow the cursor
      float wave = sin(dist * 60.0 - time * 2.5) * 0.3;
      wave *= distortionStrength;

      vec2 newUV = textureUV;
      newUV += direction * wave;

      gl_FragColor = newUV.x < 0.0 || newUV.x > 1.0 || newUV.y < 0.0 || newUV.y > 1.0
        ? vec4(0.0)
        : texture2D(image, newUV);
    }
`;
