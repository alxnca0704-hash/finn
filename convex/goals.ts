import { v } from "convex/values"

import { mutation, query } from "./_generated/server"
import { requireIdentity } from "./auth"

const GOAL_NAME_MAX_LENGTH = 60

function normalizeName(name: string) {
  const normalized = name.trim()
  if (!normalized) throw new Error("Enter a goal name.")
  if (normalized.length > GOAL_NAME_MAX_LENGTH) {
    throw new Error(`Keep the goal name under ${GOAL_NAME_MAX_LENGTH} characters.`)
  }
  return normalized
}

function normalizeTargetAmount(targetAmount: number | undefined) {
  if (targetAmount === undefined) return undefined
  if (!Number.isInteger(targetAmount) || targetAmount <= 0) {
    throw new Error("Enter a target amount greater than zero.")
  }
  return targetAmount
}

function normalizeTargetDate(targetDate: string | undefined) {
  if (targetDate === undefined) return undefined
  const parsed = new Date(`${targetDate}T00:00:00.000Z`)
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(targetDate) ||
    Number.isNaN(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== targetDate
  ) {
    throw new Error("Enter a valid target date.")
  }
  return targetDate
}

export const listGoals = query({
  args: {},
  handler: async (ctx) => {
    const identity = await requireIdentity(ctx)
    const goals = await ctx.db
      .query("goals")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .collect()

    const goalsWithBalance = await Promise.all(
      goals.map(async (goal) => {
        const transactions = await ctx.db
          .query("transactions")
          .withIndex("by_goal_id", (q) => q.eq("goalId", goal._id))
          .collect()
        const balance = transactions.reduce(
          (total, transaction) =>
            total +
            (transaction.type === "deposit" ? transaction.amount : -transaction.amount),
          0,
        )
        return { ...goal, balance }
      }),
    )

    return goalsWithBalance.sort((a, b) => a.createdAt - b.createdAt)
  },
})

export const createGoal = mutation({
  args: {
    name: v.string(),
    targetAmount: v.optional(v.number()),
    targetDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx)
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique()
    if (!user) throw new Error("Finish onboarding before creating a goal.")

    const name = normalizeName(args.name)
    const targetAmount = normalizeTargetAmount(args.targetAmount)
    const targetDate = normalizeTargetDate(args.targetDate)
    const now = Date.now()

    return await ctx.db.insert("goals", {
      clerkId: identity.subject,
      name,
      ...(targetAmount !== undefined ? { targetAmount } : {}),
      ...(targetDate !== undefined ? { targetDate } : {}),
      createdAt: now,
      updatedAt: now,
    })
  },
})
