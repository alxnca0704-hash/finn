# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- Complete (Spec 1 — CSS foundation)

## Current Goal

- Global theme tokens and fonts are in place.

## Completed

- Defined the dark-only color tokens from `context/ui-context.md` in `app/globals.css`: `--bg-base`, `--bg-surface`, `--bg-raised`, `--text-primary`, `--text-muted`, `--accent-primary`, `--border-default`, `--state-error`, `--state-success`, `--state-progress`.
- Exposed tokens to Tailwind v4 via `@theme inline`, plus `background`/`foreground` aliases for compatibility.
- Applied base dark styling: black page background, primary text color, default border color, dark `color-scheme`, and selection colors.
- Replaced Geist with Montserrat (`--font-sans`) and Roboto Mono (`--font-mono`) loaded through `next/font/google` and wired up in `app/layout.tsx`.
- Verified with `npm run lint`, `npx tsc --noEmit`, and `npm run build`.

## In Progress

- None.

## Next Up

- Spec 2 (not defined yet).

## Open Questions

- None.

## Architecture Decisions

- Dark-only theme with no light mode, matching the monochrome finance design language in the UI context.
- Kept `--background` and `--foreground` as aliases of `--bg-base` and `--text-primary` so existing scaffold usage keeps working while the new tokens are the source of truth.
- Fonts are self-hosted through `next/font` and exposed as `--font-montserrat` / `--font-roboto-mono`, which the Tailwind theme maps to `font-sans` / `font-mono`.

## Session Notes

- Components should use the tokens through Tailwind utilities (for example `bg-bg-base`, `text-text-primary`, `border-border-default`, `text-state-success`) or `var(--token)` — never hardcoded hex values.
- Verification commands: `npm run lint`, `npx tsc --noEmit`, `npm run build`.
