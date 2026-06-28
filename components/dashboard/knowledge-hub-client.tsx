"use client";

import { useCallback, useEffect, useState } from "react";

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
    throw new Error("Unexpected non-JSON response.");
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

  return (
    <div className="space-y-6">
      {error ? <p className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}
      {message ? <p className="rounded-lg border border-emerald-100 bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">{message}</p> : null}

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
        <button disabled={saving} className="mt-4 inline-flex min-h-10 items-center justify-center rounded-full bg-[#d89a42] px-5 text-sm font-bold text-[#102437] disabled:opacity-70">
          {saving ? "Saving..." : "Save knowledge item"}
        </button>
      </form>

      <section className="rounded-lg border border-border bg-surface p-4">
        <h2 className="text-xl font-semibold text-primary">Internal knowledge records</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {items.length === 0 ? <p className="text-sm text-muted">No knowledge items saved yet.</p> : null}
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
