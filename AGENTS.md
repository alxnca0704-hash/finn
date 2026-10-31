# AGENTS.md

Finn is a savings goal tracker. Users create goals (target amount and date are optional), deposit and withdraw money, and see a permanent transaction history. Finn is a tracker only. It does not move real money.

Stack: Next.js (App Router) + TypeScript, Clerk, Convex, Tailwind, shadcn/ui, Zustand.

## Project Structure

```
context/
├── spec
│   └── 01-setup-css.md
├── ai-workflow-rules.md
├── architecture.md
├── code-standards.md
├── progress-tracker.md
├── project-overview.md
└── ui-context.md
```

## Before You Start

Read these files in `context/` in this order before writing or changing any code:

1. `project-overview.md` for what Finn is, the core features, and the business rules
2. `architecture.md` for the stack, system boundaries, storage model, auth model, and invariants
3. `code-standards.md` for TypeScript, Next.js, Convex hook, styling, and folder conventions
4. `ui-context.md` for colors, fonts, radius, icons, layout patterns, and shadcn/ui usage
5. `ai-workflow-rules.md` for how to work, when to ask, and what to avoid
6. `progress-tracker.md` for what is done, what is in progress, and what comes next

Do not read the `context/spec/` folder on your own. Specs are only read when the user points you to a specific one.

## How to Work

- Build only what the user asks for. Do not add features, pages, or dependencies that are not in the project overview.
- If a request conflicts with a context file, stop and ask instead of guessing.
- If something is missing or ambiguous, state your assumption clearly in your final response.
- When you finish, update `progress-tracker.md` with what was completed, what changed, and any open issues.

## Precedence

When files disagree, follow this order:

1. `architecture.md` invariants
2. `code-standards.md`
3. `ui-context.md`
4. `project-overview.md`

## Non-Negotiables (summary)

These are explained in full in the context files. Never break them.

- Transactions are insert-only. No edit or delete of an individual transaction. Fix mistakes with an opposite transaction.
- Balance is derived from transactions and is never a typed-in or editable value.
- Money is stored as integers in minor units, never floats.
- Convex functions derive the user from the verified Clerk identity and enforce ownership before any read or mutation.
- Target amount and target date are always optional.
- Components marked `"use client"` live in `components/client/`. Server components live in `components/server/`.
- Reusable UI comes from shadcn/ui, in `components/client/ui/`.
- Convex is accessed through custom hooks in `hooks/`, never directly from components.
- Use design tokens only. No hardcoded hex values or hardcoded route strings.
- Red is for failure only. Green is for success and progress only.