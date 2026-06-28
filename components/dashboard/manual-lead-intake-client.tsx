"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

import { manualLeadSourceLabels, manualLeadSources, type ManualLeadSource } from "@/lib/manual-lead-sources";

type ManualLeadIntakeRecord = {
  id: string;
  source: ManualLeadSource;
  sourceLabel: string;
  sellerName: string;
  phone: string | null;
  email: string | null;
  socialHandle: string | null;
  propertyAddress: string | null;
  notes: string;
  intakeStatus: string;
  manualReviewStatus: string;
  createdAt: string;
  lead: {
    id: string;
    name: string;
    propertyAddress: string;
    source: string;
    status: string;
  } | null;
};

type ManualLeadIntakeForm = {
  source: ManualLeadSource;
  sellerName: string;
  phone: string;
  email: string;
  socialHandle: string;
  propertyAddress: string;
  city: string;
  state: string;
  zipCode: string;
  notes: string;
  captureContext: string;
  createLead: boolean;
};

const initialForm: ManualLeadIntakeForm = {
  source: "phone_call",
  sellerName: "",
  phone: "",
  email: "",
  socialHandle: "",
  propertyAddress: "",
  city: "",
  state: "OK",
  zipCode: "",
  notes: "",
  captureContext: "",
  createLead: true,
};

function formatStatus(value: string) {
  return value.replaceAll("_", " ");
}

function getStatusTone(status: string) {
  if (status === "lead_created" || status === "matched_existing_lead") return "border-emerald-200 bg-emerald-50 text-emerald-900";
  if (status === "needs_required_lead_fields") return "border-amber-200 bg-amber-50 text-amber-900";
  return "border-slate-200 bg-slate-50 text-slate-700";
}

