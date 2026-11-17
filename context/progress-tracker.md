# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- Spec 10 implemented (goal edit/delete actions and account menu)

## Current Goal

- Let signed-in users manage goals and account access, with individual transaction records immutable unless their goal is deleted.

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
- Spec 8: added the `goals` table and the `transactions` table (no transaction mutations yet) to `convex/schema.ts`.
- Added `convex/auth.ts` with the shared `requireIdentity` helper and reused it in `convex/users.ts`.
- Added `convex/goals.ts` with `listGoals` (derives each goal's balance from its transactions) and `createGoal` (validates name, optional target amount in minor units, optional target date, and onboarding).
- Added `hooks/use-goals.ts` exposing `useGoals` and `useGoalActions`.
- Added the shared Ant Design `FinnAntProvider`, extracted the theme from the upload component, and updated `AntUpload` to use it.
- Added `components/client/goals/`: `GoalsSection` (grid + loading/empty states), `GoalCard` (balance, deadline, Ant Design circle progress), `AddGoalCard` (dashed "Add goal" tile), and `AddGoalModal` (name, target amount, target date).
- Added `constants/goals.ts`, `lib/money.ts` (minor-unit conversion and currency formatting), and `lib/goals.ts` (progress percent, reached check, date formatting, days left).
- Replaced the home-page component preview with the goals grid, keeping the profile header and post-auth redirect.
- Verified with `npx convex codegen`, `npx tsc --noEmit`, `npm run lint` (four generated-file warnings, no errors), and `npm run build`.
- Redesigned the add-goal modal with a custom header, prominent name field, two-column target amount/date row, optional-field labels, and shadcn footer buttons; `FinnAntProvider` now sets a 44px large control height and the modal radius. Re-verified with `npx tsc --noEmit`, `npm run lint`, and `npm run build`.
- Set the app currency to Philippine peso (PHP): added `constants/money.ts` (`PHP`, `en-PH`, `₱`), updated `lib/money.ts` formatting, and switched the target amount prefix to `₱`.
- Redesigned the goal card as a passbook-style ledger: name and reached badge, 28px mono balance, one data row, and an antd progress rail flush to the card's bottom edge. Removed the circular gauge, card shadows, middle-dot metadata, and all-caps labels from the add-goal modal and add-goal tile. Re-verified with `npx tsc --noEmit`, `npm run lint`, and `npm run build`.
- Made the goals grid two columns on mobile with tighter gaps, and scaled the cards down on small screens: shorter minimum height, smaller padding, responsive balance/caption type, and a condensed add-goal tile. Re-verified with `npx tsc --noEmit`, `npm run lint`, and `npm run build`.
- Moved goal progress into a compact Ant Design circle ring in the card's top-right, with the deadline under the goal name and the balance anchored at the bottom; open-ended goals show a neutral label instead of a ring. Re-verified with `npx tsc --noEmit`, `npm run lint`, and `npm run build`.
- Changed goal ordering to oldest first so newly created goals appear at the end of the grid, immediately before the add-goal tile.
- Spec 9: added `getGoal` plus `listTransactions` and `recordTransaction` in `convex/`, with ownership checks, insert-only transaction history, integer minor units, amount validation, and the withdrawal-not-above-balance rule enforced in the mutation.
- Added `useGoal`, `useTransactions`, `useTransactionActions`, and `useMediaQuery`; transaction rows carry a derived `balanceAfter` from a chronological running balance.
- Added `app/(app)/goals/[id]/page.tsx` and a passbook-style `GoalDetail`: goal name, 44px mono balance, target progress rail, deposit and withdraw actions, and newest-first history with notes, dates, times, and running balances.
- Added a deposit/withdraw entry form that uses a shadcn Sheet on mobile and a centered Dialog on desktop, with inline validation and clear server errors.
- Added shadcn `Dialog`, `Sheet`, and `Skeleton`; goal cards now link to their detail page with a visible keyboard focus ring.
- Added skeleton loading states for the home goal grid and the goal detail page, replacing the previous loading text.
- Added shadcn's Base UI Toast at `components/client/ui/toast.tsx`, mounted `<Toaster />` in the root layout, and installed `@base-ui/react` (the `radix-nova` style has no toast item).
- Deposits and withdrawals now close the entry sheet/modal and show a success toast with the amount and the new balance. No Undo action is offered, since transactions are insert-only.
- Verified with `npx convex codegen` (functions synced), `npx tsc --noEmit`, `npm run lint` (four generated-file warnings, no errors), and `npm run build`.
- Spec 10: added an edit mutation and an edit form for goal name, optional target amount, and optional target date.
- Added a three-dot menu to each goal card with Edit and Delete actions. Delete uses a confirmation dialog and an ownership-checked mutation; deleting a goal also deletes its transactions, as confirmed by the user because Finn does not move real money.
- Updated the account header to show only a rounded profile photo at the top left, with Manage account and Sign out in its popover menu.
- Verified with `npx convex codegen`, `npx tsc --noEmit`, and `npm run lint` (four generated-file warnings, no errors). `npm run build` compiles and passes TypeScript, but Next.js stops it with a security vulnerability upgrade reminder.
- Responsive goal cards now switch to a single column below 360px, reduce their inner padding, and keep balance amounts untruncated at a viewport-scaled size so the peso symbol remains visible.

## In Progress

- None.

## Next Up

- Verify email/password, OAuth, onboarding, goal creation, deposits, and withdrawals with a signed-in development account.
- Confirm the withdraw rejection path in the UI by attempting to withdraw more than the current balance.

## Open Questions

None.

## Architecture Decisions

Goal deletion permanently removes the goal and its transactions after explicit confirmation. Individual transaction edit/delete actions remain unavailable.

## Session Notes

- Components should use the tokens through Tailwind utilities (for example `bg-bg-base`, `text-text-primary`, `border-border-default`, `text-state-success`) or `var(--token)` — never hardcoded hex values.
- Prefer shadcn semantic utilities (`bg-background`, `text-muted-foreground`, `border-border`) inside generated components so they stay portable.
- Verification commands: `npm run lint`, `npx tsc --noEmit`, `npm run build`.
