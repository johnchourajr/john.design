// WGSL port of ../shaders/prismThree.ts (the GLSL is the WebGL fallback).
//
// A glass cube that turns over the pointer: the portrait stays clean and
// sharp, and the cube magnifies the type about its centre with a colour
// split that grows toward the cube's edges. Not gated by hover.
import { Params, layer, imageUv, imageAt, headlineAt, Layer, over, overSplit } from "./layers.wgsl";

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var image: texture_2d<f32>;
@group(0) @binding(2) var headline: texture_2d<f32>;
@group(0) @binding(3) var samp: sampler;

// How much the type grows inside the cube.
const MAGNIFY = 1.4;
// How far the type shifts along the ray refracted through the face it is
// seen through. Off for now in favour of the rim below; kept to compare.
const BEND = 0.0;
// Liquid glass: the type bends in a band along the cube's outline, where
// the glass thins. RIM is the thickness under which the bend starts,
// RIM_BEND how far the type is pulled at the very outline.
const RIM = 0.45;
const RIM_BEND = 0.035;
// The glass thickness over which the refracted portrait fades in from the
// outline, hiding the bright grazing-angle rim.
const OUTLINE_FADE = 0.06;
const SPLIT = 0.005;
// The cube's silhouette reaches about this far from its centre.
const REACH = 0.35;
// How far the camera sits from the cube. Further is smaller.
const CUBE_DISTANCE = 2.2;
// The type's grainy blur in the cube, in frame heights; a share of it holds
// at the centre.
const DITHER = 0.0055;
const DITHER_CENTRE = 0.35;
// The glass the portrait is seen through.
const IOR = 1.5;
const DISPERSION = 0.05;
const ABSORPTION = vec3f(0.04);
const INTERNAL_REFLECTIONS = 4;
// How far each channel's paths spread around its own dispersion.
const DISPERSION_SOFT = 0.45;

fn rot2(a: f32) -> mat2x2f {
  let c = cos(a);
  let s = sin(a);
  return mat2x2f(c, -s, s, c);
}

// GLSL's `p.yz *= m` is row vector times matrix; WGSL's `v * m` is the same.
fn rotateCube(q: vec3f, r: vec3f) -> vec3f {
  var p = q;
  let yz = p.yz * rot2(r.x);
  p = vec3f(p.x, yz);
  let xz = p.xz * rot2(-r.y);
  p = vec3f(xz.x, p.y, xz.y);
  let xy = p.xy * rot2(r.z);
  p = vec3f(xy, p.z);
  return p;
}

fn interiorCubeReflection(ro: vec3f, rd: vec3f) -> f32 {
  let d = (0.5 * sign(rd) - ro) / rd;
  return min(min(d.x, d.y), d.z);
}

fn intersectCube(ro: vec3f, rd: vec3f) -> f32 {
  let dfront = -interiorCubeReflection(-ro, rd);
  let dback = interiorCubeReflection(ro, rd);
  return select(-1.0, dfront, (dback - dfront) > 0.001);
}

fn getReflectance(incident: vec3f, transmitted: vec3f, nor: vec3f, iorA: f32, iorB: f32) -> f32 {
  let cosI = abs(dot(incident, nor));
  let cosT = abs(dot(transmitted, nor));
  let rs = (iorA * cosI - iorB * cosT) / (iorA * cosI + iorB * cosT);
  let rp = (iorB * cosI - iorA * cosT) / (iorB * cosI + iorA * cosT);
  return (rs * rs + rp * rp) / 2.0;
}

// The GLSL keeps the pixel's texture position in a global; here it's passed.
fn sampleImage(textureUV: vec2f, rd: vec3f) -> vec3f {
  let uv = clamp(textureUV + rd.xy * 0.2, vec2f(0.0), vec2f(1.0));
  return imageAt(image, samp, uv).rgb;
}

