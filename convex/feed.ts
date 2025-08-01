import { v } from "convex/values";
import { mutation, query, QueryCtx, MutationCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { paginationOptsValidator } from "convex/server";
import { Id } from "./_generated/dataModel";

/**
 * Helper function to check if two users are friends
 */
async function areFriends(
  ctx: QueryCtx | MutationCtx,
  userId1: Id<"users">,
  userId2: Id<"users">
): Promise<boolean> {
  if (userId1 === userId2) return true;

  const friendship = await ctx.db
    .query("friendships")
    .withIndex("by_both", (q) =>
      q.eq("userId1", userId1).eq("userId2", userId2)
    )
    .first();

  if (friendship) return true;

  const reverseFriendship = await ctx.db
    .query("friendships")
    .withIndex("by_both", (q) =>
      q.eq("userId1", userId2).eq("userId2", userId1)
    )
    .first();

  return !!reverseFriendship;
}

/**
 * Helper function to get user's friends list
 */
async function getUserFriends(
  ctx: QueryCtx | MutationCtx,
  userId: Id<"users">
): Promise<Id<"users">[]> {
  const friendships1 = await ctx.db
    .query("friendships")
    .withIndex("by_user1", (q) => q.eq("userId1", userId))
    .collect();

  const friendships2 = await ctx.db
    .query("friendships")
    .withIndex("by_user2", (q) => q.eq("userId2", userId))
    .collect();

  const friends: Id<"users">[] = [
    ...friendships1.map((f) => f.userId2),
    ...friendships2.map((f) => f.userId1),
  ];

  return friends;
}

/**
 * Create a new post
 */
export const createPost = mutation({
  args: {
    content: v.string(),
    image: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Validate content
    if (!args.content.trim()) {
      throw new Error("Post content cannot be empty");
    }

    if (args.content.length > 2000) {
      throw new Error("Post too long (max 2000 characters)");
    }

    // Create the post
    const postId = await ctx.db.insert("posts", {
      userId,
      content: args.content,
      image: args.image,
    });

    return { postId, success: true };
  },
});

/**
 * Delete a post along with all its comments and likes
 */
export const deletePost = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Get the post to verify ownership
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");

    if (post.userId !== userId) {
      throw new Error("You can only delete your own posts");
    }

    // Delete all comments for this post
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_postId", (q) => q.eq("postId", args.postId))
      .collect();

    for (const comment of comments) {
      await ctx.db.delete(comment._id);
    }

    // Delete all likes for this post
    const likes = await ctx.db
      .query("likes")
      .withIndex("by_postId", (q) => q.eq("postId", args.postId))
      .collect();

    for (const like of likes) {
      await ctx.db.delete(like._id);
    }

    // Delete the post itself
    await ctx.db.delete(args.postId);

    return { success: true };
  },
});

/**
 * Like a post
 */
export const likePost = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if post exists
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");

    // Check if users are friends or it's own post
    const isFriend = await areFriends(ctx, userId, post.userId);
    if (!isFriend) {
      throw new Error("You can only like posts from friends");
    }

    // Check if already liked
    const existingLike = await ctx.db
      .query("likes")
      .withIndex("by_userId_postId", (q) =>
        q.eq("userId", userId).eq("postId", args.postId)
      )
      .first();

    if (existingLike) {
      throw new Error("Post already liked");
    }

    // Create the like
    await ctx.db.insert("likes", {
      userId,
      postId: args.postId,
    });

    return { success: true };
  },
});

/**
 * Unlike a post
 */
export const unlikePost = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Find the like
    const like = await ctx.db
      .query("likes")
      .withIndex("by_userId_postId", (q) =>
        q.eq("userId", userId).eq("postId", args.postId)
      )
      .first();

    if (!like) {
      throw new Error("Post not liked");
    }

    // Delete the like
    await ctx.db.delete(like._id);

    return { success: true };
  },
});

/**
 * Comment on a post
 */
