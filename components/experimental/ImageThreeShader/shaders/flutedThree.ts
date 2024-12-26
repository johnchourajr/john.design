export const flutedShader = `
    precision highp float;
    uniform vec2 resolution;
    uniform vec2 mouse;
    uniform float time;
    uniform sampler2D image;
    uniform vec2 imageResolution;
    varying vec2 vUv;


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

      // Effect calculations
      vec2 effectUV = uv;
      effectUV.x *= screenAspect;

      vec2 mouseUV = vec2(mouse.x / resolution.x * screenAspect, 1.0 - mouse.y / resolution.y);
      float dist = distance(effectUV, mouseUV) / screenAspect;
      vec2 direction = normalize(effectUV - mouseUV);
      direction.x /= screenAspect;

      float radius = 0.2;
      float falloff = 0.05;
      float distortionStrength = smoothstep(radius, radius - falloff, dist);

      // Fluted specific effects
      float flutes = 50.0;
      float angle = atan(direction.y, direction.x);
      float wave = sin(angle * flutes + dist * 20.0 + time * 0.2) * 0.045;
      wave += sin(angle * flutes * 1.5 + dist * 15.0 + time * 0.1) * 0.02;
      wave *= distortionStrength;

      vec2 distortedUV = textureUV + direction * wave;

      // Chromatic aberration following cursor
      float chromaticStrength = 0.02;
      vec2 redOffset = distortedUV + direction * wave * chromaticStrength;
      vec2 blueOffset = distortedUV - direction * wave * chromaticStrength;

      // Final color with cursor-relative chromatic aberration
      vec4 redChannel = texture2D(image, redOffset);
      vec4 greenChannel = texture2D(image, distortedUV);
      vec4 blueChannel = texture2D(image, blueOffset);
      vec4 finalColor = vec4(redChannel.r, greenChannel.g, blueChannel.b, 1.0);

      gl_FragColor = distortedUV.x < 0.0 || distortedUV.x > 1.0 || distortedUV.y < 0.0 || distortedUV.y > 1.0
        ? vec4(0.0)
        : finalColor;
    }
`;
