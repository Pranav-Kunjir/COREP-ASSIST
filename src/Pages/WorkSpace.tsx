import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

import Chat from "../components/chat";
import InputBar from "../components/inputBar";
import AuditLog from "../components/auditLog";
import { loadCsvTemplate } from "../utils/loadCsvTemplate";

export default function WorkSpace() {
  const { template, chatId } = useParams<{
    template: string;
    chatId: string;
  }>();

  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState(350);
  const [isResizing, setIsResizing] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      let newWidth = e.clientX;
      if (newWidth < 250) newWidth = 250;
      if (newWidth > 600) newWidth = 600;
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  if (!template || !chatId) {
    return (
      <div className="p-8 text-red-600">
        Invalid or missing reporting session
      </div>
    );
  }

  return (
    <div className={`flex h-screen overflow-hidden bg-neutral-900 text-gray-100 ${isResizing ? 'cursor-col-resize select-none' : ''}`}>
      {/* LEFT: Chat - Fixed width, Flex column */}
      <aside
        className="flex flex-col border-r border-neutral-800 bg-neutral-900/50 relative group"
        style={{ width: sidebarWidth }}
      >
        <div className="p-4 border-b border-neutral-800">
          <h2 className="font-semibold text-lg tracking-tight">Chat</h2>
        </div>

        {/* Chat messages area - flex-1 to take available space and scroll */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <Chat chatId={chatId} isTyping={isTyping} />
        </div>

        {/* Input area - Fixed at bottom */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-900">
          <InputBar chatId={chatId} onProcessingChange={setIsTyping} />
        </div>

        {/* Drag Handle */}
        <div
          className={`absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500/50 transition-colors z-20 ${isResizing ? 'bg-blue-600' : ''}`}
          onMouseDown={() => setIsResizing(true)}
        />
      </aside>


      {/* RIGHT: COREP workspace - Flex column */}
      <main className="flex-1 flex flex-col min-w-0 bg-black/20">
        {/* Header */}
        <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/80 backdrop-blur-sm">
          <div>
            <h1 className="text-2xl font-bold capitalize bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              {template.replace("-", " ")}
            </h1>
            <p className="text-neutral-400 text-sm mt-1">
              COREP reporting workspace
            </p>
          </div>
          {/* We could move the CSV download button here or keep it in the component */}
        </div>

        {/* Table Area - flex-1 to take remaining height and scroll */}
        <div className="flex-1 overflow-auto p-6 relative">
          <CorepWorkspace template={template} chatId={chatId} onSelectRow={setSelectedRow} />
        </div>
      </main>

      {/* Modal for History */}
      {selectedRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-2xl transform rounded-2xl glass-panel p-6 shadow-2xl transition-all animate-in zoom-in-95 duration-200 border border-neutral-700"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex justify-between items-center mb-6 border-b border-neutral-700 pb-4">
              <h3 className="text-xl font-semibold text-white">Row History</h3>
              <button
                className="text-neutral-400 hover:text-white transition-colors rounded-full p-1 hover:bg-neutral-800"
                onClick={() => setSelectedRow(null)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
              <AuditLog chatId={chatId} rowId={selectedRow} />
            </div>

            <div className="mt-6 flex justify-end pt-4 border-t border-neutral-700">
              <button
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-sm font-medium transition-colors"
                onClick={() => setSelectedRow(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CorepWorkspace({
  template,
  chatId,
  onSelectRow
}: {
  template: string;
  chatId: string;
  onSelectRow: (id: string) => void;
}) {
  const corepRows = useQuery(api.myFunctions.getCorepRows, {
    chatId: chatId as any,
  });

  const initCorepRows = useMutation(api.myFunctions.initCorepRows);
  const updateCorepRow = useMutation(api.myFunctions.updateCorepRow);
  const updateCorepRowTemplateId = useMutation(api.myFunctions.updateCorepRowTemplateId);

  const [edits, setEdits] = useState<Record<string, { amount: string; status: string }>>({});

  useEffect(() => {
    // If there are no rows in DB for this chat, initialise from CSV template
    const tryInit = async () => {
      if (corepRows === undefined) return; // still loading
      if (corepRows.length > 0) {
        // If rows exist but don't have templateId, attempt backfill from CSV
        const missingId = corepRows.every((r: any) => !r.templateId);
        if (missingId) {
          try {
            const mapping: Record<string, string> = {
              "own-funds": "OWN_FUNDS.csv",
            };
            const filename = mapping[template];
            if (filename) {
              const csvRows = await loadCsvTemplate(`/src/Data/TEMPLATES/${filename}`);
              const byRowCode: Record<string, string> = {};
              for (const rr of csvRows) byRowCode[rr.rowCode] = rr.rowCode;

              // patch each corepRow with its templateId
              for (const r of corepRows) {
                const idVal = byRowCode[r.rowCode];
                if (idVal) {
                  try {
                    await updateCorepRowTemplateId({ rowId: r._id as any, templateId: idVal });
                  } catch (err) {
                    console.error("Backfill patch failed for", r.rowCode, err);
                  }
                }
              }
            }
          } catch (e) {
            console.error("Failed to backfill templateId:", e);
          }
        }
        return;
      } // already initialised

      const mapping: Record<string, string> = {
        "own-funds": "OWN_FUNDS.csv",
      };

      const filename = mapping[template];
      if (!filename) return;

      try {
        const rows = await loadCsvTemplate(`/src/Data/TEMPLATES/${filename}`);
        const rowsWithId = rows.map((row: any) => ({ id: crypto.randomUUID(), ...row }));
        await initCorepRows({ chatId: chatId as any, rows: rowsWithId });
      } catch (e) {
        console.error("Failed to init corep rows:", e);
      }
    };

    tryInit();
  }, [corepRows, template, chatId, initCorepRows]);

  if (!corepRows) return <div className="text-neutral-400 p-4">Loading COREP rows…</div>;

  const handleChange = (id: string, field: "amount" | "status", value: string) => {
    setEdits(prev => ({ ...prev, [id]: { amount: field === "amount" ? value : prev[id]?.amount ?? "", status: field === "status" ? value : prev[id]?.status ?? prev[id]?.status ?? "draft" } }));
  };

  const handleSave = async (id: string) => {
    const e = edits[id];
    if (!e) return;
    try {
      await updateCorepRow({ rowId: id as any, amount: e.amount, status: e.status });
      setEdits(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } catch (err) {
      console.error("Failed to save row", err);
    }
  };

  return (
    <div className="min-w-full inline-block align-middle">
      <div className="flex justify-end mb-4 sticky top-0 bg-neutral-900/0 z-10">
        <button
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-emerald-900/20"
          onClick={() => {
            // build CSV with Row,ID,Item,Amount
            const rowsData = corepRows.map((r: any) => [r.rowCode, r.templateId || "", r.item, r.amount || ""]);
            const csv = ["Row,ID,Item,Amount", ...rowsData.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(","))].join("\n");
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${template}-${chatId}-corep.csv`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
          }}
        >
          Download CSV
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-800 shadow-xl bg-neutral-900">
        <table className="min-w-full divide-y divide-neutral-800">
          <thead className="bg-neutral-800/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Row</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Item</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider text-right">Amount</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800 bg-neutral-900">
            {corepRows.map((r: any) => {
              const id = r._id;
              const amount = edits[id]?.amount ?? r.amount ?? "";
              const status = edits[id]?.status ?? r.status ?? "draft";

              return (
                <tr key={r.rowCode} className="hover:bg-neutral-800/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-300">{r.rowCode}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">{r.templateId || ""}</td>
                  <td className="px-6 py-4 text-sm text-neutral-300 max-w-xs truncate" title={r.item}>{r.item}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    <div className="flex flex-col items-end gap-1">
                      <input
                        className="bg-neutral-800 border-neutral-700 text-neutral-200 border rounded px-3 py-1 w-32 text-right focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        value={amount}
                        onChange={(e) => handleChange(id, "amount", e.target.value)}
                        onBlur={() => handleSave(id)}
                      />
                      <button
                        className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                        onClick={() => onSelectRow(id)}
                      >
                        <span>History</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <select
                      className={`
                        block w-full rounded-md border-0 py-1.5 pl-3 pr-8 text-sm ring-1 ring-inset focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6
                        ${status === 'accepted' ? 'bg-emerald-900/30 text-emerald-400 ring-emerald-900' :
                          status === 'missing' ? 'bg-red-900/30 text-red-400 ring-red-900' :
                            'bg-neutral-800 text-neutral-300 ring-neutral-700'}
                      `}
                      value={status}
                      onChange={(e) => handleChange(id, "status", e.target.value)}
                      onBlur={() => handleSave(id)}
                    >
                      <option value="draft">draft</option>
                      <option value="accepted">accepted</option>
                      <option value="missing">missing</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
