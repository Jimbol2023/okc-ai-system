"use client";

import Link from "next/link";
import type { Route } from "next";
import { useCallback, useEffect, useState } from "react";

type ExecutiveWidget = {
  id: string;
  label: string;
  value: string | number;
  detail: string;
  href: string;
  status: "good" | "watch" | "urgent" | "missing";
};

type MetricStatus = ExecutiveWidget["status"];

type BusinessKpiCard = {
  id: string;
  label: string;
  value: string;
  detail: string;
  status: MetricStatus;
};

type MarketingChannelPerformance = {
  source: string;
  totalLeads: number;
  qualifiedLeads: number;
  closedLeads: number;
  conversionRate: number;
  qualifiedShare: number;
};

type DepartmentHealthCard = {
  id: string;
  department: string;
  score: number;
  status: MetricStatus;
  reason: string;
};

type TrendChart = {
  id: string;
  label: string;
  detail: string;
  unit: "count" | "currency";
  points: Array<{
    date: string;
    label: string;
    value: number;
  }>;
};

type BusinessIntelligenceReport = {
  kpis: BusinessKpiCard[];
  channelPerformance: MarketingChannelPerformance[];
  departmentHealth: DepartmentHealthCard[];
  trendCharts: TrendChart[];
};

type ExecutiveDashboardResponse = {
  ok: boolean;
  widgets?: ExecutiveWidget[];
  businessIntelligence?: BusinessIntelligenceReport;
  departmentHealth?: DepartmentHealthCard[];
  trendCharts?: TrendChart[];
  recommendedPriorities?: string[];
  dataGaps?: string[];
  recentSystemActivity?: Array<{
    label: string;
    detail: string;
    at: string;
  }>;
  safetyFlags?: {
    readOnly: true;
    providerCalled: false;
    outreachSent: false;
    adsCreated: false;
    scrapingStarted: false;
    financeManualOnly: true;
    knowledgeManualOnly: true;
  };
  error?: string;
};

function getStatusClass(status: MetricStatus) {
  if (status === "urgent") return "border-red-200 bg-red-50 text-red-900";
  if (status === "watch") return "border-amber-200 bg-amber-50 text-amber-900";
  if (status === "missing") return "border-slate-200 bg-slate-50 text-slate-700";
  return "border-emerald-200 bg-emerald-50 text-emerald-900";
}

function formatChartValue(value: number, unit: TrendChart["unit"]) {
  if (unit === "currency") {
    return new Intl.NumberFormat("en-US", {
      currency: "USD",
      maximumFractionDigits: 0,
      style: "currency",
    }).format(value / 100);
  }

  return String(value);
}

function formatTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Unknown";

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

async function readJsonResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    throw new Error("Unexpected non-JSON response from executive dashboard API.");
  }

  return response.json() as Promise<T>;
}