// The portrait through the cube: one refraction in, a few internal
// reflections, with the index of refraction nudged per colour channel.
// Returns the colour, or -1 where the ray misses the cube.
fn renderCube(textureUV: vec2f, ro: vec3f, rdIn: vec3f, dispersionOffset: f32) -> vec3f {
  var rd = rdIn;
  var rl = intersectCube(ro, rd);
  if (rl <= 0.0) { return vec3f(-1.0); }
  let ior = IOR + DISPERSION * (dispersionOffset - 0.5);

  var xyz = ro + rd * rl;
  var nor = round(xyz * 1.00001);
  var power = vec3f(1.0);
  var refractd = refract(rd, nor, 1.0 / ior);
  var reflectd = reflect(rd, nor);
  var refl = getReflectance(rd, refractd, nor, 1.0, ior);
  var c = sampleImage(textureUV, reflectd) * refl;
  power *= 1.0 - refl;
  rd = refractd;

  for (var i = 0; i < INTERNAL_REFLECTIONS; i++) {
    rl = interiorCubeReflection(xyz, rd);
    xyz += rd * rl;
    nor = round(xyz * 1.00001);
    refractd = refract(rd, -nor, 1.0 / ior);
    reflectd = reflect(rd, -nor);
    refl = getReflectance(rd, refractd, -nor, ior, 1.0);
    power *= exp(-ABSORPTION * rl);
    c += sampleImage(textureUV, refractd) * (1.0 - refl) * power;
    power *= refl;
    rd = reflectd;
  }
  return c;
}

