import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Chat({ chatId }: { chatId: string }) {
  const messages = useQuery(api.myFunctions.getMessages, {
    chatId: chatId as any,
  });

  if (!messages) return <div>Loading…</div>;

  return (
    <div className="flex flex-col gap-3 text-sm">
      {messages.map(msg => (
        <div
          key={msg._id}
          className={`p-2 rounded ${
            msg.role === "user"
              ? "bg-blue-50 self-end"
              : "bg-gray-100 self-start"
          }`}
        >
          {msg.content}
        </div>
      ))}
    </div>
  );
}
