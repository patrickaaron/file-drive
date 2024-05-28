import { ConvexError, v } from "convex/values";
import { MutationCtx, QueryCtx, internalMutation } from "./_generated/server";

export async function getUser(ctx: QueryCtx, tokenIdentifier: string) {
  return await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q) => q.eq("clerkId", tokenIdentifier))
    .unique();
}

export const createUser = internalMutation({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.insert("users", {
      clerkId: args.clerkId,
      orgIds: [],
    });
  },
});

export const addOrgIdToUser = internalMutation({
  args: { clerkId: v.string(), orgId: v.string() },
  handler: async (ctx, args) => {
    const user = await getUser(ctx, args.clerkId);

    if (!user) {
      throw new ConvexError("expected user to be defined");
    }

    await ctx.db.patch(user._id, {
      orgIds: [...user.orgIds, args.orgId],
    });
  },
});
