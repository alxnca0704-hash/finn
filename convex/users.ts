import { v } from "convex/values"

import { mutation, query } from "./_generated/server"

async function requireIdentity(ctx: { auth: { getUserIdentity: () => Promise<{ subject: string } | null> } }) {
  const identity = await ctx.auth.getUserIdentity()
  if (!identity) throw new Error("You must be signed in to continue.")
  return identity
}

function normalizeUsername(username: string) {
  const normalized = username.trim()
  if (!/^[a-zA-Z0-9_]{3,20}$/.test(normalized)) {
    throw new Error("Use 3 to 20 letters, numbers, or underscores for your username.")
  }
  return normalized
}

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await requireIdentity(ctx)
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique()

    if (!user) return null

    const avatarUrl = user.avatarStorageId
      ? await ctx.storage.getUrl(user.avatarStorageId)
      : null

    return { ...user, avatarUrl }
  },
})

export const isUsernameAvailable = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx)
    const username = normalizeUsername(args.username)
    const existing = await ctx.db
      .query("users")
      .withIndex("by_username_lower", (q) => q.eq("usernameLower", username.toLowerCase()))
      .unique()
    return !existing || existing.clerkId === identity.subject
  },
})

export const generateProfileUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireIdentity(ctx)
    return await ctx.storage.generateUploadUrl()
  },
})

export const completeOnboarding = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    username: v.string(),
    birthday: v.string(),
    avatarStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx)
    const username = normalizeUsername(args.username)
    const firstName = args.firstName.trim()
    const lastName = args.lastName.trim()

    if (!firstName || !lastName) throw new Error("Enter your first and last name.")
    const birthdayDate = new Date(`${args.birthday}T00:00:00.000Z`)
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(args.birthday) ||
      Number.isNaN(birthdayDate.getTime()) ||
      birthdayDate.toISOString().slice(0, 10) !== args.birthday
    ) {
      throw new Error("Enter a valid birthday.")
    }

    const existingUsername = await ctx.db
      .query("users")
      .withIndex("by_username_lower", (q) => q.eq("usernameLower", username.toLowerCase()))
      .unique()
    if (existingUsername && existingUsername.clerkId !== identity.subject) {
      throw new Error("That username is already taken.")
    }

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique()
    const profile = {
      clerkId: identity.subject,
      firstName,
      lastName,
      username,
      usernameLower: username.toLowerCase(),
      birthday: args.birthday,
      ...(args.avatarStorageId ? { avatarStorageId: args.avatarStorageId } : {}),
      onboardingCompletedAt: Date.now(),
    }

    if (currentUser) {
      await ctx.db.patch(currentUser._id, profile)
      return currentUser._id
    }
    return await ctx.db.insert("users", profile)
  },
})
