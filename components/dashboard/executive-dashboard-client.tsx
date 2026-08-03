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

type DailyMission = {
  title: "CEO Daily Mission";
  greeting: "Good Morning Moses";
  summary: string;
  status: "ready" | "watch" | "urgent" | "data_gap";
  overnightSummary: string[];
  urgentCeoDecisions: Array<{
    id: string;
    title: string;
    reason: string;
    expectedBusinessValue: string;
    riskLevel: "low" | "medium" | "high";
    status: string;
  }>;
  draftsReady: Array<{
    id: string;
    title: string;
    department: string;
    approvalStatus: string;
    sourceLabel: string;
  }>;
  revenuePriorities: Array<{
    id: string;
    title: string;
    detail: string;
    sourceLabel: string;
  }>;
  leadPriorities: Array<{
    leadId: string;
    source: string;
    propertyAddress: string;
    priority: string;
    score: number;
    recommendedAction: string;
  }>;
  connectorHealth: Array<{
    connectorId: string;
    displayName: string;
    unifiedStatus: "healthy" | "degraded" | "missing_credentials" | "readiness_only";
    lastDataGap: string | null;
  }>;
  dfdOperating: {
    summary: string;
    totals: {
      storedLeads: number;
      propertyReviewPriorities: number;
      governanceStops: number;
      distressSignals: number;
      acquisitionBottlenecks: number;
    };
    topPriorities: Array<{
      id: string;
      title: string;
      category: string;
      nextInternalAction: string;
      assignedDepartment: string;
      roiRank: number;
    }>;
    safetyFlags: {
      readOnly: true;
      providerCalled: false;
      liveExecutionAllowed: false;
      workflowStarted: false;
      sent: false;
      published: false;
      outreachBlocked: true;
      scrapingBlocked: true;
      adsBlocked: true;
      crmMutationBlocked: true;
    };
  } | null;
  dataGaps: string[];
  estimatedCeoTimeMinutes: number;
  safetyFlags: {
    providerCalled: false;
    liveExecutionAllowed: false;
    published: false;
    sent: false;
    workflowStarted: false;
    outreachBlocked: true;
    scrapingBlocked: true;
    adsBlocked: true;
  };
};

type ConnectorActivationReport = {
  summary: string;
  totals: {
    connectors: number;
    connected: number;
    internalReady: number;
    credentialsMissing: number;
    dataGaps: number;
    registryOnly: number;
  };
  connectors: Array<{
    connectorId: string;
    connectorName: string;
    status: "connected" | "internal_ready" | "credentials_missing" | "data_gap" | "registry_only" | "incomplete";
    implementationStatus: "implemented_read_adapter" | "internal_read_source" | "registry_only" | "umbrella";
    roiPriority: 1 | 2 | 3 | 4;
    revenueUseCase: string;
    dealFlowImpact: "high" | "medium" | "low" | "readiness_only";
    nextRevenueAction: string;
    blockingRevenueData: string[];
    readOnly: true;
    credentialsPresent: boolean;
    lastSuccessfulRead: string | null;
    lastFailure: string | null;
    businessUseCase: string;
    departmentUsingIt: string;
    nextRequiredAction: string;
    sourceLabel: string;
    sourceRecords: string[];
    safetyFlags: {
      readOnly: true;
      providerCalled: false;
      liveExecutionAllowed: false;
      workflowStarted: false;
      published: false;
      sent: false;
      outreachBlocked: true;
      scrapingBlocked: true;
      adsBlocked: true;
    };
  }>;
  dataGaps: string[];
  safetyFlags: {
    readOnly: true;
    providerCalled: false;
    liveExecutionAllowed: false;
    workflowStarted: false;
    published: false;
    sent: false;
    outreachBlocked: true;
    scrapingBlocked: true;
    adsBlocked: true;
  };
};

type ProductionDryRunReport = {
  ok: true;
  traceId: string;
  generatedAt: string;
  summary: string;
  loopSteps: Array<{
    sourceStep: string;
    targetStep: string;
    status: "prepared" | "completed" | "blocked" | "failed";
    evidence: string;
    auditRecorded: boolean;
  }>;
  businessWorkProduced: {
    morningBriefItems: number;
    dailyMissionRevenuePriorities: number;
    dfdPropertyPriorities: number;
    aiCooAssignments: number;
    departmentWorkOrders: number;
    draftWorkspaceItems: number;
    approvalQueueItems: number;
  };
  ceoApprovalProof: {
    draftsVisible: number;
    approvalsVisible: number;
    canApproveRejectDraftWork: boolean;
    canReviewApprovalQueue: boolean;
  };
  approvedExecutionValidation: {
    status: "blocked";
    approvedExecutionEnabled: boolean;
    productionSmokePassed: boolean;
    externalActionsBlocked: true;
    blockedReason: string;
    providerCalled: false;
    sent: false;
    published: false;
    liveExecutionAllowed: false;
  };
  auditProof: {
    traceRecordsAttempted: number;
    traceRecordsRecorded: number;
    failedClosed: boolean;
  };
  memoryEligibility: {
    eligible: boolean;
    memoryWritten: false;
    reason: string;
  };
  businessOutcomePlaceholder: {
    status: "outcome_pending" | "blocked";
    evidence: string[];
  };
  tomorrowRecommendations: Array<{
    title: string;
    reason: string;
    sourceLabel: string;
  }>;
  remainingProductionBlockers: string[];
  safetyFlags: {
    readOnly: true;
    providerCalled: false;
    sent: false;
    published: false;
    workflowStarted: false;
    liveExecutionAllowed: false;
    outreachBlocked: true;
    scrapingBlocked: true;
    adsBlocked: true;
  };
};

type ProductionReadinessDepartment = {
  id: string;
  label: string;
  status: "ready" | "read_only" | "degraded" | "blocked";
  detail: string;
  href: string;
};