export function ManualLeadIntakeClient() {
  const [form, setForm] = useState<ManualLeadIntakeForm>(initialForm);
  const [intakes, setIntakes] = useState<ManualLeadIntakeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canCreateLead = useMemo(() => Boolean(form.phone.trim() && form.propertyAddress.trim()), [form.phone, form.propertyAddress]);

  async function loadIntakes() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/leads/manual-intake", {
        cache: "no-store",
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error ?? "Unable to load manual lead intake records.");
      }

      setIntakes(data.intakes ?? []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load manual lead intake records.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadIntakes();
  }, []);

  function updateForm<K extends keyof ManualLeadIntakeForm>(key: K, value: ManualLeadIntakeForm[K]) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function submitIntake(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/leads/manual-intake", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error ?? "Check the manual intake fields and try again.");
      }

      setMessage(data.leadId ? "Manual source captured and linked to a lead for review." : "Manual source captured for review.");
      setForm(initialForm);
      await loadIntakes();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save manual lead intake.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="rounded-[1.5rem] border border-border bg-surface p-5 shadow-[0_18px_40px_rgba(17,37,52,0.05)] sm:p-6">
      <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="break-words text-xs font-bold uppercase tracking-[0.16em] text-muted">Phase 2G</p>
          <h2 className="break-words text-xl font-semibold text-primary">Lead Intake + Manual Source Capture</h2>
          <p className="max-w-3xl break-words text-sm leading-6 text-muted">
            Capture real inbound source context before analytics or publishing expands. Incomplete records stay in manual review
            instead of inventing property facts.
          </p>
        </div>
        <div className="flex max-w-full flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.08em]">
          <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-blue-950">manual only</span>
          <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-blue-950">no provider calls</span>
          <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-blue-950">source required</span>
        </div>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <form onSubmit={submitIntake} className="rounded-2xl border border-border bg-white p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-primary">
              Source
              <select
                value={form.source}
                onChange={(event) => updateForm("source", event.target.value as ManualLeadSource)}
                className="rounded-xl border border-border bg-white px-3 py-2 text-sm font-medium text-primary"
              >
                {manualLeadSources.map((source) => (
                  <option key={source} value={source}>
                    {manualLeadSourceLabels[source]}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm font-semibold text-primary">
              Seller / contact name
              <input
                value={form.sellerName}
                onChange={(event) => updateForm("sellerName", event.target.value)}
                className="rounded-xl border border-border px-3 py-2 text-sm font-medium text-primary"
                required
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-primary">
              Phone
              <input
                value={form.phone}
                onChange={(event) => updateForm("phone", event.target.value)}
                className="rounded-xl border border-border px-3 py-2 text-sm font-medium text-primary"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-primary">
              Email
              <input
                value={form.email}
                onChange={(event) => updateForm("email", event.target.value)}
                className="rounded-xl border border-border px-3 py-2 text-sm font-medium text-primary"
                type="email"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-primary">
              Social handle
              <input
                value={form.socialHandle}
                onChange={(event) => updateForm("socialHandle", event.target.value)}
                className="rounded-xl border border-border px-3 py-2 text-sm font-medium text-primary"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-primary">
              Property address
              <input
                value={form.propertyAddress}
                onChange={(event) => updateForm("propertyAddress", event.target.value)}
                className="rounded-xl border border-border px-3 py-2 text-sm font-medium text-primary"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-primary">
              City
              <input
                value={form.city}
                onChange={(event) => updateForm("city", event.target.value)}
                className="rounded-xl border border-border px-3 py-2 text-sm font-medium text-primary"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-[0.7fr_1fr]">
              <label className="grid gap-2 text-sm font-semibold text-primary">
                State
                <input
                  value={form.state}
                  onChange={(event) => updateForm("state", event.target.value.toUpperCase())}
                  className="rounded-xl border border-border px-3 py-2 text-sm font-medium text-primary"
                  maxLength={2}
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-primary">
                ZIP
                <input
                  value={form.zipCode}
                  onChange={(event) => updateForm("zipCode", event.target.value)}
                  className="rounded-xl border border-border px-3 py-2 text-sm font-medium text-primary"
                  maxLength={5}
                />
              </label>
            </div>
          </div>

          <label className="mt-4 grid gap-2 text-sm font-semibold text-primary">
            Manual notes
            <textarea
              value={form.notes}
              onChange={(event) => updateForm("notes", event.target.value)}
              className="min-h-28 rounded-xl border border-border px-3 py-2 text-sm font-medium text-primary"
              required
            />
          </label>

          <label className="mt-4 grid gap-2 text-sm font-semibold text-primary">
            Capture context
            <input
              value={form.captureContext}
              onChange={(event) => updateForm("captureContext", event.target.value)}
              className="rounded-xl border border-border px-3 py-2 text-sm font-medium text-primary"
              placeholder="Example: seller called after GBP post"
            />
          </label>

          <label className="mt-4 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-700">
            <input
              checked={form.createLead}
              onChange={(event) => updateForm("createLead", event.target.checked)}
              className="mt-1"
              type="checkbox"
            />
            <span>
              Create CRM lead when required fields are present. Requires phone and property address; otherwise the intake stays in review.
            </span>
          </label>

          {!canCreateLead && form.createLead ? (
            <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-medium leading-6 text-amber-900">
              Add phone and property address to create a CRM lead. The source capture can still be saved without them.
            </p>
          ) : null}

          {message ? <p className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-900">{message}</p> : null}
          {error ? <p className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-900">{error}</p> : null}

          <button
            type="submit"
            disabled={isSaving}
            className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Capture source"}
          </button>
        </form>

        <div className="rounded-2xl border border-border bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-primary">Recent manual intake</h3>
              <p className="mt-1 text-sm leading-6 text-muted">Latest source-labeled records awaiting review or linked to leads.</p>
            </div>
            <button
              type="button"
              onClick={() => void loadIntakes()}
              className="rounded-xl border border-border px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-primary"
            >
              Refresh
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {isLoading ? <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">Loading intake records...</p> : null}
            {!isLoading && intakes.length === 0 ? (
              <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">No manual source captures yet.</p>
            ) : null}
            {intakes.map((intake) => (
              <article key={intake.id} className="rounded-xl border border-border bg-slate-50 p-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-primary">{intake.sellerName}</p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.08em] text-muted">{intake.sourceLabel}</p>
                  </div>
                  <span className={`w-fit rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] ${getStatusTone(intake.intakeStatus)}`}>
                    {formatStatus(intake.intakeStatus)}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted">{intake.propertyAddress ?? "Property address pending manual capture."}</p>
                <p className="mt-1 text-sm leading-6 text-muted">
                  {[intake.phone, intake.email, intake.socialHandle].filter(Boolean).join(" / ") || "Contact detail pending."}
                </p>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-700">{intake.notes}</p>
                {intake.lead ? (
                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.08em] text-emerald-800">
                    Linked lead: {intake.lead.name} / {intake.lead.status}
                  </p>
                ) : (
                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.08em] text-amber-800">Manual review required before CRM lead work.</p>
                )}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
