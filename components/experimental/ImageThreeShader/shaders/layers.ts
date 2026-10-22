/**
 * Shared by the hero variants (pixel, distortion, vertical, loupe, sphere,
 * prism) so a headline drawn into a texture warps with the image (#108).
 * Paste it after a shader's uniforms and `varying vec2 vUv`.
 *
 * Each variant works out where its effect sends a fragment once, in the
 * image's texture space, and samples both layers there: the image with
 * `texture2D(image, …)`, the headline with `sampleHeadline(…)`. The headline
 * sits on top (`over`), as the DOM text did.
 *
 * - `layerRect` is the shader's frame (the image's square) in canvas UV:
 *   offset, then size. The canvas can be larger than the frame, e.g. to fit
 *   a headline that runs past the portrait. The core sets it; a material
 *   without it reads zeros, which mean the whole canvas.
 * - `headline` is the headline, premultiplied, at the canvas's own pixels.
 *   It is only read while `hasHeadline` is 1.
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
    if (canvasUv.x < 0.0 || canvasUv.x > 1.0 || canvasUv.y < 0.0 || canvasUv.y > 1.0) {
      return vec4(0.0);
    }
    return texture2D(headline, canvasUv);
  }

  // Premultiplied \`top\` over \`bottom\`.
  vec4 over(vec4 top, vec4 bottom) {
    return top + bottom * (1.0 - top.a);
  }
`;
