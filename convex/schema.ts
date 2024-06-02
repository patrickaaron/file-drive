import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  files: defineTable({
    name: v.string(),
    fileId: v.id("_storage"),
    orgId: v.string(),
  }).index("by_orgId", ["orgId"]),
  users: defineTable({
    clerkId: v.string(),
    orgIds: v.array(v.string()),
  }).index("by_clerkId", ["clerkId"]),
});
