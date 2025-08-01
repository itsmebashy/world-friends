import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export const getCurrentProfile = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!profile) return null;

    // Generate profile picture URL using standard Convex storage
    const profilePictureUrl = profile.profilePicture
      ? await ctx.storage.getUrl(profile.profilePicture)
      : null;

    return {
      ...profile,
      profilePictureUrl,
    };
  },
});

export const checkUsernameAvailability = query({
  args: { userName: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_userName", (q) => q.eq("userName", args.userName))
      .unique();
    return !existing;
  },
});

export const createProfile = mutation({
  args: {
    name: v.string(),
    userName: v.string(),
    profilePicture: v.id("_storage"),
    gender: v.union(v.literal("male"), v.literal("female"), v.literal("other")),
    birthDate: v.string(),
    countryCode: v.string(),
    spokenLanguagesCodes: v.array(v.string()),
    learningLanguagesCodes: v.array(v.string()),
    aboutMe: v.string(),
    hobbies: v.array(v.string()),
    visitedCountryCodes: v.array(v.string()),
    wantToVisitCountryCodes: v.array(v.string()),
    favoriteBooks: v.array(v.string()),
    genderPreference: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    if (existing) throw new Error("Profile already exists");

    const age = calculateAge(args.birthDate);
    if (age < 13) throw new Error("Must be at least 13 years old");

    const ageGroup = age < 18 ? "13-17" : "18-100";

    return await ctx.db.insert("profiles", {
      ...args,
      userId,
      age,
      ageGroup,
      isAdmin: false,
      lastActive: Date.now(),
    });
  },
});

export const updateProfile = mutation({
  args: {
    name: v.string(),
    countryCode: v.string(),
    spokenLanguagesCodes: v.array(v.string()),
    learningLanguagesCodes: v.array(v.string()),
    aboutMe: v.string(),
    hobbies: v.array(v.string()),
    visitedCountryCodes: v.array(v.string()),
    wantToVisitCountryCodes: v.array(v.string()),
    favoriteBooks: v.array(v.string()),
    genderPreference: v.boolean(),
    profilePicture: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    if (!profile) throw new Error("Profile not found");

    // Delete old profile picture if it's being updated
    if (profile.profilePicture !== args.profilePicture) {
      await ctx.storage.delete(profile.profilePicture);
    }

    return await ctx.db.patch(profile._id, {
      ...args,
      lastActive: Date.now(),
    });
  },
});

export const deleteProfile = mutation({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    if (!profile) throw new Error("Profile not found");

    if (profile.profilePicture) {
      await ctx.storage.delete(profile.profilePicture);
    }
    await ctx.db.delete(profile._id);
    // TODO: Delete other user data when we add more features
  },
});

export const updateLastActive = mutation({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    if (!profile) return;

    await ctx.db.patch(profile._id, {
      lastActive: Date.now(),
    });
  },
});
