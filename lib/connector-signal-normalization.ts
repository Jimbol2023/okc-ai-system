import type { AiWorkforceDepartmentName, AiWorkforceReport } from "@/lib/ai-workforce";
import type { DailyRevenueOperatingLoopReport, DailyRevenueWorkOrder } from "@/lib/daily-revenue-operating-loop";
import type { BusinessDataSnapshotRecord } from "@/lib/read-only-business-connections";

export type ConnectorSignalFreshness = "fresh" | "partial" | "stale" | "blocked" | "rate_limited";
export type ConnectorSignalType =
  | "inbound_lead_signal"
  | "ceo_schedule_context"
  | "document_readiness_signal"
  | "seo_opportunity_signal"
  | "conversion_signal"
  | "local_trust_signal"
  | "content_performance_signal"
  | "connector_blocker_signal";

export type ConnectorBusinessSignal = {
  id: string;
  connectorId: string;
  sourceLabel: string;
  signalType: ConnectorSignalType;
  summary: string;
  freshness: ConnectorSignalFreshness;
  confidence: number;
  missingData: string[];
  safeNextAction: string;
  sourceEvidenceHash: string | null;
  observationWindow: { start: string | null; end: string | null };
  rawPayloadIncluded: false;
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type RoutedConnectorSignal = ConnectorBusinessSignal & {
  department: AiWorkforceDepartmentName;
  aiManager: string;
  aiEmployee: string;
  aiEmployeeId: string;
  reason: string;
  approvalRequirement: string;
};

export type ConnectorDailyWorkOrderContext = {
  workOrderId: string;
  connectorContext: Array<{
    signalId: string;
    connectorId: string;
    sourceLabel: string;
    freshness: ConnectorSignalFreshness;
    confidence: number;
    missingData: string[];
    safeNextAction: string;
    ceoReviewRequired: boolean;
  }>;
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type ConnectorMemoryKpiReadiness = {
  signalId: string;
  department: AiWorkforceDepartmentName;
  revenueKpiAffected: string;
  aiEmployee: string;
  recommendedMemoryEvent: {
    eventType: "connector_business_signal_observed";
    source: "connector_signal_normalization";
    metadata: Record<string, string | number | boolean | string[]>;
  };
  recommendedKpiUpdate: {
    kpi: string;
    direction: "increase" | "decrease" | "watch";
    reason: string;
  };
  persistenceAllowed: false;
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type ConnectorSignalFoundationReport = {
  ok: true;
  generatedAt: string;
  signals: ConnectorBusinessSignal[];
  routedSignals: RoutedConnectorSignal[];
  workOrderContexts: ConnectorDailyWorkOrderContext[];
  memoryKpiReadiness: ConnectorMemoryKpiReadiness[];
  safety: {
    readOnly: true;
    rawPayloadsBlocked: true;
    providerCalled: false;
    liveExecutionAllowed: false;
    memoryWritesAllowed: false;
    kpiWritesAllowed: false;
    externalProviderWritesAllowed: false;
  };
  providerCalled: false;
  liveExecutionAllowed: false;
};

const routingByType: Record<ConnectorSignalType, { department: AiWorkforceDepartmentName; employeeHints: string[]; kpi: string }> = {
  inbound_lead_signal: { department: "Lead Generation", employeeHints: ["Lead Research Analyst AI", "Source Quality Analyst AI"], kpi: "qualified seller lead flow" },
  ceo_schedule_context: { department: "CEO Office", employeeHints: ["CEO Executive Assistant AI", "Daily Briefing Analyst AI"], kpi: "CEO decision throughput" },
  document_readiness_signal: { department: "Operations", employeeHints: ["System Blocker Analyst AI", "Connector Health Monitor AI"], kpi: "deal document readiness" },
  seo_opportunity_signal: { department: "SEO", employeeHints: ["SEO Director AI", "Search Console Analyst AI"], kpi: "organic seller acquisition" },
  conversion_signal: { department: "Marketing", employeeHints: ["Marketing Director AI", "Campaign Planner AI"], kpi: "site conversion awareness" },
  local_trust_signal: { department: "SEO", employeeHints: ["Local SEO / GBP Specialist AI", "SEO Director AI"], kpi: "local trust and conversion" },
  content_performance_signal: { department: "Content", employeeHints: ["Content Director AI", "Video Script Writer AI"], kpi: "content-assisted seller acquisition" },
  connector_blocker_signal: { department: "Operations", employeeHints: ["Connector Health Monitor AI", "System Blocker Analyst AI"], kpi: "connector readiness" },
};

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 90) || "signal";
}

function typeForSnapshot(snapshot: BusinessDataSnapshotRecord): ConnectorSignalType {
  if (snapshot.status === "blocked" || snapshot.status === "data_gap") return "connector_blocker_signal";
  if (snapshot.category === "gmail_inbox") return "inbound_lead_signal";
  if (snapshot.category === "google_calendar_events") return "ceo_schedule_context";
  if (snapshot.category === "google_drive_documents") return "document_readiness_signal";
  if (snapshot.category === "search_console_performance" || snapshot.category === "search_console_indexing") return "seo_opportunity_signal";
  if (snapshot.category === "google_analytics_traffic") return "conversion_signal";
  if (snapshot.category === "google_business_profile_performance" || snapshot.category === "google_business_profile_reviews") return "local_trust_signal";
  if (snapshot.category === "youtube_channel") return "content_performance_signal";

  return "connector_blocker_signal";
}

function freshnessForSnapshot(snapshot: BusinessDataSnapshotRecord): ConnectorSignalFreshness {
  if (snapshot.status === "fresh") return "fresh";
  if (snapshot.status === "partial") return "partial";
  if (snapshot.status === "stale") return "stale";
  if (/rate/i.test(snapshot.dataGaps.join(" "))) return "rate_limited";

  return "blocked";
}

function confidenceForFreshness(freshness: ConnectorSignalFreshness) {
  if (freshness === "fresh") return 85;
  if (freshness === "partial") return 65;
  if (freshness === "stale") return 45;
  if (freshness === "rate_limited") return 25;

  return 20;
}

function safeNextAction(signalType: ConnectorSignalType, snapshot: BusinessDataSnapshotRecord) {
  if (snapshot.dataGaps.length > 0) return `Resolve connector data gap: ${snapshot.dataGaps[0]}`;
  if (signalType === "inbound_lead_signal") return "Create internal lead review work only; do not email, text, or call.";
  if (signalType === "seo_opportunity_signal") return "Prepare internal SEO/content recommendation for CEO review.";
  if (signalType === "conversion_signal") return "Prepare internal conversion review; do not change tags, analytics, or website.";
  if (signalType === "local_trust_signal") return "Prepare internal GBP trust review; do not reply, post, or publish.";

  return "Route signal to the owning department for internal review only.";
}

export function normalizeConnectorSnapshotsToSignals(snapshots: BusinessDataSnapshotRecord[], generatedAt = new Date().toISOString()): ConnectorBusinessSignal[] {
  return snapshots.map((snapshot, index) => {
    const signalType = typeForSnapshot(snapshot);
    const freshness = freshnessForSnapshot(snapshot);

    return {
      id: ["connector-signal", generatedAt.slice(0, 10), slug(snapshot.connectorId), slug(snapshot.category), index].join("-"),
      connectorId: snapshot.connectorId,
      sourceLabel: snapshot.sourceLabel,
      signalType,
      summary: snapshot.summary.slice(0, 280),
      freshness,
      confidence: confidenceForFreshness(freshness),
      missingData: snapshot.dataGaps.slice(0, 6),
      safeNextAction: safeNextAction(signalType, snapshot),
      sourceEvidenceHash: typeof snapshot.evidenceHash === "string" ? snapshot.evidenceHash : null,
      observationWindow: {
        start: snapshot.observationStart ? new Date(snapshot.observationStart).toISOString() : null,
        end: snapshot.observationEnd ? new Date(snapshot.observationEnd).toISOString() : null,
      },
      rawPayloadIncluded: false,
      providerCalled: false,
      liveExecutionAllowed: false,
    };
  });
}

function pickEmployee(workforce: AiWorkforceReport, department: AiWorkforceDepartmentName, hints: string[]) {
  return (
    workforce.employees.find((employee) => employee.department === department && hints.includes(employee.name)) ??
    workforce.employees.find((employee) => employee.department === department) ??
    workforce.employees[0]
  );
}

export function routeConnectorSignalsToDepartments(signals: ConnectorBusinessSignal[], workforce: AiWorkforceReport): RoutedConnectorSignal[] {
  return signals.map((signal) => {
    const route = routingByType[signal.signalType];
    const employee = pickEmployee(workforce, route.department, route.employeeHints);

    return {
      ...signal,
      department: route.department,
      aiManager: employee?.manager ?? `${route.department} Manager`,
      aiEmployee: employee?.name ?? "Unassigned AI Employee",
      aiEmployeeId: employee?.id ?? "unassigned",
      reason: `${signal.connectorId} produced ${signal.signalType}; route to ${route.department} for internal handling.`,
      approvalRequirement: "CEO approval required before any external execution, publishing, outreach, or provider write.",
    };
  });
}

export function createDailyWorkOrderConnectorContexts(
  dailyLoop: DailyRevenueOperatingLoopReport,
  routedSignals: RoutedConnectorSignal[],
): ConnectorDailyWorkOrderContext[] {
  return dailyLoop.workOrders
    .map((order: DailyRevenueWorkOrder) => {
      const matching = routedSignals
        .filter((signal) => signal.department === order.department || signal.aiEmployeeId === order.aiEmployeeId)
        .slice(0, 3);

      return {
        workOrderId: order.id,
        connectorContext: matching.map((signal) => ({
          signalId: signal.id,
          connectorId: signal.connectorId,
          sourceLabel: signal.sourceLabel,
          freshness: signal.freshness,
          confidence: signal.confidence,
          missingData: signal.missingData,
          safeNextAction: signal.safeNextAction,
          ceoReviewRequired: /CEO approval/i.test(signal.approvalRequirement),
        })),
        providerCalled: false as const,
        liveExecutionAllowed: false as const,
      };
    })
    .filter((context) => context.connectorContext.length > 0);
}

export function createConnectorMemoryKpiReadiness(routedSignals: RoutedConnectorSignal[]): ConnectorMemoryKpiReadiness[] {
  return routedSignals.map((signal) => {
    const kpi = routingByType[signal.signalType].kpi;

    return {
      signalId: signal.id,
      department: signal.department,
      revenueKpiAffected: kpi,
      aiEmployee: signal.aiEmployee,
      recommendedMemoryEvent: {
        eventType: "connector_business_signal_observed",
        source: "connector_signal_normalization",
        metadata: {
          signalId: signal.id,
          connectorId: signal.connectorId,
          sourceLabel: signal.sourceLabel,
          department: signal.department,
          aiEmployee: signal.aiEmployee,
          confidence: signal.confidence,
          freshness: signal.freshness,
          evidenceHash: signal.sourceEvidenceHash ?? "not_persisted",
          observationWindowStart: signal.observationWindow.start ?? "not_available",
          observationWindowEnd: signal.observationWindow.end ?? "not_available",
          recommendedReviewReason: signal.safeNextAction,
          persistenceAllowed: false,
        },
      },
      recommendedKpiUpdate: {
        kpi,
        direction: signal.freshness === "fresh" || signal.freshness === "partial" ? "watch" : "decrease",
        reason: signal.safeNextAction,
      },
      persistenceAllowed: false,
      providerCalled: false,
      liveExecutionAllowed: false,
    };
  });
}

export function createConnectorSignalFoundationReportFromInputs(input: {
  snapshots: BusinessDataSnapshotRecord[];
  workforce: AiWorkforceReport;
  dailyLoop: DailyRevenueOperatingLoopReport;
  generatedAt?: string;
}): ConnectorSignalFoundationReport {
  const generatedAt = input.generatedAt ?? input.dailyLoop.generatedAt ?? input.workforce.generatedAt ?? new Date().toISOString();
  const signals = normalizeConnectorSnapshotsToSignals(input.snapshots, generatedAt);
  const routedSignals = routeConnectorSignalsToDepartments(signals, input.workforce);
  const workOrderContexts = createDailyWorkOrderConnectorContexts(input.dailyLoop, routedSignals);
  const memoryKpiReadiness = createConnectorMemoryKpiReadiness(routedSignals);
  const report: ConnectorSignalFoundationReport = {
    ok: true,
    generatedAt,
    signals,
    routedSignals,
    workOrderContexts,
    memoryKpiReadiness,
    safety: {
      readOnly: true,
      rawPayloadsBlocked: true,
      providerCalled: false,
      liveExecutionAllowed: false,
      memoryWritesAllowed: false,
      kpiWritesAllowed: false,
      externalProviderWritesAllowed: false,
    },
    providerCalled: false,
    liveExecutionAllowed: false,
  };
  assertConnectorSignalFoundationSafety(report);

  return report;
}

export function assertConnectorSignalFoundationSafety(report: ConnectorSignalFoundationReport) {
  const unsafe = [
    report.providerCalled,
    report.liveExecutionAllowed,
    report.safety.providerCalled,
    report.safety.liveExecutionAllowed,
    report.safety.memoryWritesAllowed,
    report.safety.kpiWritesAllowed,
    report.safety.externalProviderWritesAllowed,
    !report.safety.rawPayloadsBlocked,
    report.signals.some((signal) => signal.rawPayloadIncluded || signal.providerCalled || signal.liveExecutionAllowed),
    report.routedSignals.some((signal) => signal.providerCalled || signal.liveExecutionAllowed),
    report.workOrderContexts.some((context) => context.providerCalled || context.liveExecutionAllowed),
    report.memoryKpiReadiness.some((item) => item.persistenceAllowed || item.providerCalled || item.liveExecutionAllowed),
  ];

  if (unsafe.some(Boolean)) {
    throw new Error("Connector signal foundation safety contract failed.");
  }

  return true;
}
