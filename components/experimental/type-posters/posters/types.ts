import type { ComposePoster } from '../posterTexture';

/**
 * A type poster: the words name a concept, and the shader acts it out.
 * `compose` lays out the type; `fragment` draws the poster from it.
 */
export type Poster = {
  slug: string;
  title: string;
  /** One line under the poster: what the shader is doing to the words. */
  concept: string;
  /** The poster's text, for screen readers. */
  words: string;
  /**
   * The paper colour as a Tailwind class (`bg-[#…]`), shown until the
   * shader draws and without WebGL. A literal here, so Tailwind sees it.
   */
  paper: string;
  compose: ComposePoster;
  fragment: string;
};
