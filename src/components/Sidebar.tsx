import { useQuery } from "convex/react";
import { useNavigate } from "react-router-dom";
import { api } from "../../convex/_generated/api";

export default function Sidebar() {
  const navigate = useNavigate();
  const chats = useQuery(api.myFunctions.getUserChats);

  return (
    <aside className="w-64 border-r border-neutral-800 bg-neutral-900/50 p-4">
      <h2 className="text-sm font-semibold text-neutral-400 mb-4 tracking-wider uppercase">
        Reporting Sessions
      </h2>

      {!chats && (
        <p className="text-sm text-neutral-500">Loading…</p>
      )}

      {chats && chats.length === 0 && (
        <p className="text-sm text-neutral-500">
          No previous sessions
        </p>
      )}

      <ul className="space-y-2">
        {chats?.map(chat => (
          <li
            key={chat._id}
            onClick={() =>
              navigate(`/workspace/${chat.template}/${chat._id}`)
            }
            className="cursor-pointer rounded-lg px-3 py-2 text-sm hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
          >
            <div className="font-medium capitalize">
              {chat.template.replace("-", " ")}
            </div>
            <div className="text-xs text-neutral-500 mt-1">
              {new Date(chat.createdAt).toLocaleDateString()}
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
