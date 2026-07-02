"use client";

import Link from "next/link";
import type { Route } from "next";
import { useCallback, useEffect, useState } from "react";

import { DashboardCard, ErrorState, LoadingState, SafetyBadge, StatusBadge } from "@/components/dashboard/dashboard-ui";
import { getDashboardStatusColor } from "@/lib/dashboard-ui-status";

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

type RevenueCommandCenterItem = {
  id: string;
  label: string;
  value: string | number;
  detail: string;
  href: string;
  status: MetricStatus;
  sourceLabel: string;
  assumption: string;
};

type RevenueCommandCenterSection = {
  id: "revenue" | "marketing" | "seo" | "lead_intelligence" | "business_health" | "approval_priorities";
  title: string;
  summary: string;
  items: RevenueCommandCenterItem[];
};

type RevenueCommandCenter = {
  title: "Revenue Command Center";
  summary: string;
  executiveSummary: string;
  sections: RevenueCommandCenterSection[];
  highRoiDecisionFilter: string[];
  nextBestActions: string[];
  safetyFlags: {
    advisoryOnly: true;
    providerCalled: false;
    liveExecutionAllowed: false;
    externalActionsBlocked: true;
    publishingBlocked: true;
    outreachBlocked: true;
    scrapingBlocked: true;
    adsBlocked: true;
    humanApprovalRequired: true;
  };
};

type ExecutiveWorkforceHealthCard = {
  id: "revenue" | "brand" | "marketing" | "seo" | "content" | "lead" | "operations" | "security";
  label: string;
  score: number;
  status: MetricStatus;
  detail: string;
  sourceLabel: string;
  assumption: string;
};

type ContentIntelligenceRecommendation = {
  id: string;
  type: "create_next" | "refresh" | "repurpose" | "source_topic_focus";
  title: string;
  summary: string;
  priority: "high" | "medium" | "low";
  score: number;
  sourceLabel: string;
  assumption: string;
  recommendedBrief: string;
  approvalRequired: true;
  providerCalled: false;
  liveExecutionAllowed: false;
  publishingBlocked: true;
  scrapingBlocked: true;
};

type ExecutiveWorkforce = {
  healthCards: ExecutiveWorkforceHealthCard[];
  companyOrchestrator: {
    businessName: "AI Chief Operating Officer (AI COO)";
    internalName: "company-orchestrator";
    summary: string;
    workflowState: string;
    approvalValid: boolean;
    directive: {
      id: string;
      title: string;
      approval_status: string;
      expected_business_value: string;
    };
    departmentAssignments: Array<{
      department: string;
      requestedOutputs: string[];
      status: "blocked" | "assigned_for_preparation";
    }>;
    opportunityQueue: {
      totals: {
        opportunities: number;
        highConfidence: number;
        readyForLeadIntelligence: number;
      };
    };
    draftQueue: Array<{
      output: string;
      ownerDepartment: string;
      status: "draft_required" | "blocked_until_directive_approved";
      approvalRequired: true;
    }>;
    reviewRoutes: {
      brandReview: string;
      governanceReview: string;
      executiveSummaryOwner: string;
      finalApprovalOwner: "CEO";
    };
    executiveSummary: string;
    blockedActions: string[];
    safety: {
      approvalFirst: true;
      providerCalled: false;
      liveExecutionAllowed: false;
      noDepartmentDirectCommunication: true;
      publishingBlocked: true;
      outreachBlocked: true;
      scrapingBlocked: true;
      adsBlocked: true;
      workflowExecutionBlocked: true;
    };
  };
  contentIntelligence: {
    summary: string;
    recommendations: ContentIntelligenceRecommendation[];
    safety: {
      advisoryOnly: true;
      manualInputsOnly: true;
      providerCalled: false;
      liveExecutionAllowed: false;
      analyticsApiCalled: false;
      publishingBlocked: true;
      schedulingBlocked: true;
      scrapingBlocked: true;
      outreachBlocked: true;
      adsBlocked: true;
      approvalRequired: true;
    };
  };
  safetyFlags: {
    advisoryOnly: true;
    providerCalled: false;
    liveExecutionAllowed: false;
    publishingBlocked: true;
    scrapingBlocked: true;
    outreachBlocked: true;
    approvalRequired: true;
  };
};

