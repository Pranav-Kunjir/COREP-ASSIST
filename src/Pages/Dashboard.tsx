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
    <div className="flex min-h-screen bg-gray-50">
      {/* LEFT: Sidebar */}
      <Sidebar />

      {/* RIGHT: Main content */}
      <main className="flex-1 py-12 px-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-lg text-gray-600 mb-10">
            Select a COREP template to start a reporting session
          </p>

          <h2 className="text-2xl font-semibold mb-6">
            Available Templates
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Own Funds */}
            <div
              onClick={() => startNewSession("own-funds")}
              className="cursor-pointer rounded-lg border bg-white p-6 shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold mb-1">
                Own Funds
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                COREP Template C 01.00
              </p>
              <p className="text-sm text-gray-700">
                Report Common Equity Tier 1, Additional Tier 1 and Tier 2 capital.
              </p>
            </div>

            {/* Capital Requirements */}
            <div
              onClick={() => startNewSession("capital-requirements")}
              className="cursor-pointer rounded-lg border bg-white p-6 shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold mb-1">
                Capital Requirements
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                COREP Template C 07.00
              </p>
              <p className="text-sm text-gray-700">
                Report capital requirements for credit, market and operational risk.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
