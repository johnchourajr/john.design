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
  pickShaderVariant,
} from '../experimental/ImageThreeShader/shaders';

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
  const [fragmentShader, setFragmentShader] = useState<string | null>(null);

  useEffect(() => {
    if (!isHeadlineInShader()) return;
    // Random and URL-driven, so it's chosen after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFragmentShader(
      fragmentThreeShaders[pickShaderVariant(heroShaderVariants)],
    );
  }, []);

  return (
    <div className={clsx('relative', className)}>
      <div ref={rootRef}>{children}</div>
      {fragmentShader && (
        <HeadlineShaderLayer
          getRoot={getRoot}
          fragmentShader={fragmentShader}
          onError={() => setFragmentShader(null)}
        />
      )}
    </div>
  );
}
