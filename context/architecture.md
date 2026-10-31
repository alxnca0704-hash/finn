# Architecture Context

## Stack

| Layer            | Technology                      | Role                                                                                          |
| ---------------- | ------------------------------- | --------------------------------------------------------------------------------------------- |
| Framework        | Next.js (App Router) + TypeScript | Routing, page rendering, and typed UI code. Assumed, since it was not specified.            |
| UI               | Tailwind CSS                    | All styling through utility classes, with a shared set of design tokens (colors, spacing).    |
| Auth             | Clerk                           | Sign in with Google and other SSO, session handling, and the source of the user's identity.   |
| Database         | Convex                          | Stores users, goals, and transactions. Runs queries and mutations as typed server functions.  |
| File storage     | Convex file storage             | Stores uploaded profile pictures.                                                             |
| Client state     | Zustand                         | Holds UI-only state such as open modals, selected goal, and form drafts.                      |

## System Boundaries

- `app/` — Route groups: `(auth)` for sign-in, sign-up, and onboarding; `(app)` for the signed-in homepage and future authenticated screens. Pages compose components and call Convex hooks. No business rules live here.
- `components/` — Reusable UI pieces: goal card, progress bar, deposit and withdraw sheet, transaction list, avatar. Styled with Tailwind and free of data fetching logic where possible.
- `convex/` — The backend. Owns the schema, queries, and mutations for users, goals, and transactions, plus all validation and access checks.
- `stores/` — Zustand stores for client-only UI state. Never holds data that belongs in Convex.
- `lib/` — Shared helpers: currency formatting, date helpers, progress and "per week needed" calculations, validation schemas.
- `proxy.ts` — Clerk session middleware for Next.js 16. The `(app)` server layout verifies the session and redirects signed-out users to sign-in; the signed-in home flow sends users without an onboarding profile to onboarding.

## Storage Model

- **Convex database**:
  - `users`: Clerk user id, unique username, avatar reference, currency, created time.
  - `goals`: owner, name, optional target amount, optional target date, created and updated times.
  - `transactions`: goal, owner, type (deposit or withdraw), amount in integer minor units, optional note, created time.
- **Convex file storage**: profile pictures uploaded during onboarding or from settings. The `users` record stores only the file reference.
- **Clerk**: email and sign-in identity. Finn does not store passwords or tokens.
- **Clerk and Convex auth**: the Next.js root layout provides Clerk; `ConvexProviderWithClerk` passes the active Clerk token to Convex. Clerk must provide either its Convex integration token or a JWT template named `convex`. Convex validates the token with the Clerk issuer configured in `convex/auth.config.ts`.
- **Zustand (browser memory)**: temporary UI state only. Lost on refresh by design.

## Auth and Access Model

- Every user signs in through Clerk. Convex verifies the Clerk token on each request, and backend functions read the user from that verified identity.
- First-time users are routed to onboarding to choose a username and profile picture. They cannot reach the goals screens until a username is saved.
- Every goal belongs to exactly one user, and every transaction belongs to one goal and the same user.
- Only the owner can read, edit, or delete a goal and read or add its transactions. Every Convex function checks ownership on the server, so hiding buttons in the UI is never the only protection.

## Invariants

1. Transactions are insert-only. No mutation exists that edits or deletes an individual transaction. Corrections are made by adding an opposite transaction.
2. A goal's balance is derived from its transactions and is never typed in or edited directly.
3. A withdrawal can never exceed the goal's current balance, and every amount must be greater than zero. This is enforced inside the Convex mutation, not only in the form.
4. Target amount and target date are always optional. The UI and the logic must work correctly when either or both are missing.
5. Money amounts are stored as integers in minor units (such as cents), never as floating point numbers.
6. Zustand never becomes a second source of truth for server data. Goals and transactions are read only from Convex.
7. Every Convex function that touches user data derives the user from the verified Clerk identity and never trusts a user id sent by the client.
8. Usernames are unique and case-insensitive, enforced in the backend.
