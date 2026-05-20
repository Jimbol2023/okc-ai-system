"use client";

import {
  getOperatorReportingSummary,
  type OperationalSnapshot,
  type ReportingSeverity,
  type ReportingTrendState,
} from "@/lib/operator-reporting";
import type { StoredLead } from "@/lib/leads-storage";

type OperatorReportingPanelProps = {
  leads: StoredLead[];
};

const trendStyles: Record<ReportingTrendState, string> = {
  improving: "border-emerald-200 bg-emerald-50 text-emerald-800",
  stable: "border-blue-200 bg-blue-50 text-blue-800",
  worsening: "border-red-200 bg-red-50 text-red-800",
  unknown: "border-slate-200 bg-slate-50 text-slate-700",
};

const severityStyles: Record<ReportingSeverity, string> = {
  low: "border-emerald-200 bg-emerald-50 text-emerald-800",
  medium: "border-amber-200 bg-amber-50 text-amber-800",
  high: "border-orange-200 bg-orange-50 text-orange-800",
  critical: "border-red-200 bg-red-50 text-red-800",
};

function formatLabel(value?: string) {
  return value ? value.replaceAll("_", " ") : "Unknown";
}

function KpiTile({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-primary">{value}</p>
      <p className="mt-1 text-xs leading-5 text-muted">{helper}</p>
    </div>
  );
}

function SnapshotCard({ snapshot }: { snapshot: OperationalSnapshot }) {
  return (
    <article className="rounded-2xl border border-border bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-primary">{snapshot.label}</p>
          <p className="mt-1 text-xs leading-5 text-muted">{snapshot.topOperationalConcern}</p>
        </div>
        <span className={`rounded-md border px-2 py-1 text-xs font-bold ${trendStyles[snapshot.trend]}`}>
          {formatLabel(snapshot.trend)}
        </span>
      </div>
      <p className="mt-3 text-2xl font-semibold text-primary">{snapshot.count}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {Object.entries(snapshot.severityDistribution).map(([severity, count]) => (
          <span key={severity} className={`rounded-md border px-2 py-1 text-xs font-semibold ${severityStyles[severity as ReportingSeverity]}`}>
            {formatLabel(severity)} {count}
          </span>
        ))}
      </div>
      <p className="mt-3 text-sm leading-6 text-muted">{snapshot.operationalRecommendation}</p>
      <p className="mt-2 text-xs leading-5 text-muted">{snapshot.trendHint}</p>
    </article>
  );
}

export function OperatorReportingPanel({ leads }: OperatorReportingPanelProps) {
  const summary = getOperatorReportingSummary(leads);

  return (
    <section className="rounded-[1.5rem] border border-border bg-surface p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-primary">Operational reporting</h2>
          <p className="max-w-3xl text-sm leading-6 text-muted">
            Read-only operational snapshots, conservative trend hints, repeated bottlenecks, and workflow health. Operational reporting only. No outreach sent, no automation executed, and no documents generated.
          </p>
        </div>
        <span className="inline-flex w-fit rounded-full bg-[#e7eef5] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#355066]">
          Reporting only
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiTile label="Workload pressure" value={formatLabel(summary.performance.workloadPressure)} helper={summary.performance.workloadPressureReason} />
        <KpiTile label="Stalled deals" value={String(summary.performance.stalledDealCount)} helper="Stage or follow-up stagnation" />
        <KpiTile label="Closing risk" value={String(summary.performance.closingRiskCount)} helper="Closing items with non-low risk" />
        <KpiTile label="Follow-up backlog" value={String(summary.performance.followUpBacklogCount)} helper="Follow-up timing items needing review" />
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        {summary.snapshots.map((snapshot) => (
          <SnapshotCard key={snapshot.key} snapshot={snapshot} />
        ))}
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_0.9fr]">
        <div>
          <h3 className="mb-3 text-lg font-semibold text-primary">Trend direction</h3>
          <div className="space-y-3">
            {summary.trends.map((trend) => (
              <div key={trend.key} className="rounded-2xl border border-border bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-primary">{trend.label}</p>
                    <p className="mt-1 text-xs leading-5 text-muted">{trend.reason}</p>
                  </div>
                  <span className={`rounded-md border px-2 py-1 text-xs font-bold ${trendStyles[trend.state]}`}>
                    {formatLabel(trend.state)}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-5 text-muted">{trend.uncertainty}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-lg font-semibold text-primary">Repeated bottlenecks</h3>
          <div className="space-y-3">
            {summary.repeatedBottlenecks.length > 0 ? (
              summary.repeatedBottlenecks.map((bottleneck) => (
                <div key={bottleneck.category} className="rounded-2xl border border-border bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-primary">{bottleneck.category}</p>
                      <p className="mt-1 text-xs font-semibold uppercase text-muted">{formatLabel(bottleneck.affectedWorkflowArea)}</p>
                    </div>
                    <span className={`rounded-md border px-2 py-1 text-xs font-bold ${severityStyles[bottleneck.severity]}`}>
                      {bottleneck.frequencyEstimate}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted">{bottleneck.operationalRecommendation}</p>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-white p-4 text-sm text-muted">
                No repeated bottleneck frequency detected from current snapshot.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-white p-4">
          <p className="text-sm font-semibold text-primary">Daily / weekly summaries</p>
          <div className="mt-3 space-y-2 text-sm leading-6 text-muted">
            <p>{summary.weeklyWorkflowHealth}</p>
            <p>{summary.revenueAtRiskSummary}</p>
            <p>{summary.escalationSummary}</p>
            <p>{summary.followUpBacklogSummary}</p>
            <p>{summary.closingRiskSummary}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-white p-4">
          <p className="text-sm font-semibold text-primary">Reporting consistency</p>
          <p className="mt-3 text-sm leading-6 text-muted">{summary.reportingConsistencyNote}</p>
          <p className="mt-3 text-xs leading-5 text-muted">{summary.safetyNote}</p>
        </div>
      </div>

      <p className="mt-5 text-xs leading-5 text-muted">
        Operational reports are snapshot-based and advisory. R13 does not add analytics tables, scheduled jobs, exports, notifications, outreach, provider calls, or document execution.
      </p>
    </section>
  );
}
