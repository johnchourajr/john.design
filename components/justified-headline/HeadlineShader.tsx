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

import { useIdle } from '@/lib/hooks/useIdle';

import {
  fragmentThreeShaders,
  heroShaderVariants,
  isHeadlineInShader,
  nextShaderVariant,
  pickShaderVariant,
  type ShaderVariant,
} from '../experimental/ImageThreeShader/shaders';
import { isShaderDebug } from '../experimental/shaderDebug';

// three.js loads once the page is idle, like the home hero's shader.
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

  const idle = useIdle();
  useEffect(() => {
    if (!idle || !isHeadlineInShader()) return;
    const variant = pickShaderVariant(heroShaderVariants);
    // Random and URL-driven, so it's chosen after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShader({
      variant,
      // Not the variant: a new label would rebuild the canvas on every click.
      debug: isShaderDebug() ? 'headline' : undefined,
    });
  }, [idle]);

  // The padding is room for the effects (the sphere and loupe are a third
  // of the viewport across) so the canvas, which covers it, doesn't clip
  // them to the line of type. Pages pull it back with a negative margin.
  return (
    <div className={clsx('relative py-[12vw]', className)}>
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
