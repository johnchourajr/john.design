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
  "arcade https://www.arcadecoffeeroasters.com/ https://www.arcadecoffeeroasters.com/collections/shop/coffee https://www.arcadecoffeeroasters.com/pages/coffee-subscriptions https://www.arcadecoffeeroasters.com/pages/our-story"
  # The live domain now redirects to The Grand, so this is the last archived
  # copy of the site. Its photos still load from Prismic, and `#reveal` shows
  # the sections its scripts would have faded in (see REVEAL_JS).
  "petroleum-club https://web.archive.org/web/20250416011518if_/https://lbpetroleum.club/#reveal"
  "chris-rushing https://chrisrushing.com/"
  "kelsey-dake https://kelseydake.com/"
  "retool-dot-com https://retool.com/"
  # The blog as of May 2026, still your design.
  "retool-blog https://web.archive.org/web/20260521140205if_/https://retool.com/blog"
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
# On an archived page, scripts/unarchive-images.mjs loads the images from
# their live CDNs, and this loads lazy ones up front.
UNARCHIVE_JS="document.querySelectorAll('img').forEach((img) => {
  img.loading = 'eager';
})"
# A URL ending in `#reveal` is an archived page whose scripts never run there,
# so this shows everything its scroll and hydration animations would have
# faded in. Opt-in, because on a page that does run (the blog) the hidden
# elements are hover states and tooltips that should stay hidden.
REVEAL_JS="document.querySelectorAll('body *').forEach((el) => {
  if (getComputedStyle(el).opacity === '0' && el.getBoundingClientRect().height > 0) {
    el.style.opacity = '1';
    el.style.transform = 'none';
  }
})"
# Clicks away a cookie or consent banner, which would otherwise sit over
# every frame, and hides one that stays: banners often appear a few seconds
# after load, so this runs once the page has settled.
DISMISS_JS="(() => {
  [...document.querySelectorAll('button, a')]
    .find((el) => /^(got it!?|accept( all)?( cookies)?|i agree|agree|ok)$/i.test(el.textContent.trim()))
    ?.click();
  for (const el of document.querySelectorAll('body *')) {
    if (getComputedStyle(el).position === 'fixed' && /cookies/i.test(el.textContent)) {
      el.style.display = 'none';
    }
  }
})()"
# Opens a URL and lets intro animations and lazy media settle.
visit() {
  ab open "$1" >/dev/null
  if [[ "$1" == *web.archive.org* ]]; then
    sleep 4
    ab eval "$UNARCHIVE_JS" >/dev/null
  fi
  if [[ "$1" == *#reveal ]]; then ab eval "$REVEAL_JS" >/dev/null; fi
  sleep 8
  ab eval "$DISMISS_JS" >/dev/null
  sleep 1
}
TMP="$(mktemp -d)"
ab() { agent-browser --session "$SESSION" "$@"; }

ab set viewport 1440 900 2 >/dev/null
node scripts/unarchive-images.mjs "$(ab get cdp-url)" &
UNARCHIVE_PID=$!
trap 'kill "$UNARCHIVE_PID" 2>/dev/null || true' EXIT

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
  mkdir -p "$out"
  # Replace only this script's own frames; the folder also holds media
  # gathered by hand.
  rm -f "$out/$slug"-desktop-*.jpg "$out/$slug"-mobile-*.jpg

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
