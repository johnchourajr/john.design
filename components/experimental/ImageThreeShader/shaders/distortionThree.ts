export const distortionThreeShader = `
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

      // Aspect-corrected UV for effect calculations
      vec2 effectUV = uv;
      effectUV.x *= screenAspect;

      vec2 mouseUV = vec2(mouse.x / resolution.x * screenAspect, 1.0 - mouse.y / resolution.y);
      float dist = distance(effectUV, mouseUV) / screenAspect; // Normalize distance
      float strength = smoothstep(0.2, 0.0, dist);
      vec2 displacement = normalize(effectUV - mouseUV) * strength * 0.1;
      displacement.x /= screenAspect; // Correct displacement

      vec4 color = texture2D(image, textureUV - displacement);
      float noise = fract(sin(dot(effectUV, vec2(1, 78.233))) * 43758.5453);
      vec2 pos = textureUV + displacement * noise * sin(time) * 1.5;

      gl_FragColor = pos.x < 0.0 || pos.x > 1.0 || pos.y < 0.0 || pos.y > 1.0
        ? vec4(0.0)
        : texture2D(image, pos);
    }
`;
