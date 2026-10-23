import { fillText, fine, fitSize, INK, printLines } from '../posterTexture';
import { prelude } from '../prelude';
import type { Poster } from './types';

const PHRASES: { text: string; x: number; y: number; angle: number; width: number }[] = [
  { text: 'ROCAILLE', x: 0.08, y: 0.2, angle: -0.08, width: 0.84 },
  { text: 'A SHELL,', x: 0.12, y: 0.36, angle: 0.12, width: 0.42 },
  { text: 'A SCROLL,', x: 0.48, y: 0.46, angle: -0.18, width: 0.46 },
  { text: 'A FLOURISH', x: 0.1, y: 0.6, angle: 0.06, width: 0.7 },
  { text: 'THAT NEVER', x: 0.24, y: 0.74, angle: -0.1, width: 0.6 },
  { text: 'ENDS', x: 0.5, y: 0.88, angle: 0.22, width: 0.36 },
];

/**
 * Rococo ornament: the rocaille, a shell or a scroll that curls back on
 * itself. The words are pulled through a chain of whirls (one follows the
 * pointer) that curl them into C-scrolls, and shaded like silver.
 */
export const rocaille: Poster = {
  slug: 'rocaille',
  title: 'Rocaille',
  concept:
    'Rococo ornament: a line that curls back on itself. The words are pulled through whirls, and the pointer is one of them.',
  words: 'Rocaille. A shell, a scroll, a flourish that never ends.',
  paper: 'bg-[#e7e2da]',
  compose: (ctx, { width, height }) => {
    ctx.fillStyle = INK;
    for (const { text, x, y, angle, width: share } of PHRASES) {
      const size = fitSize(ctx, text, 'BigCaslon', width * share, { tracking: 0.02 });
      ctx.save();
      ctx.translate(x * width, y * height);
      ctx.rotate(angle);
      fillText(ctx, text, 0, 0, size, 'BigCaslon', { tracking: 0.02 });
      ctx.restore();
    }
    // An engraver's caption, centred over the plate: spaced capitals in
    // Caslon, then the attribution in italic.
    const s = fine(width);
    printLines(ctx, ['Planche VI \u00b7 Rocaille'], width / 2, height * 0.055, s, {
      family: 'BigCaslon',
      tracking: 0.28,
      align: 'center',
      upper: true,
    });
    printLines(ctx, ['after Meissonnier, 1734'], width / 2, height * 0.055 + s * 1.7, s * 1.05, {
      family: 'MontrealItalic',
      style: 'italic',
      align: 'center',
    });
  },
  fragment: `
    ${prelude}

    const vec3 PAPER = vec3(0.906, 0.886, 0.855);

    // Turns p around \`centre\` by \`strength\` at the centre, fading with
    // distance: a whirl.
    vec2 whirl(vec2 p, vec2 centre, float strength, float size) {
      vec2 d = p - centre;
      float falloff = exp(-dot(d, d) / (size * size));
      return centre + rotate(strength * falloff) * d;
    }

    // The chain of whirls, one after another, so the curls interlock.
    vec2 curl(vec2 p) {
      float t = time * 0.25;
      float a = aspect();
      p = whirl(p, vec2(0.3 * a, 0.7), 2.2 * sin(t), 0.22);
      p = whirl(p, vec2(0.72 * a, 0.42), -2.6 * sin(t * 0.8 + 1.0), 0.2);
      p = whirl(p, vec2(0.45 * a, 0.2), 1.8 * sin(t * 1.1 + 2.0), 0.18);
      p = whirl(p, toSquare(pointerUv()), -3.2 * hover, 0.16);
      return p;
    }

    void main() {
      vec2 uv = vUv;
      vec2 p = curl(toSquare(uv));
      vec2 warped = fromSquare(p);
      float a = smoothstep(0.35, 0.65, ink(warped));
      // Silver: bands of light and dark that follow the warp, so the
      // metal reads as bent along with the letters.
      float sheen = 0.5 + 0.5 * sin(p.y * 38.0 + p.x * 12.0 + noise(p * 6.0) * 3.0);
      vec3 silver = mix(vec3(0.18), vec3(0.82), pow(sheen, 1.8));
      // A wide white brushstroke curling behind the words.
      vec2 brush = curl(toSquare(uv) * 0.92 + 0.04);
      float stroke = smoothstep(0.05, 0.0, abs(length(brush - vec2(0.5 * aspect(), 0.5)) - 0.3 + 0.06 * noise(brush * 4.0)));
      vec3 colour = mix(PAPER, vec3(1.0), stroke * 0.75);
      colour = mix(colour, silver, a);
      colour = mix(colour, vec3(0.25), print(uv));
      gl_FragColor = vec4(paper(colour), 1.0);
    }
  `,
};
