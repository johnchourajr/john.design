import { fillText, fine, fitSize, INK, PRINT, printLines } from '../posterTexture';
import { prelude } from '../prelude';
import type { Poster } from './types';

/**
 * A word set in rows, cut into concentric rings, each ring turned a little
 * further than the one outside it, so the rows wind into a whirlpool.
 */
export const vortices: Poster = {
  slug: 'vortices',
  title: 'Vortices',
  concept:
    'Rows of one word, cut into rings that turn further toward the middle. The pointer is the drain.',
  words: 'Vortices, repeated in rows. A planning guide for whirlpools.',
  paper: 'bg-[#e8e6e0]',
  compose: (ctx, { width, height }) => {
    const word = 'Vortices';
    const top = height * 0.09;
    const size = fitSize(ctx, word, 'KUniforma Black', width * 1.04, { tracking: -0.04 });
    const leading = size * 0.86;
    ctx.fillStyle = INK;
    for (let y = top + size * 0.74; y < height + size; y += leading) {
      fillText(ctx, word, -width * 0.02, y, size, 'KUniforma Black', { tracking: -0.04 });
    }
    // Clear a band at the top for the small print.
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, top);
    ctx.globalCompositeOperation = 'lighter';
    // The masthead, after the Westinghouse guide: bold and small, in two
    // columns, with a ringed mark at the right.
    const s = fine(width, 1.05);
    const bold = { family: 'KUniforma Bold', tracking: 0 };
    printLines(ctx, ['Press Relations in Vortices'], width * 0.3, top * 0.5 + s * 0.35, s, bold);
    printLines(ctx, ['A Planning Guide', 'for Whirlpools'], width * 0.6, top * 0.5 - s * 0.3, s, {
      ...bold,
      leading: 1.15,
    });
    const mark = { x: width * 0.93, y: top * 0.5, r: s * 1.5 };
    ctx.strokeStyle = PRINT;
    ctx.lineWidth = Math.max(0.75, s * 0.12);
    ctx.beginPath();
    ctx.arc(mark.x, mark.y, mark.r, 0, Math.PI * 2);
    ctx.stroke();
    printLines(ctx, ['V'], mark.x, mark.y + s * 0.62, s * 1.7, {
      family: 'KUniforma Black',
      tracking: 0,
      align: 'center',
    });
  },
  fragment: `
    ${prelude}

    const vec3 PAPER = vec3(0.91, 0.902, 0.878);
    const vec3 INK_COLOUR = vec3(0.15);
    // Ring width, in poster heights.
    #define RING 0.052

    void main() {
      vec2 uv = vUv;
      // At rest the eye of the whirlpool circles the middle.
      vec2 rest = vec2(0.5, 0.45) + vec2(cos(time * 0.2), sin(time * 0.2)) * 0.04;
      vec2 eye = toSquare(focus(rest));
      vec2 p = toSquare(uv);
      float r = distance(p, eye);
      // A whole number of rings: a part ring at the edge would barely turn,
      // and its cut would read as a stray seam outside the whirlpool.
      float rings = floor((0.46 + 0.08 * hover) / RING);
      float reach = rings * RING;
      float ring = floor(r / RING);
      // Each ring turns further than the one outside it, the outermost
      // still enough to read as cut; the whole thing winds and unwinds
      // slowly, more once the pointer is on it.
      float depth = clamp(1.0 - ring / rings, 0.0, 1.0);
      float twist = (0.55 + 0.35 * sin(time * 0.3) + 0.5 * hover) * (0.12 + 0.88 * depth * depth) * 2.2;
      vec2 turned = eye + rotate(twist) * (p - eye);
      vec2 sampleUv = r < reach ? fromSquare(turned) : uv;
      float a = ink(sampleUv);
      // A hairline of paper where each ring is cut.
      float edge = abs(fract(r / RING) - 0.5) * 2.0;
      float cut = r < reach ? smoothstep(0.985, 0.995, edge) * step(0.5, ring) : 0.0;
      a *= 1.0 - cut;
      vec3 colour = mix(PAPER, INK_COLOUR, a);
      colour = mix(colour, INK_COLOUR, print(uv));
      gl_FragColor = vec4(paper(colour), 1.0);
    }
  `,
};
