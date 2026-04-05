"use client";

import type { Route } from "next";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setIsPending(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });
      const result = (await response.json()) as {
        ok: boolean;
        error?: string;
      };

      if (!response.ok || !result.ok) {
        setFormError(result.error ?? "Unable to sign in.");
        return;
      }

      router.push(nextPath as Route);
      router.refresh();
    } catch {
      setFormError("Unable to sign in right now.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[1.75rem] border border-border bg-surface p-6 shadow-[0_18px_50px_rgba(18,32,42,0.08)]"
    >
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">Admin Access</p>
        <h1 className="text-3xl font-semibold text-primary">Sign in</h1>
        <p className="text-sm leading-6 text-muted">Use the admin email and password configured for this environment.</p>
      </div>

      <div className="mt-6 space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-primary">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground"
            autoComplete="email"
            required
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-primary">Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground"
            autoComplete="current-password"
            required
          />
        </label>
      </div>

      {formError ? <p className="mt-4 text-sm text-red-700">{formError}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#d89a42] px-6 py-3 text-sm font-bold text-[#102437] shadow-[0_16px_35px_rgba(216,154,66,0.28)] transition hover:bg-[#e5a64f] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
