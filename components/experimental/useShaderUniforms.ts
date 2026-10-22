import { useEffect, type RefObject } from 'react';
import type * as THREE from 'three';

/**
 * Keeps a live ShaderMaterial's uniform values in step with props, so a
 * settings change doesn't tear down and rebuild the renderer.
 *
 * Returns a key that changes only when the set of uniform names changes:
 * three.js caches which uniforms a compiled program reads, so adding names
 * needs a rebuild. Put the key in the renderer effect's deps.
 */
export function useShaderUniforms(
  materialRef: RefObject<THREE.ShaderMaterial | null>,
  uniforms: Record<string, THREE.IUniform> | undefined,
) {
  useEffect(() => {
    const material = materialRef.current;
    if (!material || !uniforms) return;

    for (const [name, uniform] of Object.entries(uniforms)) {
      if (material.uniforms[name]) {
        material.uniforms[name].value = uniform.value;
      }
    }
  });

  return Object.keys(uniforms ?? {})
    .sort()
    .join(',');
}
