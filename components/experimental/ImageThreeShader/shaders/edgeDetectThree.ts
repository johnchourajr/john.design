export const edgeDetectShader = `
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
    float strength = smoothstep(0.3, 0.0, dist);

    // Sample offset for edge detection
    float offset = 0.002;

    // Sobel edge detection
    vec2 texelSize = vec2(1.0 / imageResolution.x, 1.0 / imageResolution.y);

    // Sample surrounding pixels
    vec4 topLeft = texture2D(image, textureUV + vec2(-texelSize.x, -texelSize.y));
    vec4 top = texture2D(image, textureUV + vec2(0.0, -texelSize.y));
    vec4 topRight = texture2D(image, textureUV + vec2(texelSize.x, -texelSize.y));
    vec4 left = texture2D(image, textureUV + vec2(-texelSize.x, 0.0));
    vec4 right = texture2D(image, textureUV + vec2(texelSize.x, 0.0));
    vec4 bottomLeft = texture2D(image, textureUV + vec2(-texelSize.x, texelSize.y));
    vec4 bottom = texture2D(image, textureUV + vec2(0.0, texelSize.y));
    vec4 bottomRight = texture2D(image, textureUV + vec2(texelSize.x, texelSize.y));

    // Calculate gradients
    float gx = -topLeft.r - 2.0 * left.r - bottomLeft.r + topRight.r + 2.0 * right.r + bottomRight.r;
    float gy = -topLeft.r - 2.0 * top.r - topRight.r + bottomLeft.r + 2.0 * bottom.r + bottomRight.r;

    float edge = sqrt(gx * gx + gy * gy);
    edge = clamp(edge * 3.0, 0.0, 1.0);

    // Original color
    vec4 originalColor = texture2D(image, textureUV);

    // Mix edge detection with original based on mouse distance
    vec4 edgeColor = vec4(edge, edge, edge, 1.0);
    vec4 finalColor = mix(originalColor, edgeColor, strength * 0.7);

    // Add color to edges
    finalColor.rgb = mix(finalColor.rgb, vec3(1.0, 1.0, 0.0), edge * strength * 0.3);

    gl_FragColor = finalColor;
  }
`;
