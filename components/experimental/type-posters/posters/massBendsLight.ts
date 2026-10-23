import { fillText, fine, fitSize, font, GRID, INK, MONO, printLines } from '../posterTexture';
import { prelude } from '../prelude';
import type { Poster } from './types';

/**
 * A point mass sits on the poster and bends the light coming off it, as
 * general relativity says: the type and a hairline grid lens around it,
 * into an Einstein ring and doubled images.
 */
export const massBendsLight: Poster = {
  slug: 'mass-bends-light',
  title: 'Mass Bends Light',
  concept:
    'The words say what the pointer does: it is a point mass, and the type lenses around it.',
  words: 'Mass bends light. General relativity, 1915.',
  paper: 'bg-[#0a0a0a]',
  compose: (ctx, { width, height }) => {
    const margin = width * 0.06;
    // A hairline grid, for the lens to bend.
    ctx.fillStyle = GRID;
    const cell = width / 12;
    for (let x = cell; x < width; x += cell) ctx.fillRect(x, 0, 1, height);
    for (let y = cell; y < height; y += cell) ctx.fillRect(0, y, width, 1);
    const lines = ['mass', 'bends', 'light.'];
    // Sized so the widest line spans the measure.
    const size = Math.min(
      ...lines.map((line) =>
        fitSize(ctx, line, 'KUniforma Black', width - margin * 2, { tracking: -0.03 }),
      ),
    );
    ctx.fillStyle = INK;
    lines.forEach((line, i) => {
      fillText(ctx, line, margin, height * 0.42 + i * size * 0.84, size, 'KUniforma Black', {
        tracking: -0.03,
      });
    });
    // Technical small print in mono, tucked into the corners of the grid's
    // cells, a hair off the lines: the columns numbered along the first
    // row, a note in the second, a caption in the last cell's bottom right.
    // The shader lenses it with the grid, so it stays on its lines.
    const s = fine(width, 0.85);
    const mono = { family: MONO, tracking: 0.02 };
    // Past the 1px line, one pixel of paper before the ink, measured on
    // the glyphs themselves: mono faces carry side bearings that would push
    // the text off the line.
    const gap = 2;
    ctx.font = font(s, MONO);
    ctx.letterSpacing = `${0.02 * s}px`;
    const ink = ctx.measureText('0G');
    const inset = (x: number) => x + gap + ink.actualBoundingBoxLeft;
    const hang = (y: number) => y + gap + ink.actualBoundingBoxAscent;
    for (let k = 1; k * cell < width - 1; k++) {
      printLines(ctx, [String(k).padStart(2, '0')], inset(k * cell), hang(cell), s, mono);
    }
    printLines(ctx, ['General relativity', 'Berlin, 1915'], inset(cell), hang(cell * 2), s, mono);
    const lastRow = Math.floor((height - 1) / cell) * cell;
    const lastColumn = Math.floor((width - 1) / cell) * cell;
    printLines(
      ctx,
      ['A poster about weight', 'No. 03 / \u03b8E \u221d \u221aM'],
      lastColumn - gap,
      lastRow - gap - s * 1.3,
      s,
      { ...mono, align: 'right' },
    );
  },
  fragment: `
    ${prelude}

    const vec3 SPACE = vec3(0.04);

    void main() {
      vec2 uv = vUv;
      // At rest the mass drifts slowly across the words.
      vec2 rest = vec2(0.5 + 0.3 * sin(time * 0.13), 0.36 + 0.12 * sin(time * 0.21));
      vec2 lens = toSquare(focus(rest));
      vec2 p = toSquare(uv);
      vec2 d = p - lens;
      float r2 = max(dot(d, d), 1e-5);
      // The Einstein radius: heavier once the pointer is holding it.
      float einstein = 0.075 + 0.045 * hover;
      // The lens equation: light seen at p left the poster at \`source\`.
      vec2 source = p - einstein * einstein * d / r2;
      // Each colour bends a hair differently, so the ring fringes.
      vec2 spread = d / r2 * einstein * einstein * 0.03;
      vec3 type = vec3(
        ink(fromSquare(source + spread)),
        ink(fromSquare(source)),
        ink(fromSquare(source - spread))
      );
      float lines = grid(fromSquare(source));
      vec3 colour = SPACE + accent * lines * 0.28;
      colour = mix(colour, accent, type.g);
      colour.r = mix(colour.r, accent.r, type.r);
      colour.b = mix(colour.b, accent.b, type.b);
      // Nothing comes back from inside the horizon.
      float r = sqrt(r2);
      colour *= smoothstep(einstein * 0.3, einstein * 0.36, r);
      // A faint photon ring on the horizon's edge.
      colour += accent * 0.25 * exp(-pow((r - einstein * 0.37) / 0.004, 2.0));
      // The small print is set on the grid, so it bends with it.
      colour = mix(colour, vec3(0.6), print(fromSquare(source)));
      gl_FragColor = vec4(colour, 1.0);
    }
  `,
};
