import * as THREE from 'three';
import { headlineLayer } from './headlineLayer';
import type { ShaderInput } from './useShaderRenderer';

/** Uniforms a material needs to take a headline. See shaders/layers.ts. */
export const headlineUniforms = () => ({
  layerRect: { value: new THREE.Vector4(0, 0, 1, 1) },
  headline: { value: null },
  hasHeadline: { value: 0 },
  hideImage: { value: 0 },
  // Driven by the core: how far the effect reaches the type.
  hover: { value: 0 },
  // The band of the canvas the headline texture covers, in canvas UV.
  headlineRect: { value: new THREE.Vector4(0, 0, 1, 1) },
  // The headline's largest font size, in CSS px, so effects can size
  // themselves to the type rather than the frame.
  headlineEm: { value: 0 },
});

/**
 * The headline inside `getRoot()` as the `headline` texture (#108): see
 * headlineLayer for how the letters are read and drawn. This is the
 * three.js side, uploading the band canvas and setting its uniforms.
 */
export const headlineTexture =
  (getRoot: () => HTMLElement | null): ShaderInput =>
  ({ material, ready, reducedMotion, canvas, invalidate }) => {
    const uniforms = material.uniforms;
    let texture: THREE.CanvasTexture | null = null;
    const layer = uniforms.headline
      ? headlineLayer(getRoot(), reducedMotion, { canvas, invalidate }, {
          band: ([x, y, width, height]) => {
            // The GPU copy has a fixed size; let three allocate a new one.
            texture?.dispose();
            uniforms.headlineRect.value.set(x, y, width, height);
          },
          drawn: () => {
            if (texture) texture.needsUpdate = true;
          },
          live: (live) => {
            uniforms.hasHeadline.value = live ? 1 : 0;
          },
          em: (em) => {
            uniforms.headlineEm.value = em;
          },
        })
      : null;
    if (!layer) {
      ready();
      return { dispose: () => {} };
    }

    texture = new THREE.CanvasTexture(layer.surface);
    // The type is composited premultiplied, like the browser does.
    texture.premultiplyAlpha = true;
    texture.generateMipmaps = false;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    uniforms.headline.value = texture;
    ready();

    return {
      beforeRender: layer.beforeRender,
      resize: layer.resize,
      debug: () => [
        `hasHeadline ${uniforms.hasHeadline.value}`,
        ...layer.debug(),
      ],
      dispose: () => {
        layer.dispose();
        uniforms.headline.value = null;
        texture?.dispose();
      },
    };
  };
