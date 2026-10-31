# UI Context

## Theme

Light only. No dark mode. The design language is a clean, minimal, monochrome finance workspace: white backgrounds, layered light grey surfaces, and near-black text. Color is reserved for meaning. Green marks success and progress, and red marks failure. Nothing else in the interface is colored, so these states stand out immediately.

## Colors

All components must use these tokens. No hardcoded hex values.

| Role             | CSS Variable        | Value     |
| ---------------- | ------------------- | --------- |
| Page background  | `--bg-base`         | `#FFFFFF` |
| Surface          | `--bg-surface`      | `#FAFAFA` |
| Raised surface   | `--bg-raised`       | `#F5F5F5` |
| Primary text     | `--text-primary`    | `#0A0A0A` |
| Muted text       | `--text-muted`      | `#737373` |
| Primary accent   | `--accent-primary`  | `#0A0A0A` |
| Border           | `--border-default`  | `#E5E5E5` |
| Error            | `--state-error`     | `#EF4444` |
| Success          | `--state-success`   | `#22C55E` |
| Progress         | `--state-progress`  | `#22C55E` |

Color rules:

- The primary accent is near-black. Primary buttons are near-black with white text.
- Secondary buttons use a raised surface with a default border.
- **Green** is used for successful actions, deposits, "Reached" goals, and progress bars.
- **Red** is used only for failed actions and errors (validation errors, a rejected withdrawal, failed upload). It is never used for withdrawals themselves, because a withdrawal is a normal action, not a failure.
- Withdrawals use neutral near-black or grey so they stay distinct from deposits without implying an error.
- Muted text and disabled states use grey. Never rely on color alone: pair state colors with an icon or label.

## Typography

| Role                   | Font        | Variable      |
| ---------------------- | ----------- | ------------- |
| UI text and headings   | Montserrat  | `--font-sans` |
| Numbers, amounts, data | Roboto Mono | `--font-mono` |

Usage:

- Montserrat is the default for headings, labels, buttons, and body text.
- Roboto Mono is used for money amounts, balances, percentages, dates in transaction rows, and any tabular figures, so numbers line up cleanly.
- Load both fonts through `next/font` and expose them as the CSS variables above.

## Border Radius

| Context           | Class          |
| ----------------- | -------------- |
| Inline / small UI | `rounded-md`   |
| Cards / panels    | `rounded-xl`   |
| Modals / overlays | `rounded-2xl`  |

Avatars and progress bar tracks use `rounded-full`.

## Component Library

shadcn/ui on top of Tailwind is used for all reusable components. Before building any common UI piece, check whether shadcn has it and add it with the CLI rather than writing it from scratch. Configure the CLI so generated components land in `components/client/ui/`, since they use client-side interactivity. Restyle them with the tokens above, and do not hardcode colors inside them.

Components Finn is expected to use from shadcn: Button, Input, Label, Form, Card, Dialog, Sheet (for the mobile deposit and withdraw sheet), AlertDialog (for delete confirmations), Avatar, Progress, Popover and Calendar (for the target date), Badge, Skeleton, Sonner (toasts for success and error), and Dropdown Menu.

**Exception:** Ant Design is used where a spec explicitly requires it: file uploads (`components/client/upload/ant-upload.tsx`), and the goal add modal, date field, and progress circles (`components/client/goals/`). These are themed through the shared `FinnAntProvider` in `components/client/antd/finn-provider.tsx`, built from the Finn tokens. All other reusable UI stays shadcn/ui.

Feature components such as `GoalCard` or `TransactionRow` are built by composing these shadcn pieces, not by styling raw HTML elements. Clerk's sign-in and sign-up components are themed through the `appearance` prop so they match the same tokens, with a white background, near-black text, and a near-black primary button.

## Layout Patterns

- Auth screens (`(auth)` group): single centered column on a white background, with the Finn name at the top and no app navigation.
- Onboarding: one focused step at a time, with a username field and a circular profile picture upload.
- Navbar: top bar with a bottom border, the Finn name on the left, and the user's avatar on the right.
- Goals list: responsive grid of cards. Each card shows the goal name, balance in mono, and a green progress bar plus days left only when a target amount or date exists.
- Goal detail: balance and progress at the top, Deposit and Withdraw buttons directly below, transaction list underneath.
- Transaction list: newest first, one row per transaction with type icon, amount in mono, note, and date. Deposits show in green, withdrawals in near-black.
- Deposit and withdraw: bottom sheet on mobile and centered modal on desktop, with a backdrop blur.
- Empty states: short message and a single primary button, for example "Create your first goal".
- Mobile first. Add larger breakpoints after the small layout works.

## Icons

Lucide React. Stroke-based icons only. Sizes: `h-4 w-4` for inline, `h-5 w-5` for buttons. Icons inherit text color, except success and error icons, which use `--state-success` and `--state-error`.