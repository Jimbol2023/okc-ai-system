"use client";

import { useCallback, useEffect, useState } from "react";

import { ActionButton, DashboardCard, EmptyState, ErrorState, SafetyBadge } from "@/components/dashboard/dashboard-ui";

type KnowledgeItem = {
  id: string;
  title: string;
  category: string;
  content: string;
  tags: string[] | unknown;
  status: string;
  source: string;
};

type KnowledgeDocReference = {
  title: string;
  category: string;
  path: string;
  summary: string;
};

type KnowledgeResponse = {
  ok: boolean;
  items?: KnowledgeItem[];
  docReferences?: KnowledgeDocReference[];
  error?: string;
};

type KnowledgeSearchResult = {
  title: string;
  category: string;
  sourceType: "knowledge_item" | "doc_reference";
  sourceId: string;
  snippet: string;
  score: number;
  href: "/dashboard/knowledge";
  providerCalled: boolean;
  semanticSearchUsed: boolean;
  matchReasons: string[];
};

type KnowledgeSearchResponse = {
  ok: boolean;
  query?: string;
  results?: KnowledgeSearchResult[];
  providerCalled?: boolean;
  semanticSearchUsed?: boolean;
  semanticSearchReason?: string;
  error?: string;
};

const categories = [
  ["sop", "SOP"],
  ["sales_script", "Sales script"],
  ["marketing_template", "Marketing template"],
  ["ai_prompt", "AI prompt"],
  ["oklahoma_guidance", "Oklahoma guidance"],
  ["lesson_learned", "Lesson learned"],
] as const;

const statuses = [
  ["draft", "Draft"],
  ["active", "Active"],
  ["archived", "Archived"],
] as const;

async function readJsonResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    const body = await response.text().catch(() => "");
    const preview = body.replace(/\s+/g, " ").trim().slice(0, 140);

    throw new Error(
      `Unexpected non-JSON response from ${response.url || "knowledge API"} (${response.status}, ${contentType || "no content-type"}).${preview ? ` ${preview}` : ""}`,
    );
  }

  return response.json() as Promise<T>;
}

function formatLabel(value: string) {
  return value.replaceAll("_", " ");
}

