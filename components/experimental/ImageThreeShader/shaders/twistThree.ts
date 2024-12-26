export const twistShader = `
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

    float angle = atan(textureUV.y - mouseUV.y, (textureUV.x - mouseUV.x) * screenAspect);
    float twistAmount = smoothstep(0.5, 0.0, dist) * 3.0;
    float twist = angle + dist * 10.0 * twistAmount + time;

    vec2 offset = vec2(cos(twist), sin(twist)) * dist * 0.1;
    offset.x /= screenAspect;
    vec2 twistedUV = textureUV + offset * smoothstep(0.5, 0.0, dist);

    gl_FragColor = twistedUV.x < 0.0 || twistedUV.x > 1.0 || twistedUV.y < 0.0 || twistedUV.y > 1.0
      ? vec4(0.0)
      : texture2D(image, twistedUV);
  }
`;
