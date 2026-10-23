/**
 * Hero headlines are `headline-display-xl`, which never goes below 4.5rem.
 * On a phone that's too big for any word over about six letters, and the
 * line runs off both edges. Below `md` each line takes a size that fits its
 * own letters across the screen instead (never larger than 4.5rem).
 *
 * The size comes from the text, not a measurement, so the prerendered page
 * and the shader's copy of the headline get it on their first frame.
 */

// KUniforma Bold's uppercase advance widths at 100px, measured in the
// browser. Anything missing counts as a wide letter.
const WIDTHS: Record<string, number> = {
  A: 90.7, B: 77.7, C: 91, D: 86.3, E: 69.6, F: 66.7, G: 94.9, H: 80.4,
  I: 28.2, J: 66.8, K: 82, L: 63.3, M: 103.9, N: 83.4, O: 92.4, P: 75.3,
  Q: 92.4, R: 79.5, S: 76.7, T: 71.7, U: 80.6, V: 89.5, W: 126.4, X: 83.8,
  Y: 87.4, Z: 72.6, ' ': 19.1, '-': 42.6, '—': 96.6, '.': 27, ',': 28.7,
  '&': 91.7, '0': 76.1, '1': 47.5, '2': 70.5, '3': 74.6, '4': 76.6,
  '5': 75.1, '6': 75.2, '7': 67.3, '8': 75.3, '9': 75.2,
};
const WIDE = 95;

// The sizes a line can take, as literal classes so Tailwind generates them:
// index n is n vw. Above 18vw a phone line is already at 4.5rem.
const SIZES = [
  '', '', '', '', '', '', '',
  'max-md:text-[min(4.5rem,7vw)]',
  'max-md:text-[min(4.5rem,8vw)]',
  'max-md:text-[min(4.5rem,9vw)]',
  'max-md:text-[min(4.5rem,10vw)]',
  'max-md:text-[min(4.5rem,11vw)]',
  'max-md:text-[min(4.5rem,12vw)]',
  'max-md:text-[min(4.5rem,13vw)]',
  'max-md:text-[min(4.5rem,14vw)]',
  'max-md:text-[min(4.5rem,15vw)]',
  'max-md:text-[min(4.5rem,16vw)]',
  'max-md:text-[min(4.5rem,17vw)]',
  'max-md:text-[min(4.5rem,18vw)]',
];

/**
 * The phone-size class for a headline line. Words in asterisks are set in
 * a heavier italic, so they count a little wider. The line fills 94% of the
 * screen's width, leaving room for the layouts' own nudges.
 */
export const phoneFit = (text: string) => {
  const width = text.split(' ').reduce((sum, word, i) => {
    const emphasis = word.startsWith('*') && word.endsWith('*') ? 1.06 : 1;
    const letters = word.replace(/\*/g, '').toUpperCase();
    const own = [...letters].reduce((total, ch) => total + (WIDTHS[ch] ?? WIDE), 0);
    return sum + own * emphasis + (i > 0 ? WIDTHS[' '] : 0);
  }, 0);
  const vw = Math.floor((94 * 100) / Math.max(1, width));
  return vw >= SIZES.length ? '' : SIZES[Math.max(7, vw)];
};
