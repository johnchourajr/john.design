#!/usr/bin/env bash
# Captures frames of each live project for the work page's strips (#128):
# up to three desktop frames and one phone frame, all at 2x.
#
#   scripts/capture-work-screenshots.sh [out-root] [slug...]
#
# Frames land in <out-root>/work-images/<slug>/ (default `.media`, which git
# ignores), ready for `pnpm media:upload .media` and `pnpm media:manifest .media`.
# Pass slugs to recapture only those. Needs agent-browser, macOS's sips and
# ImageMagick.
set -euo pipefail

ROOT="${1:-.media}"
shift || true
SESSION="work-shots"
# slug url [url...]: one URL gives frames scrolled down that page; more URLs
# give one frame from the top of each.
SITES=(
  "bueno-fund https://bueno.fund/"
  "processcreative https://processcreative.co/"
  "goodheart-bread https://goodheartbread.com/"
  "muybuen-cursor https://cursor.muybuen.dev/"
  "muybuen-type https://type.muybuen.dev/"
  "buen-coffee https://muybuen.coffee/ https://muybuen.coffee/recipes"
  "the-grand https://thegrandlb.com/"
  "smile-gdp https://smilegdp.archive.john.design/"
  # The live domain now redirects to The Grand, so this is the last archived
  # copy of the site; its photos still load from Prismic (see UNARCHIVE_JS).
  "petroleum-club https://web.archive.org/web/20250416011518if_/https://lbpetroleum.club/"
  "chris-rushing https://chrisrushing.com/"
  "kelsey-dake https://kelseydake.com/"
  "retool-dot-com https://retool.com/"
  # Your version of the blog, before Retool replaced it in 2025.
  "retool-blog https://web.archive.org/web/20240903023929if_/https://retool.com/blog"
  "retool-pipes https://retool.com/pipes/"
  "retool-state-of-ai-2023 https://retool.com/reports/state-of-ai-2023/"
)
# Scrolls the window, or the tallest scrolling element when the page scrolls
# an inner container instead (Pipes does).
SCROLL_JS="(() => {
  const root = document.scrollingElement;
  let target = root.scrollHeight > innerHeight + 50 ? root : null;
  if (!target) {
    for (const el of document.querySelectorAll('*')) {
      const y = getComputedStyle(el).overflowY;
      if (/(auto|scroll)/.test(y) && el.scrollHeight > el.clientHeight + 50 &&
          (!target || el.scrollHeight > target.scrollHeight)) target = el;
    }
  }
  if (target) target.scrollBy(0, innerHeight * 1.2);
})()"
# The Wayback Machine never archived some images at the sizes a page asks for,
# so on an archived page point every image back at its live URL. Next's image
# optimizer (`/_next/image?url=…`) doesn't exist on the archive, so those go
# straight to the source, and images a framework would have faded in once
# hydrated (Gatsby leaves them at opacity 0) are shown.
UNARCHIVE_JS="(() => {
  const live = (u) => u.replace(/https?:\\/\\/web\\.archive\\.org\\/web\\/[0-9]+[a-z_]*\\//g, '');
  const source = (u) => {
    const next = u.match(/\\/_next\\/image\\?url=([^&\\s]+)/);
    return live(next ? decodeURIComponent(next[1]) : u);
  };
  for (const el of document.querySelectorAll('img, source')) {
    const src = el.getAttribute('src');
    const srcset = el.getAttribute('srcset') || '';
    if (srcset.includes('/_next/image')) el.removeAttribute('srcset');
    else if (srcset) el.srcset = live(srcset);
    if (src) el.src = source(src);
    el.loading = 'eager';
    if (el.tagName === 'IMG') el.style.opacity = '1';
  }
})()"
# Opens a URL and lets intro animations and lazy media settle.
visit() {
  ab open "$1" >/dev/null
  if [[ "$1" == *web.archive.org* ]]; then
    sleep 4
    ab eval "$UNARCHIVE_JS" >/dev/null
  fi
  sleep 8
}
TMP="$(mktemp -d)"
ab() { agent-browser --session "$SESSION" "$@"; }

# PNG to a JPEG frame at the full 2x resolution, unless it repeats the frame
# before it (a short page that ran out of scroll).
frame() {
  local png="$1" out="$2" prev="${3:-}"
  if [ -n "$prev" ]; then
    local diff
    diff="$(magick compare -metric RMSE "$prev" "$png" null: 2>&1 | sed -E 's/.*\(([0-9.e-]+)\).*/\1/')"
    if awk "BEGIN { exit !($diff < 0.01) }"; then return 1; fi
  fi
  sips -s format jpeg -s formatOptions 85 "$png" --out "$out" >/dev/null
}

for site in "${SITES[@]}"; do
  read -r slug urls <<<"$site"
  read -ra urls <<<"$urls"
  if [ $# -gt 0 ] && [[ ! " $* " =~ " $slug " ]]; then continue; fi
  out="$ROOT/work-images/$slug"
  rm -rf "$out"
  mkdir -p "$out"

  ab set viewport 1440 900 2 >/dev/null
  prev=""
  n=0
  if [ "${#urls[@]}" -gt 1 ]; then
    for url in "${urls[@]}"; do
      visit "$url"
      n=$((n + 1))
      ab screenshot "$TMP/$slug-$n.png" >/dev/null
      frame "$TMP/$slug-$n.png" "$out/$slug-desktop-$n.jpg"
    done
  else
    visit "${urls[0]}"
    for i in 1 2 3; do
      ab screenshot "$TMP/$slug-$i.png" >/dev/null
      if frame "$TMP/$slug-$i.png" "$out/$slug-desktop-$((n + 1)).jpg" "$prev"; then
        n=$((n + 1))
      fi
      prev="$TMP/$slug-$i.png"
      ab eval "$SCROLL_JS" >/dev/null
      sleep 3
    done
  fi

  ab set viewport 390 844 2 >/dev/null
  visit "${urls[0]}"
  ab screenshot "$TMP/$slug-m.png" >/dev/null
  frame "$TMP/$slug-m.png" "$out/$slug-mobile-1.jpg"
  echo "$slug: $n desktop, 1 mobile"
done

ab close >/dev/null
rm -rf "$TMP"