type ProductionReadinessCommand = {
  title: "Production Readiness Command";
  status: "ready" | "watch" | "blocked";
  schemaStatus: "ready" | "schema_drift_detected" | "database_unavailable" | "not_checked";
  requiredMigration: string;
  migrationPath: string;
  missingColumns: string[];
  pendingMigration: boolean;
  blockerCount: number;
  dataGapCount: number;
  nextSafeAction: string;
  dryRunAllowed: boolean;
  departmentCompatibility: ProductionReadinessDepartment[];
  safetyFlags: {
    providerCalled: false;
    liveExecutionAllowed: false;
    crmMutationAllowed: false;
    publishingAllowed: false;
    outreachAllowed: false;
    scrapingAllowed: false;
    automationAllowed: false;
    vercelMutationAllowed: false;
    syntheticDataCreationAllowed: false;
  };
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

type DepartmentIntelligence = {
  generatedAt: string;
  summary: string;
  departments: Array<{
    department: string;
    memoryStatus: "no_memory" | "memory_started" | "outcome_pending" | "outcome_supported";
    eventCount: number;
    latestLesson: string;
    highRoiFocus: string;
    recommendations: Array<{
      id: string;
      title: string;
      summary: string;
      score: number;
      expectedBusinessValue: string;
      sourceLabel: string;
      assumption: string;
      approvalRequired: true;
      providerCalled: false;
      liveExecutionAllowed: false;
    }>;
    lessonsLearned: string[];
    sourceLabels: string[];
    assumptions: string[];
    confidence: number;
  }>;
  topRecommendations: Array<{
    id: string;
    title: string;
    summary: string;
    score: number;
    expectedBusinessValue: string;
    sourceLabel: string;
    assumption: string;
    approvalRequired: true;
    providerCalled: false;
    liveExecutionAllowed: false;
  }>;
  decisionReasonTemplates: Record<DirectiveDecision, readonly string[]>;
  safety: {
    providerCalled: false;
    liveExecutionAllowed: false;
    published: false;
    sent: false;
    outreachBlocked: true;
    workflowExecutionBlocked: true;
    scrapingBlocked: true;
    adsBlocked: true;
    emailBlocked: true;
    smsBlocked: true;
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
    directive_id: string;
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
  activation_state?: {
    assignments: Array<{
      id: string;
      directiveId: string;
      department: string;
      assignmentType: string;
      requestedOutputs: string[];
      status: string;
      blocker: string | null;
      approvalRequired: true;
    }>;
    draftQueueItems: Array<{
      id: string;
      directiveId: string;
      output: string;
      ownerDepartment: string;
      status: string;
      approvalRequired: true;
    }>;
    latestDecision: {
      decision: "approve" | "reject" | "request_changes" | "defer";
      note: string | null;
      resultingStatus: string;
      createdAt: string;
    } | null;
  };
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

type OperatingCompany = {
  summary: string;
  closeGoal: "2-5 deals/month";
  departmentCommandMatrix: Array<{
    department: string;
    operatingRole: string;
    currentOutput: string;
    nextHandoff: string;
    blocker: string;
    dealContribution: "lead_flow" | "conversion" | "deal_analysis" | "trust" | "operations" | "governance";
    lifecycleStatus: "active" | "planned" | "future_ready";
    activeExecutionOwner: boolean;
    approvalRequired: true;
    providerCalled: false;
    liveExecutionAllowed: false;
    sourceLabel: string;
    assumption: string;
  }>;
  dealClosingWorkQueue: Array<{
    id: string;
    title: string;
    count: number | string;
    ownerDepartment: string;
    nextManualAction: string;
    revenueImpact: "high" | "medium" | "low";
    safetyBoundary: string;
    href: string;
    status: MetricStatus;
    sourceLabel: string;
    assumption: string;
  }>;
  architectureImprovementBacklog: Array<{
    id: string;
    title: string;
    ownerDepartment: string;
    businessValue: string;
    risk: "high" | "medium" | "low";
    readinessState: "ready_for_ceo_review" | "in_progress" | "planned" | "blocked";
    nextSafeAction: string;
    ceoApprovalRequired: true;
    sourceBasis: Array<{
      category: "internal_standard" | "official_vendor_doc" | "open_standard" | "maintained_oss_pattern" | "best_practice";
      label: string;
      reference: string;
      rationale: string;
    }>;
    providerCalled: false;
    liveExecutionAllowed: false;
    externalExecutionAllowed: false;
  }>;
  workflowHandoffReadiness: Array<{
    id: string;
    workQueueItemId: string;
    currentOwner: string;
    nextDepartment: string;
    blocker: string;
    evidenceRequired: string[];
    approvalRequirement: string;
    recoveryPath: string;
    providerCalled: false;
    liveExecutionAllowed: false;
    outreachBlocked: true;
    scrapingBlocked: true;
    workflowStarted: false;
  }>;
  safetyFlags: {
    advisoryOnly: true;
    approvalRequired: true;
    providerCalled: false;
    liveExecutionAllowed: false;
    externalActionsBlocked: true;
    scrapingBlocked: true;
    outreachBlocked: true;
  };
};

type ExecutiveDashboardResponse = {
  ok: boolean;
  productionReadinessCommand?: ProductionReadinessCommand;
  widgets?: ExecutiveWidget[];
  dailyStartup?: DailyStartup;
  revenueCommandCenter?: RevenueCommandCenter;
  executiveWorkforce?: ExecutiveWorkforce;
  departmentIntelligence?: DepartmentIntelligence | null;
  operatingCompany?: OperatingCompany;
  dailyMission?: DailyMission | null;
  connectorActivation?: ConnectorActivationReport | null;
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

type ExecutiveAutonomyLevel1Status = {
  ok: boolean;
  level: 1;
  mode: "executive_autonomy_level_1_internal";
  tenantId: string;
  businessDate: string;
  idempotencyKey: string;
  lastRun: {
    state: "completed" | "completed_with_exceptions" | "already_completed" | "started" | "not_started";
    startedAt: string | null;
    completedAt: string | null;
    summary: string | null;
    exceptions: string[];
    confidence: number | null;
  };
  nextRunAt: string;
  manualControls: Array<"run_daily_startup_now" | "retry_failed_internal_step" | "regenerate_morning_brief">;
  safety: {
    providerCalled: false;
    sent: false;
    published: false;
    crmMutation: false;
    outreach: false;
    scraping: false;
    externalExecutionAllowed: false;
    liveExecutionAllowed: false;
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
    const body = await response.text().catch(() => "");
    const preview = body.replace(/\s+/g, " ").trim().slice(0, 140);

    throw new Error(
      `Unexpected non-JSON response from ${response.url || "executive dashboard API"} (${response.status}, ${contentType || "no content-type"}).${preview ? ` ${preview}` : ""}`,
    );
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

type DirectiveDecision = "approve" | "reject" | "request_changes" | "defer";

type DirectiveDecisionResponse = {
  ok: boolean;
  error?: string;
  resultingStatus?: string;
  assignmentsTotal?: number;
  draftQueueItemsTotal?: number;
};

type InternalWorkRunResponse = {
  ok: boolean;
  error?: string;
  assignmentsAdvanced?: number;
  draftQueueItemsAdvanced?: number;
  directivesAdvanced?: number;
  completedInternalCount?: number;
  providerCalled?: false;
  sent?: false;
  published?: false;
  liveExecutionAllowed?: false;
};

type ControlledInternalOperationAction =
  | "start_company"
  | "generate_morning_brief"
  | "refresh_internal_intelligence"
  | "record_executive_memory";

type ControlledInternalOperationResponse = {
  ok: boolean;
  error?: string;
  action?: ControlledInternalOperationAction;
  createdRecordType?: string;
  createdRecordId?: string | null;
  recordsCreated?: number;
  recordsUpdated?: number;
  stateTransition?: "internal_operational" | "degraded_but_usable";
  auditEntryCreated?: boolean;
  providerCalled?: false;
  sent?: false;
  published?: false;
  crmMutation?: false;
  outreach?: false;
  scraping?: false;
  externalExecutionAllowed?: false;
  liveExecutionAllowed?: false;
};

type ApprovedExecutionActionType =
  | "send_email"
  | "publish_article"
  | "schedule_post"
  | "create_crm_task"
  | "create_calendar_event"
  | "create_drive_doc";

type ApprovedExecutionPrepareResponse = {
  ok: boolean;
  error?: string;
  approvalItem?: {
    id: string;
    title: string;
    status: string;
    connectorId: string | null;
    actionType: ApprovedExecutionActionType;
    sourceLabel: string;
  };
};

type ApprovedExecutionRunResponse = {
  ok: boolean;
  error?: string;
  auditLogged?: boolean;
  memoryLogged?: boolean;
  result?: {
    status: string;
    message: string;
    blockedReason: string | null;
    providerCalled: boolean;
    sent: boolean;
    published: boolean;
    scheduled: boolean;
    crmTaskCreated: boolean;
    calendarEventCreated: boolean;
    driveDocumentCreated: boolean;
    externalReference: string | null;
  };
};

function formatDecisionLabel(decision: DirectiveDecision) {
  if (decision === "request_changes") return "Request Changes";

  return decision.charAt(0).toUpperCase() + decision.slice(1);
}

const fallbackDecisionReasonTemplates: Record<DirectiveDecision, readonly string[]> = {
  approve: ["High ROI", "Strong brand value", "Urgent revenue opportunity", "Low risk"],
  request_changes: ["Brand risk", "Weak CTA", "Insufficient source data", "Unclear owner"],
  reject: ["Low revenue value", "Too risky", "Duplicate work", "Not aligned"],
  defer: ["Timing", "Dependency missing", "Awaiting outcome data"],
};

function missionStatusToMetric(status: DailyMission["status"]): MetricStatus {
  if (status === "ready") return "good";
  if (status === "data_gap") return "missing";
  if (status === "urgent") return "urgent";

  return "watch";
}

function countByStatus(items: Array<{ status: string }>, status: string) {
  return items.filter((item) => item.status === status).length;
}

function operationStatusClass(status: "internal" | "degraded" | "external_blocked" | "schema_blocked" | "configuration_blocked") {
  if (status === "internal") return "border-emerald-200 bg-emerald-50 text-emerald-950";
  if (status === "degraded") return "border-amber-200 bg-amber-50 text-amber-950";
  if (status === "schema_blocked") return "border-red-200 bg-red-50 text-red-950";
  if (status === "configuration_blocked") return "border-sky-200 bg-sky-50 text-sky-950";

  return "border-slate-200 bg-slate-50 text-slate-950";
}

function OperationStatusPill({
  status,
  label,
  detail,
}: {
  status: "internal" | "degraded" | "external_blocked" | "schema_blocked" | "configuration_blocked";
  label: string;
  detail: string;
}) {
  return (
    <div className={`rounded-lg border p-3 ${operationStatusClass(status)}`}>
      <p className="break-words text-[11px] font-bold uppercase tracking-[0.08em]">{label}</p>
      <p className="mt-1 break-words text-xs leading-5">{detail}</p>
    </div>
  );
}

function ExecutiveAutonomyLevel1Panel({
  status,
  morningBrief,
  dailyMission,
  onRefresh,
}: {
  status: ExecutiveAutonomyLevel1Status | null;
  morningBrief: MorningBrief | null;
  dailyMission: DailyMission | null;
  onRefresh: () => Promise<void>;
}) {
  const [running, setRunning] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function runDailyStartup() {
    try {
      setRunning(true);
      setError("");
      setMessage("");
      const response = await fetch("/api/company/executive-autonomy/daily-startup", {
        method: "POST",
        headers: { Accept: "application/json" },
      });
      const data = await readJsonResponse<{ ok: boolean; state?: string; morningBrief?: { summary: string }; error?: string }>(response);
      if (!response.ok || !data.ok) throw new Error(data.error || "Unable to run Executive Autonomy Level 1.");
      setMessage(`Daily Startup ${data.state ?? "completed"}: ${data.morningBrief?.summary ?? "Morning Brief prepared."}`);
      await onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to run Executive Autonomy Level 1.");
    } finally {
      setRunning(false);
    }
  }

  async function retryInternalStep() {
    try {
      setRetrying(true);
      setError("");
      setMessage("");
      const response = await fetch("/api/company/internal-operations", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "refresh_internal_intelligence" }),
      });
      const data = await readJsonResponse<ControlledInternalOperationResponse>(response);
      if (!response.ok || !data.ok) throw new Error(data.error || "Unable to retry internal evidence refresh.");
      setMessage(`Internal step refreshed: ${data.stateTransition}; providerCalled:false; externalExecution:false.`);
      await onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to retry internal evidence refresh.");
    } finally {
      setRetrying(false);
    }
  }

  async function regenerateMorningBrief() {
    try {
      setRegenerating(true);
      setError("");
      setMessage("");
      const response = await fetch("/api/company/internal-operations", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "generate_morning_brief" }),
      });
      const data = await readJsonResponse<ControlledInternalOperationResponse>(response);
      if (!response.ok || !data.ok) throw new Error(data.error || "Unable to regenerate Morning Brief.");
      setMessage(`Morning Brief regenerated: ${data.createdRecordType}; providerCalled:false; externalExecution:false.`);
      await onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to regenerate Morning Brief.");
    } finally {
      setRegenerating(false);
    }
  }

  const lastRunState = status?.lastRun.state ?? "not_started";
  const confidence = status?.lastRun.confidence ?? null;
  const exceptions = status?.lastRun.exceptions ?? dailyMission?.urgentCeoDecisions.map((item) => item.title) ?? [];
  const kpiChanges = morningBrief?.keySignals.slice(0, 4) ?? [];

  return (
    <section aria-labelledby="executive-autonomy-l1-heading" className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 md:p-6">
      <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-emerald-900">Executive Autonomy Level 1</p>
          <h1 id="executive-autonomy-l1-heading" className="mt-1 break-words text-3xl font-semibold text-emerald-950 md:text-4xl">
            Daily Startup, Morning Brief, Exceptions
          </h1>
          <p className="mt-2 max-w-5xl break-words text-sm leading-6 text-emerald-950">
            The AI company runs internal daily operations, prepares recommendations, records memory and audit proof, and surfaces only CEO decisions,
            exceptions, KPI movement, and confidence levels.
          </p>
        </div>
        <div className="flex max-w-full flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.1em]">
          <SafetyBadge>providerCalled:{String(status?.safety.providerCalled ?? false)}</SafetyBadge>
          <SafetyBadge>sent:{String(status?.safety.sent ?? false)}</SafetyBadge>
          <SafetyBadge>published:{String(status?.safety.published ?? false)}</SafetyBadge>
          <SafetyBadge tone="urgent">externalExecution:{String(status?.safety.externalExecutionAllowed ?? false)}</SafetyBadge>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <OperationStatusPill
          status={lastRunState === "completed" || lastRunState === "completed_with_exceptions" || lastRunState === "already_completed" ? "internal" : "degraded"}
          label="Last Run"
          detail={`${lastRunState.replaceAll("_", " ")}${status?.lastRun.completedAt ? ` at ${formatTime(status.lastRun.completedAt)}` : ""}`}
        />
        <OperationStatusPill status="internal" label="Next Run" detail={status?.nextRunAt ? formatTime(status.nextRunAt) : "Scheduled for 8:00 AM Central."} />
        <OperationStatusPill status="internal" label="Morning Brief" detail={status?.lastRun.summary ?? morningBrief?.summary ?? "Ready to generate from internal records."} />
        <OperationStatusPill
          status={exceptions.length > 0 ? "degraded" : "internal"}
          label="Exceptions"
          detail={exceptions.length > 0 ? `${exceptions.length} exception(s) or CEO decision(s) visible.` : "No current exceptions reported."}
        />
        <OperationStatusPill
          status={confidence === null || confidence >= 70 ? "internal" : "degraded"}
          label="Data Confidence"
          detail={confidence === null ? "Awaiting first Level 1 run." : `${confidence}% advisory confidence; internal operations remain enabled.`}
        />
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <div className="rounded-lg border border-emerald-100 bg-white p-4">
          <h3 className="break-words text-lg font-semibold text-emerald-950">CEO Focus</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-emerald-900">Approval / Rejection Queue</p>
              <ul className="mt-2 space-y-2 text-sm leading-5 text-emerald-950">
                {(exceptions.length > 0 ? exceptions : ["No high-impact approval exception is currently reported."]).slice(0, 4).map((item) => (
                  <li key={item} className="break-words">{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-emerald-900">KPI Changes</p>
              <ul className="mt-2 space-y-2 text-sm leading-5 text-emerald-950">
                {(kpiChanges.length > 0 ? kpiChanges : [{ id: "pending", label: "KPI changes", value: "Pending", detail: "Run Daily Startup to refresh.", status: "watch" as MetricStatus }]).map((item) => (
                  <li key={item.id} className="break-words">
                    {item.label}: {item.value} - {item.detail}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-emerald-100 bg-white p-4">
          <h3 className="break-words text-lg font-semibold text-emerald-950">Secondary Controls</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={running}
              onClick={() => void runDailyStartup()}
              className="rounded-md bg-emerald-950 px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:bg-emerald-200 disabled:text-emerald-700"
            >
              {running ? "Running..." : "Run Daily Startup Now"}
            </button>
            <button
              type="button"
              disabled={retrying}
              onClick={() => void retryInternalStep()}
              className="rounded-md border border-emerald-200 bg-white px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-emerald-950 transition hover:border-emerald-400 disabled:cursor-not-allowed disabled:text-emerald-700"
            >
              {retrying ? "Retrying..." : "Retry Failed Internal Step"}
            </button>
            <button
              type="button"
              disabled={regenerating}
              onClick={() => void regenerateMorningBrief()}
              className="rounded-md border border-emerald-200 bg-white px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-emerald-950 transition hover:border-emerald-400 disabled:cursor-not-allowed disabled:text-emerald-700"
            >
              {regenerating ? "Regenerating..." : "Regenerate Morning Brief"}
            </button>
          </div>
          {message ? <p className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-950">{message}</p> : null}
          {error ? <p className="mt-3 rounded-md border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-950">{error}</p> : null}
        </div>
      </div>
    </section>
  );
}

function ControlledInternalModeBanner({
  dailyStartup,
  productionReadinessCommand,
}: {
  dailyStartup: DailyStartup | null;
  productionReadinessCommand: ProductionReadinessCommand | null;
}) {
  const internalReady = Boolean(dailyStartup);
  const schemaBlocked = productionReadinessCommand?.schemaStatus === "schema_drift_detected";
  const dryRunBlocked = productionReadinessCommand ? !productionReadinessCommand.dryRunAllowed : true;

  return (
    <section aria-labelledby="controlled-internal-mode-heading" className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 md:p-6">
      <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-emerald-900">Operating Mode</p>
          <h1 id="controlled-internal-mode-heading" className="mt-1 break-words text-3xl font-semibold text-emerald-950 md:text-4xl">
            Controlled Internal Operating Mode
          </h1>
          <p className="mt-2 max-w-5xl break-words text-sm leading-6 text-emerald-950">
            Internal company work is available for approved dashboard actions. Production schema alignment, external execution, provider writes,
            publishing, sending, CRM mutation, scraping, outreach, ads, and automation remain gated.
          </p>
        </div>
        <div className="flex max-w-full flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.1em]">
          <SafetyBadge tone={internalReady ? "good" : "watch"}>internalOperational:{String(internalReady)}</SafetyBadge>
          <SafetyBadge tone="urgent">externalExecution:false</SafetyBadge>
          <SafetyBadge tone={schemaBlocked ? "urgent" : "good"}>schemaBlocked:{String(schemaBlocked)}</SafetyBadge>
          <SafetyBadge tone={dryRunBlocked ? "urgent" : "good"}>dryRunBlocked:{String(dryRunBlocked)}</SafetyBadge>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <OperationStatusPill
          status={internalReady ? "internal" : "configuration_blocked"}
          label={internalReady ? "Internal Operational" : "Configuration Blocked"}
          detail={internalReady ? "Daily Startup, CEO decisions, internal assignments, drafts, memory, and audit records can run." : "Dashboard evidence has not loaded yet."}
        />
        <OperationStatusPill
          status="external_blocked"
          label="External Execution Blocked"
          detail="No provider writes, sends, publishing, CRM mutation, scraping, outreach, ads, automation, or synthetic leads."
        />
        <OperationStatusPill
          status={schemaBlocked ? "schema_blocked" : "internal"}
          label={schemaBlocked ? "Schema Blocked" : "Schema Ready"}
          detail={
            schemaBlocked
              ? "BusinessDataSnapshot hardening still blocks dry-run and snapshot-backed certification."
              : "The readiness command is not reporting BusinessDataSnapshot schema drift."
          }
        />
        <OperationStatusPill
          status={dryRunBlocked ? "degraded" : "internal"}
          label={dryRunBlocked ? "Dry Run Paused" : "Dry Run Available"}
          detail={dryRunBlocked ? "Internal work may continue; dry-run waits for readiness gates." : "Dry-run gate reports ready for internal simulation."}
        />
      </div>
    </section>
  );
}

const approvedExecutionSamples: Record<ApprovedExecutionActionType, Record<string, unknown>> = {
  create_crm_task: {
    title: "Review approved Campaign 001 final package",
    taskType: "approved_execution",
    priority: "high",
    recommendedAction: "Review final approval package and record next decision.",
    reason: "CEO approved internal work and needs a visible CRM task.",
  },
  send_email: {
    to: "recipient@example.com",
    subject: "Approved J Capital follow-up",
    body: "Approved email body goes here.",
  },
  publish_article: {
    title: "Approved article title",
    body: "Approved article body goes here.",
    slug: "approved-article-slug",
  },
  schedule_post: {
    platform: "linkedin",
    copy: "Approved post copy goes here.",
    scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  },
  create_calendar_event: {
    summary: "Approved follow-up review",
    start: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    end: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(),
    description: "CEO-approved calendar event.",
  },
  create_drive_doc: {
    name: "Approved execution notes",
    body: "Approved document body goes here.",
  },
};

function ApprovedExecutionLayerPanel({ onExecutionComplete }: { onExecutionComplete: () => Promise<void> }) {
  const [actionType, setActionType] = useState<ApprovedExecutionActionType>("create_crm_task");
  const [title, setTitle] = useState("Create approved CRM task");
  const [sourceLabel, setSourceLabel] = useState("approved_execution_layer:dashboard");
  const [payloadText, setPayloadText] = useState(JSON.stringify(approvedExecutionSamples.create_crm_task, null, 2));
  const [approvalId, setApprovalId] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function changeAction(nextAction: ApprovedExecutionActionType) {
    setActionType(nextAction);
    setTitle(
      nextAction === "send_email"
        ? "Send approved email"
        : nextAction === "publish_article"
          ? "Publish approved article"
          : nextAction === "schedule_post"
            ? "Schedule approved post"
            : nextAction === "create_calendar_event"
              ? "Create approved calendar event"
              : nextAction === "create_drive_doc"
                ? "Create approved Drive doc"
                : "Create approved CRM task",
    );
    setPayloadText(JSON.stringify(approvedExecutionSamples[nextAction], null, 2));
    setApprovalId("");
    setMessage("");
    setError("");
  }

  async function prepareExecution() {
    try {
      setBusy(true);
      setError("");
      setMessage("");

      const payload = JSON.parse(payloadText) as Record<string, unknown>;
      const response = await fetch("/api/approved-execution/prepare", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          actionType,
          title,
          sourceLabel,
          payload,
        }),
      });
      const data = await readJsonResponse<ApprovedExecutionPrepareResponse>(response);

      if (!response.ok || !data.ok || !data.approvalItem) {
        throw new Error(data.error || "Unable to prepare approved execution.");
      }

      setApprovalId(data.approvalItem.id);
      setMessage(`Prepared ${data.approvalItem.actionType} approval ${data.approvalItem.id}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to prepare approved execution.");
    } finally {
      setBusy(false);
    }
  }

  async function approveExecute() {
    if (!approvalId) {
      setError("Prepare an approved execution item first.");
      return;
    }

    try {
      setBusy(true);
      setError("");
      setMessage("");

      const response = await fetch(`/api/approved-execution/${encodeURIComponent(approvalId)}/execute`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ note: "CEO approved exact one-time execution from dashboard." }),
      });
      const data = await readJsonResponse<ApprovedExecutionRunResponse>(response);

      if (!response.ok || !data.ok || !data.result) {
        throw new Error(data.error || "Unable to execute approved action.");
      }

      setMessage(
        `${data.result.status}: ${data.result.message}${data.result.blockedReason ? ` ${data.result.blockedReason}` : ""} Audit:${String(data.auditLogged)} Memory:${String(data.memoryLogged)} Ref:${data.result.externalReference ?? "none"}`,
      );
      await onExecutionComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to execute approved action.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section aria-labelledby="approved-execution-heading" className="rounded-lg border border-border bg-surface p-5 md:p-6">
      <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">Approved Execution Layer</p>
          <h2 id="approved-execution-heading" className="mt-1 break-words text-2xl font-semibold text-primary">
            Approve One Exact Action
          </h2>
          <p className="mt-2 max-w-4xl break-words text-sm leading-6 text-muted">
            Draft, approve, execute once, log result, and update memory. CRM task creation is internal; provider actions require configured live credentials.
          </p>
        </div>
        <div className="flex max-w-full flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.1em]">
          <SafetyBadge>exactAction:true</SafetyBadge>
          <SafetyBadge>audit:true</SafetyBadge>
          <SafetyBadge>memory:true</SafetyBadge>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-[0.08em] text-muted" htmlFor="approved-execution-action">
            Action
          </label>
          <select
            id="approved-execution-action"
            value={actionType}
            onChange={(event) => changeAction(event.target.value as ApprovedExecutionActionType)}
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-primary outline-none focus:border-primary/40"
          >
            <option value="create_crm_task">Create CRM task</option>
            <option value="send_email">Send email</option>
            <option value="publish_article">Publish article</option>
            <option value="schedule_post">Schedule post</option>
            <option value="create_calendar_event">Create calendar event</option>
            <option value="create_drive_doc">Create Google Drive doc</option>
          </select>

          <label className="block text-xs font-bold uppercase tracking-[0.08em] text-muted" htmlFor="approved-execution-title">
            Title
          </label>
          <input
            id="approved-execution-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-primary outline-none focus:border-primary/40"
          />

          <label className="block text-xs font-bold uppercase tracking-[0.08em] text-muted" htmlFor="approved-execution-source">
            Source
          </label>
          <input
            id="approved-execution-source"
            value={sourceLabel}
            onChange={(event) => setSourceLabel(event.target.value)}
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-primary outline-none focus:border-primary/40"
          />
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-[0.08em] text-muted" htmlFor="approved-execution-payload">
            Payload
          </label>
          <textarea
            id="approved-execution-payload"
            value={payloadText}
            onChange={(event) => setPayloadText(event.target.value)}
            className="min-h-48 w-full rounded-md border border-slate-200 bg-white px-3 py-2 font-mono text-xs leading-5 text-primary outline-none focus:border-primary/40"
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => void prepareExecution()}
              className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-primary transition hover:border-primary/40 disabled:cursor-not-allowed disabled:text-muted"
            >
              Prepare Approval
            </button>
            <button
              type="button"
              disabled={busy || !approvalId}
              onClick={() => void approveExecute()}
              className="rounded-md bg-primary px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
            >
              Approve Execute
            </button>
          </div>
          {approvalId ? <p className="break-words text-xs font-semibold text-primary">Approval ID: {approvalId}</p> : null}
          {message ? <p className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-950">{message}</p> : null}
          {error ? <p className="rounded-md border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-950">{error}</p> : null}
        </div>
      </div>
    </section>
  );
}

function DailyStartupPanel({ startup, onDecisionComplete }: { startup: DailyStartup; onDecisionComplete: () => Promise<void> }) {
  const [decisionNotes, setDecisionNotes] = useState<Record<string, string>>({});
  const [decisionReminders, setDecisionReminders] = useState<Record<string, string>>({});
  const [submittingDecision, setSubmittingDecision] = useState<string | null>(null);
  const [runningInternalWork, setRunningInternalWork] = useState(false);
  const [runningInternalOperation, setRunningInternalOperation] = useState<ControlledInternalOperationAction | null>(null);
  const [decisionError, setDecisionError] = useState("");
  const [decisionSuccess, setDecisionSuccess] = useState("");
  const [internalWorkSuccess, setInternalWorkSuccess] = useState("");
  const [internalOperationSuccess, setInternalOperationSuccess] = useState("");
  const assignments = startup.activation_state?.assignments ?? [];
  const draftQueueItems = startup.activation_state?.draftQueueItems ?? [];
  const latestDecision = startup.activation_state?.latestDecision ?? null;
  const completedAssignments = countByStatus(assignments, "completed_internal");
  const pendingAssignments = countByStatus(assignments, "pending_internal_work");
  const finalReviewDrafts = countByStatus(draftQueueItems, "ready_for_final_approval");
  const completedDrafts = countByStatus(draftQueueItems, "completed_internal");
  const safeInternalWorkReady = startup.ceo_decision_agenda.length > 0 || assignments.length > 0 || draftQueueItems.length > 0;
  const visibleInternalGapCount = startup.provider_readiness.missing + startup.blocked_items.length;

  async function runControlledInternalOperation(action: ControlledInternalOperationAction) {
    try {
      setRunningInternalOperation(action);
      setDecisionError("");
      setInternalOperationSuccess("");

      const response = await fetch("/api/company/internal-operations", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });
      const data = await readJsonResponse<ControlledInternalOperationResponse>(response);

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Unable to run controlled internal operation.");
      }

      setInternalOperationSuccess(
        `${action.replaceAll("_", " ")}: ${data.stateTransition ?? "internal_operational"}; ${data.createdRecordType ?? "record"} ` +
          `${data.createdRecordId ? data.createdRecordId : "updated"}; audit:${String(data.auditEntryCreated)}; providerCalled:false; externalExecution:false.`,
      );
      await onDecisionComplete();
    } catch (err) {
      setDecisionError(err instanceof Error ? err.message : "Unable to run controlled internal operation.");
    } finally {
      setRunningInternalOperation(null);
    }
  }

  async function runInternalWork() {
    try {
      setRunningInternalWork(true);
      setDecisionError("");
      setInternalWorkSuccess("");

      const response = await fetch("/api/company/internal-work/run", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      });
      const data = await readJsonResponse<InternalWorkRunResponse>(response);

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Unable to run internal company work.");
      }

      setInternalWorkSuccess(
        `Internal work completed: ${data.assignmentsAdvanced ?? 0} assignment(s), ${data.draftQueueItemsAdvanced ?? 0} draft item(s), ${data.completedInternalCount ?? 0} completed package(s).`,
      );
      await onDecisionComplete();
    } catch (err) {
      setDecisionError(err instanceof Error ? err.message : "Unable to run internal company work.");
    } finally {
      setRunningInternalWork(false);
    }
  }

  async function submitDecision(item: DailyStartup["ceo_decision_agenda"][number], decision: DirectiveDecision) {
    const note = decisionNotes[item.directive_id]?.trim() ?? "";

    if ((decision === "reject" || decision === "request_changes") && note.length < 3) {
      setDecisionError("Add a short decision note before rejecting or requesting changes.");
      setDecisionSuccess("");
      return;
    }

    const reminderValue = decisionReminders[item.directive_id];
    const reviewReminderAt = decision === "defer" && reminderValue ? new Date(reminderValue).toISOString() : undefined;
    const submissionId = `${item.directive_id}:${decision}`;

    try {
      setSubmittingDecision(submissionId);
      setDecisionError("");
      setDecisionSuccess("");
      setInternalWorkSuccess("");

      const response = await fetch(`/api/company/directives/${encodeURIComponent(item.directive_id)}/decision`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          decision,
          note,
          reviewReminderAt,
        }),
      });
      const data = await readJsonResponse<DirectiveDecisionResponse>(response);

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Unable to save CEO decision.");
      }

      setDecisionSuccess(
        `${item.title} moved to ${data.resultingStatus ?? decision}. Assignments: ${data.assignmentsTotal ?? 0}. Drafts: ${data.draftQueueItemsTotal ?? 0}.`,
      );

      if (decision === "approve") {
        await runInternalWork();
      } else {
        await onDecisionComplete();
      }
    } catch (err) {
      setDecisionError(err instanceof Error ? err.message : "Unable to save CEO decision.");
    } finally {
      setSubmittingDecision(null);
    }
  }

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

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <OperationStatusPill
          status="internal"
          label="Internal Operational"
          detail="Daily Startup, CEO decisions, internal assignments, drafts, memory, and audit records can run."
        />
        <OperationStatusPill
          status={visibleInternalGapCount > 0 ? "degraded" : "internal"}
          label={visibleInternalGapCount > 0 ? "Degraded But Usable" : "Evidence Current"}
          detail={visibleInternalGapCount > 0 ? `${visibleInternalGapCount} visible blocker/gap item(s); internal review can continue.` : "No current Daily Startup blocker or provider gap is visible."}
        />
        <OperationStatusPill
          status="external_blocked"
          label="External Execution Blocked"
          detail="Provider writes, sends, publishing, outreach, CRM mutation, scraping, ads, and automation remain off."
        />
        <OperationStatusPill
          status={startup.draft_queue_summary.blocked > 0 ? "degraded" : "internal"}
          label={startup.draft_queue_summary.blocked > 0 ? "Approval Gated" : "Draft Flow Ready"}
          detail={startup.draft_queue_summary.summary}
        />
        <OperationStatusPill
          status={safeInternalWorkReady ? "internal" : "configuration_blocked"}
          label={safeInternalWorkReady ? "Workflow Evidence Ready" : "Configuration Blocked"}
          detail={safeInternalWorkReady ? "Safe internal actions have existing agenda or queue evidence." : "No internal agenda or queue evidence is loaded."}
        />
      </div>

      <div className="mt-5 rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <h3 className="break-words text-lg font-semibold text-primary">Controlled Internal Operations</h3>
            <p className="mt-1 max-w-4xl break-words text-xs leading-5 text-muted">
              These actions create or refresh internal records only. They do not call providers, send messages, publish, mutate CRM, scrape, or start external execution.
            </p>
          </div>
          <div className="flex max-w-full flex-wrap gap-2">
            {[
              ["start_company", "Start the Company"],
              ["generate_morning_brief", "Generate Morning Brief"],
              ["refresh_internal_intelligence", "Refresh Internal Intelligence"],
              ["record_executive_memory", "Record Executive Memory"],
            ].map(([action, label]) => (
              <button
                key={action}
                type="button"
                disabled={Boolean(runningInternalOperation)}
                onClick={() => void runControlledInternalOperation(action as ControlledInternalOperationAction)}
                className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-primary transition hover:border-primary/40 disabled:cursor-not-allowed disabled:text-muted"
                title="Internal records and audit evidence only. External execution remains blocked."
              >
                {runningInternalOperation === action ? "Working..." : label}
              </button>
            ))}
          </div>
        </div>
        {internalOperationSuccess ? (
          <p className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-950">{internalOperationSuccess}</p>
        ) : null}
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

          <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4">
            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h3 className="break-words text-lg font-semibold text-emerald-950">AI COO Workflow</h3>
                <p className="mt-1 break-words text-xs leading-5 text-emerald-950">
                  Approved CEO decisions now create internal department packages and move drafts to final review.
                </p>
              </div>
              <button
                type="button"
                disabled={runningInternalWork || assignments.length === 0}
                onClick={() => void runInternalWork()}
                className="shrink-0 rounded-md bg-emerald-950 px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:bg-emerald-200 disabled:text-emerald-700"
                title="Runs internal preparation only. No provider calls, publishing, outreach, scraping, ads, CRM mutation, or live execution."
              >
                {runningInternalWork ? "Working..." : "Run Internal Work"}
              </button>
              <button
                type="button"
                disabled={runningInternalWork || assignments.length === 0}
                onClick={() => void runInternalWork()}
                className="shrink-0 rounded-md border border-emerald-200 bg-white px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-emerald-950 transition hover:border-emerald-400 disabled:cursor-not-allowed disabled:bg-emerald-100 disabled:text-emerald-700"
                title="Creates or advances internal draft queue items only. Publishing and provider execution remain blocked."
              >
                Create Internal Drafts
              </button>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-md bg-white p-3">
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-emerald-900">Assignments</p>
                <p className="mt-2 text-3xl font-semibold text-emerald-950">{assignments.length}</p>
                <p className="mt-2 break-words text-xs leading-5 text-emerald-900">
                  {completedAssignments} completed internally, {pendingAssignments} pending.
                </p>
              </div>
              <div className="rounded-md bg-white p-3">
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-emerald-900">Draft Queue</p>
                <p className="mt-2 text-3xl font-semibold text-emerald-950">{draftQueueItems.length}</p>
                <p className="mt-2 break-words text-xs leading-5 text-emerald-900">
                  {finalReviewDrafts} ready for final approval, {completedDrafts} completed internally.
                </p>
              </div>
            </div>
            {internalWorkSuccess ? (
              <p className="mt-3 rounded-md border border-emerald-200 bg-white p-3 text-xs font-semibold text-emerald-950">{internalWorkSuccess}</p>
            ) : null}
            {latestDecision ? (
              <p className="mt-3 break-words text-xs leading-5 text-emerald-950">
                Latest decision: {latestDecision.decision} moved workflow to {latestDecision.resultingStatus} at {formatTime(latestDecision.createdAt)}.
              </p>
            ) : (
              <p className="mt-3 break-words text-xs leading-5 text-emerald-950">No CEO decision has been recorded yet.</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-white p-4">
            <h3 className="break-words text-lg font-semibold text-primary">CEO Decision Agenda</h3>
            {decisionError ? <p className="mt-3 rounded-md border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-900">{decisionError}</p> : null}
            {decisionSuccess ? <p className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-900">{decisionSuccess}</p> : null}
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
                  <label className="mt-3 block text-[11px] font-semibold uppercase tracking-[0.08em] text-muted" htmlFor={`decision-note-${item.directive_id}`}>
                    Decision note
                  </label>
                  <textarea
                    id={`decision-note-${item.directive_id}`}
                    value={decisionNotes[item.directive_id] ?? ""}
                    onChange={(event) => setDecisionNotes((current) => ({ ...current, [item.directive_id]: event.target.value }))}
                    className="mt-2 min-h-20 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-primary outline-none focus:border-primary/40"
                    placeholder="Required for reject or request changes."
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    {fallbackDecisionReasonTemplates[item.recommended_action].slice(0, 4).map((reason) => (
                      <button
                        key={`${item.directive_id}-${reason}`}
                        type="button"
                        onClick={() => setDecisionNotes((current) => ({ ...current, [item.directive_id]: reason }))}
                        className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-muted transition hover:border-primary/30 hover:text-primary"
                      >
                        {reason}
                      </button>
                    ))}
                  </div>
                  <label className="mt-3 block text-[11px] font-semibold uppercase tracking-[0.08em] text-muted" htmlFor={`decision-reminder-${item.directive_id}`}>
                    Defer reminder
                  </label>
                  <input
                    id={`decision-reminder-${item.directive_id}`}
                    type="datetime-local"
                    value={decisionReminders[item.directive_id] ?? ""}
                    onChange={(event) => setDecisionReminders((current) => ({ ...current, [item.directive_id]: event.target.value }))}
                    className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-primary outline-none focus:border-primary/40"
                  />
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(["approve", "reject", "request_changes", "defer"] as const).map((decision) => (
                      <button
                        key={decision}
                        type="button"
                        disabled={Boolean(submittingDecision)}
                        onClick={() => void submitDecision(item, decision)}
                        className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-primary transition hover:border-primary/40 disabled:cursor-not-allowed disabled:text-muted"
                        title="Internal only. Does not publish, send, scrape, call providers, or execute external workflows."
                      >
                        {submittingDecision === `${item.directive_id}:${decision}` ? "Processing CEO Decision..." : formatDecisionLabel(decision)}
                      </button>
                    ))}
                  </div>
                  <p className="mt-3 break-words text-[11px] leading-4 text-muted">
                    Internal only. No publishing, sending, scraping, provider calls, ads, outreach, or external workflow execution.
                  </p>
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

          {assignments.length > 0 || draftQueueItems.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-border bg-white p-4">
                <h3 className="break-words text-sm font-semibold text-primary">Assigned Departments</h3>
                <ul className="mt-3 space-y-2 text-xs leading-5 text-muted">
                  {assignments.slice(0, 8).map((assignment) => (
                    <li key={assignment.id} className="break-words">
                      {assignment.department}: {assignment.status}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-border bg-white p-4">
                <h3 className="break-words text-sm font-semibold text-primary">Internal Draft Items</h3>
                <ul className="mt-3 space-y-2 text-xs leading-5 text-muted">
                  {draftQueueItems.slice(0, 8).map((draft) => (
                    <li key={draft.id} className="break-words">
                      {draft.output}: {draft.status}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function getMemoryStatusColor(status: DepartmentIntelligence["departments"][number]["memoryStatus"]): MetricStatus {
  if (status === "outcome_supported") return "good";
  if (status === "outcome_pending" || status === "memory_started") return "watch";

  return "missing";
}

function DepartmentIntelligencePanel({ intelligence }: { intelligence: DepartmentIntelligence }) {
  return (
    <section aria-labelledby="department-intelligence-heading" className="rounded-lg border border-border bg-surface p-5 md:p-6">
      <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">Department Intelligence</p>
          <h2 id="department-intelligence-heading" className="break-words text-2xl font-semibold text-primary md:text-3xl">
            Department Memory
          </h2>
          <p className="max-w-5xl break-words text-sm leading-6 text-muted">{intelligence.summary}</p>
          <p className="break-words text-xs font-semibold uppercase tracking-[0.08em] text-muted">Generated: {formatTime(intelligence.generatedAt)}</p>
        </div>
        <div className="flex max-w-full flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.1em]">
          <SafetyBadge>providerCalled:{String(intelligence.safety.providerCalled)}</SafetyBadge>
          <SafetyBadge tone="urgent">liveExecution:{String(intelligence.safety.liveExecutionAllowed)}</SafetyBadge>
          <SafetyBadge>approval:{String(intelligence.safety.approvalRequired)}</SafetyBadge>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {intelligence.departments.slice(0, 6).map((department) => (
            <article key={department.department} className="rounded-lg border border-border bg-white p-4">
              <div className="flex min-w-0 items-start justify-between gap-2">
                <h3 className="break-words text-sm font-semibold text-primary">{department.department}</h3>
                <StatusBadge status={getMemoryStatusColor(department.memoryStatus)} />
              </div>
              <p className="mt-2 break-words text-xs font-semibold uppercase tracking-[0.08em] text-muted">
                {department.memoryStatus} | {department.eventCount} event(s)
              </p>
              <p className="mt-3 break-words text-sm leading-6 text-muted">{department.latestLesson}</p>
              <p className="mt-3 break-words text-xs leading-5 text-primary">{department.highRoiFocus}</p>
            </article>
          ))}
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
            <h3 className="break-words text-lg font-semibold text-blue-950">Top recommendations</h3>
            <div className="mt-3 space-y-3">
              {intelligence.topRecommendations.slice(0, 4).map((recommendation) => (
                <article key={recommendation.id} className="rounded-lg border border-blue-200 bg-white p-3">
                  <div className="flex min-w-0 items-start justify-between gap-2">
                    <h4 className="break-words text-sm font-semibold text-primary">{recommendation.title}</h4>
                    <SafetyBadge>{recommendation.score}</SafetyBadge>
                  </div>
                  <p className="mt-2 break-words text-xs leading-5 text-muted">{recommendation.summary}</p>
                  <p className="mt-2 break-words text-xs leading-5 text-primary">{recommendation.expectedBusinessValue}</p>
                  <p className="mt-2 break-words text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                    Source: {recommendation.sourceLabel}
                  </p>
                  <p className="mt-1 break-words text-[11px] leading-4 text-muted">Assumption: {recommendation.assumption}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-amber-100 bg-amber-50 p-4">
            <h3 className="break-words text-lg font-semibold text-amber-950">Learning boundary</h3>
            <p className="mt-2 break-words text-sm leading-6 text-amber-950">
              Department learning is evidence-based and advisory. Departments do not silently change behavior, publish, message, scrape, call providers, or execute workflows.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function getContributionClass(contribution: OperatingCompany["departmentCommandMatrix"][number]["dealContribution"]) {
  if (contribution === "lead_flow") return "border-blue-200 bg-blue-50 text-blue-900";
  if (contribution === "conversion") return "border-emerald-200 bg-emerald-50 text-emerald-900";
  if (contribution === "deal_analysis") return "border-indigo-200 bg-indigo-50 text-indigo-900";
  if (contribution === "trust") return "border-amber-200 bg-amber-50 text-amber-900";
  if (contribution === "governance") return "border-red-200 bg-red-50 text-red-900";

  return "border-slate-200 bg-slate-50 text-slate-800";
}

function getLifecycleClass(status: OperatingCompany["departmentCommandMatrix"][number]["lifecycleStatus"]) {
  if (status === "active") return "border-emerald-200 bg-emerald-50 text-emerald-900";
  if (status === "future_ready") return "border-blue-200 bg-blue-50 text-blue-900";

  return "border-slate-200 bg-slate-50 text-slate-800";
}

function OperatingCompanyPanel({ operatingCompany }: { operatingCompany: OperatingCompany }) {
  const featuredDepartments = operatingCompany.departmentCommandMatrix.filter((item) =>
    [
      "Executive AI",
      "Revenue AI",
      "Lead Intelligence AI",
      "Sales AI",
      "County Records AI",
      "Driving for Dollars AI",
      "Google Maps AI",
      "Marketing AI",
      "Design AI",
      "Operations AI",
      "Approval AI",
      "Security & Governance AI",
    ].includes(item.department),
  );
  const plannedDepartments = operatingCompany.departmentCommandMatrix.filter((item) => item.lifecycleStatus !== "active");
  const handoffByQueueItem = new Map(operatingCompany.workflowHandoffReadiness.map((item) => [item.workQueueItemId, item]));

  return (
    <section aria-labelledby="operating-company-heading" className="rounded-lg border border-border bg-surface p-5 md:p-6">
      <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">AI Business Operating Company</p>
          <h2 id="operating-company-heading" className="break-words text-2xl font-semibold text-primary md:text-3xl">
            Department Command Matrix
          </h2>
          <p className="max-w-5xl break-words text-sm leading-6 text-muted">{operatingCompany.summary}</p>
          <p className="break-words text-xs font-bold uppercase tracking-[0.1em] text-primary">Close goal: {operatingCompany.closeGoal}</p>
        </div>
        <div className="flex max-w-full flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.1em]">
          <SafetyBadge>advisoryOnly:{String(operatingCompany.safetyFlags.advisoryOnly)}</SafetyBadge>
          <SafetyBadge>approval:{String(operatingCompany.safetyFlags.approvalRequired)}</SafetyBadge>
          <SafetyBadge>providerCalled:{String(operatingCompany.safetyFlags.providerCalled)}</SafetyBadge>
          <SafetyBadge tone="urgent">liveExecution:{String(operatingCompany.safetyFlags.liveExecutionAllowed)}</SafetyBadge>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-3">
          <h3 className="break-words text-lg font-semibold text-primary">Deal-closing work queue</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {operatingCompany.dealClosingWorkQueue.map((item) => (
              <article key={item.id} className="rounded-lg border border-border bg-white p-4">
                <Link href={item.href as Route} className="block transition hover:text-primary">
                  <div className="flex min-w-0 items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="break-words text-sm font-semibold text-primary">{item.title}</p>
                      <p className="mt-1 break-words text-xs font-bold uppercase tracking-[0.08em] text-muted">{item.ownerDepartment}</p>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="mt-3 break-words text-3xl font-semibold text-primary">{item.count}</p>
                  <p className="mt-2 break-words text-sm leading-6 text-muted">{item.nextManualAction}</p>
                </Link>
                <p className="mt-3 break-words text-xs font-semibold text-primary">Impact: {item.revenueImpact}</p>
                <p className="mt-2 break-words text-xs leading-5 text-muted">{item.safetyBoundary}</p>
                {handoffByQueueItem.get(item.id) ? (
                  <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <p className="break-words text-xs font-semibold text-primary">Handoff readiness: {handoffByQueueItem.get(item.id)?.nextDepartment}</p>
                    <p className="mt-1 break-words text-xs leading-5 text-muted">Evidence: {handoffByQueueItem.get(item.id)?.evidenceRequired.join(", ")}</p>
                    <p className="mt-1 break-words text-xs leading-5 text-red-900">Recovery: {handoffByQueueItem.get(item.id)?.recoveryPath}</p>
                  </div>
                ) : null}
                <p className="mt-3 break-words text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">Source: {item.sourceLabel}</p>
                <p className="mt-1 break-words text-[11px] leading-4 text-muted">Assumption: {item.assumption}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="break-words text-lg font-semibold text-primary">Department handoffs</h3>
          <div className="space-y-3">
            {featuredDepartments.map((department) => (
              <article key={department.department} className="rounded-lg border border-border bg-white p-4">
                <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h4 className="break-words text-sm font-semibold text-primary">{department.department}</h4>
                    <p className="mt-1 break-words text-xs leading-5 text-muted">{department.operatingRole}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className={`w-fit rounded-full border px-2 py-1 text-[11px] font-bold uppercase tracking-[0.08em] ${getLifecycleClass(department.lifecycleStatus)}`}>
                      {department.lifecycleStatus.replaceAll("_", " ")}
                    </span>
                    <span className={`w-fit rounded-full border px-2 py-1 text-[11px] font-bold uppercase tracking-[0.08em] ${getContributionClass(department.dealContribution)}`}>
                      {department.dealContribution.replaceAll("_", " ")}
                    </span>
                  </div>
                </div>
                <p className="mt-3 break-words text-xs leading-5 text-primary">Output: {department.currentOutput}</p>
                <p className="mt-2 break-words text-xs leading-5 text-muted">Next handoff: {department.nextHandoff}</p>
                <p className="mt-2 break-words text-xs leading-5 text-red-900">Boundary: {department.blocker}</p>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-3">
          <h3 className="break-words text-lg font-semibold text-primary">Planned support departments</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {plannedDepartments.map((department) => (
              <article key={department.department} className="rounded-lg border border-border bg-white p-4">
                <div className="flex min-w-0 items-start justify-between gap-3">
                  <h4 className="break-words text-sm font-semibold text-primary">{department.department}</h4>
                  <span className={`shrink-0 rounded-full border px-2 py-1 text-[11px] font-bold uppercase tracking-[0.08em] ${getLifecycleClass(department.lifecycleStatus)}`}>
                    {department.lifecycleStatus.replaceAll("_", " ")}
                  </span>
                </div>
                <p className="mt-2 break-words text-xs leading-5 text-muted">{department.operatingRole}</p>
                <p className="mt-2 break-words text-xs leading-5 text-red-900">{department.blocker}</p>
                <p className="mt-3 break-words text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">activeExecutionOwner:{String(department.activeExecutionOwner)}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="break-words text-lg font-semibold text-primary">Architecture improvement backlog</h3>
          <div className="space-y-3">
            {operatingCompany.architectureImprovementBacklog.map((item) => (
              <article key={item.id} className="rounded-lg border border-border bg-white p-4">
                <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h4 className="break-words text-sm font-semibold text-primary">{item.title}</h4>
                    <p className="mt-1 break-words text-xs font-bold uppercase tracking-[0.08em] text-muted">{item.ownerDepartment}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-amber-900">{item.risk}</span>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-800">{item.readinessState.replaceAll("_", " ")}</span>
                  </div>
                </div>
                <p className="mt-2 break-words text-sm leading-6 text-muted">{item.businessValue}</p>
                <p className="mt-2 break-words text-xs leading-5 text-primary">Next safe action: {item.nextSafeAction}</p>
                <p className="mt-2 break-words text-xs leading-5 text-muted">Source basis: {item.sourceBasis.map((source) => `${source.category}: ${source.label}`).join("; ")}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <SafetyBadge>approval:{String(item.ceoApprovalRequired)}</SafetyBadge>
                  <SafetyBadge>providerCalled:{String(item.providerCalled)}</SafetyBadge>
                  <SafetyBadge tone="urgent">liveExecution:{String(item.liveExecutionAllowed)}</SafetyBadge>
                </div>
              </article>
            ))}
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

function DailyMissionPanel({ mission }: { mission: DailyMission }) {
  const connectorGaps = mission.connectorHealth.filter((connector) => connector.unifiedStatus !== "healthy").slice(0, 4);
  const dfdPriorities = mission.dfdOperating?.topPriorities.slice(0, 3) ?? [];

  return (
    <section aria-labelledby="daily-mission-heading" className="rounded-lg border border-border bg-surface p-5 md:p-6">
      <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">Canonical Daily Mission</p>
          <h1 id="daily-mission-heading" className="mt-2 break-words text-3xl font-semibold text-primary md:text-4xl">
            {mission.greeting}
          </h1>
          <p className="mt-3 max-w-5xl break-words text-sm leading-6 text-muted">{mission.summary}</p>
        </div>
        <div className="flex max-w-full flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.1em]">
          <StatusBadge status={missionStatusToMetric(mission.status)} label={mission.status.replaceAll("_", " ")} />
          <SafetyBadge>CEO time: {mission.estimatedCeoTimeMinutes} min</SafetyBadge>
          <SafetyBadge>providerCalled:{String(mission.safetyFlags.providerCalled)}</SafetyBadge>
          <SafetyBadge tone="urgent">liveExecution:{String(mission.safetyFlags.liveExecutionAllowed)}</SafetyBadge>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_1fr]">
        <div className="space-y-4">
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
            <h2 className="break-words text-lg font-semibold text-blue-950">Overnight Summary</h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-blue-950">
              {mission.overnightSummary.slice(0, 5).map((line) => (
                <li key={line} className="break-words">{line}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-white p-4">
            <h2 className="break-words text-lg font-semibold text-primary">Urgent CEO Decisions</h2>
            <div className="mt-3 space-y-3">
              {mission.urgentCeoDecisions.length > 0 ? (
                mission.urgentCeoDecisions.slice(0, 4).map((decision) => (
                  <article key={decision.id} className="rounded-md border border-slate-200 bg-slate-50 p-3">
                    <div className="flex min-w-0 items-start justify-between gap-3">
                      <h3 className="break-words text-sm font-semibold text-primary">{decision.title}</h3>
                      <SafetyBadge>{decision.riskLevel}</SafetyBadge>
                    </div>
                    <p className="mt-2 break-words text-xs leading-5 text-muted">{decision.reason}</p>
                  </article>
                ))
              ) : (
                <p className="text-sm leading-6 text-muted">No urgent CEO decisions are queued.</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-border bg-white p-4">
              <h2 className="break-words text-sm font-semibold text-primary">Drafts Ready</h2>
              <p className="mt-2 text-3xl font-semibold text-primary">{mission.draftsReady.length}</p>
              <ul className="mt-3 space-y-2 text-xs leading-5 text-muted">
                {mission.draftsReady.slice(0, 3).map((draft) => (
                  <li key={draft.id} className="break-words">{draft.title} · {draft.department}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-border bg-white p-4">
              <h2 className="break-words text-sm font-semibold text-primary">Lead Priorities</h2>
              <p className="mt-2 text-3xl font-semibold text-primary">{mission.leadPriorities.length}</p>
              <ul className="mt-3 space-y-2 text-xs leading-5 text-muted">
                {mission.leadPriorities.slice(0, 3).map((lead) => (
                  <li key={lead.leadId} className="break-words">{lead.source}: {lead.recommendedAction}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4">
            <h2 className="break-words text-lg font-semibold text-emerald-950">Revenue Priorities</h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-emerald-950">
              {mission.revenuePriorities.slice(0, 4).map((priority) => (
                <li key={priority.id} className="break-words">{priority.title}</li>
              ))}
            </ul>
          </div>

          {mission.dfdOperating ? (
            <div className="rounded-lg border border-violet-100 bg-violet-50 p-4">
              <h2 className="break-words text-lg font-semibold text-violet-950">DFD AI Operating Conductor</h2>
              <p className="mt-2 break-words text-sm leading-6 text-violet-950">{mission.dfdOperating.summary}</p>
              <div className="mt-3 grid gap-2 text-xs leading-5 text-violet-950 sm:grid-cols-3">
                <p>Priorities: <span className="font-semibold">{mission.dfdOperating.totals.propertyReviewPriorities}</span></p>
                <p>Stops: <span className="font-semibold">{mission.dfdOperating.totals.governanceStops}</span></p>
                <p>Bottlenecks: <span className="font-semibold">{mission.dfdOperating.totals.acquisitionBottlenecks}</span></p>
              </div>
              <ul className="mt-3 space-y-2 text-xs leading-5 text-violet-950">
                {dfdPriorities.length > 0 ? dfdPriorities.map((priority) => (
                  <li key={priority.id} className="break-words">
                    {priority.title} · {priority.assignedDepartment} · ROI {priority.roiRank}
                  </li>
                )) : <li>No DFD property priorities are visible yet.</li>}
              </ul>
            </div>
          ) : null}

          <div className="rounded-lg border border-amber-100 bg-amber-50 p-4">
            <h2 className="break-words text-lg font-semibold text-amber-950">Connector/Data Gaps</h2>
            <ul className="mt-3 space-y-2 text-xs leading-5 text-amber-950">
              {(connectorGaps.length > 0 ? connectorGaps.map((connector) => `${connector.displayName}: ${connector.lastDataGap ?? connector.unifiedStatus}`) : mission.dataGaps.slice(0, 4)).map((gap) => (
                <li key={gap} className="break-words">{gap}</li>
              ))}
              {connectorGaps.length === 0 && mission.dataGaps.length === 0 ? <li>No connector data gaps are visible.</li> : null}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function connectorActivationStatus(status: ConnectorActivationReport["connectors"][number]["status"]): MetricStatus {
  if (status === "connected" || status === "internal_ready") return "good";
  if (status === "credentials_missing" || status === "data_gap") return "watch";
  if (status === "registry_only") return "missing";

  return "urgent";
}

function readinessStatusToMetric(status: ProductionReadinessCommand["status"] | ProductionReadinessDepartment["status"]): MetricStatus {
  if (status === "ready" || status === "read_only") return "good";
  if (status === "blocked") return "urgent";

  return "watch";
}

function readinessStatusLabel(status: ProductionReadinessCommand["status"] | ProductionReadinessDepartment["status"]) {
  if (status === "ready") return "Ready";
  if (status === "read_only") return "Internal Ready";
  if (status === "degraded") return "Degraded Usable";
  if (status === "blocked") return "Schema Blocked";

  return "Watch";
}

function ProductionReadinessCommandPanel({ command }: { command: ProductionReadinessCommand }) {
  const blockedDepartments = command.departmentCompatibility.filter((department) => department.status === "blocked").length;
  const degradedDepartments = command.departmentCompatibility.filter((department) => department.status === "degraded").length;
  const readOnlyDepartments = command.departmentCompatibility.filter((department) => department.status === "read_only").length;

  return (
    <section aria-labelledby="production-readiness-command-heading" className="rounded-lg border border-border bg-surface p-5 md:p-6">
      <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">Operator Go/No-Go</p>
          <h1 id="production-readiness-command-heading" className="break-words text-3xl font-semibold text-primary md:text-4xl">
            {command.title}
          </h1>
          <p className="max-w-4xl break-words text-sm leading-6 text-muted">{command.nextSafeAction}</p>
        </div>
        <div className="flex max-w-full flex-wrap gap-2">
          <StatusBadge status={readinessStatusToMetric(command.status)} label={readinessStatusLabel(command.status)} />
          <SafetyBadge tone="good">providerCalled:false</SafetyBadge>
          <SafetyBadge tone="good">crmMutation:false</SafetyBadge>
          <SafetyBadge tone="good">automation:false</SafetyBadge>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard className="bg-white">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Schema alignment</p>
          <p className="mt-2 break-words text-2xl font-semibold text-primary">{command.schemaStatus.replaceAll("_", " ")}</p>
          <p className="mt-2 break-words text-xs leading-5 text-muted">
            {command.pendingMigration ? `Pending migration ${command.requiredMigration}` : `Migration ${command.requiredMigration}`}
          </p>
        </DashboardCard>
        <DashboardCard className="bg-white">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Production blockers</p>
          <p className="mt-2 text-3xl font-semibold text-primary">{command.blockerCount}</p>
          <p className="mt-2 text-xs leading-5 text-muted">{command.dryRunAllowed ? "Dry-run preflight is clear." : "Dry-run is paused until schema verification passes."}</p>
        </DashboardCard>
        <DashboardCard className="bg-white">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Operational review available</p>
          <p className="mt-2 text-3xl font-semibold text-primary">{command.departmentCompatibility.length - blockedDepartments}</p>
          <p className="mt-2 text-xs leading-5 text-muted">{readOnlyDepartments} read-only, {degradedDepartments} degraded, {blockedDepartments} blocked.</p>
        </DashboardCard>
        <DashboardCard className="bg-white">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Data gaps</p>
          <p className="mt-2 text-3xl font-semibold text-primary">{command.dataGapCount}</p>
          <p className="mt-2 text-xs leading-5 text-muted">Gaps do not authorize provider reads, outreach, or automation.</p>
        </DashboardCard>
      </div>

      {command.missingColumns.length > 0 ? (
        <div className="mt-4 rounded-lg border border-red-100 bg-red-50 p-4">
          <h2 className="break-words text-lg font-semibold text-red-950">Schema Blocker</h2>
          <p className="mt-2 break-words text-sm leading-6 text-red-950">
            Missing BusinessDataSnapshot column(s): {command.missingColumns.join(", ")}. This blocks snapshot-backed certification and dry-run only.
            Controlled internal dashboard work remains available below. Apply only the approved schema alignment path after operator verification.
          </p>
          <p className="mt-2 break-words text-xs font-semibold text-red-900">{command.migrationPath}</p>
        </div>
      ) : null}

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {command.departmentCompatibility.map((department) => (
          <Link key={department.id} href={department.href as Route} className="min-w-0 rounded-lg border border-border bg-white p-4 transition hover:border-primary/30">
            <div className="flex min-w-0 items-start justify-between gap-3">
              <p className="break-words text-sm font-semibold text-primary">{department.label}</p>
              <StatusBadge status={readinessStatusToMetric(department.status)} label={readinessStatusLabel(department.status)} />
            </div>
            <p className="mt-2 break-words text-xs leading-5 text-muted">{department.detail}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function ConnectorActivationReportPanel({ report }: { report: ConnectorActivationReport }) {
  const primaryRows = report.connectors
    .filter((connector) =>
      [
        "google_workspace",
        "gmail",
        "google_calendar",
        "google_drive",
        "google_search_console",
        "google_analytics",
        "google_business_profile",
        "youtube",
        "canva",
        "lead_database",
        "crm",
        "property_pipeline",
      ].includes(connector.connectorId),
    )
    .slice(0, 12);

  return (
    <section aria-labelledby="connector-activation-heading" className="rounded-lg border border-border bg-surface p-5 md:p-6">
      <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">Live Business Data Activation</p>
          <h2 id="connector-activation-heading" className="mt-2 break-words text-2xl font-semibold text-primary">
            Connector Activation Report
          </h2>
          <p className="mt-3 max-w-5xl break-words text-sm leading-6 text-muted">{report.summary}</p>
        </div>
        <div className="flex max-w-full flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.1em]">
          <SafetyBadge>readOnly:{String(report.safetyFlags.readOnly)}</SafetyBadge>
          <SafetyBadge>providerCalled:{String(report.safetyFlags.providerCalled)}</SafetyBadge>
          <SafetyBadge tone="urgent">liveExecution:{String(report.safetyFlags.liveExecutionAllowed)}</SafetyBadge>
          <SafetyBadge>workflowStarted:{String(report.safetyFlags.workflowStarted)}</SafetyBadge>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-lg border border-border bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Connected reads</p>
          <p className="mt-2 text-3xl font-semibold text-primary">{report.totals.connected}</p>
        </div>
        <div className="rounded-lg border border-border bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Internal ready</p>
          <p className="mt-2 text-3xl font-semibold text-primary">{report.totals.internalReady}</p>
        </div>
        <div className="rounded-lg border border-border bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Credential gaps</p>
          <p className="mt-2 text-3xl font-semibold text-primary">{report.totals.credentialsMissing}</p>
        </div>
        <div className="rounded-lg border border-border bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Data gaps</p>
          <p className="mt-2 text-3xl font-semibold text-primary">{report.totals.dataGaps}</p>
        </div>
        <div className="rounded-lg border border-border bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Total connectors</p>
          <p className="mt-2 text-3xl font-semibold text-primary">{report.totals.connectors}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        {primaryRows.map((connector) => (
          <article key={connector.connectorId} className="rounded-lg border border-border bg-white p-4">
            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h3 className="break-words text-sm font-semibold text-primary">{connector.connectorName}</h3>
                <p className="mt-1 break-words text-xs leading-5 text-muted">{connector.businessUseCase}</p>
              </div>
              <StatusBadge status={connectorActivationStatus(connector.status)} label={connector.status.replaceAll("_", " ")} />
            </div>
            <div className="mt-3 grid gap-2 text-xs leading-5 text-muted sm:grid-cols-2">
              <p className="break-words">ROI tier: <span className="font-semibold text-primary">{connector.roiPriority}</span></p>
              <p className="break-words">Deal flow: <span className="font-semibold text-primary">{connector.dealFlowImpact}</span></p>
              <p className="break-words">Department: <span className="font-semibold text-primary">{connector.departmentUsingIt}</span></p>
              <p className="break-words">Credentials: <span className="font-semibold text-primary">{connector.credentialsPresent ? "present" : "missing"}</span></p>
              <p className="break-words">Last read: <span className="font-semibold text-primary">{connector.lastSuccessfulRead ? formatTime(connector.lastSuccessfulRead) : "not yet"}</span></p>
              <p className="break-words">Read-only: <span className="font-semibold text-primary">{String(connector.readOnly)}</span></p>
            </div>
            <p className="mt-3 break-words text-xs leading-5 text-primary">Revenue: {connector.revenueUseCase}</p>
            {connector.sourceRecords.length > 0 ? (
              <p className="mt-3 break-words text-xs leading-5 text-emerald-900">Proof: {connector.sourceRecords[0]}</p>
            ) : null}
            <p className="mt-3 break-words text-xs leading-5 text-muted">Next: {connector.lastFailure ?? connector.nextRevenueAction ?? connector.nextRequiredAction}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProductionDryRunPanel({ readinessCommand }: { readinessCommand: ProductionReadinessCommand | null }) {
  const [report, setReport] = useState<ProductionDryRunReport | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");
  const dryRunAllowed = readinessCommand?.dryRunAllowed ?? true;

  async function runDryRun() {
    if (!dryRunAllowed) {
      setError(readinessCommand?.nextSafeAction ?? "Production dry-run is paused until readiness verification passes.");
      return;
    }

    try {
      setRunning(true);
      setError("");
      const response = await fetch("/api/company/production-dry-run", {
        method: "POST",
        cache: "no-store",
        headers: { Accept: "application/json" },
      });
      const data = await readJsonResponse<ProductionDryRunReport & { error?: string }>(response);

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Unable to run production dry run.");
      }

      setReport(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to run production dry run.");
    } finally {
      setRunning(false);
    }
  }

  return (
    <section aria-labelledby="production-dry-run-heading" className="rounded-lg border border-border bg-surface p-5 md:p-6">
      <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">Sprint 24 Production Dry Run</p>
          <h2 id="production-dry-run-heading" className="mt-2 break-words text-2xl font-semibold text-primary">
            Full-Day Operating Simulation
          </h2>
          <p className="mt-3 max-w-5xl break-words text-sm leading-6 text-muted">
            Runs one internal business-day loop using stored data and read-only snapshots. It writes internal audit traces only and keeps external execution blocked.
          </p>
          {!dryRunAllowed ? (
            <p className="mt-2 break-words text-sm font-semibold text-red-700">
              Dry-run is paused until Production schema alignment is verified.
            </p>
          ) : null}
        </div>
        <div className="flex max-w-full flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.1em]">
          <SafetyBadge>providerCalled:false</SafetyBadge>
          <SafetyBadge>sent:false</SafetyBadge>
          <SafetyBadge>published:false</SafetyBadge>
          <SafetyBadge tone="urgent">liveExecution:false</SafetyBadge>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={runDryRun}
          disabled={running || !dryRunAllowed}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {running ? "Running dry run..." : "Run production dry run"}
        </button>
        {error ? <p className="break-words text-sm font-semibold text-red-700">{error}</p> : null}
        {report ? <p className="break-words text-sm text-muted">Latest trace: {report.traceId}</p> : null}
      </div>

      {report ? (
        <div className="mt-5 space-y-4">
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
            <h3 className="break-words text-lg font-semibold text-blue-950">{report.summary}</h3>
            <div className="mt-3 grid gap-3 text-sm leading-6 text-blue-950 sm:grid-cols-2 xl:grid-cols-4">
              <p>DFD priorities: <span className="font-semibold">{report.businessWorkProduced.dfdPropertyPriorities}</span></p>
              <p>Work orders: <span className="font-semibold">{report.businessWorkProduced.departmentWorkOrders}</span></p>
              <p>Drafts: <span className="font-semibold">{report.businessWorkProduced.draftWorkspaceItems}</span></p>
              <p>Approvals: <span className="font-semibold">{report.businessWorkProduced.approvalQueueItems}</span></p>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <div className="rounded-lg border border-border bg-white p-4">
              <h3 className="break-words text-lg font-semibold text-primary">Loop Proof</h3>
              <ul className="mt-3 space-y-2 text-xs leading-5 text-muted">
                {report.loopSteps.map((step) => (
                  <li key={`${step.sourceStep}-${step.targetStep}`} className="break-words">
                    {step.sourceStep} {"->"} {step.targetStep}: {step.status}, audit:{String(step.auditRecorded)}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-amber-100 bg-amber-50 p-4">
              <h3 className="break-words text-lg font-semibold text-amber-950">Execution, Audit, Memory</h3>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-amber-950">
                <li>Approved execution: {report.approvedExecutionValidation.blockedReason}</li>
                <li>Audit traces: {report.auditProof.traceRecordsRecorded}/{report.auditProof.traceRecordsAttempted}</li>
                <li>Memory eligibility: {String(report.memoryEligibility.eligible)}; written:{String(report.memoryEligibility.memoryWritten)}</li>
                <li>Outcome placeholder: {report.businessOutcomePlaceholder.status}</li>
              </ul>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4">
              <h3 className="break-words text-lg font-semibold text-emerald-950">Tomorrow Recommendations</h3>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-emerald-950">
                {report.tomorrowRecommendations.slice(0, 5).map((item) => (
                  <li key={`${item.sourceLabel}-${item.title}`} className="break-words">{item.title}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-red-100 bg-red-50 p-4">
              <h3 className="break-words text-lg font-semibold text-red-950">Production Blockers</h3>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-red-950">
                {(report.remainingProductionBlockers.length > 0 ? report.remainingProductionBlockers : ["No dry-run blockers reported."]).slice(0, 6).map((item) => (
                  <li key={item} className="break-words">{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export function ExecutiveDashboardClient() {
  const [productionReadinessCommand, setProductionReadinessCommand] = useState<ProductionReadinessCommand | null>(null);
  const [dailyStartup, setDailyStartup] = useState<DailyStartup | null>(null);
  const [revenueCommandCenter, setRevenueCommandCenter] = useState<RevenueCommandCenter | null>(null);
  const [executiveWorkforce, setExecutiveWorkforce] = useState<ExecutiveWorkforce | null>(null);
  const [departmentIntelligence, setDepartmentIntelligence] = useState<DepartmentIntelligence | null>(null);
  const [operatingCompany, setOperatingCompany] = useState<OperatingCompany | null>(null);
  const [executiveAutonomyStatus, setExecutiveAutonomyStatus] = useState<ExecutiveAutonomyLevel1Status | null>(null);
  const [dailyMission, setDailyMission] = useState<DailyMission | null>(null);
  const [connectorActivation, setConnectorActivation] = useState<ConnectorActivationReport | null>(null);
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
      const [response, autonomyResponse] = await Promise.all([
        fetch("/api/executive-dashboard", {
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
        }),
        fetch("/api/company/executive-autonomy/status", {
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
        }),
      ]);
      const data = await readJsonResponse<ExecutiveDashboardResponse>(response);
      const autonomyData = await readJsonResponse<ExecutiveAutonomyLevel1Status>(autonomyResponse);

      if (!response.ok || !data.ok || !data.widgets) {
        throw new Error(data.error || "Failed to load executive dashboard.");
      }

      setProductionReadinessCommand(data.productionReadinessCommand ?? null);
      setDailyStartup(data.dailyStartup ?? null);
      setRevenueCommandCenter(data.revenueCommandCenter ?? null);
      setExecutiveWorkforce(data.executiveWorkforce ?? null);
      setDepartmentIntelligence(data.departmentIntelligence ?? null);
      setOperatingCompany(data.operatingCompany ?? null);
      setExecutiveAutonomyStatus(autonomyResponse.ok && autonomyData.ok ? autonomyData : null);
      setDailyMission(data.dailyMission ?? null);
      setConnectorActivation(data.connectorActivation ?? null);
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

      <ExecutiveAutonomyLevel1Panel
        status={executiveAutonomyStatus}
        morningBrief={morningBrief}
        dailyMission={dailyMission}
        onRefresh={loadDashboard}
      />
      <ControlledInternalModeBanner dailyStartup={dailyStartup} productionReadinessCommand={productionReadinessCommand} />
      {productionReadinessCommand ? <ProductionReadinessCommandPanel command={productionReadinessCommand} /> : null}
      {dailyMission ? <DailyMissionPanel mission={dailyMission} /> : null}
      <ProductionDryRunPanel readinessCommand={productionReadinessCommand} />
      {connectorActivation ? <ConnectorActivationReportPanel report={connectorActivation} /> : null}
      {dailyStartup ? <DailyStartupPanel startup={dailyStartup} onDecisionComplete={loadDashboard} /> : null}
      <ApprovedExecutionLayerPanel onExecutionComplete={loadDashboard} />
      {operatingCompany ? <OperatingCompanyPanel operatingCompany={operatingCompany} /> : null}
      {revenueCommandCenter ? <RevenueCommandCenterPanel commandCenter={revenueCommandCenter} /> : null}
      {executiveWorkforce ? <ExecutiveWorkforcePanel workforce={executiveWorkforce} /> : null}
      {departmentIntelligence ? <DepartmentIntelligencePanel intelligence={departmentIntelligence} /> : null}

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
