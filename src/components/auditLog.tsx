import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function AuditLog({ chatId, rowId }: { chatId: string; rowId?: string }) {
  const logs = useQuery(api.myFunctions.getAuditLogs, { chatId: chatId as any, rowId: rowId as any });

  if (!logs) return <div>Loading history…</div>;
  if (logs.length === 0) return <div className="text-sm text-gray-500">No changes recorded.</div>;

  return (
    <div className="space-y-4">
      <ul className="space-y-4">
        {logs.map((l: any, i: number) => (
          <li key={l._id} className="relative pl-6 pb-2 border-l border-neutral-700 last:border-0 hover:bg-neutral-800/20 p-2 rounded transition-colors group">
            {/* Timeline dot */}
            <div className="absolute -left-1.5 top-3 w-3 h-3 rounded-full bg-blue-500 border-2 border-neutral-900 group-hover:scale-110 transition-transform"></div>

            <div className="flex justify-between items-start mb-1">
              <span className="text-xs text-neutral-500 font-mono">{new Date(l.createdAt).toLocaleString()}</span>
              {i === 0 && <span className="bg-blue-900/40 text-blue-300 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Latest</span>}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-2 mb-3 bg-neutral-900/50 p-2 rounded border border-neutral-800">
              <div>
                <div className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Previous</div>
                <div className="text-sm text-red-400 font-mono">{l.prevAmount || "—"} / {l.prevStatus || "—"}</div>
              </div>
              <div>
                <div className="text-xs text-neutral-500 uppercase tracking-wider mb-1">New</div>
                <div className="text-sm text-emerald-400 font-mono">{l.newAmount || "—"} / {l.newStatus || "—"}</div>
              </div>
            </div>

            {l.reasoning && (
              <div className="mt-2 text-sm text-neutral-300 leading-relaxed bg-neutral-800/30 p-2 rounded">
                <strong className="text-blue-400 block mb-1 text-xs uppercase">Reasoning</strong>
                {l.reasoning}
              </div>
            )}
            {l.evidence && (
              <div className="mt-2 text-xs text-neutral-400 italic bg-neutral-800/30 p-2 rounded border border-neutral-800/50">
                <strong className="text-neutral-500 block mb-1 not-italic uppercase">Evidence</strong>
                {l.evidence}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
