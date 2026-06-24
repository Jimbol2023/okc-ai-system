"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard route failed:", error);
  }, [error]);

  return (
    <div className="rounded-[1.5rem] border border-red-200 bg-red-50 p-5 text-red-950 sm:p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-red-800">Dashboard recovery</p>
      <h1 className="mt-2 text-2xl font-semibold">The dashboard could not finish loading.</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6">
        The app kept this failure inside the dashboard route. No outreach, automation, provider call, lead mutation, or
        assignment was executed.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#d89a42] px-5 py-2.5 text-sm font-bold text-[#102437] transition hover:bg-[#e5a64f]"
        >
          Reload dashboard
        </button>
        <Link
          href="/login?next=%2Fdashboard"
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-red-200 bg-white px-5 py-2.5 text-sm font-semibold text-red-950 transition hover:border-red-300"
        >
          Return to login
        </Link>
      </div>
      {error.digest ? <p className="mt-4 text-xs font-semibold text-red-800">Error digest: {error.digest}</p> : null}
    </div>
  );
}
