"use client";

import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { user, loading, isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="text-xl font-bold text-slate-800 hover:text-blue-600 transition-colors"
        >
          TradeBoard
        </Link>

        <div className="flex items-center gap-3">
          {!loading && isAuthenticated && (
            <Link
              href="/jobs/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Post a Job
            </Link>
          )}

          {!loading && !isAuthenticated && (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-slate-700 hover:text-blue-600"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Register
              </Link>
            </>
          )}

          {!loading && isAuthenticated && user && (
            <>
              <span className="text-sm text-gray-600 hidden sm:inline">
                Hi, {user.name}
              </span>
              <button
                type="button"
                onClick={logout}
                className="text-sm font-medium text-slate-700 hover:text-red-600"
              >
                Log out
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
