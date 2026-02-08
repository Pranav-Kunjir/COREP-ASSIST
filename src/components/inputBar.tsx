import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { chatWithUser, generateSuggestions } from "../functions/corepAgent";

export default function InputBar({ chatId }: { chatId: string }) {
  const [text, setText] = useState("");

  const sendMessage = useMutation(api.myFunctions.sendMessage);
  const writeAssistantMessage = useMutation(api.myFunctions.writeAssistantMessage);
  const updateCorepRow = useMutation(api.myFunctions.updateCorepRow);
  const createAuditLog = useMutation(api.myFunctions.createAuditLog);

  const corepRows = useQuery(api.myFunctions.getCorepRows, { chatId: chatId as any });

  const handleSend = async () => {
    if (!text.trim()) return;

    // Write user message to DB
    await sendMessage({ chatId: chatId as any, content: text });

    // Run local agent (client-side): try to generate suggestions based on table + rules
    const rows = corepRows || [];
    let suggestions = [] as any[];
    try {
      suggestions = await generateSuggestions(text, rows as any);
    } catch (e) {
      console.error("Agent generateSuggestions failed", e);
      suggestions = [];
    }

    if (suggestions.length === 0) {
      // fallback to chat-only response
      try {
        const reply = await chatWithUser(text);
        await writeAssistantMessage({ chatId: chatId as any, content: reply || "" });
      } catch (e) {
        console.error("chatWithUser failed", e);
      }
    } else {
      // Apply suggested updates and post assistant message with reasoning
      const lines: string[] = [];
      for (const s of suggestions) {
        // find matching row id
        const found = (rows as any[]).find(r => r.rowCode === s.rowCode);
        if (!found) continue;
        try {
          const prevAmount = found.amount || "";
          const prevStatus = found.status || "draft";

          await updateCorepRow({ rowId: found._id as any, amount: s.suggestedAmount || "", status: s.suggestedStatus || "draft" });

          await createAuditLog({
            chatId: chatId as any,
            rowId: found._id as any,
            prevAmount,
            newAmount: s.suggestedAmount || "",
            prevStatus,
            newStatus: s.suggestedStatus || "draft",
            reasoning: s.reasoning || "",
            evidence: s.evidence || "",
          });

          lines.push(`Row ${s.rowCode}: ${s.suggestedStatus || "draft"} — ${s.reasoning} \nEvidence: ${s.evidence}`);
        } catch (e) {
          console.error("Failed to apply suggestion", e);
        }
      }

      const assistantMessage = `Applied suggestions:\n${lines.join("\n\n")}`;
      await writeAssistantMessage({ chatId: chatId as any, content: assistantMessage });
    }

    setText("");
  };

  return (
    <div className="flex gap-2 mt-4">
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        className="flex-1 border rounded px-3 py-2 text-sm"
        placeholder="Describe the reporting scenario…"
      />
      <button
        onClick={handleSend}
        className="bg-blue-600 text-white px-4 rounded"
      >
        Send
      </button>
    </div>
  );
}
