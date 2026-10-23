# AGENTS.md

## Cursor Cloud specific instructions

### Overview

Next.js 16 portfolio site (App Router, React 19, Tailwind CSS 4, Three.js). Single service, no database or external dependencies needed.

### Dev server

```
pnpm dev
```

Runs on port 2424. See `package.json` scripts for all available commands.

### Linting and type checking

- `pnpm lint` -- ESLint (requires `eslint.config.mjs` flat config for ESLint 9)
- `pnpm typecheck` -- TypeScript (`tsc --noEmit`)
- `pnpm precommit` -- runs both lint and typecheck

### Tickets

Tickets are GitHub Issues, via `gh issue`. How to title, write, label and link them is in `.claude/skills/github-issues/SKILL.md`. PR bodies open with `Closes #N`.

### Non-obvious caveats

- The global accent color uses CSS custom property `--root-color`. It is resolved server-side in `app/layout.tsx` from `root_color` cookie fallback to `#ff0000`, proposal pages can provide a per-page default via `themeColor` frontmatter (applied in `app/proposals/[slug]/layout.tsx`), and `AppProvider` persists user overrides back to the cookie.
- Pages are statically prerendered with full content. Avoid `useSearchParams` in anything that wraps the whole site (providers, layout chrome): it forces every page to render client-only. Read `window.location.search` via `useSyncExternalStore`, use the `useLocationSearch` hook (`lib/hooks/useLocationSearch.tsx`). Check with `pnpm build && pnpm exec next start` and inspect the HTML for `BAILOUT_TO_CLIENT_SIDE_RENDERING`.
- `?iframe` embeds are flagged on `<html data-iframe>` by `public/scripts/iframe-flag.js` before first paint; site chrome hides with the `in-data-iframe:hidden` variant (Tailwind v4's spelling of `[[data-iframe]_&]:hidden`).
- Tailwind 4 is configured in `styles/globals.css`: `@source` lists the scanned directories, including `data/` because posts use Tailwind classes in raw HTML (automatic detection is off, so docs like this file aren't scanned), and `@config` loads `tailwind.config.js` for the theme and the `@muybuen/type` plugin that generates `headline-*` and `text-*`. CSS modules that `@apply` need `@reference "../../styles/globals.css";` (see `components/journal/journal.module.css`).
- Bot filtering lives in Vercel Firewall custom rules, not in code (#90): production returns 403 to known scanners/scrapers and to user agents that are missing or shorter than 12 characters, including plain `curl`. Pass a browser `-A` user agent when inspecting production HTML. Local `next start` has no filter.
- ESLint 9 uses the flat config in `eslint.config.mjs`, which imports `eslint-config-next/core-web-vitals`. There are no import-order or Prettier lint rules; `.prettierrc` only serves editor formatting. ESLint 10 waits on `eslint-plugin-react`, `eslint-plugin-import` and `eslint-plugin-jsx-a11y` (pulled in by `eslint-config-next`) supporting it, see #93.
- Hero headlines (home and every `JustifiedHeadlineInner` hero) are drawn inside the shader so its effects warp the type (#108): `components/experimental/headlineTexture.ts` rasterises the DOM letters into a texture, and the DOM headline goes to `opacity: 0` once the canvas shows it. The DOM text stays visible with reduced motion, without WebGL and until fonts load. `?shader=<variant>` pins a hero variant, `?shader-text=off` keeps the headline in the DOM for side-by-side review, and `?shader-debug` shows a live readout of the shader's state (sizes, loop, hover, headline). The hero canvas mirrors whether the pointer has arrived as `data-hover`.
- Proposal detail pages (`/proposals/[slug]`) hide the site Header, Footer, and top padding via the `useIsProposalDetail` hook (`NavLeft`, `NavRight`, `Footer`, `LayoutInner`).

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
