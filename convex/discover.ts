/**
 * User Discovery System for Language Learning App
 *
 * This module provides three main queries for discovering users:
 * 1. getDiscoverUsers - Main discovery with age group and gender filtering
 * 2. searchDiscoverUsers - Full-text search by name/username
 * 3. filterDiscoverUsers - Filter by country, spoken language, or learning language
 *
 * All queries exclude:
 * - Blocked users (both ways)
 * - Friends
 * - Pending friend requests
 * - Admin users
 * - Current user
 * - Users without profile pictures
 *
 * Age group filtering ensures users only see others in their age group (13-17 or 18-100)
 * Gender preference filtering shows only same gender users if enabled
 */

import { v } from "convex/values";
import { query, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { paginationOptsValidator } from "convex/server";
import { Doc, Id } from "./_generated/dataModel";

/**
 * Helper function to get blocked user IDs for the current user
 * Returns array of user IDs that are blocked by or have blocked the current user
 */
async function getBlockedUserIds(ctx: QueryCtx, currentUserId: Id<"users">) {
  // Get users blocked by current user
  const blockedByMe = await ctx.db
    .query("blockedUsers")
    .withIndex("by_blocker", (q) => q.eq("blockerUserId", currentUserId))
    .collect();

  // Get users who blocked current user
  const blockedMe = await ctx.db
    .query("blockedUsers")
    .withIndex("by_blocked", (q) => q.eq("blockedUserId", currentUserId))
    .collect();

  const blockedUserIds = new Set([
    ...blockedByMe.map((b) => b.blockedUserId),
    ...blockedMe.map((b) => b.blockerUserId),
  ]);

  return Array.from(blockedUserIds);
}

/**
 * Helper function to get friend user IDs for the current user
 * Returns array of user IDs that are friends with the current user
 */
async function getFriendUserIds(ctx: QueryCtx, currentUserId: Id<"users">) {
  // Get friendships where current user is userId1
  const friendships1 = await ctx.db
    .query("friendships")
    .withIndex("by_user1", (q) => q.eq("userId1", currentUserId))
    .collect();

  // Get friendships where current user is userId2
  const friendships2 = await ctx.db
    .query("friendships")
    .withIndex("by_user2", (q) => q.eq("userId2", currentUserId))
    .collect();

  const friendUserIds = [
    ...friendships1.map((f) => f.userId2),
    ...friendships2.map((f) => f.userId1),
  ];

  return friendUserIds;
}

/**
 * Helper function to get pending friend request user IDs for the current user
 * Returns array of user IDs with pending friend requests (sent or received)
 */
async function getPendingFriendRequestUserIds(
  ctx: QueryCtx,
  currentUserId: Id<"users">
) {
  // Get friend requests sent by current user
  const sentRequests = await ctx.db
    .query("friendRequests")
    .withIndex("by_sender", (q) => q.eq("senderId", currentUserId))
    .collect();

  // Get friend requests received by current user
  const receivedRequests = await ctx.db
    .query("friendRequests")
    .withIndex("by_receiver", (q) => q.eq("receiverId", currentUserId))
    .collect();

  const pendingUserIds = [
    ...sentRequests.map((r) => r.receiverId),
    ...receivedRequests.map((r) => r.senderId),
  ];

  return pendingUserIds;
}

/**
 * Helper function to transform profile to UserCardData format
 */
async function transformProfileToUserCard(
  ctx: QueryCtx,
  profile: Doc<"profiles">
) {
  // Generate profile picture URL
  const profilePictureUrl = profile.profilePicture
    ? await ctx.storage.getUrl(profile.profilePicture)
    : null;

  if (!profilePictureUrl) {
    // Skip profiles without profile pictures as they are required
    return null;
  }

  return {
    id: profile._id,
    profilePicture: profilePictureUrl,
    name: profile.name,
    username: profile.userName,
    gender: profile.gender,
    age: profile.age,
    countryCode: profile.countryCode,
    spokenLanguageCodes: profile.spokenLanguagesCodes,
    learningLanguageCodes: profile.learningLanguagesCodes,
    greetingCode: profile.countryCode, // Use country code as greeting code
  };
}

/**
 * Get discover users with pagination
 * Excludes blocked users, friends, pending requests, admins, and current user
 * Filters by age group and gender preference
 * Sorted by lastActive (most recent first)
 */
export const getDiscoverUsers = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Get current user's profile to determine filtering criteria
    const currentProfile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!currentProfile) throw new Error("Profile not found");

    // Get excluded user IDs
    const blockedUserIds = await getBlockedUserIds(ctx, userId);
    const friendUserIds = await getFriendUserIds(ctx, userId);
    const pendingUserIds = await getPendingFriendRequestUserIds(ctx, userId);

    const excludedUserIds = new Set([
      userId, // Exclude current user
      ...blockedUserIds,
      ...friendUserIds,
      ...pendingUserIds,
    ]);

    // Build query based on current user's preferences
    let results;

    // Filter by age group (users can only see their own age group)
    if (currentProfile.genderPreference) {
      // If gender preference is true, show only same gender users
      results = await ctx.db
        .query("profiles")
        .withIndex("by_ageGroup_gender_lastActive", (q) =>
          q
            .eq("ageGroup", currentProfile.ageGroup)
            .eq("gender", currentProfile.gender)
        )
        .order("desc")
        .paginate(args.paginationOpts);
    } else {
      // Show all genders in the same age group
      results = await ctx.db
        .query("profiles")
        .withIndex("by_ageGroup_lastActive", (q) =>
          q.eq("ageGroup", currentProfile.ageGroup)
        )
        .order("desc")
        .paginate(args.paginationOpts);
    }

    // Filter out excluded users and admins, then transform to UserCardData
    const filteredProfiles = results.page.filter(
      (profile) =>
        !excludedUserIds.has(profile.userId) &&
        !profile.isAdmin &&
        profile.profilePicture // Ensure profile picture exists
    );

    // Transform profiles to UserCardData format
    const userCards = await Promise.all(
      filteredProfiles.map((profile) =>
        transformProfileToUserCard(ctx, profile)
      )
    );

    // Filter out null results (profiles without valid profile pictures)
    const validUserCards = userCards.filter((card) => card !== null);

    return {
      ...results,
      page: validUserCards,
    };
  },
});

