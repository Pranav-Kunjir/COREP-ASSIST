import {
  useConvexAuth,
} from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";

export default function SignOutButton() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();

  if (!isAuthenticated) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-full shadow-lg transition-all border border-neutral-700 group relative"
        onClick={() => void signOut()}
        title="Sign out"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-neutral-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-neutral-800">
          Sign out
        </span>
      </button>
    </div>
  );
}