type DailyStartup = {
  date: string;
  companyOperatingMode: "planning" | "daily_startup_ready" | "ceo_review" | "approved_internal_workflow";
  company_health: {
    score: number;
    status: MetricStatus;
    summary: string;
    sourceLabel: string;
    assumption: string;
  };
  department_health: Array<{
    department: string;
    status: "ready" | "blocked_awaiting_directive" | "review_only";
    summary: string;
    approval_required: true;
  }>;
  active_executive_directives: Array<{
    id: string;
    title: string;
    approval_status: string;
    expected_business_value: string;
    risk_level: "low" | "medium" | "high";
  }>;
  opportunity_queue_summary: QueueSummary;
  campaign_queue_summary: QueueSummary;
  draft_queue_summary: QueueSummary;
  approval_queue_summary: QueueSummary;
  blocked_items: string[];
  provider_readiness: {
    summary: string;
    missing: number;
    ready: number;
    providerCalled: false;
    liveExecutionAllowed: false;
  };
  government_policy_updates: string[];
  news_intelligence_updates: string[];
  engineering_progress: string[];
  executive_brief: string;
  ceo_decision_agenda: Array<{
    id: string;
    title: string;
    business_goal: string;
    reason: string;
    expected_business_value: string;
    risk_level: "low" | "medium" | "high";
    departments_involved: string[];
    recommended_action: "approve" | "reject" | "request_changes" | "defer";
    approval_required: true;
    status: string;
    sourceLabel: string;
    assumption: string;
  }>;
  safety: {
    internalOnly: true;
    providerCalled: false;
    liveExecutionAllowed: false;
    publishingBlocked: true;
    emailBlocked: true;
    smsBlocked: true;
    scrapingBlocked: true;
    adsBlocked: true;
    outreachBlocked: true;
    workflowExecutionBlocked: true;
    recommendationsOnly: true;
  };
};

type QueueSummary = {
  total: number;
  awaiting_ceo_approval: number;
  ready_for_review: number;
  blocked: number;
  summary: string;
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
  dailyStartup?: DailyStartup;
  revenueCommandCenter?: RevenueCommandCenter;
  executiveWorkforce?: ExecutiveWorkforce;
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

function getStatusColor(status: MetricStatus) {
  return getDashboardStatusColor(status);
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
    <DashboardCard>
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="break-words text-sm font-semibold text-primary">{chart.label}</h3>
          <p className="mt-1 break-words text-xs leading-5 text-muted">{chart.detail}</p>
        </div>
        <StatusBadge status={status} />
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
    </DashboardCard>
  );
}

