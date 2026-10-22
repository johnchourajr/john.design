import { layers } from './layers';

export const sphereShader = `
  precision highp float;
  uniform vec2 resolution;
  uniform vec2 mouse;
  uniform float time;
  uniform sampler2D image;
  uniform vec2 imageResolution;
  varying vec2 vUv;

  ${layers}

  // The headline over the image at one point.
  vec4 sampleLayers(vec2 textureUV) {
    return over(sampleHeadline(textureUV), texture2D(image, textureUV) * g_inFrame);
  }

  void main() {
    vec2 uv = frameUv();
    float screenAspect = resolution.x / resolution.y;

    vec2 textureUV = imageUv(uv);

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
    vec4 outsideColor = sampleLayers(textureUV);
    if (sphereMask < 0.01) {
      gl_FragColor = outsideColor;
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

    vec4 redChannel = sampleLayers(redUV);
    vec4 greenChannel = sampleLayers(sphereUV);
    vec4 blueChannel = sampleLayers(blueUV);

    // Opaque over the image, as before; over the headline alone, as solid as the type.
    float alpha = max(g_inFrame, max(redChannel.a, max(greenChannel.a, blueChannel.a)));
    vec4 sphereColor = vec4(redChannel.r, greenChannel.g, blueChannel.b, alpha);

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
    sphereColor.rgb += specular * alpha;
    sphereColor.rgb += rim * vec3(0.95, 0.97, 1.0) * alpha;

    // Slight darkening at edges (depth)
    sphereColor.rgb *= 0.9 + z * 0.1;

    // Blend with smooth edge
    vec4 finalColor = mix(outsideColor, sphereColor, sphereMask);

    gl_FragColor = finalColor;
  }
`;
