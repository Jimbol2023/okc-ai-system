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

type ExecutiveRecommendation = {
  id: string;
  title: string;
  summary: string;
  confidenceLabel: "low" | "medium" | "high";
  confidenceScore: number;
  reason: string;
  sampleWindowDays: 90;
  knowledgeLinks: Array<{
    title: string;
    category: string;
    href: "/dashboard/knowledge";
    detail: string;
    source: "knowledge_item" | "doc_reference";
  }>;
  advisoryOnly: true;
};

type MorningBrief = {
  greeting: string;
  summary: string;
  keySignals: Array<{
    id: string;
    label: string;
    value: string | number;
    detail: string;
    status: MetricStatus;
  }>;
  recommendedWorkOrder: string[];
  memoryInsight: {
    title: string;
    summary: string;
    confidenceLabel: ExecutiveRecommendation["confidenceLabel"];
    confidenceScore: number;
    sampleWindowDays: 90;
  } | null;
  safetyBadges: string[];
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
  morningBrief?: MorningBrief;
  todayPriorities?: ExecutiveWidget[];
  kpiInterpretations?: Record<string, string>;
  businessIntelligence?: BusinessIntelligenceReport;
  departmentHealth?: DepartmentHealthCard[];
  trendCharts?: TrendChart[];
  recommendedPriorities?: string[];
  executiveRecommendations?: ExecutiveRecommendation[];
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

function getStatusLabel(status: MetricStatus) {
  if (status === "good") return "Healthy";
  if (status === "watch") return "Watch";
  if (status === "urgent") return "Needs Attention";

  return "Missing";
}

function getStatusColor(status: MetricStatus) {
  if (status === "urgent") return "#dc2626";
  if (status === "watch") return "#d97706";
  if (status === "missing") return "#64748b";

  return "#059669";
}

function getConfidenceClass(confidence: ExecutiveRecommendation["confidenceLabel"]) {
  if (confidence === "high") return "border-emerald-200 bg-emerald-50 text-emerald-900";
  if (confidence === "medium") return "border-blue-200 bg-blue-50 text-blue-900";

  return "border-slate-200 bg-slate-50 text-slate-700";
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

function getChartStatus(chart: TrendChart): MetricStatus {
  const latest = chart.points.at(-1)?.value ?? 0;
  const previous = chart.points.at(-2)?.value ?? latest;

  if (chart.id === "finance_cash_flow") {
    if (latest > 0) return "good";
    if (latest < 0) return "urgent";

    return "watch";
  }

  if (latest > previous) return "good";
  if (latest === 0) return "missing";
  if (latest < previous) return "watch";

  return "watch";
}

function TrendAreaChart({ chart }: { chart: TrendChart }) {
  const width = 320;
  const height = 128;
  const status = getChartStatus(chart);
  const stroke = getStatusColor(status);
  const values = chart.points.map((point) => point.value);
  const min = Math.min(0, ...values);
  const max = Math.max(1, ...values);
  const range = max - min || 1;
  const linePoints = chart.points
    .map((point, index) => {
      const x = chart.points.length <= 1 ? 0 : (index / (chart.points.length - 1)) * width;
      const y = height - ((point.value - min) / range) * height;

      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const areaPoints = `0,${height} ${linePoints} ${width},${height}`;
  const latest = chart.points.at(-1);

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="break-words text-sm font-semibold text-primary">{chart.label}</h3>
          <p className="mt-1 break-words text-xs leading-5 text-muted">{chart.detail}</p>
        </div>
        <span className={`shrink-0 rounded-full border px-2 py-1 text-xs font-bold ${getStatusClass(status)}`}>
          {getStatusLabel(status)}
        </span>
      </div>
      <div className="mt-4 flex items-end justify-between gap-3">
        {latest ? <span className="text-xl font-semibold text-primary">{formatChartValue(latest.value, chart.unit)}</span> : null}
        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">30 days</span>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${chart.label} 30-day trend`} className="mt-4 h-36 w-full overflow-visible">
        <line x1="0" x2={width} y1={height} y2={height} stroke="#e2e8f0" strokeWidth="2" />
        <polygon fill={stroke} fillOpacity="0.14" points={areaPoints} />
        <polyline fill="none" points={linePoints} stroke={stroke} strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
      </svg>
      <div className="mt-2 flex justify-between text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
        <span>{chart.points[0]?.label ?? ""}</span>
        <span>{latest?.label ?? ""}</span>
      </div>
    </div>
  );
}

export function ExecutiveDashboardClient() {
  const [morningBrief, setMorningBrief] = useState<MorningBrief | null>(null);
  const [todayPriorities, setTodayPriorities] = useState<ExecutiveWidget[]>([]);
  const [kpiInterpretations, setKpiInterpretations] = useState<Record<string, string>>({});
  const [businessIntelligence, setBusinessIntelligence] = useState<BusinessIntelligenceReport | null>(null);
  const [departmentHealth, setDepartmentHealth] = useState<DepartmentHealthCard[]>([]);
  const [trendCharts, setTrendCharts] = useState<TrendChart[]>([]);
  const [recommendedPriorities, setRecommendedPriorities] = useState<string[]>([]);
  const [executiveRecommendations, setExecutiveRecommendations] = useState<ExecutiveRecommendation[]>([]);
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

      setMorningBrief(data.morningBrief ?? null);
      setTodayPriorities(
        data.todayPriorities ??
          data.widgets.filter((widget) => ["follow_ups_due", "revenue_pipeline", "offer_ready", "marketing_approval", "website_seo"].includes(widget.id)),
      );
      setKpiInterpretations(data.kpiInterpretations ?? {});
      setBusinessIntelligence(data.businessIntelligence ?? null);
      setDepartmentHealth(data.departmentHealth ?? data.businessIntelligence?.departmentHealth ?? []);
      setTrendCharts(data.trendCharts ?? data.businessIntelligence?.trendCharts ?? []);
      setRecommendedPriorities(data.recommendedPriorities ?? []);
      setExecutiveRecommendations(data.executiveRecommendations ?? []);
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
      {loading ? <p className="text-sm text-muted">Loading executive dashboard...</p> : null}
      {error ? <p className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}

      <section aria-labelledby="morning-brief-heading" className="rounded-lg border border-border bg-surface p-5 md:p-6">
        <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 space-y-3">
            <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">Executive Dashboard</p>
            <h1 id="morning-brief-heading" className="break-words text-3xl font-semibold text-primary md:text-4xl">
              {morningBrief?.greeting ?? "Good morning Moses."}
            </h1>
            <p className="max-w-4xl break-words text-sm leading-6 text-muted">
              {morningBrief?.summary ??
                "Start here each workday. Every signal is advisory and manual-review only; no outreach, provider calls, ad spend, scraping, or automated tasks are triggered."}
            </p>
          </div>
          <div className="flex max-w-full flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.1em]">
            {(morningBrief?.safetyBadges ?? ["providerCalled:false", "outreachSent:false", "manualReviewOnly:true"]).map((badge) => (
              <span key={badge} className="max-w-full break-words rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-blue-900">
                {badge}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {(morningBrief?.keySignals ?? todayPriorities.slice(0, 5)).map((signal) => (
              <div key={signal.id} className="rounded-lg border border-border bg-white p-4">
                <span className={`w-fit max-w-full break-words rounded-full border px-2 py-1 text-xs font-bold ${getStatusClass(signal.status)}`}>
                  {getStatusLabel(signal.status)}
                </span>
                <p className="mt-3 break-words text-xs font-bold uppercase tracking-[0.08em] text-muted">{signal.label}</p>
                <p className="mt-1 break-words text-2xl font-semibold text-primary">{signal.value}</p>
                <p className="mt-2 break-words text-xs leading-5 text-muted">{signal.detail}</p>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-border bg-white p-4">
            <h2 className="break-words text-lg font-semibold text-primary">Recommended order</h2>
            <ol className="mt-3 space-y-2 text-sm leading-6 text-muted">
              {(morningBrief?.recommendedWorkOrder ?? recommendedPriorities).slice(0, 5).map((item, index) => (
                <li key={`${item}-${index}`} className="flex min-w-0 gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <span className="break-words">{item}</span>
                </li>
              ))}
            </ol>
            {morningBrief?.memoryInsight ? (
              <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-3">
                <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <p className="break-words text-sm font-semibold text-blue-950">{morningBrief.memoryInsight.title}</p>
                  <span className={`w-fit shrink-0 rounded-full border px-2 py-1 text-[11px] font-bold uppercase tracking-[0.08em] ${getConfidenceClass(morningBrief.memoryInsight.confidenceLabel)}`}>
                    {morningBrief.memoryInsight.confidenceLabel} confidence
                  </span>
                </div>
                <p className="mt-2 break-words text-xs leading-5 text-blue-900">
                  {morningBrief.memoryInsight.summary} Score {morningBrief.memoryInsight.confidenceScore}/100 over {morningBrief.memoryInsight.sampleWindowDays} days.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section aria-labelledby="today-priorities-heading" className="space-y-3">
        <h2 id="today-priorities-heading" className="break-words text-xl font-semibold text-primary">
          Today&apos;s priorities
        </h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {todayPriorities.map((widget) => (
            <Link
              key={widget.id}
              href={widget.href as Route}
              className="min-w-0 rounded-lg border border-border bg-surface p-5 transition hover:border-primary/30"
            >
              <div className="flex min-w-0 flex-col gap-2">
                <span className={`w-fit max-w-full break-words rounded-full border px-2 py-1 text-xs font-bold leading-5 ${getStatusClass(widget.status)}`}>
                  {getStatusLabel(widget.status)}
                </span>
                <p className="break-words text-sm font-semibold text-muted">{widget.label}</p>
                <p className="break-words text-3xl font-semibold text-primary">{widget.value}</p>
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
                {kpiInterpretations[kpi.id] ? (
                  <p className="mt-2 break-words text-sm font-semibold text-primary">{kpiInterpretations[kpi.id]}</p>
                ) : null}
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
                    {getStatusLabel(department.status)}
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
              <TrendAreaChart key={chart.id} chart={chart} />
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
          {executiveRecommendations.length > 0 ? (
            <div className="mt-3 space-y-3">
              {executiveRecommendations.map((recommendation) => (
                <div key={recommendation.id} className="rounded-lg border border-border bg-white p-3">
                  <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <h3 className="break-words text-sm font-semibold text-primary">{recommendation.title}</h3>
                    <span className={`w-fit shrink-0 rounded-full border px-2 py-1 text-[11px] font-bold uppercase tracking-[0.08em] ${getConfidenceClass(recommendation.confidenceLabel)}`}>
                      {recommendation.confidenceLabel} confidence
                    </span>
                  </div>
                  <p className="mt-2 break-words text-sm leading-6 text-muted">{recommendation.summary}</p>
                  <p className="mt-2 break-words text-xs leading-5 text-muted">
                    {recommendation.reason} Confidence score: {recommendation.confidenceScore}/100 over {recommendation.sampleWindowDays} days.
                  </p>
                  {recommendation.knowledgeLinks.length > 0 ? (
                    <div className="mt-3 space-y-2">
                      {recommendation.knowledgeLinks.map((link) => (
                        <Link
                          key={`${recommendation.id}-${link.source}-${link.title}`}
                          href={link.href}
                          className="block rounded-md border border-border bg-slate-50 p-2 text-xs leading-5 text-primary transition hover:border-primary/30"
                        >
                          <span className="font-semibold">{link.title}</span>
                          <span className="block text-muted">{link.detail}</span>
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted">
              {recommendedPriorities.map((priority) => (
                <li key={priority} className="break-words">{priority}</li>
              ))}
            </ul>
          )}
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
