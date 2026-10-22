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
  #define SPLIT 0.012
  // The cube's silhouette reaches about this far from its centre, in the
  // centred units below. The split grows over that distance.
  #define REACH 0.42

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

    // The portrait is clean everywhere, inside the cube too.
    vec4 imageColor = texture2D(image, textureUV) * g_inFrame;

    // The cube's footprint. Past the portrait's frame it stays cut off, as
    // it always was; a headline on its own has no frame to keep inside.
    bool inCube = intersectCube(ro, rd) > 0.01 && (g_inFrame > 0.5 || hideImage > 0.5);
    if (inCube) {
      // Magnify about the cube's centre, in texture space.
      vec2 centre = imageUv(mouseNorm);
      vec2 magnified = centre + (textureUV - centre) / MAGNIFY;

      // Split the colours along the radius: none at the centre, most at
      // the cube's edge.
      float reach = clamp(length(localCoord) / REACH, 0.0, 1.0);
      vec2 outward = length(localCoord) > 0.0001 ? normalize(localCoord) : vec2(0.0);
      outward.x /= resolution.x / resolution.y;
      vec2 split = outward * SPLIT * reach * reach;

      gl_FragColor = overSplit(
        sampleHeadline(magnified + split),
        sampleHeadline(magnified),
        sampleHeadline(magnified - split),
        imageColor
      );
      return;
    }

    gl_FragColor = over(sampleHeadline(textureUV), imageColor);
  }
`;
