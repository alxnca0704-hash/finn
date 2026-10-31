# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- In progress (Spec 7 — Clerk authentication and Convex-backed onboarding)

## Current Goal

- Wire the existing Finn sign-in and sign-up UI to Clerk, then persist onboarding in Convex without changing the established interface.

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
- Spec 4: extracted the shared `AuthCard` shell, `SocialAuthButtons`, and `PasswordInput` into `components/client/auth/` so sign-in and sign-up reuse the same card.
- Added the `/sign-up` page and `SignUpCard` with email, password, and verify-password fields, show/hide toggles, a "Create account" submit button, and an "Already have an account? Sign in" link.
- Sign-up has no Google/SSO buttons; the submit button stays disabled and a red `FieldError` appears when the two passwords differ.
- The sign-in card's "Sign up" link now reaches the new `/sign-up` page; both links use `ROUTES` from `constants/routes.ts`.
- Verified with `npm run lint`, `npx tsc --noEmit`, and `npm run build`.
- Spec 5: added `Progress` and restyled its indicator to `bg-state-progress` so progress stays green per the UI context.
- Added `Popover` and `Calendar` (with `date-fns` and `react-day-picker`) plus a `DatePicker` composition at `components/client/ui/date-picker.tsx`.
- Installed `antd` and `@ant-design/icons` and added `AntUpload` at `components/client/upload/ant-upload.tsx`, themed through `ConfigProvider` with Finn tokens and a shadcn `Button` trigger.
- Replaced the home-page placeholder with a small preview that renders all three components; `AntUpload` sits inside `<Suspense>` because antd reads `Date.now()` at module scope during prerender.
- Verified with `npm run lint`, `npx tsc --noEmit`, `npm run build`, and a dev-server request that returned 200 with the new components rendered.
- Spec 7 implementation: added the Clerk Next.js SDK and root provider, Next.js 16 `proxy.ts` session middleware, a signed-in `(app)` route group with the homepage at `/`, and an SSO callback route.
- Connected the existing email/password sign-in and sign-up forms to Clerk custom flows, including email verification, optional email-code MFA, provider OAuth buttons (Google, Apple, Facebook), and visible errors. The Finn components and visual layout remain in use.
- Added Clerk-to-Convex token provisioning, Convex auth configuration, a user profile schema and authenticated queries/mutations for username availability and onboarding completion.
- Onboarding now saves first name, last name, username, and birthday to Convex; optional profile photos upload to Convex Storage in accordance with the architecture rules.
- `npm run lint`, `npx tsc --noEmit`, and `npm run build` pass. Lint reports four warnings in generated Convex files and no errors.
- The user supplied the selected Clerk application's development keys in `.env.local` (the file was not opened). `/sign-in` and `/sign-up` now return 200 locally, and signed-out `/onboarding` requests redirect to sign-in.
- The Clerk Frontend API URL supplied by the user is set as `CLERK_JWT_ISSUER_DOMAIN` on the existing `flippant-sardine-77` Convex development deployment. `npx convex dev` synced the schema and functions and reported them ready.
- `npx convex run users:getCurrentUser "{}"` found the deployed function and returned the expected signed-out authorization error.
- Moved the existing home page into `app/(app)/page.tsx`; the URL remains `/`, and signed-in users land there after Clerk redirects.
- The signed-in home page displays the saved username and profile photo from Convex Storage, with initials when no photo was uploaded. Added a Clerk sign-out button beside the profile.
- A signed-in browser request reached Convex but had no verified Convex identity. Updated the current-user hooks to skip queries until Convex authentication succeeds and show an onboarding setup message instead of a runtime error.
- The selected Clerk app still needs its Convex integration enabled or a JWT template named `convex`; after that, verify onboarding from a signed-in browser session.

## In Progress

- Enable the selected Clerk app's Convex integration or create its `convex` JWT template. Confirm email/password and Google, Apple, and Facebook sign-in are enabled.
- Confirm `NEXT_PUBLIC_CONVEX_URL` is set for the app and verify onboarding with a signed-in development account.

## Next Up

- Verify email/password, OAuth, and onboarding with a signed-in development account.

## Open Questions

- Spec 3 mentions "a new page for sign up" but the card title, link text, and screen list describe a sign-in screen. Built the sign-in page at `/sign-in`; the sign-up link points to `/sign-up`, which does not exist yet and was out of scope.
- Spec 4 says the sign-up "Sign in" link has "no routes for now". Assumed this refers to auth/API wiring rather than navigation, so the link points to the existing `/sign-in` page. Confirm if it should be inert instead.
- Verify password validates only that both fields match; there are no strength rules yet. Social buttons were removed from sign-up but remain on sign-in, since sign-in SSO is part of the product overview.
- Ant Design is a deliberate exception to the shadcn-only rule, requested by Spec 5. The `Upload` has no endpoint, so it keeps files in local component state (`beforeUpload` returns `false`) and never posts anywhere; wiring it to Convex file storage is still open.
- The `DatePicker` is a local composition of `Calendar` + `Popover`, since shadcn has no standalone date-picker registry item. It is uncontrolled by default and optionally controlled via `value` / `onChange`.
- `AntUpload` reads `Date.now()` at module scope inside antd, which Next 16 flags during prerender. The home-page preview wraps it in `<Suspense>`. Any future usage needs the same boundary (or a client-only dynamic import).
- The Clerk issuer domain and provider enablement are account configuration; environment files were not inspected.

## Architecture Decisions

- Light-only theme with no dark mode, matching the monochrome finance design language in the UI context.
- `--background` and `--foreground` remain aliases of `--bg-base` and `--text-primary`; the shadcn semantic tokens are aliases too, so generated components inherit Finn colors without custom overrides.
- Fonts are self-hosted through `next/font` and exposed as `--font-montserrat` / `--font-roboto-mono`, which the Tailwind theme maps to `font-sans` / `font-mono`.
- shadcn `ui` components live in `components/client/ui/` and all carry `"use client"`, even when a specific component has no hooks.
- Generated components import `cn` from the `cn` package; `lib/utils.ts` re-exports it as the shared utility entry point.
- Ant Design is limited to `Upload`; it is wrapped in a client component with a `ConfigProvider` theme built from `var(--token)` values so it matches the monochrome palette, and it is documented as an exception in `ui-context.md`.

## Session Notes

- Components should use the tokens through Tailwind utilities (for example `bg-bg-base`, `text-text-primary`, `border-border-default`, `text-state-success`) or `var(--token)` — never hardcoded hex values.
- Prefer shadcn semantic utilities (`bg-background`, `text-muted-foreground`, `border-border`) inside generated components so they stay portable.
- Verification commands: `npm run lint`, `npx tsc --noEmit`, `npm run build`.
