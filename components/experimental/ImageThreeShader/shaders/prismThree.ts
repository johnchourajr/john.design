import { layers } from './layers';

export const prismShader = `
  precision highp float;
  uniform vec2 resolution;
  uniform vec2 mouse;
  uniform float time;
  uniform sampler2D image;
  uniform vec2 imageResolution;
  varying vec2 vUv;

  ${layers}

  #define IOR 1.5
  #define DISPERSION 0.05
  #define ABSORPTION vec3(0.04)
  #define INTERNAL_REFLECTIONS 4

  mat2 rot2(float a) {
    float c = cos(a), s = sin(a);
    return mat2(c, -s, s, c);
  }

  vec3 rotateCube(vec3 p, vec3 r) {
    p.yz *= rot2(r.x);
    p.xz *= rot2(-r.y);
    p.xy *= rot2(r.z);
    return p;
  }

  float interiorCubeReflection(vec3 ro, vec3 rd) {
    vec3 d = (0.5 * sign(rd) - ro) / rd;
    return min(min(d.x, d.y), d.z);
  }

  float intersectCube(vec3 ro, vec3 rd) {
    float dfront = -interiorCubeReflection(-ro, rd);
    float dback = interiorCubeReflection(ro, rd);
    // Add small epsilon to avoid edge cases
    return (dback - dfront) > 0.001 ? dfront : -1.0;
  }

  float getReflectance(vec3 incident, vec3 transmitted, vec3 nor, float iorA, float iorB) {
    float cosI = abs(dot(incident, nor));
    float cosT = abs(dot(transmitted, nor));
    float rs = (iorA * cosI - iorB * cosT) / (iorA * cosI + iorB * cosT);
    float rp = (iorB * cosI - iorA * cosT) / (iorB * cosI + iorA * cosT);
    return (rs * rs + rp * rp) / 2.0;
  }

  // Global for current texture position
  vec2 g_textureUV;
  // The headline seen through the cube, gathered alongside the image by
  // renderCubeWithEdge, with the same weights.
  vec4 g_typeThrough;

  vec3 sampleImage(vec3 rd) {
    // Sample from the current pixel's texture position with refraction offset
    vec2 offset = rd.xy * 0.2;
    vec2 uv = g_textureUV + offset;
    uv = clamp(uv, 0.0, 1.0);
    return texture2D(image, uv).rgb;
  }

  // The headline along a refracted ray, unclamped: it can run past the image.
  // On its own, a headline is one short line in a tall frame: bent as far
  // as the portrait, its letters would refract clean out of the cube, so
  // they bend less and stay legible in the glass.
  vec4 sampleType(vec3 rd) {
    return sampleHeadline(g_textureUV + rd.xy * mix(0.2, 0.05, hideImage));
  }

  // Returns vec4: rgb = color, a = edge distance (0 = at edge, 1 = center)
  vec4 renderCubeWithEdge(vec3 ro, vec3 rd, float dispersionOffset) {
    float rl = intersectCube(ro, rd);
    g_typeThrough = vec4(0.0);

    if (rl > 0.0) {
      float ior = IOR + DISPERSION * (dispersionOffset - 0.5);

      vec3 xyz = ro + rd * rl;

      // Compute edge distance - how close to cube corners/edges
      vec3 absXyz = abs(xyz);
      // Distance to nearest edge: for each axis, how far from ±0.5
      vec3 edgeDistPerAxis = 0.5 - absXyz;
      // Sort to find two smallest (those are the face coordinates, not the face normal axis)
      float d1 = edgeDistPerAxis.x;
      float d2 = edgeDistPerAxis.y;
      float d3 = edgeDistPerAxis.z;
      // Edge distance is min of the two smallest
      float edgeDist = min(d1, min(d2, d3));

      vec3 nor = round(xyz * 1.00001);
      vec3 power = vec3(1.0);
      vec3 refractd = refract(rd, nor, 1.0 / ior);
      vec3 reflectd = reflect(rd, nor);
      float refl = getReflectance(rd, refractd, nor, 1.0, ior);
      vec3 c = sampleImage(reflectd) * refl;
      g_typeThrough = sampleType(reflectd) * refl;
      power *= 1.0 - refl;
      rd = refractd;

      for (int i = 0; i < INTERNAL_REFLECTIONS; i++) {
        rl = interiorCubeReflection(xyz, rd);
        xyz += rd * rl;
        nor = round(xyz * 1.00001);
        refractd = refract(rd, -nor, 1.0 / ior);
        reflectd = reflect(rd, -nor);
        refl = getReflectance(rd, refractd, -nor, ior, 1.0);
        power *= exp(-ABSORPTION * rl);
        c += sampleImage(refractd) * (1.0 - refl) * power;
        g_typeThrough += sampleType(refractd) * (1.0 - refl) * power.x;
        power *= refl;
        rd = reflectd;
      }
      return vec4(c, edgeDist);
    }
    return vec4(-1.0);
  }

  void main() {
    vec2 uv = frameUv();

    vec2 textureUV = imageUv(uv);

    // Set global for image sampling
    g_textureUV = textureUV;

    // Mouse position normalized (0-1). A headline on its own has no image
    // to keep the cube inside, so the cube reaches every letter.
    vec2 mouseNorm = vec2(mouse.x / resolution.x, 1.0 - mouse.y / resolution.y);
    vec2 mouseClamped = clamp(mouseNorm, 0.2, 0.8);
    if (hideImage < 0.5) mouseNorm = mouseClamped;

    // ShaderToy-style normalized coordinates centered on mouse
    vec2 fragCoord = uv * resolution;
    vec2 mouseCoord = mouseNorm * resolution;
    vec2 centered = (2.0 * fragCoord - resolution) / resolution.y;
    vec2 mouseCentered = (2.0 * mouseCoord - resolution) / resolution.y;
    vec2 localCoord = centered - mouseCentered;

    // Ray setup
    vec3 ro = vec3(0.0, 0.0, -1.9);
    vec3 rd = normalize(vec3(localCoord, 1.0));

    // Mouse influence on rotation (centered at 0.5)
    vec2 mouseInfluence = (mouseClamped - 0.5) * 0.6;

    // Rotation with mouse influence
    vec3 rotation = vec3(
      time * 0.3 + mouseInfluence.y * 0.5,
      time * 0.4 - mouseInfluence.x * 0.5,
      time * 0.2
    );
    ro = rotateCube(ro, rotation);
    rd = rotateCube(rd, rotation);

    // Render with edge detection
    vec4 bgColor = texture2D(image, textureUV) * g_inFrame;
    vec4 restingType = sampleHeadline(textureUV);
    vec4 type = restingType;
    float hitTest = intersectCube(ro, rd);

    if (hitTest > 0.01 && (g_inFrame > 0.5 || hideImage > 0.5)) {
      vec4 rResult = renderCubeWithEdge(ro, rd, 0.0);
      vec4 redType = g_typeThrough;
      vec4 gResult = renderCubeWithEdge(ro, rd, 0.5);
      vec4 greenType = g_typeThrough;
      vec4 bResult = renderCubeWithEdge(ro, rd, 1.0);
      vec4 blueType = g_typeThrough;

      vec3 col = vec3(rResult.r, gResult.g, bResult.b);
      float edgeDist = min(min(rResult.a, gResult.a), bResult.a);

      // The cube belongs to the image: past its frame, it stays cut off.
      if (g_inFrame > 0.5 && col.r >= 0.0 && col.g >= 0.0 && col.b >= 0.0) {
        col = smoothstep(0.0, 1.0, col);
        col = pow(col, vec3(0.4545));
        col *= 0.7;
        bgColor = vec4(col, 1.0);
      }

      // The type refracts and splits through the glass, as far as the
      // hover reaches, and takes the glass's tint.
      if (rResult.a > -1.0) {
        vec4 cubeType = vec4(
          redType.r,
          greenType.g,
          blueType.b,
          max(redType.a, max(greenType.a, blueType.a))
        );
        cubeType.rgb *= 0.85;
        type = mix(restingType, cubeType, hover);
      }
    }

    gl_FragColor = over(type, bgColor);
  }
`;
