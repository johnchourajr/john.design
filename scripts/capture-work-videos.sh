#!/usr/bin/env bash
# Records each project's page scrolling, for the work page's strips (#128):
# a short hold on the first screen, then eased pushes from section to section,
# at 1440x900 and 30fps (scripts/record-scroll.mjs).
#
#   scripts/capture-work-videos.sh [out-root] [slug...]
#
# Videos land in <out-root>/work-images/<slug>/<slug>-scroll-1.mp4 (default
# `.media`, which git ignores), with a WebM beside it where that is clearly
# smaller. Pass slugs to record only those. Needs agent-browser and ffmpeg.
set -euo pipefail

ROOT="${1:-.media}"
shift || true
SESSION="work-videos"
# slug url
SITES=(
  "the-grand https://thegrandlb.com/"
  "processcreative https://processcreative.co/"
  "bueno-fund https://bueno.fund/"
)
ab() { agent-browser --session "$SESSION" "$@"; }

for site in "${SITES[@]}"; do
  read -r slug url <<<"$site"
  if [ $# -gt 0 ] && [[ ! " $* " =~ " $slug " ]]; then continue; fi
  out="$ROOT/work-images/$slug"
  mkdir -p "$out"

  ab set viewport 1440 900 1 >/dev/null
  ab open "$url" >/dev/null
  # Intro animations and lazy media settle.
  sleep 8
  node scripts/record-scroll.mjs "$(ab get cdp-url)" "$out/$slug-scroll-1.mp4" 3 24

  webm="$out/$slug-scroll-1.webm"
  ffmpeg -v error -y -i "$out/$slug-scroll-1.mp4" -an -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 "$webm"
  if [ "$(stat -f%z "$webm")" -gt "$(($(stat -f%z "$out/$slug-scroll-1.mp4") * 9 / 10))" ]; then
    rm "$webm"
  fi
done

ab close >/dev/null
