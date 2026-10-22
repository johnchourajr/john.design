# AGENTS.md

## Cursor Cloud specific instructions

### Overview

Next.js 16 portfolio site (App Router, React 19, Tailwind CSS 3, Three.js). Single service, no database or external dependencies needed.

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
- `?iframe` embeds are flagged on `<html data-iframe>` by `public/scripts/iframe-flag.js` before first paint; site chrome hides with the `[[data-iframe]_&]:hidden` variant.
- `proxy.ts` serves an empty page to short or bot user agents, including plain `curl`. Pass a browser `-A` user agent when inspecting HTML.
- ESLint 9 uses the flat config in `eslint.config.mjs`, which imports `eslint-config-next/core-web-vitals`. `.eslintrc.ts` is legacy and ignored; its import-order and Prettier rules are not enforced.
- Proposal detail pages (`/proposals/[slug]`) hide the site Header, Footer, and top padding via the `useIsProposalDetail` hook (`NavLeft`, `NavRight`, `Footer`, `LayoutInner`).
