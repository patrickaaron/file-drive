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
    authorId: v.string(),
    authorName: v.string(),
    orgId: v.string(),
    isArchived: v.boolean(),
  })
    .index("by_org", ["orgId"])
    .index("by_user_org", ["authorId", "orgId"])
    .searchIndex("search_name", {
      searchField: "name",
      filterFields: ["orgId"],
    }),
  favorites: defineTable({
    userId: v.id("users"),
    fileId: v.id("files"),
    orgId: v.string(),
  })
    .index("by_fileId", ["fileId"])
    .index("by_user_org", ["userId", "orgId"])
    .index("by_user_file", ["userId", "fileId"])
    .index("by_user_file_org", ["userId", "fileId", "orgId"]),
  users: defineTable({
    clerkId: v.string(),
    orgIds: v.array(v.string()),
  }).index("by_clerkId", ["clerkId"]),
});
