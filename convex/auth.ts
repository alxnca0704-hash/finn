import type { MutationCtx, QueryCtx } from "./_generated/server"

type AuthCtx = Pick<QueryCtx | MutationCtx, "auth">

export async function requireIdentity(ctx: AuthCtx) {
  const identity = await ctx.auth.getUserIdentity()
  if (!identity) throw new Error("You must be signed in to continue.")
  return identity
}
