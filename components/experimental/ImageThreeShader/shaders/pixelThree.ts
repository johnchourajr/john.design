export const pixelShader = `
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

      vec2 effectUV = uv;
      effectUV.x *= screenAspect;

      vec2 mouseUV = vec2(mouse.x / resolution.x * screenAspect, 1.0 - mouse.y / resolution.y);
      float dist = distance(effectUV, mouseUV) / screenAspect;

      float innerRadius = 0.07;
      float outerRadius = 0.14;
      float pixelSize = smoothstep(innerRadius, outerRadius, dist) * 0.05;
      pixelSize = pow(pixelSize, 1.5);

      vec2 pixelated = dist < innerRadius
        ? textureUV
        : floor(textureUV / pixelSize) * pixelSize;

      // Clamp pixelated coordinates to avoid hairline issues
      pixelated = clamp(pixelated, vec2(0.0), vec2(1.0));

      float wobble = sin(time * 2.0 + dist * 10.0) * 0.002;
      wobble *= smoothstep(innerRadius, outerRadius, dist);
      pixelated += vec2(wobble) / vec2(screenAspect, 1.0);

      gl_FragColor = pixelated.x < 0.0 || pixelated.x > 1.0 || pixelated.y < 0.0 || pixelated.y > 1.0
        ? vec4(0.0)
        : texture2D(image, pixelated);
    }
`;
