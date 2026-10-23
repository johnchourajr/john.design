import { fillText, fine, fitSize, INK, printLines } from '../posterTexture';
import { prelude } from '../prelude';
import type { Poster } from './types';

/**
 * Two spot inks, printed from the same plate and out of register. The
 * plates drift apart on their own and pull toward the pointer; where they
 * overlap they multiply into a third colour, as ink on paper does.
 */
export const outOfRegister: Poster = {
  slug: 'out-of-register',
  title: 'Out of Register',
  concept:
    'Two inks from one plate, never quite lined up. The pointer is the press slipping.',
  words: 'out of reg-is-ter. Printed in orange and blue, on a press that drifted.',
  paper: 'bg-[#dcddd2]',
  compose: (ctx, { width, height }) => {
    const margin = width * 0.05;
    // Five stepped lines, in the poster's height.
    const lines: [string, CanvasTextAlign][] = [
      ['out', 'left'],
      ['of', 'right'],
      ['reg-', 'left'],
      ['is-', 'center'],
      ['ter', 'right'],
    ];
    const size = Math.min(
      (height - margin * 2) / (lines.length * 0.8),
      fitSize(ctx, 'reg-', 'Montreal', width - margin * 2, { tracking: -0.05 }),
    );
    ctx.fillStyle = INK;
    lines.forEach(([text, align], i) => {
      const x = align === 'left' ? margin : align === 'right' ? width - margin : width / 2;
      fillText(ctx, text, x, margin + size * (0.72 + i * 0.8), size, 'Montreal', {
        tracking: -0.05,
        align,
      });
    });
    // Small print hangs off the big lines' baselines, in the gaps the
    // stepped words leave: Swiss, set lowercase like the words.
    const s = fine(width);
    const leading = 1.3;
    const baseline = (row: number) => margin + size * (0.72 + row * 0.8);
    const endingOn = (row: number, lines: number) => baseline(row) - (lines - 1) * s * leading;
    printLines(ctx, ['with special guests', 'cyan, magenta', 'and yellow'], margin, endingOn(1, 3), s);
    printLines(ctx, ['friday / october 23 2026'], width - margin, endingOn(2, 1) - size * 0.55, s, {
      align: 'right',
    });
    printLines(
      ctx,
      ['at john.design', 'poster no. 01', 'printed slightly wrong'],
      margin,
      endingOn(4, 3),
      s,
    );
  },
  fragment: `
    ${prelude}

    const vec3 PAPER = vec3(0.863, 0.867, 0.824);
    const vec3 ORANGE = vec3(0.957, 0.45, 0.13);
    const vec3 BLUE = vec3(0.05, 0.43, 0.68);
    const vec3 PRINT_INK = vec3(0.17, 0.22, 0.2);

    void main() {
      vec2 uv = vUv;
      // At rest the plates breathe a little apart; the pointer pulls them
      // along the line from the middle of the poster to it, further the
      // further it is.
      vec2 rest = vec2(0.5 + 0.12 * sin(time * 0.35), 0.5 + 0.1 * cos(time * 0.27));
      vec2 pull = fromSquare(toSquare(focus(rest)) - toSquare(vec2(0.5)));
      vec2 drift = vec2(0.006, -0.004) + pull * 0.05;
      // Each plate wobbles on its own, like paper stretching in the press.
      vec2 wobble = vec2(noise(uv * 3.0 + time * 0.2), noise(uv * 3.0 - time * 0.2)) - 0.5;
      // Each plate prints from its own spot, through its own rough edge,
      // with its own patchy laydown and density across the sheet.
      vec2 orangeAt = roughen(uv + drift + wobble * 0.004, 1.0, 1.0);
      vec2 blueAt = roughen(uv - drift * 0.7 + vec2(-drift.y, drift.x) * 0.4 - wobble * 0.004, 1.0, 2.0);
      float orange = inkLaid(ink(orangeAt), 1.0, 1.0) * pressDensity(1.0, 1.0);
      float blue = inkLaid(ink(blueAt), 1.0, 2.0) * pressDensity(1.0, 2.0);

      vec3 colour = PAPER;
      colour *= mix(vec3(1.0), ORANGE / PAPER, clamp(orange * 0.95, 0.0, 1.0));
      colour *= mix(vec3(1.0), BLUE / PAPER, clamp(blue * 0.92, 0.0, 1.0));
      // The small print is a third, cleaner pass, still on the same stock.
      colour = mix(colour, PRINT_INK, inkLaid(print(roughen(uv, 0.5, 3.0)), 0.5, 3.0));
      gl_FragColor = vec4(paperStock(colour, 1.0), 1.0);
    }
  `,
};
