import { ConvexError, v } from "convex/values";
import { getAllOrThrow, getOneFrom } from "convex-helpers/server/relationships";
import { mutation, query } from "./_generated/server";
import { Doc } from "./_generated/dataModel";

import { getUser } from "./users";
import { fileTypes } from "./schema";

export const generateUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new ConvexError("you must be logged in to upload a file");
  }
  return await ctx.storage.generateUploadUrl();
});

export const createFile = mutation({
  args: {
    name: v.string(),
    fileId: v.id("_storage"),
    orgId: v.string(),
    type: fileTypes,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("you must be logged in to upload a file");
    }

    const userId = identity.subject;

    const currentUser = await getUser(ctx, userId);

    if (!currentUser) {
      throw new ConvexError("user was not found");
    }

    const isPersonalWorskpace = userId === args.orgId;

    if (!currentUser.orgIds.includes(args.orgId) && !isPersonalWorskpace) {
      throw new ConvexError(
        "user does not belong to organization " + args.orgId
      );
    }

    await ctx.db.insert("files", {
      name: args.name,
      fileId: args.fileId,
      authorId: identity.subject,
      authorName: identity.name || identity.nickname || "",
      orgId: args.orgId,
      isArchived: false,
      type: args.type,
    });
  },
});

export const getFiles = query({
  args: {
    orgId: v.string(),
    search: v.optional(v.string()),
    favorites: v.optional(v.boolean()),
    trash: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return [];
    }

    const currentUser = await getUser(ctx, identity.subject);

    if (!currentUser) {
      return [];
    }

    let files: Doc<"files">[] = [];

    if (args.favorites) {
      const favorites = await ctx.db
        .query("favorites")
        .withIndex("by_user_org", (q) =>
          q.eq("userId", currentUser._id).eq("orgId", args.orgId)
        )
        .order("asc")
        .collect();

      const ids = favorites.map((q) => q.fileId);

      files = (await getAllOrThrow(ctx.db, ids)).filter((f) => !f.isArchived);

      return Promise.all(
        files.map(async (file) => ({
          ...file,
          ...{ url: await ctx.storage.getUrl(file.fileId) },
          isFavorite: true,
        }))
      );
    }

    if (args.trash) {
      files = await ctx.db
        .query("files")
        .withIndex("by_user_org", (q) =>
          q.eq("authorId", identity.subject).eq("orgId", args.orgId)
        )
        .filter((q) => q.eq(q.field("isArchived"), true))
        .order("asc")
        .collect();

      return Promise.all(
        files.map(async (file) => ({
          ...file,
          ...{ url: await ctx.storage.getUrl(file.fileId) },
        }))
      );
    }

    if (args.search) {
      files = await ctx.db
        .query("files")
        .withSearchIndex("search_name", (q) =>
          q.search("name", args.search!).eq("orgId", args.orgId)
        )
        .filter((q) => q.eq(q.field("isArchived"), false))
        .collect();
    } else {
      files = await ctx.db
        .query("files")
        .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
        .filter((q) => q.eq(q.field("isArchived"), false))
        .order("asc")
        .collect();
    }

    const filesWithFavoriteRelation = files.map(async (file) => {
      return ctx.db
        .query("favorites")
        .withIndex("by_user_file", (q) =>
          q.eq("userId", currentUser._id).eq("fileId", file._id)
        )
        .unique()
        .then(async (favorite) => {
          return {
            ...file,
            ...{ url: await ctx.storage.getUrl(file.fileId) },
            isFavorite: !!favorite,
          };
        });
    });

    return Promise.all(filesWithFavoriteRelation);
  },
});

export const deleteFile = mutation({
  args: {
    fileId: v.id("files"),
    permanentDelete: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("Unauthorized adf");
    }
    const userId = identity.subject;

    const file = await ctx.db.get(args.fileId);

    if (!file) {
      throw new ConvexError("This file does not exist");
    }

    if (file.authorId !== userId) {
      throw new ConvexError("Unauthorized permission");
    }

    if (args.permanentDelete) {
      const possibleFavoritedFile = await getOneFrom(
        ctx.db,
        "favorites",
        "by_fileId",
        args.fileId
      );

      if (!possibleFavoritedFile) {
        return await ctx.db.delete(args.fileId);
      }

      console.log("Deleting all relations");

      await ctx.db.delete(args.fileId);
      await ctx.db.delete(possibleFavoritedFile._id);
      await ctx.storage.delete(file.fileId);

      return;
    }

    await ctx.db.patch(args.fileId, {
      isArchived: true,
    });
  },
});

export const toggleFavorite = mutation({
  args: {
    fileId: v.id("files"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    const userId = identity.subject;

    const file = await ctx.db.get(args.fileId);

    if (!file) {
      throw new ConvexError("This file does not exist");
    }

    const currentUser = await getUser(ctx, userId);

    if (!currentUser) {
      throw new ConvexError("user was not found");
    }

    const isPersonalWorskpace = userId === file.orgId;

    if (!currentUser.orgIds.includes(file.orgId) && !isPersonalWorskpace) {
      throw new ConvexError(
        "user does not belong to organization " + file.orgId
      );
    }

    const favorite = await ctx.db
      .query("favorites")
      .withIndex("by_user_file_org", (q) =>
        q
          .eq("userId", currentUser._id)
          .eq("fileId", file._id)
          .eq("orgId", file.orgId)
      )
      .first();

    if (favorite) {
      await ctx.db.delete(favorite._id);
    } else {
      await ctx.db.insert("favorites", {
        userId: currentUser._id,
        fileId: file._id,
        orgId: file.orgId,
      });
    }
  },
});

export const restore = mutation({
  args: {
    fileId: v.id("files"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    const userId = identity.subject;

    const file = await ctx.db.get(args.fileId);

    if (!file) {
      throw new ConvexError("This file does not exist");
    }

    if (file.authorId !== userId) {
      throw new ConvexError("Unauthorized");
    }

    await ctx.db.patch(args.fileId, {
      isArchived: false,
    });
  },
});

export const renameFile = mutation({
  args: {
    fileId: v.id("files"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    const userId = identity.subject;

    const file = await ctx.db.get(args.fileId);

    if (!file) {
      throw new ConvexError("This file does not exist");
    }

    const fileName = args.name.trim();

    if (file.authorId !== userId) {
      throw new ConvexError("Unauthorized");
    }

    if (fileName.length > 60) {
      throw new ConvexError("File name cannot be longer than 60 characters");
    }

    const updatedFile = await ctx.db.patch(args.fileId, {
      name: fileName,
    });

    return updatedFile;
  },
});
