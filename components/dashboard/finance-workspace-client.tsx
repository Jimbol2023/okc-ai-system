"use client";

import { useCallback, useEffect, useState } from "react";

type FinanceEntry = {
  id: string;
  entryType: string;
  category: string;
  source: string;
  amountCents: number;
  entryDate: string;
  notes: string;
};

type FinanceKpis = {
  totalMarketingSpendCents: number;
  totalDealRevenueCents: number;
  totalDealExpenseCents: number;
  grossProfitCents: number;
  cashFlowCents: number;
  costPerLeadCents: number | null;
  costPerAcquisitionCents: number | null;
  grossProfitPerDealCents: number | null;
  missingData: string[];
};

type FinanceResponse = {
  ok: boolean;
  entries?: FinanceEntry[];
  kpis?: FinanceKpis;
  error?: string;
};

const entryTypes = [
  ["marketing_spend", "Marketing spend"],
  ["deal_revenue", "Deal revenue"],
  ["deal_expense", "Deal expense"],
  ["kpi_note", "KPI note"],
] as const;

const categories = [
  ["paid_ads", "Paid ads"],
  ["direct_mail", "Direct mail"],
  ["data", "Data"],
  ["software", "Software"],
  ["contractor", "Contractor"],
  ["closing", "Closing"],
  ["assignment_fee", "Assignment fee"],
  ["wholesale_revenue", "Wholesale revenue"],
  ["other", "Other"],
] as const;

function formatMoney(cents: number | null | undefined) {
  if (typeof cents !== "number") return "Unavailable";

  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(cents / 100);
}

async function readJsonResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    throw new Error("Unexpected non-JSON response.");
  }

  return response.json() as Promise<T>;
}

export function FinanceWorkspaceClient() {
  const [entries, setEntries] = useState<FinanceEntry[]>([]);
  const [kpis, setKpis] = useState<FinanceKpis | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const loadFinance = useCallback(async () => {
    const response = await fetch("/api/finance/entries", {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    const data = await readJsonResponse<FinanceResponse>(response);

    if (!response.ok || !data.ok) {
      throw new Error(data.error || "Unable to load finance workspace.");
    }

    setEntries(data.entries ?? []);
    setKpis(data.kpis ?? null);
  }, []);

  useEffect(() => {
    loadFinance().catch((err) => setError(err instanceof Error ? err.message : "Unable to load finance workspace."));
  }, [loadFinance]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      entryType: String(formData.get("entryType") ?? ""),
      category: String(formData.get("category") ?? ""),
      source: String(formData.get("source") ?? ""),
      amount: Number(formData.get("amount") ?? 0),
      entryDate: String(formData.get("entryDate") ?? ""),
      notes: String(formData.get("notes") ?? ""),
      leadId: String(formData.get("leadId") ?? ""),
      dealReference: String(formData.get("dealReference") ?? ""),
      assumption: String(formData.get("assumption") ?? ""),
    };

    try {
      const response = await fetch("/api/finance/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await readJsonResponse<FinanceResponse>(response);

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Unable to save finance entry.");
      }

      event.currentTarget.reset();
      setMessage("Finance entry saved. Metrics remain manual and advisory.");
      await loadFinance();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save finance entry.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {error ? <p className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}
      {message ? <p className="rounded-lg border border-emerald-100 bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">{message}</p> : null}

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Marketing spend" value={formatMoney(kpis?.totalMarketingSpendCents)} />
        <Kpi label="Cost per lead" value={formatMoney(kpis?.costPerLeadCents)} />
        <Kpi label="Gross profit" value={formatMoney(kpis?.grossProfitCents)} />
        <Kpi label="Cash flow" value={formatMoney(kpis?.cashFlowCents)} />
      </div>

      <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-surface p-4">
        <h2 className="text-xl font-semibold text-primary">Add manual finance entry</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Field label="Source" name="source" placeholder="website, google_ads, direct_mail" required />
          <Field label="Amount" name="amount" type="number" min="0" step="0.01" required />
          <Select label="Entry type" name="entryType" options={entryTypes} />
          <Select label="Category" name="category" options={categories} />
          <Field label="Date" name="entryDate" type="date" required />
          <Field label="Lead ID" name="leadId" placeholder="Optional stored lead ID" />
          <Field label="Deal reference" name="dealReference" placeholder="Optional manual deal label" />
          <Field label="Assumption" name="assumption" placeholder="Label manual assumptions clearly" />
        </div>
        <label className="mt-4 block">
          <span className="mb-2 block text-sm font-medium text-primary">Notes</span>
          <textarea name="notes" required rows={4} className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm" />
        </label>
        <button disabled={saving} className="mt-4 inline-flex min-h-10 items-center justify-center rounded-full bg-[#d89a42] px-5 text-sm font-bold text-[#102437] disabled:opacity-70">
          {saving ? "Saving..." : "Save finance entry"}
        </button>
      </form>

      <section className="rounded-lg border border-border bg-surface p-4">
        <h2 className="text-xl font-semibold text-primary">Recent finance entries</h2>
        <div className="mt-3 grid gap-3">
          {entries.length === 0 ? <p className="text-sm text-muted">No finance entries recorded yet.</p> : null}
          {entries.slice(0, 8).map((entry) => (
            <article key={entry.id} className="rounded-lg border border-border bg-white p-3">
              <p className="break-words text-sm font-semibold text-primary">{entry.entryType.replaceAll("_", " ")} - {formatMoney(entry.amountCents)}</p>
              <p className="break-words text-sm leading-6 text-muted">{entry.source} / {entry.category.replaceAll("_", " ")}</p>
              <p className="break-words text-sm leading-6 text-muted">{entry.notes}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">{label}</p>
      <p className="mt-2 break-words text-2xl font-semibold text-primary">{value}</p>
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
