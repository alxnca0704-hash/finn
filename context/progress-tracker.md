# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- Complete (Spec 2 — shadcn/ui setup and core components)

## Current Goal

- shadcn/ui is initialized and Button, Card, Input, and Field are available.

## Completed

- Spec 1: global dark-only theme tokens and Montserrat / Roboto Mono fonts in `app/globals.css` and `app/layout.tsx`.
- Initialized shadcn/ui (`radix` base, `nova` preset, lucide icons) and created `components.json` at the project root.
- Pointed the shadcn `ui` alias to `components/client/ui` per the project folder convention.
- Added `Button`, `Card`, `Input`, and `Field` to `components/client/ui/`, plus their `Label` and `Separator` dependencies.
- Added `"use client"` to every file under `components/client/ui/` to match the client folder rule.
- Restored the Finn dark-only tokens after `init`, and mapped shadcn semantic tokens (`background`, `foreground`, `card`, `popover`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`) onto the Finn palette.
- Kept the `@theme inline` exports, added the shadcn imports (`tw-animate-css`, `shadcn/tailwind.css`), and aligned the radius scale with `ui-context.md`.
- Removed the Geist font that `init` injected, keeping Montserrat as `--font-sans` and Roboto Mono as `--font-mono`.
- Replaced the default Next.js starter content in `app/page.tsx` with a centered `Input` and `Button` to confirm the components render.
- Verified with `npm run lint`, `npx tsc --noEmit`, and `npm run build`.

## In Progress

- None.

## Next Up

- Spec 3 (not defined yet).

## Open Questions

- None.

## Architecture Decisions

- Dark-only theme with no light mode, matching the monochrome finance design language in the UI context.
- `--background` and `--foreground` remain aliases of `--bg-base` and `--text-primary`; the shadcn semantic tokens are aliases too, so generated components inherit Finn colors without custom overrides.
- Fonts are self-hosted through `next/font` and exposed as `--font-montserrat` / `--font-roboto-mono`, which the Tailwind theme maps to `font-sans` / `font-mono`.
- shadcn `ui` components live in `components/client/ui/` and all carry `"use client"`, even when a specific component has no hooks.
- Generated components import `cn` from the `cn` package; `lib/utils.ts` re-exports it as the shared utility entry point.

## Session Notes

- Components should use the tokens through Tailwind utilities (for example `bg-bg-base`, `text-text-primary`, `border-border-default`, `text-state-success`) or `var(--token)` — never hardcoded hex values.
- Prefer shadcn semantic utilities (`bg-background`, `text-muted-foreground`, `border-border`) inside generated components so they stay portable.
- Verification commands: `npm run lint`, `npx tsc --noEmit`, `npm run build`.