export const commentPost = mutation({
  args: {
    postId: v.id("posts"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Validate content
    if (!args.content.trim()) {
      throw new Error("Comment content cannot be empty");
    }

    if (args.content.length > 500) {
      throw new Error("Comment too long (max 500 characters)");
    }

    // Check if post exists
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");

    // Check if users are friends or it's own post
    const isFriend = await areFriends(ctx, userId, post.userId);
    if (!isFriend) {
      throw new Error("You can only comment on posts from friends");
    }

    // Create the comment
    const commentId = await ctx.db.insert("comments", {
      userId,
      postId: args.postId,
      content: args.content.trim(),
    });

    return { commentId, success: true };
  },
});

/**
 * Delete a comment
 */
export const deleteComment = mutation({
  args: { commentId: v.id("comments") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Get the comment to verify ownership
    const comment = await ctx.db.get(args.commentId);
    if (!comment) throw new Error("Comment not found");

    if (comment.userId !== userId) {
      throw new Error("You can only delete your own comments");
    }

    // Delete the comment
    await ctx.db.delete(args.commentId);

    return { success: true };
  },
});

/**
 * Get feed posts from friends with pagination
 */
export const getFeedPosts = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Get user's friends
    const friends = await getUserFriends(ctx, userId);

    // Include user's own posts
    const allowedUserIds = [userId, ...friends];

    // Get posts from friends and self, ordered by creation time (newest first)
    const result = await ctx.db
      .query("posts")
      .order("desc")
      .filter((q) =>
        q.or(...allowedUserIds.map((id) => q.eq(q.field("userId"), id)))
      )
      .paginate(args.paginationOpts);

    // Enrich posts with user profile, likes count, comments count, and user's like status
    const enrichedPosts = await Promise.all(
      result.page.map(async (post) => {
        // Get user profile
        const profile = await ctx.db
          .query("profiles")
          .withIndex("by_userId", (q) => q.eq("userId", post.userId))
          .first();

        if (!profile) {
          throw new Error("Profile not found for post author");
        }

        // Get likes count
        const likesCount = await ctx.db
          .query("likes")
          .withIndex("by_postId", (q) => q.eq("postId", post._id))
          .collect()
          .then((likes) => likes.length);

        // Get comments count
        const commentsCount = await ctx.db
          .query("comments")
          .withIndex("by_postId", (q) => q.eq("postId", post._id))
          .collect()
          .then((comments) => comments.length);

        // Check if current user liked this post
        const userLike = await ctx.db
          .query("likes")
          .withIndex("by_userId_postId", (q) =>
            q.eq("userId", userId).eq("postId", post._id)
          )
          .first();

        // Get image URL if image exists
        const imageUrl = post.image
          ? await ctx.storage.getUrl(post.image)
          : null;

        // Get profile picture URL
        const profilePictureUrl = await ctx.storage.getUrl(
          profile.profilePicture
        );

        return {
          _id: post._id,
          _creationTime: post._creationTime,
          userId: post.userId,
          content: post.content,
          image: imageUrl,
          user: {
            _id: profile._id,
            name: profile.name,
            userName: profile.userName,
            profilePicture: profilePictureUrl,
          },
          likesCount,
          commentsCount,
          isLiked: !!userLike,
          isOwner: post.userId === userId,
        };
      })
    );

    return {
      ...result,
      page: enrichedPosts,
    };
  },
});

/**
 * Get comments for a post with pagination
 */