// A stable pseudo-random value in [0, 1) per pixel and seed (Dave Hoskins'
// hash), without the banding a sin() hash shows at this scale.
fn hash(p: vec2f, seed: f32) -> f32 {
  var p3 = fract((p.xyx + seed * 7.13) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

// A random offset in a disc of radius 1, per pixel and colour channel.
fn grain(frag: vec2f, seed: f32) -> vec2f {
  let angle = hash(frag, seed) * 6.2831853;
  let radius = sqrt(hash(frag, seed + 17.0));
  return vec2f(cos(angle), sin(angle)) * radius;
}

// The headline averaged over four grain samples around `at`: a blur that
// keeps some grain. `seed` keeps the colour channels apart.
fn grainyType(l: Layer, frag: vec2f, at: vec2f, spread: vec2f, seed: f32) -> vec4f {
  return 0.25 * (
    headlineAt(params, l, headline, samp, at + grain(frag, seed) * spread) +
    headlineAt(params, l, headline, samp, at + grain(frag, seed + 31.0) * spread) +
    headlineAt(params, l, headline, samp, at + grain(frag, seed + 57.0) * spread) +
    headlineAt(params, l, headline, samp, at + grain(frag, seed + 83.0) * spread)
  );
}

// How much glass the ray through `local` (centred on the cube) crosses: ~1
// through the middle, falling to 0 at the cube's outline.
fn glassThickness(local: vec2f, rotation: vec3f) -> f32 {
  let ro = rotateCube(vec3f(0.0, 0.0, -CUBE_DISTANCE), rotation);
  let rd = rotateCube(normalize(vec3f(local, 1.0)), rotation);
  let dfront = -interiorCubeReflection(-ro, rd);
  let dback = interiorCubeReflection(ro, rd);
  return max(dback - dfront, 0.0);
}

@fragment fn fs_main(
  @location(0) topUv: vec2f,
  @builtin(position) position: vec4f,
) -> @location(0) vec4f {
  let l = layer(params, topUv);
  let uv = l.uv;
  let resolution = params.resolution;
  let mouse = params.mouse;
  let time = params.time;
  let frag = position.xy;
  let textureUV = imageUv(l, uv);

  // Mouse position normalized (0-1). A headline on its own has no image to
  // keep the cube inside, so the cube reaches every letter.
  var mouseNorm = vec2f(mouse.x / resolution.x, 1.0 - mouse.y / resolution.y);
  let mouseClamped = clamp(mouseNorm, vec2f(0.2), vec2f(0.8));
  if (params.hideImage < 0.5) { mouseNorm = mouseClamped; }

  // ShaderToy-style normalized coordinates centered on mouse
  let fragCoord = uv * resolution;
  let mouseCoord = mouseNorm * resolution;
  let centered = (2.0 * fragCoord - resolution) / resolution.y;
  let mouseCentered = (2.0 * mouseCoord - resolution) / resolution.y;
  let localCoord = centered - mouseCentered;

  // Ray setup
  var ro = vec3f(0.0, 0.0, -CUBE_DISTANCE);
  var rd = normalize(vec3f(localCoord, 1.0));

  // Mouse influence on rotation (centered at 0.5)
  let mouseInfluence = (mouseClamped - 0.5) * 0.6;

  let rotation = vec3f(
    time * 0.3 + mouseInfluence.y * 0.5,
    time * 0.4 - mouseInfluence.x * 0.5,
    time * 0.2,
  );
  ro = rotateCube(ro, rotation);
  rd = rotateCube(rd, rotation);

  // The portrait as it is outside the cube.
  var imageColor = imageAt(image, samp, textureUV) * l.inFrame;

  // The cube's footprint. Past the portrait's frame it stays cut off; a
  // headline on its own has no frame to keep inside.
  let inCube = intersectCube(ro, rd) > 0.01 && (l.inFrame > 0.5 || params.hideImage > 0.5);
  if (inCube) {
    // The portrait refracts through the glass, split per channel.
    if (l.inFrame > 0.5) {
      // Each channel averages two paths spread around its own index of
      // refraction, jittered per pixel, so the fringes soften.
      let jitter = (hash(frag, 5.0) - 0.5) * DISPERSION_SOFT;
      let spread = DISPERSION_SOFT * 0.5;
      var col = 0.5 * vec3f(
        renderCube(textureUV, ro, rd, 0.0 - spread + jitter).r + renderCube(textureUV, ro, rd, 0.0 + spread - jitter).r,
        renderCube(textureUV, ro, rd, 0.5 - spread + jitter).g + renderCube(textureUV, ro, rd, 0.5 + spread - jitter).g,
        renderCube(textureUV, ro, rd, 1.0 - spread + jitter).b + renderCube(textureUV, ro, rd, 1.0 + spread - jitter).b,
      );
      if (col.r >= 0.0 && col.g >= 0.0 && col.b >= 0.0) {
        col = smoothstep(vec3f(0.0), vec3f(1.0), col);
        col = pow(col, vec3f(0.4545));
        // At the outline the ray only grazes the glass, which reads as a
        // bright rim. Fade from the plain portrait over thin glass instead.
        let solid = smoothstep(0.0, OUTLINE_FADE, glassThickness(localCoord, rotation));
        imageColor = mix(imageColor, vec4f(col * 0.7, 1.0), solid);
      }
    }

    // Magnify about the cube's centre, in texture space.
    let centre = imageUv(l, mouseNorm);
    var magnified = centre + (textureUV - centre) / MAGNIFY;

    // Prism bending: shift the type along the ray as it refracts into the
    // face in front.
    let front = ro + rd * intersectCube(ro, rd);
    let bent = refract(rd, round(front * 1.00001), 1.0 / IOR);
    magnified += bent.xy * BEND * vec2f(resolution.y / resolution.x, 1.0);

    // Liquid glass rim: where the glass thins toward the outline, sample
    // the type from further out, so it bends around the rim.
    let thickness = glassThickness(localCoord, rotation);
    let stepV = vec2f(0.003, 0.0);
    let thinning = -vec2f(
      glassThickness(localCoord + stepV.xy, rotation) - glassThickness(localCoord - stepV.xy, rotation),
      glassThickness(localCoord + stepV.yx, rotation) - glassThickness(localCoord - stepV.yx, rotation),
    );
    let rimDir = select(vec2f(0.0), normalize(thinning), length(thinning) > 0.00001);
    let rim = 1.0 - smoothstep(0.0, RIM, thickness);
    magnified += rimDir * RIM_BEND * rim * rim * vec2f(resolution.y / resolution.x, 1.0);

    // Split the colours along the radius: none at the centre, most at the
    // cube's edge.
    let reach = clamp(length(localCoord) / REACH, 0.0, 1.0);
    var outward = select(vec2f(0.0), normalize(localCoord), length(localCoord) > 0.0001);
    outward.x /= resolution.x / resolution.y;
    let split = outward * SPLIT * reach * reach;

    // Grainy blur, stronger toward the edges with the split.
    let aspect = vec2f(resolution.y / resolution.x, 1.0);
    let fuzz = DITHER * mix(DITHER_CENTRE, 1.0, reach);
    return overSplit(
      grainyType(l, frag, magnified + split, fuzz * aspect, 1.0),
      grainyType(l, frag, magnified, fuzz * aspect, 2.0),
      grainyType(l, frag, magnified - split, fuzz * aspect, 3.0),
      imageColor,
    );
  }

  return over(headlineAt(params, l, headline, samp, textureUV), imageColor);
}
