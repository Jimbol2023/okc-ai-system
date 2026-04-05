"use client";

import { useState } from "react";

import {
  generateResearchSummary,
  getSavedResearchSummaries,
  saveResearchSummary,
  type ResearchInput,
  type ResearchSummary
} from "@/lib/research-agent";

const initialInput: ResearchInput = {
  topic: "",
  county: "",
  city: "",
  zipCode: "",
  notes: ""
};

function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

export default function DashboardResearchPage() {
  const [input, setInput] = useState<ResearchInput>(initialInput);
  const [summaries, setSummaries] = useState<ResearchSummary[]>(() => getSavedResearchSummaries());
  const [selectedId, setSelectedId] = useState<string | null>(() => getSavedResearchSummaries()[0]?.id ?? null);

  const selectedSummary = summaries.find((summary) => summary.id === selectedId) ?? null;

  function updateField<Key extends keyof ResearchInput>(key: Key, value: ResearchInput[Key]) {
    setInput((current) => ({
      ...current,
      [key]: value
    }));
  }

  function handleGenerateSummary(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const summary = generateResearchSummary(input);
    const nextSummaries = saveResearchSummary(summary);

    setSummaries(nextSummaries);
    setSelectedId(summary.id);
    setInput(initialInput);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-primary">Research Agent</h1>
        <p className="max-w-3xl text-sm leading-6 text-muted md:text-base">
          Organize market, county, city, and ZIP-level research into structured internal opportunity summaries.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[1.5rem] border border-border bg-surface p-5 shadow-[0_18px_40px_rgba(17,37,52,0.05)] md:p-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-primary">Create Summary</h2>
            <p className="text-sm leading-6 text-muted">Enter a research topic, area, and any notes you want the starter agent to organize.</p>
          </div>

          <form onSubmit={handleGenerateSummary} className="mt-5 space-y-4">
            <Field label="Topic" value={input.topic} onChange={(value) => updateField("topic", value)} placeholder="Tax delinquent opportunities" />
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="County" value={input.county} onChange={(value) => updateField("county", value)} placeholder="Oklahoma" />
              <Field label="City" value={input.city} onChange={(value) => updateField("city", value)} placeholder="Oklahoma City" />
            </div>
            <Field label="ZIP Code" value={input.zipCode} onChange={(value) => updateField("zipCode", value)} placeholder="73119" />
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-primary">Manual Notes</span>
              <textarea
                value={input.notes}
                onChange={(event) => updateField("notes", event.target.value)}
                rows={7}
                className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground"
                placeholder="Paste county observations, market notes, neighborhood patterns, or seller signals here."
              />
            </label>

            <button
              type="submit"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#d89a42] px-5 py-2.5 text-sm font-bold text-[#102437] transition hover:bg-[#e5a64f]"
            >
              Generate Research Summary
            </button>
          </form>
        </section>

        <section className="rounded-[1.5rem] border border-border bg-surface p-5 shadow-[0_18px_40px_rgba(17,37,52,0.05)] md:p-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-primary">Saved Research</h2>
            <p className="text-sm leading-6 text-muted">Review prior research summaries and reuse them for sourcing and list-building decisions.</p>
          </div>

          {summaries.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-dashed border-border bg-white px-4 py-5 text-sm leading-6 text-muted">
              No research summaries saved yet.
            </div>
          ) : (
            <div className="mt-5 grid gap-5 lg:grid-cols-[280px_1fr]">
              <div className="space-y-3">
                {summaries.map((summary) => (
                  <button
                    key={summary.id}
                    type="button"
                    onClick={() => setSelectedId(summary.id)}
                    className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                      selectedId === summary.id ? "border-[#d89a42] bg-[#f7f3ea]" : "border-border bg-white hover:border-primary/20"
                    }`}
                  >
                    <p className="text-sm font-semibold text-primary">{summary.areaName}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted">{summary.topic || "General research"}</p>
                    <p className="mt-2 text-xs text-muted">{formatTimestamp(summary.createdAt)}</p>
                  </button>
                ))}
              </div>

              {selectedSummary ? (
                <div className="rounded-2xl border border-border bg-white px-4 py-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-primary">{selectedSummary.areaName}</h3>
                    <p className="text-sm text-muted">{formatTimestamp(selectedSummary.createdAt)}</p>
                  </div>

                  <div className="mt-5 space-y-5">
                    <SummarySection title="Opportunity Notes" items={selectedSummary.opportunityNotes} />
                    <SummarySection title="Possible Distress Signals" items={selectedSummary.possibleDistressSignals} />
                    <SummarySection title="Suggested Next Actions" items={selectedSummary.suggestedNextActions} />

                    <div className="rounded-2xl border border-border bg-[#f9fbfd] px-4 py-4">
                      <p className="text-sm font-semibold text-primary">Original Notes</p>
                      <p className="mt-2 text-sm leading-6 text-[#40576b]">
                        {selectedSummary.notes.trim() ? selectedSummary.notes : "No manual notes were provided."}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-primary">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground"
      />
    </label>
  );
}

function SummarySection({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-border bg-[#f9fbfd] px-4 py-4">
      <p className="text-sm font-semibold text-primary">{title}</p>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-[#40576b]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