function TrendSparkline({ chart }: { chart: TrendChart }) {
  const width = 220;
  const height = 72;
  const values = chart.points.map((point) => point.value);
  const min = Math.min(0, ...values);
  const max = Math.max(1, ...values);
  const range = max - min || 1;
  const points = chart.points
    .map((point, index) => {
      const x = chart.points.length <= 1 ? 0 : (index / (chart.points.length - 1)) * width;
      const y = height - ((point.value - min) / range) * height;

      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const latest = chart.points.at(-1);

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="break-words text-sm font-semibold text-primary">{chart.label}</h3>
          <p className="mt-1 break-words text-xs leading-5 text-muted">{chart.detail}</p>
        </div>
        {latest ? <span className="shrink-0 text-sm font-semibold text-primary">{formatChartValue(latest.value, chart.unit)}</span> : null}
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${chart.label} trend`} className="mt-4 h-20 w-full overflow-visible">
        <polyline fill="none" points={points} stroke="#02213d" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
      </svg>
      <div className="mt-2 flex justify-between text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
        <span>{chart.points[0]?.label ?? ""}</span>
        <span>{latest?.label ?? ""}</span>
      </div>
    </div>
  );
}

export function ExecutiveDashboardClient() {
  const [widgets, setWidgets] = useState<ExecutiveWidget[]>([]);
  const [businessIntelligence, setBusinessIntelligence] = useState<BusinessIntelligenceReport | null>(null);
  const [departmentHealth, setDepartmentHealth] = useState<DepartmentHealthCard[]>([]);
  const [trendCharts, setTrendCharts] = useState<TrendChart[]>([]);
  const [recommendedPriorities, setRecommendedPriorities] = useState<string[]>([]);
  const [dataGaps, setDataGaps] = useState<string[]>([]);
  const [recentSystemActivity, setRecentSystemActivity] = useState<NonNullable<ExecutiveDashboardResponse["recentSystemActivity"]>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/executive-dashboard", {
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      });
      const data = await readJsonResponse<ExecutiveDashboardResponse>(response);

      if (!response.ok || !data.ok || !data.widgets) {
        throw new Error(data.error || "Failed to load executive dashboard.");
      }

      setWidgets(data.widgets);
      setBusinessIntelligence(data.businessIntelligence ?? null);
      setDepartmentHealth(data.departmentHealth ?? data.businessIntelligence?.departmentHealth ?? []);
      setTrendCharts(data.trendCharts ?? data.businessIntelligence?.trendCharts ?? []);
      setRecommendedPriorities(data.recommendedPriorities ?? []);
      setDataGaps(data.dataGaps ?? []);
      setRecentSystemActivity(data.recentSystemActivity ?? []);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load executive dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  return (
    <div className="space-y-6">
      <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">Executive Dashboard</p>
          <h1 className="break-words text-3xl font-semibold text-primary">Daily command center</h1>
          <p className="max-w-3xl break-words text-sm leading-6 text-muted">
            Start here each workday. Every widget is advisory and manual-review only; no outreach, provider calls, ad spend, scraping, or automated tasks are triggered.
          </p>
        </div>
        <div className="flex max-w-full flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.1em]">
          <span className="max-w-full break-words rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-blue-900">
            providerCalled:false
          </span>
          <span className="max-w-full break-words rounded-full border border-red-200 bg-red-50 px-3 py-1 text-red-800">
            outreachSent:false
          </span>
        </div>
      </div>

      {loading ? <p className="text-sm text-muted">Loading executive dashboard...</p> : null}
      {error ? <p className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}

      <section aria-labelledby="executive-widgets-heading" className="space-y-3">
        <h2 id="executive-widgets-heading" className="break-words text-xl font-semibold text-primary">
          Today&apos;s operating signals
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {widgets.map((widget) => (
            <Link
              key={widget.id}
              href={widget.href as Route}
              className="min-w-0 rounded-lg border border-border bg-surface p-4 transition hover:border-primary/30"
            >
              <div className="flex min-w-0 flex-col gap-2">
                <span className={`w-fit max-w-full break-words rounded-full border px-2 py-1 text-xs font-bold uppercase leading-5 ${getStatusClass(widget.status)}`}>
                  {widget.status}
                </span>
                <p className="break-words text-sm font-semibold text-muted">{widget.label}</p>
                <p className="break-words text-2xl font-semibold text-primary">{widget.value}</p>
                <p className="break-words text-sm leading-6 text-muted">{widget.detail}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {businessIntelligence ? (
        <section aria-labelledby="business-intelligence-heading" className="space-y-3">
          <h2 id="business-intelligence-heading" className="break-words text-xl font-semibold text-primary">
            Business intelligence KPIs
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {businessIntelligence.kpis.map((kpi) => (
              <div key={kpi.id} className="rounded-lg border border-border bg-surface p-4">
                <span className={`w-fit max-w-full break-words rounded-full border px-2 py-1 text-xs font-bold uppercase leading-5 ${getStatusClass(kpi.status)}`}>
                  {kpi.status}
                </span>
                <p className="mt-3 break-words text-sm font-semibold text-muted">{kpi.label}</p>
                <p className="mt-1 break-words text-2xl font-semibold text-primary">{kpi.value}</p>
                <p className="mt-2 break-words text-sm leading-6 text-muted">{kpi.detail}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {departmentHealth.length > 0 ? (
        <section aria-labelledby="department-health-heading" className="space-y-3">
          <h2 id="department-health-heading" className="break-words text-xl font-semibold text-primary">
            Department health
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {departmentHealth.map((department) => (
              <div key={department.id} className="rounded-lg border border-border bg-surface p-4">
                <div className="flex min-w-0 items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="break-words text-sm font-semibold text-primary">{department.department}</p>
                    <p className="mt-1 break-words text-xs leading-5 text-muted">{department.reason}</p>
                  </div>
                  <span className={`shrink-0 rounded-full border px-2 py-1 text-xs font-bold ${getStatusClass(department.status)}`}>
                    {department.status}
                  </span>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${department.score}%` }} />
                </div>
                <p className="mt-2 text-sm font-semibold text-primary">{department.score}/100</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {trendCharts.length > 0 ? (
        <section aria-labelledby="trend-heading" className="space-y-3">
          <h2 id="trend-heading" className="break-words text-xl font-semibold text-primary">
            Executive trend charts
          </h2>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {trendCharts.map((chart) => (
              <TrendSparkline key={chart.id} chart={chart} />
            ))}
          </div>
        </section>
      ) : null}

      {businessIntelligence?.channelPerformance.length ? (
        <section aria-labelledby="channel-performance-heading" className="rounded-lg border border-border bg-surface p-4">
          <h2 id="channel-performance-heading" className="break-words text-lg font-semibold text-primary">
            Marketing channel performance
          </h2>
          <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {businessIntelligence.channelPerformance.slice(0, 6).map((channel) => (
              <div key={channel.source} className="rounded-lg border border-border bg-white p-3">
                <p className="break-words text-sm font-semibold text-primary">{channel.source}</p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {channel.qualifiedLeads} qualified / {channel.totalLeads} total lead(s)
                </p>
                <p className="text-sm leading-6 text-muted">
                  {channel.conversionRate}% conversion, {channel.qualifiedShare}% qualified-share
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr_1fr]">
        <section className="rounded-lg border border-border bg-surface p-4">
          <h2 className="break-words text-lg font-semibold text-primary">AI executive recommendations</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted">
            {recommendedPriorities.map((priority) => (
              <li key={priority} className="break-words">{priority}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg border border-border bg-surface p-4">
          <h2 className="break-words text-lg font-semibold text-primary">Data gaps</h2>
          {dataGaps.length === 0 ? (
            <p className="mt-3 text-sm leading-6 text-muted">No major dashboard data gaps are visible.</p>
          ) : (
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted">
              {dataGaps.map((gap) => (
                <li key={gap} className="break-words">{gap}</li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-lg border border-border bg-surface p-4">
          <h2 className="break-words text-lg font-semibold text-primary">Recent system activity</h2>
          {recentSystemActivity.length === 0 ? (
            <p className="mt-3 text-sm leading-6 text-muted">No recent system activity is available.</p>
          ) : (
            <div className="mt-3 space-y-3">
              {recentSystemActivity.map((activity) => (
                <div key={`${activity.label}-${activity.at}`} className="min-w-0 border-t border-border pt-3 first:border-t-0 first:pt-0">
                  <p className="break-words text-sm font-semibold text-primary">{activity.label}</p>
                  <p className="break-words text-sm leading-6 text-muted">{activity.detail}</p>
                  <p className="break-words text-xs font-semibold uppercase tracking-[0.08em] text-muted">{formatTime(activity.at)}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
