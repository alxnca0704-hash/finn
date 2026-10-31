import { v } from "convex/values"

import type { Doc, Id } from "./_generated/dataModel"
import type { MutationCtx, QueryCtx } from "./_generated/server"
import { mutation, query } from "./_generated/server"
import { requireIdentity } from "./auth"

const NOTE_MAX_LENGTH = 140

type LedgerCtx = Pick<QueryCtx | MutationCtx, "db">

export async function listGoalTransactions(
  ctx: LedgerCtx,
  goalId: Id<"goals">,
) {
  return await ctx.db
    .query("transactions")
    .withIndex("by_goal_id", (q) => q.eq("goalId", goalId))
    .collect()
}

export function sumBalance(transactions: Doc<"transactions">[]) {
  return transactions.reduce(
    (total, transaction) =>
      total +
      (transaction.type === "deposit" ? transaction.amount : -transaction.amount),
    0,
  )
}

async function findOwnedGoal(ctx: QueryCtx | MutationCtx, goalId: string) {
  const identity = await requireIdentity(ctx)
  const normalizedId = ctx.db.normalizeId("goals", goalId)
  if (!normalizedId) return { identity, goal: null }

  const goal = await ctx.db.get(normalizedId)
  if (!goal || goal.clerkId !== identity.subject) {
    return { identity, goal: null }
  }

  return { identity, goal }
}

export const listTransactions = query({
  args: { goalId: v.string() },
  handler: async (ctx, args) => {
    const { goal } = await findOwnedGoal(ctx, args.goalId)
    if (!goal) return []

    const transactions = await listGoalTransactions(ctx, goal._id)
    const chronological = [...transactions].sort(
      (a, b) =>
        a.createdAt - b.createdAt || a._creationTime - b._creationTime,
    )

    let runningBalance = 0
    const withRunningBalance = chronological.map((transaction) => {
      runningBalance +=
        transaction.type === "deposit"
          ? transaction.amount
          : -transaction.amount
      return { ...transaction, balanceAfter: runningBalance }
    })

    return withRunningBalance.reverse()
  },
})

export const recordTransaction = mutation({
  args: {
    goalId: v.string(),
    type: v.union(v.literal("deposit"), v.literal("withdraw")),
    amount: v.number(),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { identity, goal } = await findOwnedGoal(ctx, args.goalId)
    if (!goal) throw new Error("We couldn't find that goal.")

    if (!Number.isFinite(args.amount) || args.amount <= 0) {
      throw new Error("Enter an amount greater than zero.")
    }

    if (!Number.isSafeInteger(args.amount)) {
      throw new Error("Enter a smaller amount.")
    }

    const note = args.note?.trim()
    if (note && note.length > NOTE_MAX_LENGTH) {
      throw new Error(`Keep the note under ${NOTE_MAX_LENGTH} characters.`)
    }

    if (args.type === "withdraw") {
      const transactions = await listGoalTransactions(ctx, goal._id)
      const balance = sumBalance(transactions)
      if (args.amount > balance) {
        throw new Error("You can't withdraw more than the current balance.")
      }
    }

    return await ctx.db.insert("transactions", {
      goalId: goal._id,
      clerkId: identity.subject,
      type: args.type,
      amount: args.amount,
      ...(note ? { note } : {}),
      createdAt: Date.now(),
    })
  },
})
