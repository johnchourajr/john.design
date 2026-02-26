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

### Non-obvious caveats

- The global text color is set via CSS custom property `--root-color` (defaults to `#ff0000` red) applied in `LayoutOuter`. Components that need white text must explicitly override with `text-white`.
- `pnpm build` has a pre-existing failure on `/_global-error` page (`useContext` null reference). The dev server works fine despite this.
- ESLint 9 requires flat config format. The repo uses `.eslintrc.json` (legacy) alongside `eslint.config.mjs` (flat config bridge). The flat config file imports from `eslint-config-next/core-web-vitals` directly.
- Proposal detail pages (`/proposals/[slug]`) hide the site Header, Footer, and top padding via pathname checks in `NavWrapper`, `Footer`, and `LayoutInner`.
