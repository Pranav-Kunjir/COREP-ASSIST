import { useNavigate } from "react-router-dom";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import Sidebar from "../components/Sidebar";



export default function Dashboard() {
  const navigate = useNavigate();
  const createChat = useMutation(api.myFunctions.createChat);

  const startNewSession = async (template: string) => {
    const chatId = await createChat({ template });
    navigate(`/workspace/${template}/${chatId}`);
  };

  return (
    <div className="flex min-h-screen bg-neutral-900 text-gray-100 font-sans">
      {/* LEFT: Sidebar - matches new dark aesthetic */}
      <Sidebar />

      {/* RIGHT: Main content */}
      <main className="flex-1 py-12 px-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-lg text-neutral-400">
              Select a COREP template to start a reporting session
            </p>
          </div>

          <h2 className="text-xl font-semibold mb-6 text-neutral-200 border-b border-neutral-800 pb-2">
            Available Templates
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Own Funds */}
            <div
              onClick={() => startNewSession("own-funds")}
              className="group cursor-pointer rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 hover:bg-neutral-800 transition-all shadow-lg hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-4">
                  <span className="bg-blue-900/30 text-blue-400 text-xs px-2 py-1 rounded border border-blue-900/50">Template C 01.00</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-blue-300 transition-colors">
                  Own Funds
                </h3>
                <p className="text-sm text-neutral-400 mb-6 flex-1">
                  Report Common Equity Tier 1, Additional Tier 1 and Tier 2 capital.
                </p>

                <div className="flex justify-end">
                  <span className="text-blue-400 text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                    Start Report
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  </span>
                </div>
              </div>
            </div>

            {/* Capital Requirements */}
            <div
              onClick={() => startNewSession("capital-requirements")}
              className="group cursor-pointer rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 hover:bg-neutral-800 transition-all shadow-lg hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-4">
                  <span className="bg-emerald-900/30 text-emerald-400 text-xs px-2 py-1 rounded border border-emerald-900/50">Template C 07.00</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-emerald-300 transition-colors">
                  Capital Requirements
                </h3>
                <p className="text-sm text-neutral-400 mb-6 flex-1">
                  Report capital requirements for credit, market and operational risk.
                </p>

                <div className="flex justify-end">
                  <span className="text-emerald-400 text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                    Start Report
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

