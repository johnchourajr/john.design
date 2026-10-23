'use client';

import clsx from 'clsx';
import dynamic from 'next/dynamic';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import {
  fragmentThreeShaders,
  heroShaderVariants,
  isHeadlineInShader,
  nextShaderVariant,
  pickShaderVariant,
  type ShaderVariant,
} from '../experimental/ImageThreeShader/shaders';
import { isShaderDebug } from '../experimental/shaderDebug';

// three.js loads after the page, like the home hero's shader.
const HeadlineShaderLayer = dynamic(() => import('./HeadlineShaderLayer'), {
  ssr: false,
});

type HeadlineShaderProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Renders a justified headline inside a shader, so the pointer warps the
 * type the way the home hero's effects warp its portrait (#108).
 *
 * The children render as they always have (prerendered, readable without
 * JavaScript, and the source of layout and animation). Once the shader has
 * drawn them, they go to opacity 0 underneath it. With reduced motion, no
 * WebGL, `?shader-text=off`, or until the fonts have loaded, they stay as
 * they are.
 */
export function HeadlineShader({ children, className }: HeadlineShaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const getRoot = useCallback(() => rootRef.current, []);
  const [shader, setShader] = useState<{
    variant: ShaderVariant;
    debug?: string;
  } | null>(null);
  // A click on the headline moves on to the next effect.
  const cycleShader = useCallback(
    () =>
      setShader(
        (current) =>
          current && {
            ...current,
            variant: nextShaderVariant(current.variant, heroShaderVariants),
          },
      ),
    [],
  );

  useEffect(() => {
    if (!isHeadlineInShader()) return;
    const variant = pickShaderVariant(heroShaderVariants);
    // Random and URL-driven, so it's chosen after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShader({
      variant,
      // Not the variant: a new label would rebuild the canvas on every click.
      debug: isShaderDebug() ? 'headline' : undefined,
    });
  }, []);

  return (
    <div className={clsx('relative', className)}>
      <div ref={rootRef}>{children}</div>
      {shader && (
        <HeadlineShaderLayer
          getRoot={getRoot}
          fragmentShader={fragmentThreeShaders[shader.variant]}
          debug={shader.debug}
          onError={() => setShader(null)}
          onCanvasClick={cycleShader}
        />
      )}
    </div>
  );
}
