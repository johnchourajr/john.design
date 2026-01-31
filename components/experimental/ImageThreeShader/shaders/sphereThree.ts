export const sphereShader = `
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

    // Glass sphere parameters
    float radius = 0.15;
    float padding = radius + 0.02;

    // Clamp mouse position to keep sphere inside canvas
    vec2 mouseUV = vec2(mouse.x / resolution.x * screenAspect, 1.0 - mouse.y / resolution.y);
    mouseUV.x = clamp(mouseUV.x, padding * screenAspect, screenAspect - padding * screenAspect);
    mouseUV.y = clamp(mouseUV.y, padding, 1.0 - padding);

    vec2 mouseTextureUV = vec2(mouseUV.x / screenAspect, mouseUV.y);
    float dist = distance(effectUV, mouseUV) / screenAspect;
    float edgeSoftness = 0.005;

    // Smooth edge mask
    float sphereMask = smoothstep(radius + edgeSoftness, radius - edgeSoftness, dist);

    // Outside the sphere - just show normal image
    if (sphereMask < 0.01) {
      gl_FragColor = texture2D(image, textureUV);
      return;
    }

    // Direction from sphere center
    vec2 dir = (effectUV - mouseUV);
    dir.x /= screenAspect;
    vec2 normDir = length(dir) > 0.001 ? normalize(dir) : vec2(0.0);

    // Normalize distance within sphere
    float normalizedDist = clamp(dist / radius, 0.0, 1.0);

    // Spherical depth
    float z = sqrt(max(0.0, 1.0 - normalizedDist * normalizedDist));
    vec3 normal = normalize(vec3(normDir * normalizedDist, z));

    // Glass ball refraction - center is clearer, edges distort more
    vec2 sphereCenter = mouseTextureUV;
    vec2 toPixel = textureUV - sphereCenter;

    // Refraction increases toward edges (based on surface angle)
    // Center (z=1) has minimal distortion, edges (z=0) have more
    float edgeFactor = 1.0 - z; // 0 at center, 1 at edge
    float refractionStrength = edgeFactor * edgeFactor * 0.12;

    // Slight magnification in center, compression at edges
    float magnification = 1.0 + z * 0.08 - edgeFactor * 0.15;
    vec2 sphereUV = sphereCenter + toPixel * magnification;

    // Add refraction offset pushing outward at edges
    sphereUV += normDir * refractionStrength;

    // Gentle oscillating variation
    float oscillation = sin(time * 0.8) * 0.5 + 0.5;
    float oscillateStrength = mix(0.01, 0.02, oscillation) * edgeFactor;
    sphereUV += normDir * oscillateStrength;

    // Chromatic aberration
    float chromatic = (1.0 - z) * 0.008;
    vec2 redUV = sphereUV + normDir * chromatic;
    vec2 blueUV = sphereUV - normDir * chromatic;

    vec4 redChannel = texture2D(image, redUV);
    vec4 greenChannel = texture2D(image, sphereUV);
    vec4 blueChannel = texture2D(image, blueUV);
    vec4 outsideColor = texture2D(image, textureUV);

    vec4 sphereColor = vec4(redChannel.r, greenChannel.g, blueChannel.b, 1.0);

    // Lighting - highlight moves based on cursor position, source from top-left
    vec2 cursorOffset = (mouseTextureUV - 0.5) * 0.4;
    vec3 lightDir = normalize(vec3(-0.7 - cursorOffset.x, 0.8 + cursorOffset.y, 0.5));
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    vec3 halfVec = normalize(lightDir + viewDir);

    // Fresnel - edges are brighter/more reflective
    float fresnel = pow(1.0 - z, 3.0);

    // Specular highlight
    float specular = pow(max(0.0, dot(normal, halfVec)), 48.0) * 0.2;

    // Rim light
    float rim = fresnel * 0.2;

    // Apply lighting effects
    sphereColor.rgb += specular;
    sphereColor.rgb += rim * vec3(0.95, 0.97, 1.0);

    // Slight darkening at edges (depth)
    sphereColor.rgb *= 0.9 + z * 0.1;

    // Blend with smooth edge
    vec4 finalColor = mix(outsideColor, sphereColor, sphereMask);

    gl_FragColor = finalColor;
  }
`;
