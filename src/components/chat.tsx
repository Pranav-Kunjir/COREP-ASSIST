import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Chat({ chatId, isTyping }: { chatId: string; isTyping?: boolean }) {
  const messages = useQuery(api.myFunctions.getMessages, {
    chatId: chatId as any,
  });

  if (!messages) return <div>Loading…</div>;

  return (
    <div className="flex flex-col gap-4 text-sm">
      {messages.map(msg => (
        <div
          key={msg._id}
          className={`p-3 rounded-2xl max-w-[85%] leading-relaxed shadow-sm ${msg.role === "user"
            ? "bg-blue-600 text-white self-end rounded-br-none"
            : "bg-neutral-800 text-neutral-200 self-start rounded-bl-none border border-neutral-700"
            }`}
        >
          {msg.content}
        </div>
      ))}

      {isTyping && (
        <div className="self-start animate-in fade-in slide-in-from-bottom-2">
          <div className="bg-neutral-800 rounded-2xl rounded-bl-none border border-neutral-700 px-4 py-3 flex items-center gap-1 w-fit">
            <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce"></span>
          </div>
        </div>
      )}
    </div>
  );
}
