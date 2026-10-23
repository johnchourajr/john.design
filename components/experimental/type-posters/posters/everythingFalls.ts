import { fillText, fine, fitSize, INK, printLines, printRule } from '../posterTexture';
import { prelude } from '../prelude';
import type { Poster } from './types';

const LIST = ['everything', 'falls', 'apples', 'empires', 'leaves', 'prices', 'eventually'];

/**
 * A justified list of things that fall. Each word trails a long extrusion
 * straight down, shaded from white to black, as if it were already on its
 * way: longest under the pointer.
 */
export const everythingFalls: Poster = {
  slug: 'everything-falls',
  title: 'Everything Falls',
  concept:
    'A list of things that fall, each word already on its way down. Under the pointer they drop furthest.',
  words: `${LIST.join(', ')}.`,
  paper: 'bg-[#050505]',
  compose: (ctx, { width, height }) => {
    const margin = width * 0.03;
    let y = height * 0.03;
    ctx.fillStyle = INK;
    // Every line set as wide as the poster, so short words are tall.
    for (const word of LIST) {
      const size = Math.min(
        fitSize(ctx, word, 'KUniforma Black', width - margin * 2, { tracking: -0.04 }),
        height * 0.16,
      );
      y += size * 0.74;
      fillText(ctx, word, width / 2, y, size, 'KUniforma Black', {
        tracking: -0.04,
        align: 'center',
      });
      y += size * 0.02;
    }
    // One line of small print across the foot, in three columns under a
    // hairline, as on the Zurich poster.
    const s = fine(width);
    const foot = height - margin - s * 1.3;
    printRule(ctx, margin, foot - s * 1.6, width - margin * 2);
    printLines(ctx, ['A list of things,', 'in order of how soon they land'], margin, foot, s);
    printLines(ctx, ['No. 04'], width / 2, foot, s, { align: 'center' });
    printLines(ctx, ['john.design', '2026'], width - margin, foot, s, { align: 'right' });
  },
  fragment: `
    ${prelude}

    #define STEPS 48

    void main() {
      vec2 uv = vUv;
      vec2 at = focus(vec2(0.5 + 0.35 * sin(time * 0.17), 0.5));
      // How far each column has fallen: uneven across the poster, in broad
      // swells and narrow jags, and always shifting, deepest under the
      // pointer.
      float broad = noise(vec2(uv.x * 6.0, time * 0.35));
      float jag = noise(vec2(uv.x * 38.0, time * 0.9));
      float pulse = 0.5 + 0.5 * sin(time * 1.3 + uv.x * 11.0);
      float under = exp(-pow((uv.x - at.x) * aspect() / 0.18, 2.0));
      float fall = 0.03 + 0.42 * broad * broad + 0.12 * jag * pulse + 0.4 * under * (0.4 + 0.6 * hover);

      // The face: the word where it was set, white, always on top.
      float face = ink(uv);
      // The extrusion: march up to the first letter above this point.
      float trail = 0.0;
      float shade = 0.0;
      for (int i = 1; i <= STEPS; i++) {
        float t = float(i) / float(STEPS);
        float a = ink(uv + vec2(0.0, t * fall));
        if (a > 0.5) {
          trail = 1.0;
          shade = t;
          break;
        }
      }
      // It decays hard: bright just under the letter, quickly to grey and
      // then nothing, with fine banding like a stepped extrusion.
      float bands = 0.88 + 0.12 * step(0.5, fract(shade * 18.0));
      vec3 trailColour = vec3(pow(1.0 - shade, 3.2) * 0.72 * bands);
      vec3 colour = vec3(0.02);
      colour = mix(colour, trailColour, trail);
      colour = mix(colour, vec3(0.97), smoothstep(0.3, 0.7, face));
      colour = mix(colour, vec3(0.85), print(uv));
      gl_FragColor = vec4(colour, 1.0);
    }
  `,
};
