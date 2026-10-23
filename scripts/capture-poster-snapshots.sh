#!/usr/bin/env bash
# Captures each type poster's still frame into public/exp/type-posters/, the
# snapshot the page shows until the live shader has drawn (#123).
#
# Reduced motion gives every poster a deterministic frame (time 0, no
# pointer), so the snapshot is exactly what the shader draws first. Run it
# against `pnpm dev` after changing a poster's layout or shader:
#
#   scripts/capture-poster-snapshots.sh [base-url]
#
# Needs agent-browser and macOS's sips.
set -euo pipefail

BASE="${1:-http://localhost:2424}"
OUT="public/exp/type-posters"
SESSION="poster-snapshots"
SLUGS=(out-of-register vortices mass-bends-light everything-falls interference rocaille afterimage dot-gain)
TMP="$(mktemp -d)"
ab() { agent-browser --session "$SESSION" "$@"; }

mkdir -p "$OUT"
ab set viewport 1600 1000 2 >/dev/null
ab set media dark reduced-motion >/dev/null
for i in "${!SLUGS[@]}"; do
  slug="${SLUGS[$i]}"
  # A fresh page for each, then step to the poster with the keyboard (the
  # pointer would set hover) and open it at its largest.
  ab open "$BASE/exp/type-posters?poster-renderer=webgl" >/dev/null
  sleep 6
  for _ in $(seq 0 "$i"); do ab press ArrowRight >/dev/null; done
  ab press Enter >/dev/null
  sleep 2
  opened="$(ab eval "document.querySelector('[aria-expanded=true]')?.dataset.testid" | tr -d '"')"
  if [ "$opened" != "type-poster-open-$slug" ]; then echo "$slug: opened '$opened' instead" >&2; exit 1; fi
  rect="$(ab eval "(() => { const r = document.querySelector('[data-testid=type-poster-open-$slug] [role=img]').getBoundingClientRect(); return [r.left, r.top, r.width, r.height].map((v) => Math.round(v * 2)).join(' '); })()" | tr -d '"')"
  read -r x y w h <<<"$rect"
  ab screenshot "$TMP/$slug.png" >/dev/null
  sips -c "$h" "$w" --cropOffset "$y" "$x" "$TMP/$slug.png" --out "$TMP/$slug-crop.png" >/dev/null
  sips -s format jpeg -s formatOptions 82 "$TMP/$slug-crop.png" --out "$OUT/$slug.jpg" >/dev/null
  echo "$slug: ${w}x${h}"
done

ab close >/dev/null
rm -rf "$TMP"
