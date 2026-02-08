import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { chatWithUser, generateSuggestions } from "../functions/corepAgent";
export default function InputBar({
  chatId,
  onProcessingChange
}: {
  chatId: string;
  onProcessingChange?: (isProcessing: boolean) => void;
}) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const sendMessage = useMutation(api.myFunctions.sendMessage);
  const writeAssistantMessage = useMutation(api.myFunctions.writeAssistantMessage);
  const updateCorepRow = useMutation(api.myFunctions.updateCorepRow);
  const createAuditLog = useMutation(api.myFunctions.createAuditLog);

  const corepRows = useQuery(api.myFunctions.getCorepRows, { chatId: chatId as any });

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [text]);

  const handleSend = async () => {
    if (!text.trim()) return;

    // Notify parent start
    onProcessingChange?.(true);

    // Store current text and clear input immediately for better UX
    const currentText = text;
    setText("");

    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      // Write user message to DB
      await sendMessage({ chatId: chatId as any, content: currentText });

      // Run local agent (client-side): try to generate suggestions based on table + rules
      const rows = corepRows || [];
      let suggestions = [] as any[];
      try {
        suggestions = await generateSuggestions(currentText, rows as any);
      } catch (e) {
        console.error("Agent generateSuggestions failed", e);
        suggestions = [];
      }

      if (suggestions.length === 0) {
        // fallback to chat-only response
        try {
          const reply = await chatWithUser(currentText);
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
    } catch (err) {
      console.error("Error processing message", err);
    } finally {
      // Notify parent end
      onProcessingChange?.(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex gap-2 w-full items-end bg-neutral-900 border-t border-neutral-800 p-2">
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all resize-none shadow-inner custom-scrollbar no-scrollbar"
          placeholder="Describe the reporting scenario…"
          rows={1}
          style={{ minHeight: "44px", maxHeight: "200px" }}
        />
      </div>
      <button
        onClick={handleSend}
        disabled={!text.trim()}
        className="bg-blue-600 hover:bg-blue-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-white p-3 rounded-xl transition-colors flex items-center justify-center shadow-lg mb-[1px]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </button>
    </div>
  );
}

