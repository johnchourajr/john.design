import { layers } from './layers';

/**
 * A glass cube that turns over the pointer. It is the inverse of the other
 * lenses, like pixel: the portrait stays clean and sharp, and the cube acts
 * on the type, magnifying it about the cube's centre with a colour split
 * that is zero in the middle and grows toward the cube's edges.
 *
 * Unlike the other variants, the type's cube isn't gated by hover: the cube
 * always sits on the hero, as it always has on the portrait. A headline on
 * its own keeps the cube off the canvas until the pointer first arrives.
 */
export const prismShader = `
  precision highp float;
  uniform vec2 resolution;
  uniform vec2 mouse;
  uniform float time;
  uniform sampler2D image;
  uniform vec2 imageResolution;
  varying vec2 vUv;

  ${layers}

  // How much the type grows inside the cube, and how far its colours split
  // at the cube's edge (in frame heights).
  #define MAGNIFY 1.4
  // How far the type shifts along the ray refracted through the face it is
  // seen through (in frame heights per unit of ray). Each face bends it its
  // own way, so the type breaks at the cube's edges like a prism. Off for
  // now in favour of the rim below; kept to compare.
  #define BEND 0.0
  // Liquid glass: the type stays true where the glass is thick and bends
  // in a band along the cube's outline, where it thins to nothing. RIM is
  // the glass thickness (in cube units; ~1 through the middle) under which
  // the bend starts, and RIM_BEND how far the type is pulled at the very
  // outline (in frame heights).
  #define RIM 0.45
  #define RIM_BEND 0.035
  // The glass thickness over which the refracted portrait fades in from
  // the outline, hiding the bright grazing-angle rim.
  #define OUTLINE_FADE 0.06
  #define SPLIT 0.005
  // The cube's silhouette reaches about this far from its centre, in the
  // centred units below. The split grows over that distance.
  #define REACH 0.35
  // How far the camera sits from the cube. Further is smaller: at 2.2 the
  // cube's silhouette spans ~0.15 to 0.2 of the frame's width as it turns,
  // sized with the other hero lenses.
  #define CUBE_DISTANCE 2.2
  // The type's grainy blur in the cube: each pixel averages a few samples
  // up to this far away (in frame heights), different per colour channel,
  // so letters soften and their edges break up like dithering. A share of
  // it holds at the centre.
  #define DITHER 0.0055
  #define DITHER_CENTRE 0.35
  // The glass the portrait is seen through.
  #define IOR 1.5
  #define DISPERSION 0.05
  #define ABSORPTION vec3(0.04)
  #define INTERNAL_REFLECTIONS 4
  // How far each channel's paths spread around its own dispersion, as a
  // share of the red-to-blue range: 0 is the hard split, ~0.5 a smear.
  #define DISPERSION_SOFT 0.45

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

  // The current pixel's texture position, for sampleImage.
  vec2 g_textureUV;

  vec3 sampleImage(vec3 rd) {
    vec2 uv = clamp(g_textureUV + rd.xy * 0.2, 0.0, 1.0);
    return texture2D(image, uv).rgb;
  }

  // The portrait through the cube: one refraction in, a few internal
  // reflections, with the index of refraction nudged per colour channel
  // (dispersionOffset 0 to 1) so the channels split. Returns the colour, or
  // -1 where the ray misses the cube.
  vec3 renderCube(vec3 ro, vec3 rd, float dispersionOffset) {
    float rl = intersectCube(ro, rd);
    if (rl <= 0.0) return vec3(-1.0);
    float ior = IOR + DISPERSION * (dispersionOffset - 0.5);

    vec3 xyz = ro + rd * rl;
    vec3 nor = round(xyz * 1.00001);
    vec3 power = vec3(1.0);
    vec3 refractd = refract(rd, nor, 1.0 / ior);
    vec3 reflectd = reflect(rd, nor);
    float refl = getReflectance(rd, refractd, nor, 1.0, ior);
    vec3 c = sampleImage(reflectd) * refl;
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
      power *= refl;
      rd = reflectd;
    }
    return c;
  }

  // A stable pseudo-random value in [0, 1) per pixel and seed, without the
  // diagonal banding a sin() hash shows at this scale (Dave Hoskins' hash).
  float hash(vec2 p, float seed) {
    vec3 p3 = fract(vec3(p.xyx + seed * 7.13) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  // A random offset in a disc of radius 1, per pixel and colour channel.
  vec2 grain(float seed) {
    float angle = hash(gl_FragCoord.xy, seed) * 6.2831853;
    float radius = sqrt(hash(gl_FragCoord.xy, seed + 17.0));
    return vec2(cos(angle), sin(angle)) * radius;
  }

  // The headline averaged over four grain samples around \`at\`: a blur
  // that keeps some grain. \`seed\` keeps the colour channels apart.
  vec4 grainyType(vec2 at, vec2 spread, float seed) {
    return 0.25 * (
      sampleHeadline(at + grain(seed) * spread) +
      sampleHeadline(at + grain(seed + 31.0) * spread) +
      sampleHeadline(at + grain(seed + 57.0) * spread) +
      sampleHeadline(at + grain(seed + 83.0) * spread)
    );
  }

  // How much glass the ray through \`local\` (centred on the cube) crosses:
  // ~1 through the middle, falling to 0 at the cube's outline.
  float glassThickness(vec2 local, vec3 rotation) {
    vec3 ro = rotateCube(vec3(0.0, 0.0, -CUBE_DISTANCE), rotation);
    vec3 rd = rotateCube(normalize(vec3(local, 1.0)), rotation);
    float dfront = -interiorCubeReflection(-ro, rd);
    float dback = interiorCubeReflection(ro, rd);
    return max(dback - dfront, 0.0);
  }

  void main() {
    vec2 uv = frameUv();
    vec2 textureUV = imageUv(uv);

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
    vec3 ro = vec3(0.0, 0.0, -CUBE_DISTANCE);
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

    // The portrait as it is outside the cube.
    vec4 imageColor = texture2D(image, textureUV) * g_inFrame;

    // The cube's footprint. Past the portrait's frame it stays cut off, as
    // it always was; a headline on its own has no frame to keep inside.
    bool inCube = intersectCube(ro, rd) > 0.01 && (g_inFrame > 0.5 || hideImage > 0.5);
    if (inCube) {
      // The portrait refracts through the glass, split per channel, as it
      // always has; past its frame the cube stays cut off.
      if (g_inFrame > 0.5) {
        g_textureUV = textureUV;
        // Each channel averages two paths spread around its own index of
        // refraction, jittered per pixel, so the fringes soften into
        // gradients instead of hard-edged copies.
        float jitter = (hash(gl_FragCoord.xy, 5.0) - 0.5) * DISPERSION_SOFT;
        float spread = DISPERSION_SOFT * 0.5;
        vec3 col = 0.5 * vec3(
          renderCube(ro, rd, 0.0 - spread + jitter).r + renderCube(ro, rd, 0.0 + spread - jitter).r,
          renderCube(ro, rd, 0.5 - spread + jitter).g + renderCube(ro, rd, 0.5 + spread - jitter).g,
          renderCube(ro, rd, 1.0 - spread + jitter).b + renderCube(ro, rd, 1.0 + spread - jitter).b
        );
        if (col.r >= 0.0 && col.g >= 0.0 && col.b >= 0.0) {
          col = smoothstep(0.0, 1.0, col);
          col = pow(col, vec3(0.4545));
          // At the outline the ray only grazes the glass and is almost all
          // reflection, which reads as a bright rim. Fade from the plain
          // portrait over the last sliver of thin glass instead.
          float solid = smoothstep(0.0, OUTLINE_FADE, glassThickness(localCoord, rotation));
          imageColor = mix(imageColor, vec4(col * 0.7, 1.0), solid);
        }
      }

      // Magnify about the cube's centre, in texture space.
      vec2 centre = imageUv(mouseNorm);
      vec2 magnified = centre + (textureUV - centre) / MAGNIFY;

      // Prism bending: shift the type along the ray as it refracts into the
      // face in front, so each face offsets it differently.
      vec3 front = ro + rd * intersectCube(ro, rd);
      vec3 bent = refract(rd, round(front * 1.00001), 1.0 / IOR);
      magnified += bent.xy * BEND * vec2(resolution.y / resolution.x, 1.0);

      // Liquid glass rim: where the glass thins toward the outline, sample
      // the type from further out, so it bends around the rim. Thickness
      // only falls at the outline, so the faces' inner edges stay clean.
      float thickness = glassThickness(localCoord, rotation);
      vec2 step = vec2(0.003, 0.0);
      vec2 thinning = -vec2(
        glassThickness(localCoord + step.xy, rotation) - glassThickness(localCoord - step.xy, rotation),
        glassThickness(localCoord + step.yx, rotation) - glassThickness(localCoord - step.yx, rotation)
      );
      vec2 rimDir = length(thinning) > 0.00001 ? normalize(thinning) : vec2(0.0);
      float rim = 1.0 - smoothstep(0.0, RIM, thickness);
      magnified += rimDir * RIM_BEND * rim * rim
        * vec2(resolution.y / resolution.x, 1.0);

      // Split the colours along the radius: none at the centre, most at
      // the cube's edge.
      float reach = clamp(length(localCoord) / REACH, 0.0, 1.0);
      vec2 outward = length(localCoord) > 0.0001 ? normalize(localCoord) : vec2(0.0);
      outward.x /= resolution.x / resolution.y;
      vec2 split = outward * SPLIT * reach * reach;

      // Grainy blur, stronger toward the edges with the split.
      vec2 aspect = vec2(resolution.y / resolution.x, 1.0);
      float fuzz = DITHER * mix(DITHER_CENTRE, 1.0, reach);
      gl_FragColor = overSplit(
        grainyType(magnified + split, fuzz * aspect, 1.0),
        grainyType(magnified, fuzz * aspect, 2.0),
        grainyType(magnified - split, fuzz * aspect, 3.0),
        imageColor
      );
      return;
    }

    gl_FragColor = over(sampleHeadline(textureUV), imageColor);
  }
`;
