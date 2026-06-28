"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { Command, Search, X } from "lucide-react";

import { filterDashboardNavigationItems } from "@/lib/dashboard-navigation";

type GlobalSearchResult = {
  id: string;
  title: string;
  subtitle: string;
  sourceType: string;
  href: string;
  score: number;
  matchReasons: string[];
  providerCalled: false;
  generatedPropertyFacts: false;
};

type GlobalSearchResponse = {
  ok: boolean;
  results?: GlobalSearchResult[];
  error?: string;
  providerCalled?: boolean;
  outreachSent?: boolean;
  generatedPropertyFacts?: boolean;
};

async function readJsonResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    throw new Error("Unexpected non-JSON response.");
  }

  return response.json() as Promise<T>;
}

export function CommandPaletteClient() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GlobalSearchResult[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fallbackResults = useMemo(
    () =>
      filterDashboardNavigationItems(query || "dashboard").map((item): GlobalSearchResult => ({
        id: `navigation:${item.href}`,
        title: item.label,
        subtitle: item.href,
        sourceType: "navigation",
        href: item.href,
        score: 1,
        matchReasons: ["Matched navigation"],
        providerCalled: false,
        generatedPropertyFacts: false,
      })),
    [query],
  );
  const visibleResults = query.trim().length >= 2 ? results : fallbackResults;

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }

      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      window.setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  useEffect(() => {
    const normalizedQuery = query.trim();

    if (normalizedQuery.length < 2) {
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      setLoading(true);
      fetch(`/api/global-search?q=${encodeURIComponent(normalizedQuery)}`, {
        cache: "no-store",
        headers: { Accept: "application/json" },
        signal: controller.signal,
      })
        .then((response) => readJsonResponse<GlobalSearchResponse>(response).then((data) => ({ response, data })))
        .then(({ response, data }) => {
          if (!response.ok || !data.ok) {
            throw new Error(data.error || "Unable to search internal records.");
          }

          setResults(data.results ?? []);
          setError("");
        })
        .catch((err) => {
          if (err instanceof DOMException && err.name === "AbortError") return;
          setResults([]);
          setError(err instanceof Error ? err.message : "Unable to search internal records.");
        })
        .finally(() => setLoading(false));
    }, 180);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  function selectResult(result: GlobalSearchResult | undefined) {
    if (!result) return;

    setOpen(false);
    setQuery("");
    router.push(result.href as Route);
  }

  function updateQuery(value: string) {
    setQuery(value);
    setActiveIndex(0);

    if (value.trim().length < 2) {
      setResults([]);
      setError("");
      setLoading(false);
    }
  }

  function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => Math.min(current + 1, Math.max(visibleResults.length - 1, 0)));
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => Math.max(current - 1, 0));
    }

    if (event.key === "Enter") {
      event.preventDefault();
      selectResult(visibleResults[activeIndex]);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-40 inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-bold text-primary shadow-lg transition hover:border-primary/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <Command className="h-4 w-4" aria-hidden="true" />
        Command
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 bg-primary/40 p-3 backdrop-blur-sm" role="presentation" onMouseDown={() => setOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="mx-auto mt-12 w-full max-w-2xl rounded-lg border border-border bg-white p-3 shadow-2xl"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-2 rounded-lg border border-border bg-slate-50 px-3">
              <Search className="h-4 w-4 text-muted" aria-hidden="true" />
              <label className="sr-only" htmlFor="dashboard-command-search">Search dashboard records and navigation</label>
              <input
                id="dashboard-command-search"
                ref={inputRef}
                value={query}
                onChange={(event) => updateQuery(event.target.value)}
                onKeyDown={handleInputKeyDown}
                className="min-h-12 flex-1 bg-transparent text-sm text-primary outline-none"
                placeholder="Search leads, properties, knowledge, marketing, or navigation..."
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-2 text-muted transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                aria-label="Close command palette"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-2 flex flex-wrap gap-2 px-1 text-[11px] font-bold uppercase tracking-[0.08em]">
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-emerald-900">internal search</span>
              <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-1 text-blue-900">providerCalled:false</span>
              <span className="rounded-full border border-red-200 bg-red-50 px-2 py-1 text-red-800">generatedFacts:false</span>
            </div>

            {error ? <p className="mt-3 rounded-lg border border-red-100 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}
            {loading ? <p className="mt-3 text-sm text-muted">Searching internal records...</p> : null}

            <div className="mt-3 max-h-[60vh] overflow-y-auto">
              {visibleResults.length === 0 && !loading ? <p className="p-3 text-sm text-muted">No internal records matched that search.</p> : null}
              {visibleResults.map((result, index) => (
                <button
                  key={result.id}
                  type="button"
                  onClick={() => selectResult(result)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`block w-full rounded-lg p-3 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                    activeIndex === index ? "bg-primary text-white" : "text-primary hover:bg-slate-50"
                  }`}
                >
                  <span className="block break-words text-sm font-semibold">{result.title}</span>
                  <span className={`mt-1 block break-words text-xs ${activeIndex === index ? "text-white/75" : "text-muted"}`}>
                    {result.sourceType} / {result.subtitle}
                  </span>
                </button>
              ))}
            </div>

            <p className="mt-3 px-1 text-xs leading-5 text-muted">Use Ctrl+K, arrow keys, Enter, and Escape. Search is internal-only and advisory.</p>
          </div>
        </div>
      ) : null}
    </>
  );
}