export const getComments = query({
  args: {
    postId: v.id("posts"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if post exists and user can access it
    const post = await ctx.db.get(args.postId);
    if (!post) return null;

    // Check if users are friends or it's own post
    const isFriend = await areFriends(ctx, userId, post.userId);
    if (!isFriend) {
      throw new Error("You can only view comments on posts from friends");
    }

    // Get comments with pagination, ordered by creation time (oldest first)
    const result = await ctx.db
      .query("comments")
      .withIndex("by_postId", (q) => q.eq("postId", args.postId))
      .order("asc")
      .paginate(args.paginationOpts);

    // Enrich comments with user profile
    const enrichedComments = await Promise.all(
      result.page.map(async (comment) => {
        // Get user profile
        const profile = await ctx.db
          .query("profiles")
          .withIndex("by_userId", (q) => q.eq("userId", comment.userId))
          .first();

        if (!profile) {
          throw new Error("Profile not found for comment author");
        }

        // Get profile picture URL
        const profilePictureUrl = profile.profilePicture
          ? await ctx.storage.getUrl(profile.profilePicture)
          : null;

        return {
          _id: comment._id,
          _creationTime: comment._creationTime,
          userId: comment.userId,
          postId: comment.postId,
          content: comment.content,
          user: {
            _id: profile._id,
            name: profile.name,
            userName: profile.userName,
            profilePicture: profilePictureUrl,
          },
          isOwner: comment.userId === userId,
        };
      })
    );

    return {
      ...result,
      page: enrichedComments,
    };
  },
});

/**
 * Get likes for a post with pagination
 */
export const getLikes = query({
  args: {
    postId: v.id("posts"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if post exists and user can access it
    const post = await ctx.db.get(args.postId);
    if (!post) {
      // Return empty result if post doesn't exist (e.g., deleted)
      return {
        page: [],
        isDone: true,
        continueCursor: "",
      };
    }

    // Check if users are friends or it's own post
    const isFriend = await areFriends(ctx, userId, post.userId);
    if (!isFriend) {
      throw new Error("You can only view likes on posts from friends");
    }

    // Get likes with pagination, ordered by creation time (newest first)
    const result = await ctx.db
      .query("likes")
      .withIndex("by_postId", (q) => q.eq("postId", args.postId))
      .order("desc")
      .paginate(args.paginationOpts);

    // Enrich likes with user profile
    const enrichedLikes = await Promise.all(
      result.page.map(async (like) => {
        // Get user profile
        const profile = await ctx.db
          .query("profiles")
          .withIndex("by_userId", (q) => q.eq("userId", like.userId))
          .first();

        if (!profile) {
          throw new Error("Profile not found for like author");
        }

        // Get profile picture URL
        const profilePictureUrl = await ctx.storage.getUrl(
          profile.profilePicture
        );

        return {
          _id: like._id,
          _creationTime: like._creationTime,
          userId: like.userId,
          postId: like.postId,
          user: {
            _id: profile._id,
            name: profile.name,
            userName: profile.userName,
            profilePicture: profilePictureUrl,
          },
        };
      })
    );

    return {
      ...result,
      page: enrichedLikes,
    };
  },
});

/**
 * Get a specific post details
 */
export const getPostDetails = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Get the post
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");

    // Get user profile
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", post.userId))
      .first();

    if (!profile) {
      throw new Error("Profile not found for post author");
    }

    // Check if users are friends or it's own post
    const isFriend = await areFriends(ctx, userId, post.userId);
    if (!isFriend) {
      throw new Error("You can only view posts from friends");
    }

    // Get likes count
    const likesCount = await ctx.db
      .query("likes")
      .withIndex("by_postId", (q) => q.eq("postId", post._id))
      .collect()
      .then((likes) => likes.length);

    // Get comments count
    const commentsCount = await ctx.db
      .query("comments")
      .withIndex("by_postId", (q) => q.eq("postId", post._id))
      .collect()
      .then((comments) => comments.length);

    // Check if current user liked this post
    const userLike = await ctx.db
      .query("likes")
      .withIndex("by_userId_postId", (q) =>
        q.eq("userId", userId).eq("postId", post._id)
      )
      .first();

    // Get image URL if image exists
    const imageUrl = post.image ? await ctx.storage.getUrl(post.image) : null;

    // Get profile picture URL
    const profilePictureUrl = profile.profilePicture
      ? await ctx.storage.getUrl(profile.profilePicture)
      : null;

    return {
      _id: post._id,
      _creationTime: post._creationTime,
      userId: post.userId,
      content: post.content,
      image: imageUrl,
      user: {
        _id: profile._id,
        name: profile.name,
        userName: profile.userName,
        profilePicture: profilePictureUrl,
      },
      likesCount,
      commentsCount,
      isLiked: !!userLike,
      isOwner: post.userId === userId,
    };
  },
});

