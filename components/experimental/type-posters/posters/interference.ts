import { fillText, fine, fitSize, INK, printLines } from '../posterTexture';
import { prelude } from '../prelude';
import type { Poster } from './types';

/**
 * Two waves meeting. Rings spread from the pointer across the paper; inside
 * the letters they cross straight stripes that bend over each letter's
 * bevel, and where one is on and the other off the paper shows: moiré.
 */
export const interference: Poster = {
  slug: 'interference',
  title: 'Interference',
  concept:
    'Two wave patterns meeting. Rings spread from the pointer, stripes fill the letters, and the moiré is the interference.',
  words: 'Inter-ference. Wave.',
  paper: 'bg-[#f04e23]',
  compose: (ctx, { width, height }) => {
    const size = fitSize(ctx, 'wa', 'BigCaslon', width * 1.25);
    ctx.fillStyle = INK;
    // Cropped off the poster's edges, like a detail of something larger.
    fillText(ctx, 'wa', -width * 0.12, height * 0.58, size, 'BigCaslon', { tracking: -0.04 });
    fillText(ctx, 've', width * 0.06, height * 0.58 + size * 0.62, size, 'BigCaslon', {
      tracking: -0.04,
    });
    const title = Math.max(14, width * 0.06);
    fillText(ctx, 'inter—', -title * 0.6, title * 1.3, title, 'KUniforma Black', { tracking: -0.02 });
    fillText(ctx, '—ference', width + title * 0.5, title * 1.3, title, 'KUniforma Black', {
      tracking: -0.02,
      align: 'right',
    });
    // One row of small print under the title band, in three columns on a
    // three-column grid, all on one first baseline, clear of the letters.
    const s = fine(width);
    const margin = width * 0.05;
    const column = (i: number) => margin + ((width - margin * 2) / 3) * i;
    const first = title * 2.2;
    printLines(ctx, ['Two sources,', 'one surface'], column(0), first, s);
    printLines(ctx, ['Waves add where they agree', 'and cancel where they don\u2019t'], column(1), first, s);
    printLines(ctx, ['Fig. 5', 'No. 05', 'john.design, 2026'], column(2), first, s);
  },
  fragment: `
    ${prelude}

    const vec3 ORANGE = vec3(0.94, 0.31, 0.14);
    const vec3 WHITE = vec3(0.98, 0.95, 0.92);
    const vec3 BLACK = vec3(0.08, 0.05, 0.04);

    // The type blurred, as a height: 1 deep inside a letter, falling to 0
    // across its edge, for the stripes to ride over.
    float bevel(vec2 uv) {
      float sum = ink(uv) * 2.0;
      float total = 2.0;
      for (int i = 0; i < 12; i++) {
        float a = float(i) * 0.5235988;
        for (int ring = 1; ring <= 2; ring++) {
          vec2 offset = vec2(cos(a), sin(a)) * 0.018 * float(ring) / 2.0;
          sum += ink(uv + fromSquare(offset));
          total += 1.0;
        }
      }
      return sum / total;
    }

    void main() {
      vec2 uv = vUv;
      vec2 p = toSquare(uv);
      vec2 source = toSquare(focus(vec2(0.78 + 0.08 * sin(time * 0.3), 0.18 + 0.06 * cos(time * 0.23))));
      float r = distance(p, source);
      // The rings: spreading outward, fading with distance.
      float rings = step(0.25, sin(r * 140.0 - time * 2.4)) * smoothstep(0.75, 0.15, r);
      // The stripes: straight, a little off the rings' angle, and lifted
      // over each letter's bevel so they curve like ribbons.
      float h = bevel(uv);
      vec2 q = rotate(0.62 + 0.15 * sin(time * 0.2)) * p;
      float stripes = step(0.0, sin(q.y * 150.0 + h * 9.0));
      float inside = smoothstep(0.45, 0.55, ink(uv));
      // Where one is on and the other off, the paper shows.
      float crossed = abs(stripes - rings);
      vec3 colour = mix(ORANGE, WHITE, rings * 0.9);
      colour = mix(colour, mix(WHITE, BLACK, crossed), inside);
      colour = mix(colour, BLACK, print(uv));
      gl_FragColor = vec4(paper(colour), 1.0);
    }
  `,
};
