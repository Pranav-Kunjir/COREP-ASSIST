import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api } from "./_generated/api";

/* =====================================================
   CHAT / SESSION CREATION
===================================================== */

export const createChat = mutation({
  args: {
    template: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const title = `${args.template.replace("-", " ")} – Draft ${Date.now()}`;

    return ctx.db.insert("chats", {
      userId,
      template: args.template,
      title,
      createdAt: Date.now(),
    });
  },
});

/* =====================================================
   CHAT LISTING / LOADING
===================================================== */

export const getUserChats = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return ctx.db
      .query("chats")
      .withIndex("by_user", q => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const getChatById = query({
  args: { chatId: v.id("chats") },
  handler: async (ctx, args) => {
    return ctx.db.get(args.chatId);
  },
});

/* =====================================================
   MESSAGES
===================================================== */

export const getMessages = query({
  args: { chatId: v.id("chats") },
  handler: async (ctx, args) => {
    return ctx.db
      .query("messages")
      .withIndex("by_chat", q => q.eq("chatId", args.chatId))
      .order("asc")
      .collect();
  },
});

export const sendMessage = mutation({
  args: {
    chatId: v.id("chats"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("messages", {
      chatId: args.chatId,
      role: "user",
      content: args.content,
      createdAt: Date.now(),
    });
  },
});

export const writeAssistantMessage = mutation({
  args: {
    chatId: v.id("chats"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("messages", {
      chatId: args.chatId,
      role: "assistant",
      content: args.content,
      createdAt: Date.now(),
    });
  },
});

/* =====================================================
   COREP ROWS
===================================================== */

export const initCorepRows = mutation({
  args: {
    chatId: v.id("chats"),
    rows: v.array(
      v.object({
        rowCode: v.string(),
        id: v.string(),
        item: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("corepRows")
      .withIndex("by_chat", q => q.eq("chatId", args.chatId))
      .collect();

    if (existing.length > 0) return;

    for (const row of args.rows) {
      await ctx.db.insert("corepRows", {
        chatId: args.chatId,
        rowCode: row.rowCode,
        templateId: row.id,
        item: row.item,
        amount: "",
        status: "draft",
        createdAt: Date.now(),
      });
    }
  },
});

export const getCorepRows = query({
  args: { chatId: v.id("chats") },
  handler: async (ctx, args) => {
    return ctx.db
      .query("corepRows")
      .withIndex("by_chat", q => q.eq("chatId", args.chatId))
      .order("asc")
      .collect();
  },
});

export const updateCorepRow = mutation({
  args: {
    rowId: v.id("corepRows"),
    amount: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const patch: Record<string, any> = {};
    if (args.amount !== undefined) patch.amount = args.amount;
    if (args.status !== undefined) patch.status = args.status;

    await ctx.db.patch(args.rowId, patch);
  },
});

export const updateCorepRowTemplateId = mutation({
  args: {
    rowId: v.id("corepRows"),
    templateId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.rowId, { templateId: args.templateId });
  },
});

export const createAuditLog = mutation({
  args: {
    chatId: v.id("chats"),
    rowId: v.id("corepRows"),
    prevAmount: v.optional(v.string()),
    newAmount: v.optional(v.string()),
    prevStatus: v.optional(v.string()),
    newStatus: v.optional(v.string()),
    reasoning: v.optional(v.string()),
    evidence: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    await ctx.db.insert("auditLogs", {
      chatId: args.chatId,
      rowId: args.rowId,
      userId: userId || undefined,
      prevAmount: args.prevAmount,
      newAmount: args.newAmount,
      prevStatus: args.prevStatus,
      newStatus: args.newStatus,
      reasoning: args.reasoning,
      evidence: args.evidence,
      createdAt: Date.now(),
    });
  },
});

export const getAuditLogs = query({
  args: { chatId: v.id("chats"), rowId: v.optional(v.id("corepRows")) },
  handler: async (ctx, args) => {
    let q = ctx.db.query("auditLogs").withIndex("by_chat", q => q.eq("chatId", args.chatId));
    if (args.rowId) {
      const filtered = await q.collect();
      return filtered.filter(log => log.rowId === args.rowId).sort((a, b) => b.createdAt - a.createdAt);
    }

    return q.order("desc").collect();
  },
});

/* =====================================================
   LLM ORCHESTRATION (ACTION)
===================================================== */

export const runAssistant = action({
  args: {
    chatId: v.id("chats"),
    latestMessage: v.string(),
  },
  handler: async (ctx, args) => {
    // ✅ reuse queries from THIS file
    const messages = await ctx.runQuery(api.myFunctions.getMessages, {
      chatId: args.chatId,
    });

    const rows = await ctx.runQuery(api.myFunctions.getCorepRows, {
      chatId: args.chatId,
    });

    const text = args.latestMessage.toLowerCase();

    const wantsUpdate =
      /update|suggest|fill|populate|amount|calculate|estimate|recommend/.test(text);

    if (!wantsUpdate) {
      await ctx.runMutation(api.myFunctions.writeAssistantMessage, {
        chatId: args.chatId,
        content: `Assistant: I read your message — "${args.latestMessage}". How would you like me to help?`,
      });
    }

    // future:
    // - call LLM
    // - decide row updates
    // - apply updateCorepRow mutations
  },
});
