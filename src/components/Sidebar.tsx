import { useQuery } from "convex/react";
import { useNavigate } from "react-router-dom";
import { api } from "../../convex/_generated/api";

export default function Sidebar() {
  const navigate = useNavigate();
  const chats = useQuery(api.myFunctions.getUserChats);

  return (
    <aside className="w-64 border-r bg-white p-4">
      <h2 className="text-sm font-semibold text-gray-600 mb-4">
        Reporting Sessions
      </h2>

      {!chats && (
        <p className="text-sm text-gray-400">Loading…</p>
      )}

      {chats && chats.length === 0 && (
        <p className="text-sm text-gray-400">
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
            className="cursor-pointer rounded px-3 py-2 text-sm hover:bg-gray-100"
          >
            <div className="font-medium capitalize">
              {chat.template.replace("-", " ")}
            </div>
            <div className="text-xs text-gray-500">
              {new Date(chat.createdAt).toLocaleDateString()}
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
