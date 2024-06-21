import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const fileTypes = v.union(
  v.literal("image"),
  v.literal("pdf"),
  v.literal("csv")
);

export default defineSchema({
  files: defineTable({
    name: v.string(),
    type: v.union(v.literal("image"), v.literal("csv"), v.literal("pdf")),
    fileId: v.id("_storage"),
    orgId: v.string(),
  }).index("by_orgId", ["orgId"]),
  users: defineTable({
    clerkId: v.string(),
    orgIds: v.array(v.string()),
  }).index("by_clerkId", ["clerkId"]),
});
