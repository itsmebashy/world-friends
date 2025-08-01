/**
 * User Management System
 *
 * This module provides functions for managing user interactions:
 * 1. getUserProfile - Get detailed user profile with friendship status
 * 2. blockUser - Block a user and clean up relationships
 */

import { v } from "convex/values";
import { query, mutation, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

/**
 * Helper function to check if two users are friends
 */
async function checkFriendshipStatus(
  ctx: QueryCtx,
  currentUserId: Id<"users">,
  targetUserId: Id<"users">
): Promise<boolean> {
  // Check if friendship exists in either direction
  const friendship = await ctx.db
    .query("friendships")
    .withIndex("by_both", (q) =>
      q.eq("userId1", currentUserId).eq("userId2", targetUserId)
    )
    .first();

  if (friendship) return true;

  // Check reverse direction
  const reverseFriendship = await ctx.db
    .query("friendships")
    .withIndex("by_both", (q) =>
      q.eq("userId1", targetUserId).eq("userId2", currentUserId)
    )
    .first();

  return !!reverseFriendship;
}

/**
 * Get detailed user profile with friendship status
 * Returns all profile information needed for user details screen
 */
export const getUserProfile = query({
  args: { profileId: v.id("profiles") },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) throw new Error("Not authenticated");

    // Get the target user's profile
    const profile = await ctx.db.get(args.profileId);

    if (!profile) {
      throw new Error("User profile not found");
    }

    // Don't allow viewing own profile through this function
    if (currentUserId === profile.userId) {
      throw new Error("Cannot view own profile through this function");
    }

    // Check if user is blocked (either direction)
    const isBlocked = await ctx.db
      .query("blockedUsers")
      .withIndex("by_both", (q) =>
        q.eq("blockerUserId", currentUserId).eq("blockedUserId", profile.userId)
      )
      .first();

    const isBlockedBy = await ctx.db
      .query("blockedUsers")
      .withIndex("by_both", (q) =>
        q.eq("blockerUserId", profile.userId).eq("blockedUserId", currentUserId)
      )
      .first();

    // If blocked in either direction, don't show profile
    if (isBlocked || isBlockedBy) {
      throw new Error("User profile not accessible");
    }

    // Check friendship status
    const isFriend = await checkFriendshipStatus(
      ctx,
      currentUserId,
      profile.userId
    );

    // Generate profile picture URL
    const profilePictureUrl = profile.profilePicture
      ? await ctx.storage.getUrl(profile.profilePicture)
      : null;

    // Profile picture is required
    if (!profilePictureUrl) {
      throw new Error("User profile not accessible");
    }

    // Return profile data with required fields
    // Only include travel countries and favorite books if they exist
    const userProfile = {
      id: profile._id,
      userId: profile.userId,
      profilePicture: profilePictureUrl,
      name: profile.name,
      username: profile.userName,
      gender: profile.gender,
      age: profile.age,
      countryCode: profile.countryCode,
      aboutMe: profile.aboutMe,
      spokenLanguageCodes: profile.spokenLanguagesCodes,
      learningLanguageCodes: profile.learningLanguagesCodes,
      isFriend,
    };

    // Add optional fields only if they have content
    const result: any = { ...userProfile };

    if (profile.visitedCountryCodes && profile.visitedCountryCodes.length > 0) {
      result.visitedCountryCodes = profile.visitedCountryCodes;
    }

    if (
      profile.wantToVisitCountryCodes &&
      profile.wantToVisitCountryCodes.length > 0
    ) {
      result.wantToVisitCountryCodes = profile.wantToVisitCountryCodes;
    }

    if (profile.favoriteBooks && profile.favoriteBooks.length > 0) {
      result.favoriteBooks = profile.favoriteBooks;
    }

    return result;
  },
});

/**
 * Block a user and clean up all relationships
 * This will:
 * 1. Add user to blocked list
 * 2. Remove friendship if exists
 * 3. Remove any pending friend requests (both directions)
 */
export const blockUser = mutation({
  args: { profileId: v.id("profiles") },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) throw new Error("Not authenticated");

    // Get the target user's profile to get their userId
    const profile = await ctx.db.get(args.profileId);
    if (!profile) {
      throw new Error("User profile not found");
    }

    // Don't allow blocking yourself
    if (currentUserId === profile.userId) {
      throw new Error("Cannot block yourself");
    }

    // Check if already blocked
    const existingBlock = await ctx.db
      .query("blockedUsers")
      .withIndex("by_both", (q) =>
        q.eq("blockerUserId", currentUserId).eq("blockedUserId", profile.userId)
      )
      .first();

    if (existingBlock) {
      throw new Error("User is already blocked");
    }

    // 1. Add to blocked users
    await ctx.db.insert("blockedUsers", {
      blockerUserId: currentUserId,
      blockedUserId: profile.userId,
    });

    // 2. Remove friendship if exists (both directions)
    const friendship1 = await ctx.db
      .query("friendships")
      .withIndex("by_both", (q) =>
        q.eq("userId1", currentUserId).eq("userId2", profile.userId)
      )
      .first();

    if (friendship1) {
      await ctx.db.delete(friendship1._id);
    }

    const friendship2 = await ctx.db
      .query("friendships")
      .withIndex("by_both", (q) =>
        q.eq("userId1", profile.userId).eq("userId2", currentUserId)
      )
      .first();

    if (friendship2) {
      await ctx.db.delete(friendship2._id);
    }

    // 3. Remove pending friend requests (both directions)
    const sentRequests = await ctx.db
      .query("friendRequests")
      .withIndex("by_both", (q) =>
        q.eq("senderId", currentUserId).eq("receiverId", profile.userId)
      )
      .collect();

    for (const request of sentRequests) {
      await ctx.db.delete(request._id);
    }

    const receivedRequests = await ctx.db
      .query("friendRequests")
      .withIndex("by_both", (q) =>
        q.eq("senderId", profile.userId).eq("receiverId", currentUserId)
      )
      .collect();

    for (const request of receivedRequests) {
      await ctx.db.delete(request._id);
    }

    return { success: true };
  },
});
