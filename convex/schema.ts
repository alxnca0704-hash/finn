import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    username: v.string(),
    usernameLower: v.string(),
    birthday: v.string(),
    avatarStorageId: v.optional(v.id("_storage")),
    onboardingCompletedAt: v.number(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_username_lower", ["usernameLower"]),
  goals: defineTable({
    clerkId: v.string(),
    name: v.string(),
    targetAmount: v.optional(v.number()),
    targetDate: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_clerk_id", ["clerkId"]),
  transactions: defineTable({
    goalId: v.id("goals"),
    clerkId: v.string(),
    type: v.union(v.literal("deposit"), v.literal("withdraw")),
    amount: v.number(),
    note: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_goal_id", ["goalId"])
    .index("by_clerk_id", ["clerkId"]),
})
