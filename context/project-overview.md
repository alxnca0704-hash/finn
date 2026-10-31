# Finn: Project Overview

*A simple savings goal tracker · Draft v0.1*

## 1. Summary

Finn is an app where people create savings goals, put money toward them (deposit), take money back out (withdraw), and see a clear history of every movement. A goal can have a target amount and a target date, but both are optional, so Finn works for "I'm saving for a laptop by March" and also for "just a general emergency fund."

**One-line pitch:** Create a goal, add or remove money, and always know where you stand.

**Important to decide early:** Finn is a *tracker*. It records what the user says they saved. It does not move real money or connect to a bank (unless you decide to add that later).

## 2. Problem and audience

**Problem:** People save toward several things at once (travel, gadgets, emergency fund) and lose track of how much belongs to what. Spreadsheets feel heavy and bank apps rarely separate money by purpose.

**Target users:**

- Students and young professionals starting to save
- Anyone who wants a lightweight, goal-by-goal view of their savings
- People who prefer a simple app over a full budgeting tool

## 3. Core features

### 3.1 Authentication and onboarding

- Sign in with Google (Gmail)
- SSO support (for example Apple, or other providers later)
- First-time onboarding screen that asks for:
  - **Username** (unique, with validation and availability check)
  - **Profile picture** (upload, or default avatar if skipped)
- Returning users skip onboarding and go straight to their goals

### 3.2 Goals: add, edit, delete

Each goal has:

| Field | Required | Notes |
|---|---|---|
| Name | Yes | For example "New laptop" |
| Target amount | No | If empty, goal is open-ended |
| Target date | No | If empty, no deadline |
| Current balance | Auto | Calculated from transactions, never typed in |
| Created date | Auto | |

- **Add:** create a goal with just a name, or add target amount and date
- **Edit:** change name, target amount, target date (balance is not editable)
- **Delete:** remove a goal, with a confirmation step (see open questions for what happens to its history)

### 3.3 Deposits and withdrawals

- Inside a goal, the user can **deposit** or **withdraw** an amount
- Every deposit or withdrawal creates a **transaction**
- **Transactions cannot be edited or deleted.** This keeps the history trustworthy, like a bank statement
- The goal's balance is always the sum of its transactions

### 3.4 Transaction history

- Each goal has a list of its transactions, newest first
- Each entry shows: type (deposit or withdraw), amount, date and time, optional note
- Running balance after each entry is a nice addition

## 4. Key user flows

**First launch**

1. Open app, tap "Continue with Google"
2. Onboarding: choose username, add profile picture
3. Land on empty Goals screen with a prompt to create the first goal

**Create a goal**

1. Tap "New goal"
2. Enter name; optionally target amount and date
3. Save, then open the goal detail screen

**Deposit or withdraw**

1. Open a goal
2. Tap Deposit or Withdraw, enter amount, optional note
3. Confirm, then balance and history update immediately

**Made a mistake?**

Since transactions are not editable, the fix is to add an opposite transaction (for example, withdraw the amount that was deposited by mistake). A note field helps explain it.

## 5. Business rules

- Amount must be greater than zero
- A withdrawal cannot be larger than the goal's current balance (no negative balances)
- Balance is derived from transactions, never stored as an editable number
- Target amount and date are optional; the UI adapts:
  - With target amount: show progress bar and percent
  - Without target amount: show balance only
  - With target date: show days remaining, and optionally "you need X per week to reach it"
  - Without date: no deadline info
- If balance reaches or passes the target, mark the goal as "Reached" (but still allow deposits and withdrawals)
- Usernames are unique and case-insensitive

## 6. Screens

1. **Sign in:** Google and SSO buttons
2. **Onboarding:** username and profile picture
3. **Goals list (home):** cards showing name, balance, progress (if target set), days left (if date set)
4. **Create or edit goal:** form
5. **Goal detail:** balance, progress, Deposit and Withdraw buttons, transaction history
6. **Deposit or withdraw sheet:** amount, note, confirm
7. **Profile and settings:** change username, picture, currency, sign out, delete account

## 7. Data model (draft)

**User**

- id
- email
- username (unique)
- avatar_url
- currency
- created_at

**Goal**

- id
- user_id
- name
- target_amount (nullable)
- target_date (nullable)
- created_at
- updated_at

**Transaction**

- id
- goal_id
- user_id
- type (deposit or withdraw)
- amount (stored as integer minor units, such as cents, to avoid rounding errors)
- note (optional)
- created_at

Balance = sum of deposits minus sum of withdrawals for a goal.

## 8. Suggested tech stack (flexible)

- **Frontend:** React Native (mobile) or React (web), whichever platform you want first
- **Auth:** Firebase Auth, Supabase Auth, or Auth0 (all support Google and other SSO)
- **Backend and database:** Supabase (Postgres) or Firebase; Postgres suits financial-style records well
- **File storage:** for profile pictures (Supabase Storage or Firebase Storage)
- **Security:** row-level rules so each user only reads and writes their own goals and transactions; make the transactions table insert-only

## 9. MVP scope

**In the MVP**

- Google sign-in and onboarding (username, profile picture)
- Goal create, edit, delete with optional target amount and date
- Deposit and withdraw with transaction history
- Progress display

**Later ideas**

- More SSO providers
- Goal icons, colors, or cover images
- Reminders and nudges ("You haven't deposited this week")
- Charts and insights over time
- Multiple currencies
- Shared goals with friends or family
- Export history as CSV
- Archive or pause a goal
- Bank connection (big step, with legal and security implications)

## 10. Open questions to elaborate your idea

These are the decisions that will shape the product most. Try answering them one by one:

1. **Real money or tracker only?** Does Finn just record numbers, or will it ever connect to real accounts?
2. **What happens when a goal is deleted?** Delete its transactions too, or archive them? Because transactions are "not editable," deleting a goal may conflict with that principle.
3. **Can a goal be edited after it's reached?** And should reaching the goal trigger a celebration or an "archive" prompt?
4. **Transfers between goals:** is moving money from one goal to another a feature, or is it just a withdraw plus a deposit?
5. **Currency:** one fixed currency, or user-selectable?
6. **Platform first:** mobile app, web app, or both?
7. **Name and look:** what feeling should "Finn" have (playful, minimal, serious)?
8. **Monetization (if any):** free, premium features, or none?

## 11. Suggested roadmap

| Phase | Focus |
|---|---|
| 1. Foundation | Auth, onboarding, user profile |
| 2. Goals | Create, edit, delete, list, detail screen |
| 3. Transactions | Deposit, withdraw, history, balance rules |
| 4. Polish | Progress visuals, empty states, validation, error handling |
| 5. Launch | Testing, privacy policy, store or web release |