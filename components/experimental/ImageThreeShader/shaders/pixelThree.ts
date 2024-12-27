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

      // Create normalized effect space
      vec2 effectUV = uv;
      effectUV.x *= screenAspect;

      vec2 mouseUV = vec2(mouse.x / resolution.x * screenAspect, 1.0 - mouse.y / resolution.y);
      float dist = distance(effectUV, mouseUV) / screenAspect;

      float innerRadius = 0.07;
      float outerRadius = 0.14;
      float basePixelSize = 0.055;
      float pixelSize = smoothstep(innerRadius, outerRadius, dist) * basePixelSize;
      pixelSize = pow(pixelSize, 1.5);

      // Apply pixelation in normalized space
      vec2 normalizedUV = textureUV;
      normalizedUV.x *= screenAspect;

      vec2 pixelated;
      if (dist < innerRadius) {
        pixelated = textureUV;
      } else {
        normalizedUV = floor(normalizedUV / pixelSize) * pixelSize;
        pixelated = normalizedUV;
        pixelated.x /= screenAspect;
      }

      float wobble = sin(time * 2.0 + dist * 10.0) * 0.002;
      wobble *= smoothstep(innerRadius, outerRadius, dist);
      pixelated += wobble;

      pixelated = clamp(pixelated, vec2(0.001), vec2(0.999));
      gl_FragColor = texture2D(image, pixelated);
    }
`;
