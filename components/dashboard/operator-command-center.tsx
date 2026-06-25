"use client";

import { Component, useMemo, useState, useSyncExternalStore, type ErrorInfo, type FormEvent, type ReactNode } from "react";
import { BarChart3, LineChart, PhoneCall, PlayCircle, TrendingUp } from "lucide-react";

import {
  createOperatorCommandCenterModel,
  readOperatorAnalyticsSnapshots,
  saveOperatorAnalyticsSnapshots,
  subscribeToOperatorAnalyticsSnapshots,
  validateOperatorAnalyticsSnapshotDraft,
  type OperatorAnalyticsSnapshot,
  type OperatorAnalyticsSnapshotDraft,
  type OperatorCommandCenterModel,
  type TrendPoint,
} from "@/lib/operator-command-center-analytics";
import type { StoredLead } from "@/lib/leads-storage";

type OperatorCommandCenterProps = {
  leads: StoredLead[];
  isLoadingLeads: boolean;
};

const emptyDraft: OperatorAnalyticsSnapshotDraft = {
  snapshotDate: "",
  websiteSessions: 0,
  ga4Conversions: 0,
  gbpCalls: 0,
  contactFormSubmissions: 0,
  youtubeViews: 0,
  youtubeEngagement: 0,
  topEducationalPagesText: "",
};

const emptyModel: OperatorCommandCenterModel = {
  sourceTrends: [],
  websiteSessionsTrend: [],
  ga4ConversionsTrend: [],
  gbpCallsTrend: [],
  contactFormTrend: [],
  youtubeViewsTrend: [],
  youtubeEngagementTrend: [],
  topEducationalPages: [],
  latestSnapshot: null,
  snapshotCount: 0,
};

class OperatorCommandCenterSectionBoundary extends Component<
  { children: ReactNode; label: string },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Operator command center section failed:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <article className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          <p className="font-bold">{this.props.label} unavailable</p>
          <p className="mt-1">
            This section could not render from the current dashboard data. The dashboard stayed read-only and no outreach,
            provider call, assignment, reminder, or CRM mutation was executed.
          </p>
        </article>
      );
    }

    return this.props.children;
  }
}

function sum(points: TrendPoint[]) {
  return points.reduce((total, point) => total + point.value, 0);
}

