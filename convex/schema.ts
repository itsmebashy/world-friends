import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const applicationTables = {
  profiles: defineTable({
    userId: v.id("users"),
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
    age: v.number(),
    ageGroup: v.union(v.literal("13-17"), v.literal("18-100")),
    isAdmin: v.boolean(),
    lastActive: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userName", ["userName"])
    .index("by_lastActive", ["lastActive"])
    .index("by_ageGroup_lastActive", ["ageGroup", "lastActive"])
    .index("by_ageGroup_gender_lastActive", [
      "ageGroup",
      "gender",
      "lastActive",
    ])
    .index("by_ageGroup_genderPreference_lastActive", [
      "ageGroup",
      "genderPreference",
      "lastActive",
    ])
    .index("by_countryCode_ageGroup_lastActive", [
      "countryCode",
      "ageGroup",
      "lastActive",
    ])
    .searchIndex("search_name_username", {
      searchField: "name",
      filterFields: ["ageGroup", "gender", "genderPreference", "countryCode"],
    })
    .searchIndex("search_username", {
      searchField: "userName",
      filterFields: ["ageGroup", "gender", "genderPreference", "countryCode"],
    }),

  blockedUsers: defineTable({
    blockerUserId: v.id("users"),
    blockedUserId: v.id("users"),
  })
    .index("by_blocker", ["blockerUserId"])
    .index("by_blocked", ["blockedUserId"])
    .index("by_both", ["blockerUserId", "blockedUserId"]),

  friendRequests: defineTable({
    senderId: v.id("users"),
    receiverId: v.id("users"),
    requestMessage: v.string(),
  })
    .index("by_sender", ["senderId"])
    .index("by_receiver", ["receiverId"])
    .index("by_both", ["senderId", "receiverId"]),

  friendships: defineTable({
    userId1: v.id("users"),
    userId2: v.id("users"),
  })
    .index("by_user1", ["userId1"])
    .index("by_user2", ["userId2"])
    .index("by_both", ["userId1", "userId2"]),

  posts: defineTable({
    userId: v.id("users"),
    content: v.string(),
    image: v.optional(v.id("_storage")),
  }).index("by_userId", ["userId"]),

  comments: defineTable({
    userId: v.id("users"),
    postId: v.id("posts"),
    content: v.string(),
  })
    .index("by_userId", ["userId"])
    .index("by_postId", ["postId"]),

  likes: defineTable({
    userId: v.id("users"),
    postId: v.id("posts"),
  })
    .index("by_userId", ["userId"])
    .index("by_postId", ["postId"])
    .index("by_userId_postId", ["userId", "postId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
