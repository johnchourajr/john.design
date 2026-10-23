import { fillText, fine, font, INK, printLines } from '../posterTexture';
import { prelude } from '../prelude';
import type { Poster } from './types';

// The word's cap height and its top, in poster heights. The shader stacks
// its copies from these, so the two have to agree.
const CAP = 0.075;
const TOP = 0.2;

/**
 * The word is set once; what follows it is what the eye keeps after it
 * looks away. Each copy below is cut shorter from the bottom, fainter, and
 * swings further behind the pointer.
 */
export const afterimage: Poster = {
  slug: 'afterimage',
  title: 'Afterimage',
  concept:
    'The word is set once. The rest is what your eye keeps: each copy cut shorter, lagging further behind the pointer.',
  words: 'Afterimage. What stays when you look away.',
  paper: 'bg-[#0b0b0b]',
  compose: (ctx, { width, height }) => {
    const word = 'AFTER—IMAGE';
    // Sized by its cap height, then stretched to the poster's width.
    ctx.font = font(100, 'KUniforma Black');
    const capAt100 = ctx.measureText('H').actualBoundingBoxAscent;
    const size = (100 * CAP * height) / capAt100;
    ctx.font = font(size, 'KUniforma Black');
    ctx.letterSpacing = '0px';
    const margin = width * 0.05;
    const stretch = (width - margin * 2) / ctx.measureText(word).width;
    ctx.save();
    ctx.translate(margin, (TOP + CAP) * height);
    ctx.scale(stretch, 1);
    ctx.fillStyle = INK;
    fillText(ctx, word, 0, 0, size, 'KUniforma Black');
    ctx.restore();
    // Tiny, widely spaced capitals: a line over the word, and the corners
    // of the sheet, as on Neo\u2014Monument.
    const s = fine(width, 0.9);
    const caps = { family: 'KUniforma Bold', tracking: 0.14, upper: true };
    printLines(ctx, ['An afterimage is what the eye keeps'], width / 2, TOP * height - s * 2.2, s, {
      ...caps,
      align: 'center',
    });
    printLines(ctx, ['What stays'], margin, height - margin, s, caps);
    printLines(ctx, ['No. 07 / 2026'], width - margin, height - margin, s, { ...caps, align: 'right' });
  },
  fragment: `
    ${prelude}

    #define CAP ${CAP.toFixed(4)}
    #define TOP ${TOP.toFixed(4)}
    #define COPIES 9
    #define GUTTER 0.008

    void main() {
      vec2 uv = vUv;
      // The word's band, in UV (y up).
      float wordTop = 1.0 - TOP + CAP * 0.04;
      float wordBottom = 1.0 - TOP - CAP - CAP * 0.04;
      float a = ink(uv);
      float lead = focus(vec2(0.5 + 0.25 * sin(time * 0.4), 0.5)).x - 0.5;
      // Walk down the copies: each one shorter than the last, cut from the
      // bottom, set right under the one before.
      float top = wordBottom - GUTTER;
      for (int k = 1; k <= COPIES; k++) {
        float i = float(k);
        float height = (wordTop - wordBottom) * (1.0 - i * 0.095);
        float bottom = top - height;
        if (uv.y <= top && uv.y > bottom) {
          // Where this copy reads from: the same distance down from the
          // word's top, so the cut takes the letters' feet.
          float y = wordTop - (top - uv.y);
          // Further behind the pointer, and swaying, the later the copy.
          float lag = lead * 0.05 * i * (0.4 + 0.6 * hover) + sin(time * 0.8 - i * 0.55) * 0.004 * i;
          float copy = ink(vec2(uv.x + lag, y));
          // A hairline gap where each copy is cut.
          copy *= smoothstep(bottom, bottom + 0.002, uv.y);
          a = max(a, copy * (1.0 - i * 0.085));
        }
        top = bottom - GUTTER;
      }
      vec3 colour = mix(vec3(0.045), vec3(0.95), a);
      colour = mix(colour, vec3(0.8), print(uv));
      gl_FragColor = vec4(paper(colour), 1.0);
    }
  `,
};
