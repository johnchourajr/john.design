/**
 * Scripts that have to run before first paint, inlined into the document
 * head by app/layout.tsx. `next/script`'s `beforeInteractive` queues even
 * these behind the Next runtime, so they're plain inline scripts instead.
 * Each function is serialised with `toString()`, so it can't reach anything
 * outside its own body.
 */

/** Applies the accent colour saved in the `root_color` cookie. */
function applyRootColorCookie() {
  try {
    const match = document.cookie.match(/(?:^|;\s*)root_color=([^;]+)/);
    if (!match) return;

    const value = decodeURIComponent(match[1] || '').trim();
    if (!value) return;

    const isHex = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value);
    const isRgb =
      /^rgba?\(\s*(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\s*,\s*(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\s*,\s*(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])(?:\s*,\s*(?:0|1|0?\.\d+))?\s*\)$/.test(
        value,
      );
    const isHsl =
      /^hsla?\(\s*(?:\d|[1-2]\d{1,2}|3[0-5]\d|360)(?:deg)?\s*,\s*(?:\d|[1-9]\d|100)%\s*,\s*(?:\d|[1-9]\d|100)%(?:\s*,\s*(?:0|1|0?\.\d+))?\s*\)$/.test(
        value,
      );

    if (!(isHex || isRgb || isHsl)) return;

    document.documentElement.style.setProperty('--root-color', value);
  } catch {
    // ignore
  }
}

/**
 * Flags embedded pages (?iframe) so CSS can hide the site chrome in the
 * static HTML, ahead of React reading the same flag.
 */
function flagIframe() {
  try {
    if (new URLSearchParams(window.location.search).has('iframe')) {
      document.documentElement.setAttribute('data-iframe', '');
    }
  } catch {
    // ignore
  }
}

export const headScript = [applyRootColorCookie, flagIframe]
  .map((script) => `(${script.toString()})();`)
  .join('\n');
