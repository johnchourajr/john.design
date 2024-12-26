export const zoomThree = `
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

      vec2 effectUV = uv;
      effectUV.x *= screenAspect;

      vec2 mouseUV = vec2(mouse.x / resolution.x * screenAspect, 1.0 - mouse.y / resolution.y);
      float dist = distance(effectUV, mouseUV) / screenAspect;

      float zoomStrength = smoothstep(0.3, 0.0, dist) * 0.25;
      vec2 zoomOffset = (textureUV - mouseUV) * zoomStrength;
      zoomOffset.x *= screenAspect;
      vec2 zoomedUV = textureUV - zoomOffset;

      float lensDistort = 1.0 - dist * 0.3;
      vec2 distortedOffset = (zoomedUV - mouseUV);
      distortedOffset.x *= screenAspect;
      zoomedUV = mouseUV + distortedOffset * lensDistort;

      float aberration = smoothstep(0.3, 0.0, dist) * 0.01;
      vec4 red = texture2D(image, zoomedUV - aberration);
      vec4 green = texture2D(image, zoomedUV);
      vec4 blue = texture2D(image, zoomedUV + aberration);
      vec4 color = vec4(red.r, green.g, blue.b, 1.0);

      gl_FragColor = zoomedUV.x < 0.0 || zoomedUV.x > 1.0 || zoomedUV.y < 0.0 || zoomedUV.y > 1.0
        ? vec4(0.0)
        : color;
    }
`;
