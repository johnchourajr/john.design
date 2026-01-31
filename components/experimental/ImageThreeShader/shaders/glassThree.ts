export const glassShader = `
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

    // Glass refraction effect
    float radius = 0.18;
    float strength = smoothstep(radius, 0.0, dist);

    // Direction from mouse to pixel
    vec2 dir = normalize(effectUV - mouseUV);
    dir.x /= screenAspect;

    // Thick glass refraction - bends light toward center
    float refraction = strength * 0.08;
    float edgeBend = pow(dist / radius, 2.0) * strength;

    vec2 refractedUV = textureUV - dir * refraction * (1.0 - edgeBend);

    // Subtle chromatic aberration at edges
    float chromatic = strength * 0.006 * (1.0 - strength);
    vec2 redUV = refractedUV + dir * chromatic;
    vec2 blueUV = refractedUV - dir * chromatic;

    vec4 redChannel = texture2D(image, redUV);
    vec4 greenChannel = texture2D(image, refractedUV);
    vec4 blueChannel = texture2D(image, blueUV);

    vec4 color = vec4(redChannel.r, greenChannel.g, blueChannel.b, 1.0);

    // Subtle brightness boost in center (caustic-like)
    float caustic = pow(strength, 3.0) * 0.15;
    color.rgb += caustic;

    gl_FragColor = refractedUV.x < 0.0 || refractedUV.x > 1.0 || refractedUV.y < 0.0 || refractedUV.y > 1.0
      ? vec4(0.0)
      : color;
  }
`;
