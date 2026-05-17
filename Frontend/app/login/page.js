"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth, getErrorMessage } from "../../contexts/AuthContext";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      const redirect = searchParams.get("redirect") || "/";
      router.replace(redirect);
    }
  }, [authLoading, isAuthenticated, router, searchParams]);

  if (authLoading || isAuthenticated) {
    return <p className="text-slate-600">Redirecting...</p>;
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(form);
      const redirect = searchParams.get("redirect") || "/";
      router.push(redirect);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold text-slate-900">Log in</h1>
      <p className="mt-1 text-slate-600">
        Sign in to post jobs and update their status.
      </p>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-6 bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4"
      >
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            className="field-input"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={form.password}
            onChange={handleChange}
            className="field-input"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Log in"}
        </button>
      </form>

      <p className="mt-4 text-sm text-slate-600">
        No account?{" "}
        <Link href="/register" className="text-blue-600 hover:text-blue-800 font-medium">
          Register
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="max-w-md text-slate-600">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
