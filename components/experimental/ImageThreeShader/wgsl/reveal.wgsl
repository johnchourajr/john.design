// A program swap (#125): the new frame (`to`) revealed over the old (`from`)
// in a circle growing from `origin`, with a feathered edge. All in the
// drawing buffer's pixels, y up. Port of revealShader in useShaderRenderer.

struct Reveal {
  origin: vec2f,
  size: vec2f,
  radius: f32,
  feather: f32,
}

@group(0) @binding(0) var<uniform> reveal: Reveal;
@group(0) @binding(1) var from_tex: texture_2d<f32>;
@group(0) @binding(2) var to_tex: texture_2d<f32>;
@group(0) @binding(3) var samp: sampler;

@fragment fn fs_main(@location(0) topUv: vec2f) -> @location(0) vec4f {
  let at = vec2f(topUv.x, 1.0 - topUv.y) * reveal.size;
  let outside = smoothstep(reveal.radius - reveal.feather, reveal.radius, distance(at, reveal.origin));
  // Both targets were drawn the way up the canvas is, so sample as is.
  let from_ = textureSampleLevel(from_tex, samp, topUv, 0.0);
  let to = textureSampleLevel(to_tex, samp, topUv, 0.0);
  return mix(to, from_, outside);
}