/**
 * Search discover users by name/username with full-text search
 * Same constraints as getDiscoverUsers with search functionality
 */
export const searchDiscoverUsers = query({
  args: {
    paginationOpts: paginationOptsValidator,
    searchQuery: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Get current user's profile to determine filtering criteria
    const currentProfile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!currentProfile) throw new Error("Profile not found");

    // Get excluded user IDs
    const blockedUserIds = await getBlockedUserIds(ctx, userId);
    const friendUserIds = await getFriendUserIds(ctx, userId);
    const pendingUserIds = await getPendingFriendRequestUserIds(ctx, userId);

    const excludedUserIds = new Set([
      userId, // Exclude current user
      ...blockedUserIds,
      ...friendUserIds,
      ...pendingUserIds,
    ]);

    // Search by name first
    let nameSearchQuery = ctx.db
      .query("profiles")
      .withSearchIndex("search_name_username", (q) => {
        let searchQuery = q
          .search("name", args.searchQuery)
          .eq("ageGroup", currentProfile.ageGroup);

        if (currentProfile.genderPreference) {
          searchQuery = searchQuery.eq("gender", currentProfile.gender);
        }

        return searchQuery;
      });

    const nameSearchResults = await nameSearchQuery.paginate(
      args.paginationOpts
    );

    // Search by username as fallback if name search doesn't yield enough results
    let usernameSearchQuery = ctx.db
      .query("profiles")
      .withSearchIndex("search_username", (q) => {
        let searchQuery = q
          .search("userName", args.searchQuery)
          .eq("ageGroup", currentProfile.ageGroup);

        if (currentProfile.genderPreference) {
          searchQuery = searchQuery.eq("gender", currentProfile.gender);
        }

        return searchQuery;
      });

    const usernameSearchResults = await usernameSearchQuery.take(10); // Take additional results to merge

    // Combine and deduplicate results
    const allResults = [...nameSearchResults.page];
    const existingIds = new Set(nameSearchResults.page.map((p) => p._id));

    for (const profile of usernameSearchResults) {
      if (!existingIds.has(profile._id)) {
        allResults.push(profile);
      }
    }

    // Filter out excluded users and admins
    const filteredProfiles = allResults.filter(
      (profile) =>
        !excludedUserIds.has(profile.userId) &&
        !profile.isAdmin &&
        profile.profilePicture // Ensure profile picture exists
    );

    // Transform profiles to UserCardData format
    const userCards = await Promise.all(
      filteredProfiles.map((profile) =>
        transformProfileToUserCard(ctx, profile)
      )
    );

    // Filter out null results
    const validUserCards = userCards.filter((card) => card !== null);

    return {
      ...nameSearchResults,
      page: validUserCards,
    };
  },
});

