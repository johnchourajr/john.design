---
name: bueno-demo
description: Record a short, polished product demo video of a web app (a real browser, an eased zoom toward each click, a spring-smoothed cursor) and export MP4, a poster and optionally a GIF. Use when a moving demo explains a feature better than a screenshot, for release notes, docs, decks, PRs or Slack. Triggers on "record a demo", "demo video", "screen recording of", "make a GIF of", "show this feature in a video".
---

# Demo videos with bueno-demo

`bueno-demo` records a scripted walk through a web page and renders it into a Screen Studio-style clip. There are two steps: **capture** drives a real Chromium window and records it, and **render** adds the camera, cursor and titles.

## Setup, once per machine

```bash
npm i -D bueno-demo            # or run everything with npx bueno-demo
npx playwright install chromium
brew install ffmpeg            # required; add imagemagick for WebP posters
```

## The loop

1. **Write a script**, a JSON file (see below). Keep one idea per clip, 10 to 15 seconds.
2. **Capture:** `npx bueno-demo capture demos/<name>.json out/<name>`
3. **Optional cut** of a slow load: `npx bueno-demo cut out/<name> <from-s> <to-s>`
4. **Render:** `npx bueno-demo render out/<name> out/<name>/<name> --gif`
5. **Look at it before using it.** Make a contact sheet and check every frame:
   `ffmpeg -i out/<name>/<name>.mp4 -vf "fps=1,scale=640:-1,tile=3x4" -frames:v 1 sheet.png`
   If a bug or private data shows on camera, fix the script or cut it, then re-render.

## Scripts

```json
{
  "url": "http://localhost:3000/settings",
  "viewport": [1440, 900],
  "storage": "auth.json",
  "keep": "document.querySelectorAll('[data-user-email]').forEach(e => e.textContent = 'sam@example.com')",
  "steps": [
    { "scroll": "[data-testid=billing]" },
    { "click": "[data-testid=plan-toggle]", "after": 1200 },
    { "type": "[data-testid=team-name]", "text": "Northwind", "clear": true },
    { "hover": "[data-testid=save]", "zoom": true },
    { "click": "[data-testid=save]", "zoom": false },
    { "wait": 800 }
  ]
}
```

**Steps**, each optionally with `after` (ms to pause afterwards):
- `click`: glide to the element and click. `zoom: false` skips the camera zoom; use it on a click that navigates.
- `type`: click, then type `text` (`delay` ms per key, default 55; `clear: true` replaces the value).
- `fill`: click, then set `text` at once, for inputs typing can't drive (date pickers).
- `hover`: glide there. `zoom: true` points the camera too.
- `upload`: glide to a drop zone and attach `file` (relative to the script) to `input`.
- `press`: a key, like `"Escape"`.
- `scroll`: smooth-scroll the element into view.
- `wait`: pause, in ms. `eval`: run JS in the page, on camera.

**Options:**
- **Signing in:** `storage` points at a Playwright storage-state file (save one with `npx playwright codegen --save-storage=auth.json <url>`). Or `"cookiesFrom": "agent-browser"` borrows a signed-in agent-browser session. Cookies are never printed.
- **Privacy:** `keep` is JS run before recording and every 250ms during it, to swap real names and emails for stand-ins so a re-render never brings them back. `hide` adds CSS selectors to hide (dev overlays from Next.js and Vercel are hidden already; `"hide": false` shows them).
- **Off camera:** `setup` is JS run once before recording (closing a banner, say).
- **Feel:** `travelMs` (cursor travel, default 700), `settle` (wait after load, default 1500), `tail` (hold at the end, default 1200), `cursorStart` (`[x, y]`), `reducedMotion: true`.
- **Loading:** `waitUntil` (default `networkidle`). A page that streams video or polls never goes idle, so the capture times out; set `"load"` and let `settle` cover the rest.
- **Another server:** `--base http://localhost:3001` on capture records the same path elsewhere.

**Selectors:** prefer `data-testid` or structure (`#title`, `input[name=amount]`) over visible text, so copy changes don't break the script.

## Render flags

- `--zoom 1.6` how far a click zooms (1.3 when two things matter at once).
- `--speed 0.9` plays 10% slower; `--speed 2.5` for a fast montage.
- `--end 9.8` cuts at that second; `--hold 1.2` freezes the last frame.
- `--matte '#fdfaf1'` frames the page as a rounded window on that colour (default is edge to edge).
- `--title 'Moving an event' --kicker 'Events'` adds an opening title; `--end-cap` adds a closing card.
- `--brand brand.json` sets the title and card look: `ink`, `paper`, `accent`, `displayFont` / `monoFont` (`{ "family", "file", "weight" }`), `logo`, `footer`, `kicker`. Paths are relative to the brand file.
- `--fit` renders at the page's own shape (portrait for a phone viewport).
- `--gif` also writes a 960px, 15fps GIF.

## Rules

- **Never record real customer data.** Use test accounts and a `keep` hook for anything personal; check the contact sheet before sharing.
- **Short and single-purpose.** One feature per clip; cut waits with `cut`.
- **Host video outside the repo.** Commit the script (and a poster if your docs need one); put MP4s and GIFs in your storage or CDN.
