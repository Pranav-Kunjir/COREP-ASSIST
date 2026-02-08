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

  if (!template || !chatId) {
    return (
      <div className="p-8 text-red-600">
        Invalid or missing reporting session
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* LEFT: Chat */}
      <aside className="w-1/4 border-r p-4 flex flex-col">
        <h2 className="font-semibold mb-3">Chat</h2>
        <Chat chatId={chatId} />
        <InputBar chatId={chatId} />
      </aside>

      {/* RIGHT: COREP workspace */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold capitalize">
          {template.replace("-", " ")}
        </h1>
        <p className="text-gray-600 mb-6">
          COREP reporting workspace
        </p>

        {/* COREP tables + suggestions go here */}
        <CorepWorkspace template={template} chatId={chatId} />
      </main>
    </div>
  );
}

function CorepWorkspace({
  template,
  chatId,
}: {
  template: string;
  chatId: string;
}) {
  const corepRows = useQuery(api.myFunctions.getCorepRows, {
    chatId: chatId as any,
  });

  const initCorepRows = useMutation(api.myFunctions.initCorepRows);
  const updateCorepRow = useMutation(api.myFunctions.updateCorepRow);
  const updateCorepRowTemplateId = useMutation(api.myFunctions.updateCorepRowTemplateId);

  const [edits, setEdits] = useState<Record<string, { amount: string; status: string }>>({});
  const [selectedRow, setSelectedRow] = useState<string | null>(null);

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

  if (!corepRows) return <div>Loading COREP rows…</div>;

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
    <div>
      <div className="flex justify-end mb-3">
        <button
          className="bg-green-600 text-white px-3 py-1 rounded text-sm"
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
      <table className="w-full border text-sm">
        <thead>
          <tr>
            <th>Row</th>
            <th>ID</th>
            <th>Item</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {corepRows.map((r: any) => {
            const id = r._id;
            const amount = edits[id]?.amount ?? r.amount ?? "";
            const status = edits[id]?.status ?? r.status ?? "draft";

            return (
              <tr key={r.rowCode}>
                <td className="p-2">{r.rowCode}</td>
                <td className="p-2">{r.templateId || ""}</td>
                <td className="p-2">{r.item}</td>
                <td className="p-2 flex gap-2">
                  <input
                    className="border px-2 py-1 w-full"
                    value={amount}
                    onChange={(e) => handleChange(id, "amount", e.target.value)}
                    onBlur={() => handleSave(id)}
                  />
                  <button
                    className="text-xs text-blue-600 underline"
                    onClick={() => setSelectedRow(id)}
                  >
                    View history
                  </button>
                </td>
                <td className="p-2">
                  <select
                    className="border px-2 py-1"
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
      {selectedRow && (
        <div className="mt-4">
          <AuditLog chatId={chatId} rowId={selectedRow} />
          <div className="mt-2">
            <button
              className="text-sm text-gray-600"
              onClick={() => setSelectedRow(null)}
            >
              Close history
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