/**
 * Get posts from a specific user
 */
export const getUserPosts = query({
  args: {
    targetUserId: v.id("users"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if users are friends or it's own posts
    const isFriend = await areFriends(ctx, userId, args.targetUserId);
    if (!isFriend) {
      throw new Error("You can only view posts from friends");
    }

    // Get user profile
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.targetUserId))
      .first();

    if (!profile) {
      throw new Error("Profile not found");
    }

    // Get posts from the target user, ordered by creation time (newest first)
    const result = await ctx.db
      .query("posts")
      .withIndex("by_userId", (q) => q.eq("userId", args.targetUserId))
      .order("desc")
      .paginate(args.paginationOpts);

    // Enrich each post with additional data
    const enrichedPosts = await Promise.all(
      result.page.map(async (post) => {
        // Get likes count
        const likesCount = await ctx.db
          .query("likes")
          .withIndex("by_postId", (q) => q.eq("postId", post._id))
          .collect()
          .then((likes) => likes.length);

        // Get comments count
        const commentsCount = await ctx.db
          .query("comments")
          .withIndex("by_postId", (q) => q.eq("postId", post._id))
          .collect()
          .then((comments) => comments.length);

        // Check if current user liked this post
        const userLike = await ctx.db
          .query("likes")
          .withIndex("by_userId_postId", (q) =>
            q.eq("userId", userId).eq("postId", post._id)
          )
          .first();

        // Get image URL if image exists
        const imageUrl = post.image
          ? await ctx.storage.getUrl(post.image)
          : null;

        // Get profile picture URL
        const profilePictureUrl = profile.profilePicture
          ? await ctx.storage.getUrl(profile.profilePicture)
          : null;

        return {
          _id: post._id,
          _creationTime: post._creationTime,
          userId: post.userId,
          content: post.content,
          image: imageUrl,
          user: {
            _id: profile._id,
            name: profile.name,
            userName: profile.userName,
            profilePicture: profilePictureUrl,
          },
          likesCount,
          commentsCount,
          isLiked: !!userLike,
          isOwner: post.userId === userId,
        };
      })
    );

    return {
      ...result,
      page: enrichedPosts,
    };
  },
});

/**
 * Get current user's own posts
 */
export const getMyPosts = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Get user profile
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!profile) {
      throw new Error("Profile not found");
    }

    // Get current user's posts, ordered by creation time (newest first)
    const result = await ctx.db
      .query("posts")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .paginate(args.paginationOpts);

    // Enrich each post with additional data
    const enrichedPosts = await Promise.all(
      result.page.map(async (post) => {
        // Get likes count
        const likesCount = await ctx.db
          .query("likes")
          .withIndex("by_postId", (q) => q.eq("postId", post._id))
          .collect()
          .then((likes) => likes.length);

        // Get comments count
        const commentsCount = await ctx.db
          .query("comments")
          .withIndex("by_postId", (q) => q.eq("postId", post._id))
          .collect()
          .then((comments) => comments.length);

        // Get image URL if image exists
        const imageUrl = post.image
          ? await ctx.storage.getUrl(post.image)
          : null;

        // Get profile picture URL
        const profilePictureUrl = profile.profilePicture
          ? await ctx.storage.getUrl(profile.profilePicture)
          : null;

        return {
          _id: post._id,
          _creationTime: post._creationTime,
          userId: post.userId,
          content: post.content,
          image: imageUrl,
          user: {
            _id: profile._id,
            name: profile.name,
            userName: profile.userName,
            profilePicture: profilePictureUrl,
          },
          likesCount,
          commentsCount,
          isLiked: false, // User can't like their own posts
          isOwner: true, // Always true for own posts
        };
      })
    );

    return {
      ...result,
      page: enrichedPosts,
    };
  },
});
