/**
 * Shared by the hero variants (pixel, distortion, vertical, loupe, sphere,
 * prism) so a headline drawn into a texture warps with the image (#108).
 * Paste it after a shader's uniforms and `varying vec2 vUv`.
 *
 * Each variant works out its effect once, in the image's texture space, and
 * sends both layers through it: the image with `texture2D(image, …)`, the
 * headline with `sampleHeadline(…)`. The image's result is exactly what it
 * was before; the headline's is composited on top (`over`), as the DOM text
 * was.
 *
 * - `hover` (0 to 1) is how much the effect reaches the headline. The core
 *   eases it in while the pointer is over the canvas and out when it
 *   leaves, so at rest the type is untouched and matches the DOM pixel for
 *   pixel, whatever the image is doing.
 * - `layerRect` is the shader's frame (the image's square) in canvas UV:
 *   offset, then size. Effects are sized from the frame. The canvas can be
 *   larger than the frame, to fit a headline that runs past the portrait,
 *   or smaller, for a headline on its own measured against the same
 *   viewport-wide square as the home hero. The core sets it; a material
 *   without it reads zeros, which mean the whole canvas.
 * - `headline` is the headline, premultiplied, at the canvas's own pixels,
 *   covering the band of rows `headlineRect` gives in canvas UV. It is only
 *   read while `hasHeadline` is 1.
 * - `hideImage` is 1 for a headline on its own: no image, and texture space
 *   is the frame itself.
 *
 * With no headline and the default frame, every variant renders exactly as
 * it did before.
 */
export const layers = `
  uniform vec4 layerRect;
  uniform sampler2D headline;
  uniform float hasHeadline;
  uniform float hideImage;
  uniform float hover;
  uniform vec4 headlineRect;
  // The headline's largest font size, in CSS px (0 without a headline).
  uniform float headlineEm;

  vec4 g_layerRect;
  // 1 where this fragment shows the image: inside the frame, image on.
  float g_inFrame;
  // textureUV = (uv - 0.5) * g_texScale + 0.5
  vec2 g_texScale;

  // This fragment in frame UV. Outside 0 to 1 it is past the image.
  vec2 frameUv() {
    g_layerRect = layerRect.z > 0.0 ? layerRect : vec4(0.0, 0.0, 1.0, 1.0);
    vec2 uv = (vUv - g_layerRect.xy) / g_layerRect.zw;
    vec2 inside = step(vec2(0.0), uv) * step(uv, vec2(1.0));
    g_inFrame = inside.x * inside.y * (1.0 - hideImage);
    return uv;
  }

  // Frame UV to the image's texture UV, fitted to the frame's aspect.
  vec2 imageUv(vec2 uv) {
    vec2 size = hideImage > 0.5 ? resolution : imageResolution;
    float imageAspect = size.x / size.y;
    float screenAspect = resolution.x / resolution.y;

    vec2 textureUV = uv;
    if (screenAspect < imageAspect) {
      float scale = screenAspect / imageAspect;
      textureUV.x = (uv.x - 0.5) / scale + 0.5;
      g_texScale = vec2(1.0 / scale, 1.0);
    } else {
      float scale = imageAspect / screenAspect;
      textureUV.y = (uv.y - 0.5) / scale + 0.5;
      g_texScale = vec2(1.0, 1.0 / scale);
    }
    return textureUV;
  }

  // The headline at a point in texture UV, wherever the effect sent it.
  vec4 sampleHeadline(vec2 textureUV) {
    if (hasHeadline < 0.5) return vec4(0.0);
    vec2 uv = (textureUV - 0.5) / g_texScale + 0.5;
    vec2 canvasUv = g_layerRect.xy + uv * g_layerRect.zw;
    // The texture covers only the band of rows the letters reach.
    vec4 band = headlineRect.w > 0.0 ? headlineRect : vec4(0.0, 0.0, 1.0, 1.0);
    vec2 bandUv = (canvasUv - band.xy) / band.zw;
    if (bandUv.x < 0.0 || bandUv.x > 1.0 || bandUv.y < 0.0 || bandUv.y > 1.0) {
      return vec4(0.0);
    }
    return texture2D(headline, bandUv);
  }

  // A colour split, composited one channel at a time: each channel's copy
  // of the type covers only that channel of what's under it. On the
  // portrait the copies fringe in colour; on the black page they leave the
  // type's own colour, as glass would.
  vec4 overSplit(vec4 red, vec4 green, vec4 blue, vec4 bottom) {
    return vec4(
      red.r + bottom.r * (1.0 - red.a),
      green.g + bottom.g * (1.0 - green.a),
      blue.b + bottom.b * (1.0 - blue.a),
      max(bottom.a, max(red.a, max(green.a, blue.a)))
    );
  }

  // Premultiplied \`top\` over \`bottom\`.
  vec4 over(vec4 top, vec4 bottom) {
    return top + bottom * (1.0 - top.a);
  }
`;
