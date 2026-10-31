# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- Complete (Spec 3 — sign-in card)

## Current Goal

- The sign-in screen renders an email/password card with social buttons and a sign-up link.

## Completed

- Spec 1: global theme tokens and Montserrat / Roboto Mono fonts in `app/globals.css` and `app/layout.tsx`.
- Initialized shadcn/ui (`radix` base, `nova` preset, lucide icons) and created `components.json` at the project root.
- Pointed the shadcn `ui` alias to `components/client/ui` per the project folder convention.
- Added `Button`, `Card`, `Input`, and `Field` to `components/client/ui/`, plus their `Label` and `Separator` dependencies.
- Added `"use client"` to every file under `components/client/ui/` to match the client folder rule.
- Restored the Finn tokens after `init`, and mapped shadcn semantic tokens (`background`, `foreground`, `card`, `popover`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`) onto the Finn palette.
- Reverted the palette to a light theme: white page background, light grey surfaces, near-black text and primary accent, light borders; updated `context/ui-context.md` to match.
- Kept the `@theme inline` exports, added the shadcn imports (`tw-animate-css`, `shadcn/tailwind.css`), and aligned the radius scale with `ui-context.md`.
- Removed the Geist font that `init` injected, keeping Montserrat as `--font-sans` and Roboto Mono as `--font-mono`.
- Replaced the default Next.js starter content in `app/page.tsx` with a centered `Input` and `Button` to confirm the components render.
- Verified with `npm run lint`, `npx tsc --noEmit`, and `npm run build`.
- Spec 3: added the `(auth)` route group layout with a centered column and the Finn wordmark.
- Added the `/sign-in` page and the `SignInCard` client component with email and password fields, a submit button, Google/Apple/Facebook buttons, and the "Doesn't have an account? Sign up" link.
- Added `constants/routes.ts` with the home, sign-in, and sign-up paths so routes are not hardcoded.
- Social buttons use monochrome inline brand SVGs, since Lucide has no brand icons; all colors come from theme tokens.
- Refined the sign-in card: white surface, `rounded-2xl` corners, a soft token-based shadow, larger bold title, and more generous card padding.
- Added a show/hide password toggle inside the password input using Lucide `Eye` / `EyeOff` icons.
- Verified with `npm run lint`, `npx tsc --noEmit`, and `npm run build`.

## In Progress

- None.

## Next Up

- Spec 4 (not defined yet).

## Open Questions

- Spec 3 mentions "a new page for sign up" but the card title, link text, and screen list describe a sign-in screen. Built the sign-in page at `/sign-in`; the sign-up link points to `/sign-up`, which does not exist yet and was out of scope.

## Architecture Decisions

- Light-only theme with no dark mode, matching the monochrome finance design language in the UI context.
- `--background` and `--foreground` remain aliases of `--bg-base` and `--text-primary`; the shadcn semantic tokens are aliases too, so generated components inherit Finn colors without custom overrides.
- Fonts are self-hosted through `next/font` and exposed as `--font-montserrat` / `--font-roboto-mono`, which the Tailwind theme maps to `font-sans` / `font-mono`.
- shadcn `ui` components live in `components/client/ui/` and all carry `"use client"`, even when a specific component has no hooks.
- Generated components import `cn` from the `cn` package; `lib/utils.ts` re-exports it as the shared utility entry point.

## Session Notes

- Components should use the tokens through Tailwind utilities (for example `bg-bg-base`, `text-text-primary`, `border-border-default`, `text-state-success`) or `var(--token)` — never hardcoded hex values.
- Prefer shadcn semantic utilities (`bg-background`, `text-muted-foreground`, `border-border`) inside generated components so they stay portable.
- Verification commands: `npm run lint`, `npx tsc --noEmit`, `npm run build`.
