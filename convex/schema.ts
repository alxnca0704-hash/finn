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
})
