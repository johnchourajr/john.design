import { layers } from './layers';

export const distortionThreeShader = `
    precision highp float;
    uniform vec2 resolution;
    uniform vec2 mouse;
    uniform float time;
    uniform sampler2D image;
    uniform vec2 imageResolution;
    varying vec2 vUv;

    ${layers}

    void main() {
      vec2 uv = frameUv();
      float screenAspect = resolution.x / resolution.y;

      // Aspect-corrected UV for texture sampling
      vec2 textureUV = imageUv(uv);

      // Aspect-corrected UV for effect calculations
      vec2 effectUV = uv;
      effectUV.x *= screenAspect;

      vec2 mouseUV = vec2(mouse.x / resolution.x * screenAspect, 1.0 - mouse.y / resolution.y);
      float dist = distance(effectUV, mouseUV) / screenAspect; // Normalize distance
      float strength = smoothstep(0.2, 0.0, dist);
      vec2 displacement = normalize(effectUV - mouseUV) * strength * 0.1;
      displacement.x /= screenAspect; // Correct displacement

      float noise = fract(sin(dot(effectUV, vec2(1, 78.233))) * 43758.5453);
      vec2 pos = textureUV + displacement * noise * sin(time) * 1.5;

      vec4 imageColor = pos.x < 0.0 || pos.x > 1.0 || pos.y < 0.0 || pos.y > 1.0
        ? vec4(0.0)
        : texture2D(image, pos);

      // The type scatters the same way, but never fades to nothing as
      // sin(time) crosses zero, so a hover always shows.
      float typePulse = 0.75 + 0.25 * sin(time);
      vec2 typePos = textureUV + displacement * noise * typePulse * 1.5 * hover;
      gl_FragColor = over(sampleHeadline(typePos), imageColor * g_inFrame);
    }
`;
