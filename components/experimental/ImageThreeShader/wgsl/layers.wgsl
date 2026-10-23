// The hero variants' shared WGSL (#125), ported from ../shaders/layers.ts
// (the GLSL the WebGL fallback still runs). Keep the two in step.
//
// A pure module: vgpu only lets the entry shader declare bindings, so each
// variant declares `params`, `image`, `headline` and `samp`, builds a
// `Layer` once, and passes it (and the textures) to these helpers. The
// GLSL's globals (g_layerRect, g_inFrame, g_texScale) live on the `Layer`.
//
// Coordinates match the GLSL: `vUv` grows upward from the bottom left, so
// every variant's maths ports line for line. vgpu's own uv is top-origin;
// `layer()` flips it once, and the texture helpers flip back when they
// sample, since uploaded images and canvases are top-origin too.

// What the renderer sends every variant. See ../shaders/layers.ts for what
// each one means.
export struct Params {
  // The frame in CSS px.
  resolution: vec2f,
  // The pointer in CSS px from the frame's top left, damped.
  mouse: vec2f,
  // The image in its own pixels (the frame's size without one).
  imageResolution: vec2f,
  // Seconds; 0 with reduced motion.
  time: f32,
  // 0 to 1: how much the effect reaches the headline.
  hover: f32,
  // The frame in canvas UV (y up): offset, then size.
  layerRect: vec4f,
  // The band of the canvas the headline texture covers, in canvas UV.
  headlineRect: vec4f,
  hasHeadline: f32,
  hideImage: f32,
  // The headline's largest font size, in CSS px (0 without a headline).
  headlineEm: f32,
}

// How much of the frame's height, from the bottom, the image fades out over.
const IMAGE_BOTTOM_FADE = 0.15;

// One fragment's view of the layers.
export struct Layer {
  // This fragment in canvas UV, y up (the GLSL's vUv).
  vUv: vec2f,
  // This fragment in frame UV. Outside 0 to 1 it is past the image.
  uv: vec2f,
  layerRect: vec4f,
  // 1 where this fragment shows the image: inside the frame, image on.
  inFrame: f32,
  // textureUV = (uv - 0.5) * texScale + 0.5
  texScale: vec2f,
}

// The GLSL's frameUv(), plus the texture scale imageUv() worked out.
export fn layer(p: Params, topUv: vec2f) -> Layer {
  let vUv = vec2f(topUv.x, 1.0 - topUv.y);
  let rect = select(vec4f(0.0, 0.0, 1.0, 1.0), p.layerRect, p.layerRect.z > 0.0);
  let uv = (vUv - rect.xy) / rect.zw;
  let inside = step(vec2f(0.0), uv) * step(uv, vec2f(1.0));
  // The portrait is cut off at the frame's bottom edge; feather it out
  // instead of ending on a hard line.
  let inFrame = inside.x * inside.y * (1.0 - p.hideImage) * smoothstep(0.0, IMAGE_BOTTOM_FADE, uv.y);

  let size = select(p.imageResolution, p.resolution, p.hideImage > 0.5);
  let imageAspect = size.x / size.y;
  let screenAspect = p.resolution.x / p.resolution.y;
  // A frame narrower than the image crops its sides; a wider one its top
  // and bottom.
  let texScale = select(
    vec2f(1.0, screenAspect / imageAspect),
    vec2f(imageAspect / screenAspect, 1.0),
    screenAspect < imageAspect,
  );
  return Layer(vUv, uv, rect, inFrame, texScale);
}

// Frame UV to the image's texture UV, fitted to the frame's aspect.
export fn imageUv(l: Layer, uv: vec2f) -> vec2f {
  return (uv - 0.5) * l.texScale + 0.5;
}

// The image at a point in texture UV (y up). Clamped at the edges, as the
// GLSL's texture is.
export fn imageAt(image: texture_2d<f32>, samp: sampler, uv: vec2f) -> vec4f {
  return textureSampleLevel(image, samp, vec2f(uv.x, 1.0 - uv.y), 0.0);
}

// The headline at a point in texture UV, wherever the effect sent it.
export fn headlineAt(p: Params, l: Layer, headline: texture_2d<f32>, samp: sampler, textureUV: vec2f) -> vec4f {
  let uv = (textureUV - 0.5) / l.texScale + 0.5;
  let canvasUv = l.layerRect.xy + uv * l.layerRect.zw;
  // The texture covers only the band of rows the letters reach.
  let band = select(vec4f(0.0, 0.0, 1.0, 1.0), p.headlineRect, p.headlineRect.w > 0.0);
  let bandUv = (canvasUv - band.xy) / band.zw;
  let colour = textureSampleLevel(headline, samp, vec2f(bandUv.x, 1.0 - bandUv.y), 0.0);
  let inBand = bandUv.x >= 0.0 && bandUv.x <= 1.0 && bandUv.y >= 0.0 && bandUv.y <= 1.0;
  return select(vec4f(0.0), colour, inBand && p.hasHeadline > 0.5);
}

// A colour split, composited one channel at a time: each channel's copy of
// the type covers only that channel of what's under it.
export fn overSplit(red: vec4f, green: vec4f, blue: vec4f, bottom: vec4f) -> vec4f {
  return vec4f(
    red.r + bottom.r * (1.0 - red.a),
    green.g + bottom.g * (1.0 - green.a),
    blue.b + bottom.b * (1.0 - blue.a),
    max(bottom.a, max(red.a, max(green.a, blue.a))),
  );
}

// Premultiplied `top` over `bottom`.
export fn over(top: vec4f, bottom: vec4f) -> vec4f {
  return top + bottom * (1.0 - top.a);
}
