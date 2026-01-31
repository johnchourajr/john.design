export const liquidShader = `
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

    // Liquid displacement
    float radius = 0.2;
    float strength = smoothstep(radius, 0.0, dist);

    // Direction from mouse
    vec2 dir = normalize(effectUV - mouseUV);
    dir.x /= screenAspect;

    // Smooth, flowing displacement
    float flowSpeed = 1.5;
    float displacement = sin(dist * 25.0 - time * flowSpeed) * 0.04 * strength;
    displacement += sin(dist * 40.0 - time * flowSpeed * 1.3) * 0.015 * strength;

    // Push outward from center
    float push = strength * 0.05 * (1.0 - dist / radius);

    vec2 liquidUV = textureUV + dir * (displacement + push);

    // Smooth chromatic separation
    float chromatic = strength * 0.008;
    vec2 redUV = liquidUV + dir * chromatic;
    vec2 blueUV = liquidUV - dir * chromatic;

    vec4 redChannel = texture2D(image, redUV);
    vec4 greenChannel = texture2D(image, liquidUV);
    vec4 blueChannel = texture2D(image, blueUV);

    vec4 color = vec4(redChannel.r, greenChannel.g, blueChannel.b, 1.0);

    gl_FragColor = liquidUV.x < 0.0 || liquidUV.x > 1.0 || liquidUV.y < 0.0 || liquidUV.y > 1.0
      ? vec4(0.0)
      : color;
  }
`;
