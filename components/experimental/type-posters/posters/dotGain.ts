import { fillText, fine, fitSize, GRID, INK, MONO, printLines, PRINT } from '../posterTexture';
import { prelude } from '../prelude';
import type { Poster } from './types';

/**
 * Dot gain: halftone dots print larger than they were set, as ink spreads
 * into paper. The type is screened into dots, and they swell under the
 * pointer until the letters fill back in.
 */
export const dotGain: Poster = {
  slug: 'dot-gain',
  title: 'Dot Gain',
  concept:
    'Halftone dots print bigger than they were set, as ink spreads. Under the pointer the dots swell until the letters close up.',
  words: 'Dot gain. Ink spreads into paper.',
  paper: 'bg-[#f1efe8]',
  compose: (ctx, { width, height }) => {
    const margin = width * 0.05;
    const s = fine(width, 0.9);
    const mono = { family: MONO, tracking: 0.02 };
    // The two words at one size, as big as the sheet allows: "gain" spans
    // it, unless the two words and the band between them would overrun its
    // height. "dot" hangs from the top and bleeds off the left, "gain"
    // stands on the foot with its tail and last stroke bleeding off.
    const weight = Math.max(2, width * 0.006);
    const swatch = s * 2.4;
    const bandHeight = weight + s * 2 + swatch + s * 1.6;
    const word = Math.min(
      fitSize(ctx, 'gain', 'Montreal', width * 1.02, { tracking: -0.05 }),
      (height - bandHeight - s * 8) / 1.64,
    );
    const dotBaseline = word * 0.76;
    const gainBaseline = height - word * 0.14;
    ctx.fillStyle = INK;
    fillText(ctx, 'dot', -word * 0.05, dotBaseline, word, 'Montreal', { tracking: -0.05 });
    fillText(ctx, 'gain', width + word * 0.03, gainBaseline, word, 'Montreal', {
      tracking: -0.05,
      align: 'right',
    });

    // Between them, centred in the gap: a red rule, the one thing printed
    // solid, and under it one band of press marks, top-aligned: a tone
    // wedge for the screen to break up, specs, and a registration target.
    const gapTop = dotBaseline + word * 0.06;
    const gapBottom = gainBaseline - word * 0.74;
    const rule = (gapTop + gapBottom) / 2 - bandHeight / 2;
    ctx.fillStyle = GRID;
    ctx.fillRect(margin, rule, width - margin * 2, weight);
    const band = rule + weight + s * 2;
    [1, 0.75, 0.5, 0.25, 0.1].forEach((tone, i) => {
      ctx.fillStyle = `rgba(255, 0, 0, ${tone})`;
      ctx.fillRect(margin + i * swatch, band, swatch, swatch);
      printLines(ctx, [String(Math.round(tone * 100))], margin + i * swatch, band + swatch + s * 1.4, s * 0.85, mono);
    });
    printLines(
      ctx,
      ['K 100% \u00b7 40 LPI \u00b7 15\u00b0', 'Ink spreads into paper', 'No. 08 / john.design'],
      width * 0.5,
      band + s * 0.72,
      s,
      mono,
    );

    // Registration targets in the corners the words leave.
    const target = (x: number, y: number) => {
      const r = s * 1.3;
      ctx.strokeStyle = PRINT;
      ctx.lineWidth = 0.75;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.moveTo(x - r * 1.6, y);
      ctx.lineTo(x + r * 1.6, y);
      ctx.moveTo(x, y - r * 1.6);
      ctx.lineTo(x, y + r * 1.6);
      ctx.stroke();
    };
    target(width - margin, margin);
    target(width - margin, band + swatch / 2);
  },
  fragment: `
    ${prelude}

    const vec3 PAPER = vec3(0.945, 0.937, 0.91);
    const vec3 INK_COLOUR = vec3(0.07);
    const vec3 RED = vec3(0.9, 0.16, 0.1);
    // The screen's cell, in poster heights, and its angle.
    #define CELL 0.018
    #define ANGLE 0.2618

    void main() {
      vec2 uv = vUv;
      vec2 p = rotate(ANGLE) * toSquare(uv);
      vec2 cell = floor(p / CELL);
      vec2 centre = (cell + 0.5) * CELL;
      vec2 centreUv = fromSquare(rotate(-ANGLE) * centre);
      // How much ink the cell holds: the type averaged over it.
      float tone = 0.0;
      for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
          tone += ink(centreUv + fromSquare(rotate(-ANGLE) * vec2(float(x), float(y)) * CELL * 0.33));
        }
      }
      tone /= 9.0;
      // The gain: a little everywhere, breathing, and a lot under the
      // pointer.
      vec2 at = focus(vec2(0.3 + 0.2 * sin(time * 0.2), 0.3));
      float near = exp(-pow(distance(toSquare(uv), toSquare(at)) / 0.22, 2.0));
      float gain = 1.0 + 0.12 * sin(time * 0.6) + 0.9 * near * (0.35 + 0.65 * hover);
      // A dot's area is the tone, so its radius goes with the square root.
      float radius = sqrt(tone) * CELL * 0.62 * gain;
      float d = distance(p, centre);
      float aa = CELL * 0.06;
      float dotInk = 1.0 - smoothstep(radius - aa, radius + aa, d);
      dotInk *= step(0.02, tone);
      vec3 colour = mix(PAPER, INK_COLOUR, dotInk);
      colour = mix(colour, RED, grid(uv));
      colour = mix(colour, INK_COLOUR, print(uv));
      gl_FragColor = vec4(paper(colour), 1.0);
    }
  `,
};
