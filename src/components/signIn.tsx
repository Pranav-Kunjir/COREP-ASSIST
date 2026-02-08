import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { createPortal } from "react-dom";

export function SignIn() {
  const { signIn } = useAuthActions();
  const [isOpen, setIsOpen] = useState(false);
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <button
        className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors shadow-lg shadow-blue-900/20 text-sm"
        onClick={() => setIsOpen(true)}
      >
        Sign In
      </button>

      {isOpen &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
              className="w-full max-w-sm bg-neutral-900/90 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 ring-1 ring-white/10"
              role="dialog"
              aria-modal="true"
            >
              <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-neutral-950/50">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {flow === "signIn" ? "Welcome Back" : "Create Account"}
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-neutral-400 hover:text-white transition-colors p-1 hover:bg-neutral-800 rounded-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-6">
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target as HTMLFormElement);
                    formData.set("flow", flow);
                    void signIn("password", formData).catch((error) => {
                      setError(error.message);
                    });
                  }}
                >
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                        Email
                      </label>
                      <input
                        className="w-full bg-neutral-950 text-white rounded-lg px-4 py-2.5 border border-neutral-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-neutral-600"
                        type="email"
                        name="email"
                        placeholder="name@example.com"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                        Password
                      </label>
                      <input
                        className="w-full bg-neutral-950 text-white rounded-lg px-4 py-2.5 border border-neutral-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-neutral-600"
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-xs flex gap-2 items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="shrink-0 mt-0.5"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                      {error}
                    </div>
                  )}

                  <button
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium py-2.5 rounded-lg transition-all shadow-lg shadow-blue-500/20 border border-blue-500/50"
                    type="submit"
                  >
                    {flow === "signIn" ? "Sign In" : "Sign Up"}
                  </button>
                </form>
              </div>

              <div className="p-4 bg-neutral-950/30 border-t border-neutral-800 text-center text-sm text-neutral-400">
                {flow === "signIn" ? (
                  <>
                    Don't have an account?{" "}
                    <button
                      onClick={() => setFlow("signUp")}
                      className="text-white hover:underline decoration-blue-500 underline-offset-4 font-medium transition-colors"
                    >
                      Create one
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      onClick={() => setFlow("signIn")}
                      className="text-white hover:underline decoration-blue-500 underline-offset-4 font-medium transition-colors"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