/**
 * Filter discover users by country, spoken language, or learning language
 * Same constraints as getDiscoverUsers with additional filtering
 * User can select one option per filter type, but can combine filter types
 */
export const filterDiscoverUsers = query({
  args: {
    paginationOpts: paginationOptsValidator,
    countryCode: v.optional(v.string()),
    spokenLanguageCode: v.optional(v.string()),
    learningLanguageCode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Validate that at least one filter is provided
    if (
      !args.countryCode &&
      !args.spokenLanguageCode &&
      !args.learningLanguageCode
    ) {
      throw new Error("At least one filter must be provided");
    }

    // Get current user's profile to determine filtering criteria
    const currentProfile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!currentProfile) throw new Error("Profile not found");

    // Get excluded user IDs
    const blockedUserIds = await getBlockedUserIds(ctx, userId);
    const friendUserIds = await getFriendUserIds(ctx, userId);
    const pendingUserIds = await getPendingFriendRequestUserIds(ctx, userId);

    const excludedUserIds = new Set([
      userId, // Exclude current user
      ...blockedUserIds,
      ...friendUserIds,
      ...pendingUserIds,
    ]);

    // Start with base query filtered by age group and gender preference
    let results;

    // Use appropriate index based on filters
    if (args.countryCode) {
      results = await ctx.db
        .query("profiles")
        .withIndex("by_countryCode_ageGroup_lastActive", (q) =>
          q
            .eq("countryCode", args.countryCode!)
            .eq("ageGroup", currentProfile.ageGroup)
        )
        .order("desc")
        .paginate(args.paginationOpts);
    } else if (currentProfile.genderPreference) {
      results = await ctx.db
        .query("profiles")
        .withIndex("by_ageGroup_gender_lastActive", (q) =>
          q
            .eq("ageGroup", currentProfile.ageGroup)
            .eq("gender", currentProfile.gender)
        )
        .order("desc")
        .paginate(args.paginationOpts);
    } else {
      results = await ctx.db
        .query("profiles")
        .withIndex("by_ageGroup_lastActive", (q) =>
          q.eq("ageGroup", currentProfile.ageGroup)
        )
        .order("desc")
        .paginate(args.paginationOpts);
    }

    // Filter results based on language arrays and other criteria
    const filteredProfiles = results.page.filter((profile) => {
      // Basic exclusions
      if (
        excludedUserIds.has(profile.userId) ||
        profile.isAdmin ||
        !profile.profilePicture
      ) {
        return false;
      }

      // Gender preference filtering
      if (
        currentProfile.genderPreference &&
        profile.gender !== currentProfile.gender
      ) {
        return false;
      }

      // Language filtering
      if (
        args.spokenLanguageCode &&
        !profile.spokenLanguagesCodes.includes(args.spokenLanguageCode)
      ) {
        return false;
      }

      if (
        args.learningLanguageCode &&
        !profile.learningLanguagesCodes.includes(args.learningLanguageCode)
      ) {
        return false;
      }

      return true;
    });

    // Transform profiles to UserCardData format
    const userCards = await Promise.all(
      filteredProfiles.map((profile) =>
        transformProfileToUserCard(ctx, profile)
      )
    );

    // Filter out null results
    const validUserCards = userCards.filter((card) => card !== null);

    return {
      ...results,
      page: validUserCards,
    };
  },
});