function maxValue(points: TrendPoint[]) {
  return Math.max(...points.map((point) => point.value), 0);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function getTrendLinePath(points: TrendPoint[]) {
  if (points.length === 0) {
    return "";
  }

  const max = Math.max(maxValue(points), 1);
  const width = 180;
  const height = 56;
  const step = points.length > 1 ? width / (points.length - 1) : width;

  return points
    .map((point, index) => {
      const x = index * step;
      const y = height - (point.value / max) * height;

      return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

function MiniTrendChart({ points, label }: { points: TrendPoint[]; label: string }) {
  const path = getTrendLinePath(points);

  if (!path) {
    return <p className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3 text-xs leading-5 text-muted">No {label.toLowerCase()} snapshots yet.</p>;
  }

  return (
    <div className="mt-4">
      <svg viewBox="0 0 180 64" role="img" aria-label={`${label} trend`} className="h-16 w-full overflow-visible">
        <path d={path} fill="none" stroke="#0f4c81" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((point, index) => {
          const max = Math.max(maxValue(points), 1);
          const x = points.length > 1 ? (index * 180) / (points.length - 1) : 90;
          const y = 56 - (point.value / max) * 56;

          return <circle key={`${point.label}-${index}`} cx={x} cy={y} r="3.5" fill="#d89a42" />;
        })}
      </svg>
      <div className="mt-2 flex justify-between gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-muted">
        {points.slice(-4).map((point) => (
          <span key={point.label}>{point.label}</span>
        ))}
      </div>
    </div>
  );
}

function CommandMetricCard({
  label,
  value,
  helper,
  points,
  icon: Icon,
}: {
  label: string;
  value: number;
  helper: string;
  points: TrendPoint[];
  icon: typeof TrendingUp;
}) {
  return (
    <article className="rounded-2xl border border-border bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">{label}</p>
          <p className="mt-2 text-3xl font-semibold text-primary">{formatNumber(value)}</p>
        </div>
        <span className="rounded-xl border border-blue-100 bg-blue-50 p-2 text-primary">
          <Icon aria-hidden className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-2 text-sm leading-5 text-muted">{helper}</p>
      <MiniTrendChart points={points} label={label} />
    </article>
  );
}

function SourceTrendPanel({ model }: { model: ReturnType<typeof createOperatorCommandCenterModel> }) {
  const max = Math.max(...model.sourceTrends.map((row) => row.total), 1);

  return (
    <section className="rounded-2xl border border-border bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Leads by source</p>
          <h3 className="mt-1 text-lg font-semibold text-primary">Source trend</h3>
        </div>
        <BarChart3 aria-hidden className="h-5 w-5 text-primary" />
      </div>

      {model.sourceTrends.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-muted">
          No lead source trend is visible yet. New, imported, or generated leads with source labels will populate this chart.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {model.sourceTrends.map((row) => (
            <div key={row.source}>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-semibold text-primary">{row.sourceLabel}</span>
                <span className="text-muted">{row.total}</span>
              </div>
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-[#0f4c81]" style={{ width: `${Math.max(5, (row.total / max) * 100)}%` }} />
              </div>
              <div className="mt-2 grid grid-cols-6 gap-1">
                {row.points.map((point) => (
                  <div key={`${row.source}-${point.label}`} className="flex min-h-10 flex-col justify-end rounded bg-slate-50 px-1">
                    <div
                      className="rounded-t bg-[#d89a42]"
                      style={{ height: `${Math.max(4, (point.value / Math.max(...row.points.map((p) => p.value), 1)) * 32)}px` }}
                      title={`${point.label}: ${point.value}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function TopPagesPanel({ model }: { model: ReturnType<typeof createOperatorCommandCenterModel> }) {
  const max = Math.max(...model.topEducationalPages.map((page) => page.views), 1);

  return (
    <section className="rounded-2xl border border-border bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Education content</p>
          <h3 className="mt-1 text-lg font-semibold text-primary">Top educational pages</h3>
        </div>
        <LineChart aria-hidden className="h-5 w-5 text-primary" />
      </div>

      {model.topEducationalPages.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-muted">
          Add snapshot rows like &quot;Probate Basics|/resources/education/probate-basics-oklahoma-property-owners|42&quot; to rank education pages.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {model.topEducationalPages.map((page) => (
            <div key={page.path}>
              <div className="flex items-start justify-between gap-3 text-sm">
                <div className="min-w-0">
                  <p className="break-words font-semibold text-primary">{page.title}</p>
                  <p className="break-words text-xs text-muted">{page.path}</p>
                </div>
                <span className="shrink-0 font-semibold text-primary">{formatNumber(page.views)}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-[#d89a42]" style={{ width: `${Math.max(5, (page.views / max) * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function SnapshotForm({
  onAddSnapshot,
}: {
  onAddSnapshot: (snapshot: OperatorAnalyticsSnapshot) => void;
}) {
  const [draft, setDraft] = useState<OperatorAnalyticsSnapshotDraft>(emptyDraft);
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  function updateNumber(field: keyof Omit<OperatorAnalyticsSnapshotDraft, "snapshotDate" | "topEducationalPagesText">, value: string) {
    setDraft((current) => ({
      ...current,
      [field]: value === "" ? 0 : Number(value),
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = validateOperatorAnalyticsSnapshotDraft(draft);

    if (!result.valid || !result.snapshot) {
      setErrors(result.errors);
      setMessage(null);
      return;
    }

    onAddSnapshot(result.snapshot);
    setDraft(emptyDraft);
    setErrors([]);
    setMessage("Snapshot saved locally for dashboard trend review.");
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Manual snapshot</p>
          <h3 className="mt-1 text-lg font-semibold text-primary">Add channel metrics</h3>
        </div>
        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-emerald-800">
          Local only
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <label className="text-sm font-semibold text-primary">
          Snapshot date
          <input
            type="date"
            value={draft.snapshotDate}
            onChange={(event) => setDraft((current) => ({ ...current, snapshotDate: event.target.value }))}
            className="mt-1 min-h-11 w-full rounded-md border border-border bg-white px-3 text-sm text-primary"
            required
          />
        </label>
        <NumberField label="Website sessions" value={draft.websiteSessions} onChange={(value) => updateNumber("websiteSessions", value)} />
        <NumberField label="GA4 conversions" value={draft.ga4Conversions} onChange={(value) => updateNumber("ga4Conversions", value)} />
        <NumberField label="GBP calls" value={draft.gbpCalls} onChange={(value) => updateNumber("gbpCalls", value)} />
        <NumberField label="Contact forms" value={draft.contactFormSubmissions} onChange={(value) => updateNumber("contactFormSubmissions", value)} />
        <NumberField label="YouTube views" value={draft.youtubeViews} onChange={(value) => updateNumber("youtubeViews", value)} />
        <NumberField label="YouTube engagement" value={draft.youtubeEngagement} onChange={(value) => updateNumber("youtubeEngagement", value)} />
      </div>

      <label className="mt-3 block text-sm font-semibold text-primary">
        Top educational pages
        <textarea
          value={draft.topEducationalPagesText}
          onChange={(event) => setDraft((current) => ({ ...current, topEducationalPagesText: event.target.value }))}
          rows={3}
          placeholder="Probate Basics|/resources/education/probate-basics-oklahoma-property-owners|42"
          className="mt-1 w-full rounded-md border border-border bg-white px-3 py-2 text-sm leading-6 text-primary"
        />
      </label>

      {errors.length > 0 ? (
        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-800">
          {errors.join(" ")}
        </div>
      ) : null}
      {message ? <p className="mt-3 text-sm font-semibold text-emerald-800">{message}</p> : null}

      <button
        type="submit"
        className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#12324e]"
      >
        Save Snapshot
      </button>
      <p className="mt-3 text-xs font-semibold uppercase leading-5 tracking-[0.1em] text-muted">
        readOnly:true externalApiCalled:false providerCalled:false crmMutation:false outreachCreated:false
      </p>
    </form>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: string) => void }) {
  return (
    <label className="text-sm font-semibold text-primary">
      {label}
      <input
        type="number"
        min="0"
        step="1"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 min-h-11 w-full rounded-md border border-border bg-white px-3 text-sm text-primary"
      />
    </label>
  );
}

export function OperatorCommandCenter({ leads, isLoadingLeads }: OperatorCommandCenterProps) {
  const snapshots = useSyncExternalStore(subscribeToOperatorAnalyticsSnapshots, readOperatorAnalyticsSnapshots, readOperatorAnalyticsSnapshots);

  const { model, modelError } = useMemo(() => {
    try {
      return {
        model: createOperatorCommandCenterModel(leads, snapshots),
        modelError: null,
      };
    } catch (error) {
      console.error("Operator command center model failed:", error);

      return {
        model: emptyModel,
        modelError: error,
      };
    }
  }, [leads, snapshots]);

  function handleAddSnapshot(snapshot: OperatorAnalyticsSnapshot) {
    saveOperatorAnalyticsSnapshots([...snapshots, snapshot]);
  }

  return (
    <section className="overflow-hidden rounded-[1.5rem] border border-border bg-surface p-5 shadow-[0_18px_40px_rgba(17,37,52,0.05)] sm:p-6">
      <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">Operator command center</p>
          <h2 className="break-words text-2xl font-semibold text-primary">Trends, channels, and content signals</h2>
          <p className="max-w-3xl break-words text-sm leading-6 text-muted">
            Visual decision support from existing lead records and manual marketing snapshots. No Google, YouTube, GBP,
            provider, outreach, assignment, reminder, or campaign action is triggered.
          </p>
        </div>
        <div className="flex max-w-full flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.1em]">
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-800">Read only</span>
          <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-blue-800">
            {model.snapshotCount} snapshots
          </span>
        </div>
      </div>

      {isLoadingLeads ? <p className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-900">Loading lead trends...</p> : null}

      {modelError ? (
        <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-semibold leading-6 text-amber-950">
          Analytics snapshot data could not be read safely, so empty command-center cards are shown. No outreach, provider
          call, assignment, reminder, or CRM mutation was executed.
        </p>
      ) : null}

      <div className="mt-5 grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        <OperatorCommandCenterSectionBoundary label="Website traffic metric">
          <CommandMetricCard label="Website traffic" value={sum(model.websiteSessionsTrend)} helper="Manual sessions snapshot total" points={model.websiteSessionsTrend} icon={TrendingUp} />
        </OperatorCommandCenterSectionBoundary>
        <OperatorCommandCenterSectionBoundary label="GA4 conversions metric">
          <CommandMetricCard label="GA4 conversions" value={sum(model.ga4ConversionsTrend)} helper="Manual conversion snapshot total" points={model.ga4ConversionsTrend} icon={BarChart3} />
        </OperatorCommandCenterSectionBoundary>
        <OperatorCommandCenterSectionBoundary label="GBP calls metric">
          <CommandMetricCard label="GBP calls" value={sum(model.gbpCallsTrend)} helper="Manual Google Business Profile calls" points={model.gbpCallsTrend} icon={PhoneCall} />
        </OperatorCommandCenterSectionBoundary>
        <OperatorCommandCenterSectionBoundary label="YouTube views metric">
          <CommandMetricCard label="YouTube views" value={sum(model.youtubeViewsTrend)} helper="Manual video performance signal" points={model.youtubeViewsTrend} icon={PlayCircle} />
        </OperatorCommandCenterSectionBoundary>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <OperatorCommandCenterSectionBoundary label="Source trend">
          <SourceTrendPanel model={model} />
        </OperatorCommandCenterSectionBoundary>
        <OperatorCommandCenterSectionBoundary label="Top educational pages">
          <TopPagesPanel model={model} />
        </OperatorCommandCenterSectionBoundary>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <OperatorCommandCenterSectionBoundary label="Lower channel metrics">
          <div className="grid gap-4 sm:grid-cols-2">
            <CommandMetricCard label="Contact forms" value={sum(model.contactFormTrend)} helper="Manual form submission count" points={model.contactFormTrend} icon={BarChart3} />
            <CommandMetricCard label="YouTube engagement" value={sum(model.youtubeEngagementTrend)} helper="Manual watch or engagement signal" points={model.youtubeEngagementTrend} icon={PlayCircle} />
          </div>
        </OperatorCommandCenterSectionBoundary>
        <OperatorCommandCenterSectionBoundary label="Snapshot form">
          <SnapshotForm onAddSnapshot={handleAddSnapshot} />
        </OperatorCommandCenterSectionBoundary>
      </div>
    </section>
  );
}