export function KnowledgeHubClient() {
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [docReferences, setDocReferences] = useState<KnowledgeDocReference[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<KnowledgeSearchResult[]>([]);
  const [searchMessage, setSearchMessage] = useState("");
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [searchProviderCalled, setSearchProviderCalled] = useState(false);
  const [semanticSearchUsed, setSemanticSearchUsed] = useState(false);

  const loadKnowledge = useCallback(async () => {
    const response = await fetch("/api/knowledge/items", {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    const data = await readJsonResponse<KnowledgeResponse>(response);

    if (!response.ok || !data.ok) {
      throw new Error(data.error || "Unable to load knowledge hub.");
    }

    setItems(data.items ?? []);
    setDocReferences(data.docReferences ?? []);
  }, []);

  useEffect(() => {
    loadKnowledge().catch((err) => setError(err instanceof Error ? err.message : "Unable to load knowledge hub."));
  }, [loadKnowledge]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const tags = String(formData.get("tags") ?? "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    const payload = {
      title: String(formData.get("title") ?? ""),
      category: String(formData.get("category") ?? ""),
      content: String(formData.get("content") ?? ""),
      tags,
      status: String(formData.get("status") ?? "draft"),
      source: "manual",
    };

    try {
      const response = await fetch("/api/knowledge/items", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await readJsonResponse<KnowledgeResponse>(response);

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Unable to save knowledge item.");
      }

      event.currentTarget.reset();
      setMessage("Knowledge item saved. Keep legal, tax, and property claims human-reviewed.");
      await loadKnowledge();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save knowledge item.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = searchQuery.trim();

    if (query.length < 2) {
      setSearchMessage("Search query must be at least 2 characters.");
      setSearchResults([]);
      setSearched(true);
      return;
    }

    setSearching(true);
    setSearchMessage("");
    setError("");

    try {
      const response = await fetch(`/api/knowledge/search?q=${encodeURIComponent(query)}`, {
        cache: "no-store",
        headers: { Accept: "application/json" },
      });
      const data = await readJsonResponse<KnowledgeSearchResponse>(response);

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Unable to search internal knowledge.");
      }

      setSearchResults(data.results ?? []);
      setSearchProviderCalled(data.providerCalled === true);
      setSemanticSearchUsed(data.semanticSearchUsed === true);
      setSearchMessage(data.semanticSearchReason ? formatLabel(data.semanticSearchReason) : "");
      setSearched(true);
    } catch (err) {
      setSearchResults([]);
      setSearchProviderCalled(false);
      setSemanticSearchUsed(false);
      setSearchMessage(err instanceof Error ? err.message : "Unable to search internal knowledge.");
      setSearched(true);
    } finally {
      setSearching(false);
    }
  }

  return (
    <div className="space-y-6">
      {error ? <ErrorState message={error} /> : null}
      {message ? <p className="rounded-lg border border-emerald-100 bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">{message}</p> : null}

      <DashboardCard>
        <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">Internal Search Engine</p>
            <h2 className="mt-1 break-words text-xl font-semibold text-primary">Search Knowledge Hub</h2>
            <p className="mt-2 max-w-3xl break-words text-sm leading-6 text-muted">
              Search SOPs, templates, Oklahoma guidance, documentation references, and internal notes. Results only use stored knowledge records and known documentation references.
            </p>
          </div>
          <div className="flex max-w-full flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.08em]">
            <SafetyBadge tone="good">internal search</SafetyBadge>
            <SafetyBadge>providerCalled:{String(searchProviderCalled)}</SafetyBadge>
            <SafetyBadge tone="missing">semantic:{String(semanticSearchUsed)}</SafetyBadge>
            <SafetyBadge tone="urgent">generatedFacts:false</SafetyBadge>
          </div>
        </div>

        <form onSubmit={handleSearch} className="mt-4 flex min-w-0 flex-col gap-3 sm:flex-row">
          <label className="min-w-0 flex-1">
            <span className="sr-only">Search knowledge</span>
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="min-h-11 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-primary"
              placeholder="Search probate, offer checklist, follow-up, marketing..."
            />
          </label>
          <ActionButton type="submit" disabled={searching} className="min-h-11 px-5">
            {searching ? "Searching..." : "Search"}
          </ActionButton>
        </form>

        {searchMessage ? <p className="mt-3 break-words text-sm leading-6 text-muted">{searchMessage}</p> : null}

        {searched ? (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {searchResults.length === 0 ? (
              <EmptyState title={`No internal knowledge matched ${searchQuery.trim() || "that search"}.`} detail="Only saved Knowledge Hub records and known documentation references are searched." />
            ) : null}
            {searchResults.map((result) => (
              <article key={`${result.sourceType}-${result.sourceId}`} className="rounded-lg border border-border bg-white p-4">
                <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="break-words text-sm font-semibold text-primary">{result.title}</p>
                    <p className="mt-1 break-words text-xs font-bold uppercase tracking-[0.08em] text-muted">
                      {formatLabel(result.category)} / {formatLabel(result.sourceType)}
                    </p>
                  </div>
                  <span className="w-fit shrink-0 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-bold text-slate-700">
                    score {result.score}
                  </span>
                </div>
                <p className="mt-3 break-words text-sm leading-6 text-muted">{result.snippet}</p>
                {result.matchReasons.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {result.matchReasons.map((reason) => (
                      <span key={reason} className="rounded-full border border-blue-100 bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-900">
                        {reason}
                      </span>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        ) : null}
      </DashboardCard>

      <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-surface p-4">
        <h2 className="text-xl font-semibold text-primary">Add knowledge item</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Field label="Title" name="title" required />
          <Field label="Tags" name="tags" placeholder="probate, seller-call, okc" />
          <Select label="Category" name="category" options={categories} />
          <Select label="Status" name="status" options={statuses} />
        </div>
        <label className="mt-4 block">
          <span className="mb-2 block text-sm font-medium text-primary">Content</span>
          <textarea name="content" required rows={7} className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm" placeholder="Internal SOP, script, prompt, template, Oklahoma guidance, or lesson learned." />
        </label>
        <ActionButton type="submit" disabled={saving} className="mt-4 bg-[#d89a42] text-[#102437] hover:bg-[#c4852d]">
          {saving ? "Saving..." : "Save knowledge item"}
        </ActionButton>
      </form>

      <section className="rounded-lg border border-border bg-surface p-4">
        <h2 className="text-xl font-semibold text-primary">Internal knowledge records</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {items.length === 0 ? <EmptyState title="No knowledge items saved yet." detail="Add SOPs, scripts, templates, prompts, guidance, or lessons learned manually." /> : null}
          {items.map((item) => (
            <article key={item.id} className="rounded-lg border border-border bg-white p-4">
              <p className="break-words text-sm font-semibold text-primary">{item.title}</p>
              <p className="mt-1 break-words text-xs font-bold uppercase tracking-[0.08em] text-muted">{formatLabel(item.category)} / {item.status}</p>
              <p className="mt-2 line-clamp-4 break-words text-sm leading-6 text-muted">{item.content}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-border bg-surface p-4">
        <h2 className="text-xl font-semibold text-primary">Existing documentation index</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {docReferences.length === 0 ? <EmptyState title="No documentation references are indexed." /> : null}
          {docReferences.map((doc) => (
            <article key={doc.path} className="rounded-lg border border-border bg-white p-4">
              <p className="break-words text-sm font-semibold text-primary">{doc.title}</p>
              <p className="mt-1 break-all text-xs font-bold uppercase tracking-[0.08em] text-muted">{doc.path}</p>
              <p className="mt-2 break-words text-sm leading-6 text-muted">{doc.summary}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string }) {
  const { label, ...inputProps } = props;

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-primary">{label}</span>
      <input {...inputProps} className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm" />
    </label>
  );
}

function Select({ label, name, options }: { label: string; name: string; options: readonly (readonly [string, string])[] }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-primary">{label}</span>
      <select name={name} className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm">
        {options.map(([value, optionLabel]) => (
          <option key={value} value={value}>{optionLabel}</option>
        ))}
      </select>
    </label>
  );
}
