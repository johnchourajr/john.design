#!/usr/bin/env bash
# Uploads hosted media to the john-design-media R2 bucket, served at
# https://media.john.design (see #88). Uses your own Cloudflare login, so run
# `npx wrangler login` once first.
#
#   pnpm media:upload [sourceRoot]
#
# sourceRoot defaults to `public`; object keys are paths relative to it, e.g.
# `journal-images/images/x.jpg`. Re-uploading an existing key overwrites it.
set -euo pipefail

root="${1:-public}"
bucket="john-design-media"
count=0

while IFS= read -r -d '' file; do
  key="${file#"$root"/}"
  case "${file##*.}" in
    jpg | jpeg | JPG | JPEG) type="image/jpeg" ;;
    png) type="image/png" ;;
    gif) type="image/gif" ;;
    webp) type="image/webp" ;;
    svg) type="image/svg+xml" ;;
    mp4) type="video/mp4" ;;
    webm) type="video/webm" ;;
    mov) type="video/quicktime" ;;
    *) type="application/octet-stream" ;;
  esac
  echo "→ $key"
  npx --yes wrangler@4.152.0 r2 object put "$bucket/$key" \
    --file "$file" \
    --remote \
    --content-type "$type" \
    --cache-control "public, max-age=31536000"
  count=$((count + 1))
done < <(find "$root/journal-images" -type f ! -name '.*' -print0)

echo "Uploaded $count files to $bucket."
echo "Next: pnpm media:manifest $root && pnpm media:verify"
