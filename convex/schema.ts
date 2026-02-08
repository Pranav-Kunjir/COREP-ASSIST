import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  chats: defineTable({
    userId: v.id("users"),
    template: v.string(),        // own-funds | capital-requirements
    title: v.string(),           // e.g. "Own Funds – Draft 1"
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_template", ["userId", "template"]),

  messages: defineTable({
    chatId: v.id("chats"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    createdAt: v.number(),
  }).index("by_chat", ["chatId"]),
  corepRows: defineTable({
    chatId: v.id("chats"),
    rowCode: v.string(),        // "010"
    templateId: v.string(),    // CSV ID (e.g. "1", "1.1")
    item: v.string(),           // "OWN FUNDS"
    amount: v.optional(v.string()),
    status: v.string(),         // "draft" | "accepted" | "missing"
    createdAt: v.number(),
  }).index("by_chat", ["chatId"]).index("by_chat_row", ["chatId", "rowCode"]),

  auditLogs: defineTable({
    chatId: v.id("chats"),
    rowId: v.id("corepRows"),
    userId: v.optional(v.id("users")),
    prevAmount: v.optional(v.string()),
    newAmount: v.optional(v.string()),
    prevStatus: v.optional(v.string()),
    newStatus: v.optional(v.string()),
    reasoning: v.optional(v.string()),
    evidence: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_chat", ["chatId"]).index("by_row", ["rowId"]),

});