function RevenueCommandCenterPanel({ commandCenter }: { commandCenter: RevenueCommandCenter }) {
  return (
    <section aria-labelledby="revenue-command-center-heading" className="rounded-lg border border-border bg-surface p-5 md:p-6">
      <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">CEO Daily Command</p>
          <h2 id="revenue-command-center-heading" className="break-words text-2xl font-semibold text-primary md:text-3xl">
            {commandCenter.title}
          </h2>
          <p className="max-w-5xl break-words text-sm leading-6 text-muted">{commandCenter.summary}</p>
          <p className="max-w-5xl break-words text-sm font-semibold leading-6 text-primary">{commandCenter.executiveSummary}</p>
        </div>
        <div className="flex max-w-full flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.1em]">
          <SafetyBadge>advisoryOnly:{String(commandCenter.safetyFlags.advisoryOnly)}</SafetyBadge>
          <SafetyBadge>providerCalled:{String(commandCenter.safetyFlags.providerCalled)}</SafetyBadge>
          <SafetyBadge tone="urgent">liveExecution:{String(commandCenter.safetyFlags.liveExecutionAllowed)}</SafetyBadge>
          <SafetyBadge>humanApproval:{String(commandCenter.safetyFlags.humanApprovalRequired)}</SafetyBadge>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="grid gap-4 md:grid-cols-2">
          {commandCenter.sections.map((section) => (
            <article key={section.id} className="rounded-lg border border-border bg-white p-4">
              <div className="min-w-0">
                <h3 className="break-words text-lg font-semibold text-primary">{section.title}</h3>
                <p className="mt-1 break-words text-sm leading-6 text-muted">{section.summary}</p>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {section.items.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href as Route}
                    className="min-w-0 rounded-lg border border-slate-200 bg-slate-50 p-3 transition hover:border-primary/30"
                  >
                    <div className="flex min-w-0 items-start justify-between gap-2">
                      <p className="break-words text-sm font-semibold text-primary">{item.label}</p>
                      <StatusBadge status={item.status} />
                    </div>
                    <p className="mt-2 break-words text-2xl font-semibold text-primary">{item.value}</p>
                    <p className="mt-2 break-words text-xs leading-5 text-muted">{item.detail}</p>
                    <p className="mt-2 break-words text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                      Source: {item.sourceLabel}
                    </p>
                    <p className="mt-1 break-words text-[11px] leading-4 text-muted">
                      Assumption: {item.assumption}
                    </p>
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
            <h3 className="break-words text-lg font-semibold text-blue-950">Next best actions</h3>
            <ol className="mt-3 space-y-2 text-sm leading-6 text-blue-950">
              {commandCenter.nextBestActions.slice(0, 6).map((action, index) => (
                <li key={`${action}-${index}`} className="flex min-w-0 gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-950 text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <span className="break-words">{action}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4">
            <h3 className="break-words text-lg font-semibold text-emerald-950">High-ROI decision filter</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-emerald-950">
              {commandCenter.highRoiDecisionFilter.map((filter) => (
                <li key={filter} className="break-words">{filter}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-amber-100 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
            <h3 className="break-words text-lg font-semibold text-amber-950">Approval boundary</h3>
            <p className="mt-2 break-words">
              AI prepares, Safety validates, Executive AI summarizes, and the CEO approves. This dashboard does not publish,
              email, message, scrape, spend ads, activate providers, mutate CRM records, or execute workflows.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function QueueSummaryCard({ title, summary }: { title: string; summary: QueueSummary }) {
  return (
    <article className="rounded-lg border border-border bg-white p-4">
      <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">{title}</p>
      <p className="mt-2 text-3xl font-semibold text-primary">{summary.total}</p>
      <p className="mt-2 break-words text-xs leading-5 text-muted">{summary.summary}</p>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">
        <span className="rounded-md bg-slate-100 px-2 py-1">Approval {summary.awaiting_ceo_approval}</span>
        <span className="rounded-md bg-slate-100 px-2 py-1">Review {summary.ready_for_review}</span>
        <span className="rounded-md bg-slate-100 px-2 py-1">Blocked {summary.blocked}</span>
      </div>
    </article>
  );
}

function DailyStartupPanel({ startup }: { startup: DailyStartup }) {
  return (
    <section aria-labelledby="daily-startup-heading" className="rounded-lg border border-border bg-surface p-5 md:p-6">
      <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">Daily Executive Brief</p>
          <h2 id="daily-startup-heading" className="break-words text-2xl font-semibold text-primary md:text-3xl">
            Start the Company
          </h2>
          <p className="max-w-5xl break-words text-sm leading-6 text-muted">{startup.executive_brief}</p>
          <p className="break-words text-xs font-semibold uppercase tracking-[0.08em] text-muted">
            Mode: {startup.companyOperatingMode} | Date: {formatTime(startup.date)}
          </p>
        </div>
        <div className="flex max-w-full flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.1em]">
          <SafetyBadge>internalOnly:{String(startup.safety.internalOnly)}</SafetyBadge>
          <SafetyBadge>providerCalled:{String(startup.safety.providerCalled)}</SafetyBadge>
          <SafetyBadge tone="urgent">liveExecution:{String(startup.safety.liveExecutionAllowed)}</SafetyBadge>
          <SafetyBadge>recommendationsOnly:{String(startup.safety.recommendationsOnly)}</SafetyBadge>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
            <div className="flex min-w-0 items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="break-words text-lg font-semibold text-blue-950">Company Health</h3>
                <p className="mt-2 break-words text-sm leading-6 text-blue-950">{startup.company_health.summary}</p>
              </div>
              <StatusBadge status={startup.company_health.status} />
            </div>
            <p className="mt-3 text-3xl font-semibold text-blue-950">{startup.company_health.score}</p>
            <p className="mt-2 break-words text-[11px] font-semibold uppercase tracking-[0.08em] text-blue-900">
              Source: {startup.company_health.sourceLabel}
            </p>
            <p className="mt-1 break-words text-[11px] leading-4 text-blue-900">Assumption: {startup.company_health.assumption}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <QueueSummaryCard title="Opportunities" summary={startup.opportunity_queue_summary} />
            <QueueSummaryCard title="Campaigns" summary={startup.campaign_queue_summary} />
            <QueueSummaryCard title="Draft Queue" summary={startup.draft_queue_summary} />
            <QueueSummaryCard title="Approvals" summary={startup.approval_queue_summary} />
          </div>

          <div className="rounded-lg border border-red-100 bg-red-50 p-4">
            <h3 className="break-words text-lg font-semibold text-red-950">Blocked Actions</h3>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-red-950">
              {startup.blocked_items.map((item) => (
                <li key={item} className="break-words">{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-white p-4">
            <h3 className="break-words text-lg font-semibold text-primary">CEO Decision Agenda</h3>
            <div className="mt-4 space-y-3">
              {startup.ceo_decision_agenda.map((item) => (
                <article key={item.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h4 className="break-words text-sm font-semibold text-primary">{item.title}</h4>
                      <p className="mt-1 break-words text-xs leading-5 text-muted">{item.reason}</p>
                    </div>
                    <SafetyBadge>{item.recommended_action}</SafetyBadge>
                  </div>
                  <p className="mt-3 break-words text-xs leading-5 text-primary">{item.expected_business_value}</p>
                  <p className="mt-2 break-words text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                    Status: {item.status} | Risk: {item.risk_level}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(["Approve", "Reject", "Request Changes", "Defer"] as const).map((label) => (
                      <button
                        key={label}
                        type="button"
                        disabled
                        className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-muted"
                        title="Review-only placeholder. Decision persistence is not enabled in this sprint."
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <p className="mt-3 break-words text-[11px] leading-4 text-muted">
                    Source: {item.sourceLabel}. Assumption: {item.assumption}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-border bg-white p-4">
              <h3 className="break-words text-sm font-semibold text-primary">Department Health</h3>
              <ul className="mt-3 space-y-2 text-xs leading-5 text-muted">
                {startup.department_health.slice(0, 8).map((department) => (
                  <li key={department.department} className="break-words">
                    {department.department}: {department.status}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-border bg-white p-4">
              <h3 className="break-words text-sm font-semibold text-primary">Readiness Updates</h3>
              <p className="mt-2 break-words text-xs leading-5 text-muted">{startup.provider_readiness.summary}</p>
              {[...startup.government_policy_updates, ...startup.news_intelligence_updates, ...startup.engineering_progress].slice(0, 5).map((update) => (
                <p key={update} className="mt-2 break-words text-xs leading-5 text-muted">{update}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ExecutiveWorkforcePanel({ workforce }: { workforce: ExecutiveWorkforce }) {
  return (
    <section aria-labelledby="executive-workforce-heading" className="rounded-lg border border-border bg-surface p-5 md:p-6">
      <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">Executive Workforce</p>
          <h2 id="executive-workforce-heading" className="break-words text-2xl font-semibold text-primary md:text-3xl">
            AI Department Health
          </h2>
          <p className="max-w-5xl break-words text-sm leading-6 text-muted">
            Brand, content, marketing, lead, revenue, operations, SEO, and security health are advisory only. Every recommendation remains draft-only until CEO approval.
          </p>
        </div>
        <div className="flex max-w-full flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.1em]">
          <SafetyBadge>advisoryOnly:{String(workforce.safetyFlags.advisoryOnly)}</SafetyBadge>
          <SafetyBadge>providerCalled:{String(workforce.safetyFlags.providerCalled)}</SafetyBadge>
          <SafetyBadge tone="urgent">liveExecution:{String(workforce.safetyFlags.liveExecutionAllowed)}</SafetyBadge>
          <SafetyBadge>approval:{String(workforce.safetyFlags.approvalRequired)}</SafetyBadge>
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex min-w-0 flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            <p className="break-words text-sm font-semibold uppercase tracking-[0.14em] text-muted">
              {workforce.companyOrchestrator.internalName}
            </p>
            <h3 className="mt-1 break-words text-xl font-semibold text-primary">{workforce.companyOrchestrator.businessName}</h3>
            <p className="mt-2 max-w-5xl break-words text-sm leading-6 text-muted">{workforce.companyOrchestrator.summary}</p>
          </div>
          <div className="flex max-w-full flex-wrap gap-2">
            <SafetyBadge>approval:{String(workforce.companyOrchestrator.approvalValid)}</SafetyBadge>
            <SafetyBadge>providerCalled:{String(workforce.companyOrchestrator.safety.providerCalled)}</SafetyBadge>
            <SafetyBadge tone="urgent">liveExecution:{String(workforce.companyOrchestrator.safety.liveExecutionAllowed)}</SafetyBadge>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-lg border border-border bg-slate-50 p-3">
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Executive Directives</p>
            <p className="mt-2 break-words text-lg font-semibold text-primary">{workforce.companyOrchestrator.directive.title}</p>
            <p className="mt-1 break-words text-xs leading-5 text-muted">Status: {workforce.companyOrchestrator.directive.approval_status}</p>
          </div>
          <div className="rounded-lg border border-border bg-slate-50 p-3">
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Opportunity Queue</p>
            <p className="mt-2 text-3xl font-semibold text-primary">{workforce.companyOrchestrator.opportunityQueue.totals.opportunities}</p>
            <p className="mt-1 text-xs leading-5 text-muted">{workforce.companyOrchestrator.opportunityQueue.totals.readyForLeadIntelligence} ready for Lead Intelligence review.</p>
          </div>
          <div className="rounded-lg border border-border bg-slate-50 p-3">
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Draft Queue</p>
            <p className="mt-2 text-3xl font-semibold text-primary">{workforce.companyOrchestrator.draftQueue.length}</p>
            <p className="mt-1 text-xs leading-5 text-muted">Brand Review: {workforce.companyOrchestrator.reviewRoutes.brandReview}</p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 xl:grid-cols-2">
          <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3">
            <h4 className="break-words text-sm font-semibold text-emerald-950">Department assignments</h4>
            <ul className="mt-2 space-y-2 text-xs leading-5 text-emerald-950">
              {workforce.companyOrchestrator.departmentAssignments.slice(0, 8).map((assignment) => (
                <li key={assignment.department} className="break-words">
                  {assignment.department}: {assignment.status}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-red-100 bg-red-50 p-3">
            <h4 className="break-words text-sm font-semibold text-red-950">Blocked actions</h4>
            <ul className="mt-2 space-y-2 text-xs leading-5 text-red-950">
              {workforce.companyOrchestrator.blockedActions.map((action) => (
                <li key={action} className="break-words">{action}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {workforce.healthCards.map((card) => (
            <article key={card.id} className="rounded-lg border border-border bg-white p-4">
              <div className="flex min-w-0 items-start justify-between gap-2">
                <h3 className="break-words text-sm font-semibold text-primary">{card.label}</h3>
                <StatusBadge status={card.status} />
              </div>
              <p className="mt-3 break-words text-3xl font-semibold text-primary">{card.score}</p>
              <p className="mt-2 break-words text-xs leading-5 text-muted">{card.detail}</p>
              <p className="mt-3 break-words text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                Source: {card.sourceLabel}
              </p>
              <p className="mt-1 break-words text-[11px] leading-4 text-muted">Assumption: {card.assumption}</p>
            </article>
          ))}
        </div>

        <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
          <h3 className="break-words text-lg font-semibold text-blue-950">Content Intelligence AI</h3>
          <p className="mt-2 break-words text-sm leading-6 text-blue-950">{workforce.contentIntelligence.summary}</p>
          <div className="mt-4 space-y-3">
            {workforce.contentIntelligence.recommendations.slice(0, 4).map((recommendation) => (
              <article key={recommendation.id} className="rounded-lg border border-blue-200 bg-white p-3">
                <div className="flex min-w-0 items-start justify-between gap-2">
                  <h4 className="break-words text-sm font-semibold text-primary">{recommendation.title}</h4>
                  <SafetyBadge>{recommendation.priority}</SafetyBadge>
                </div>
                <p className="mt-2 break-words text-xs leading-5 text-muted">{recommendation.summary}</p>
                <p className="mt-2 break-words text-xs leading-5 text-primary">{recommendation.recommendedBrief}</p>
                <p className="mt-2 break-words text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                  Source: {recommendation.sourceLabel}
                </p>
                <p className="mt-1 break-words text-[11px] leading-4 text-muted">Assumption: {recommendation.assumption}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ExecutiveDashboardClient() {
  const [dailyStartup, setDailyStartup] = useState<DailyStartup | null>(null);
  const [revenueCommandCenter, setRevenueCommandCenter] = useState<RevenueCommandCenter | null>(null);
  const [executiveWorkforce, setExecutiveWorkforce] = useState<ExecutiveWorkforce | null>(null);
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

      setDailyStartup(data.dailyStartup ?? null);
      setRevenueCommandCenter(data.revenueCommandCenter ?? null);
      setExecutiveWorkforce(data.executiveWorkforce ?? null);
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
      {loading ? <LoadingState label="Loading executive dashboard..." /> : null}
      {error ? <ErrorState message={error} /> : null}

      {dailyStartup ? <DailyStartupPanel startup={dailyStartup} /> : null}
      {revenueCommandCenter ? <RevenueCommandCenterPanel commandCenter={revenueCommandCenter} /> : null}
      {executiveWorkforce ? <ExecutiveWorkforcePanel workforce={executiveWorkforce} /> : null}

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
              <SafetyBadge key={badge}>{badge}</SafetyBadge>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {(morningBrief?.keySignals ?? todayPriorities.slice(0, 5)).map((signal) => (
              <div key={signal.id} className="rounded-lg border border-border bg-white p-4">
                <StatusBadge status={signal.status} />
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
                <StatusBadge status={widget.status} />
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
                <StatusBadge status={kpi.status} />
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
                  <StatusBadge status={department.status} />
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
