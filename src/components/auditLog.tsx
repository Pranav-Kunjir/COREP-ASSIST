import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function AuditLog({ chatId, rowId }: { chatId: string; rowId?: string }) {
  const logs = useQuery(api.myFunctions.getAuditLogs, { chatId: chatId as any, rowId: rowId as any });

  if (!logs) return <div>Loading history…</div>;
  if (logs.length === 0) return <div className="text-sm text-gray-500">No changes recorded.</div>;

  return (
    <div className="mt-4 border rounded p-3 bg-white">
      <h3 className="font-medium mb-2">Change history</h3>
      <ul className="text-sm space-y-3">
        {logs.map((l: any) => (
          <li key={l._id} className="border p-2 rounded">
            <div className="text-xs text-gray-500">{new Date(l.createdAt).toLocaleString()}</div>
            <div><strong>Row:</strong> {l.rowId ? l.rowId.toString() : "-"}</div>
            <div><strong>From:</strong> {l.prevAmount || ""} / {l.prevStatus || ""}</div>
            <div><strong>To:</strong> {l.newAmount || ""} / {l.newStatus || ""}</div>
            {l.reasoning && (
              <div className="mt-1"><strong>Reasoning:</strong> {l.reasoning}</div>
            )}
            {l.evidence && (
              <div className="mt-1 text-xs text-gray-700"><strong>Evidence:</strong> {l.evidence}</div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
