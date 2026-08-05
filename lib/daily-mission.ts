import { loadPartialData } from "@/lib/api-response";
import { getCompanyActivationSnapshot, type CompanyActivationSnapshot } from "@/lib/company-activation";
import type { ExecutiveDirective } from "@/lib/company-orchestrator";
import { getCeoDraftWorkspaceReport, type CeoDraftWorkspaceReport } from "@/lib/company-draft-workspace";
import { normalizeConnectorHealth } from "@/lib/connector-health-contract";
import { getConnectorHealth } from "@/lib/connector-platform";
import { createDfdOperatingReportFromInputs, type DfdOperatingReport } from "@/lib/dfd-operating-conductor";
import { listDbLeads } from "@/lib/leads-db";
import { createProviderReadinessReport, type ProviderReadinessReport, type ProviderReadinessStatus } from "@/lib/provider-readiness";
import { getLatestBusinessSnapshots, getLatestLiveMorningBrief, type BusinessDataSnapshotRecord, type LiveMorningBrief } from "@/lib/read-only-business-connections";
import { createRevenueCommandCenter, type RevenueCommandCenterReport } from "@/lib/revenue-spine";
import { requireTenantId } from "@/lib/tenant-context";

export const dailyMissionSafetyFlags = {
  readOnly: true,
  providerCalled: false,
  liveExecutionAllowed: false,
  published: false,
  sent: false,
  workflowStarted: false,
  outreachBlocked: true,
  scrapingBlocked: true,
  adsBlocked: true,
  emailBlocked: true,
  smsBlocked: true,
  crmMutationBlocked: true,
  externalActionsBlocked: true,
  approvalRequired: true,
} as const;

export type DailyMissionStatus = "ready" | "watch" | "urgent" | "data_gap";

export type DailyMissionConnectorHealth = {
  connectorId: string;
  displayName: string;
  connected: boolean;
  authenticated: boolean;
  readOnly: true;
  healthy: boolean;
  lastFailure: string | null;
  sourceLabel: string;
  unifiedStatus: "healthy" | "degraded" | "missing_credentials" | "readiness_only";
  registryStatus: string;
  providerReadinessStatus: ProviderReadinessStatus | "not_listed";
  lastSuccessfulRead: string | null;
  lastDataGap: string | null;
  authentication: "configured" | "partial" | "missing" | "no_credentials_required" | "not_required" | "unknown";
  permissions: string[];
  dataFreshness: string;
  readOnlyProviderCalled: boolean;
  liveExecutionAllowed: false;
};

export type DailyMissionDecision = {
  id: string;
  title: string;
  reason: string;
  expectedBusinessValue: string;
  riskLevel: ExecutiveDirective["risk_level"];
  status: ExecutiveDirective["approval_status"];
  recommendedAction: "approve" | "reject" | "request_changes" | "defer" | "review";
  sourceLabel: string;
  approvalRequired: true;
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type DailyMissionDraft = {
  id: string;
  title: string;
  department: string;
  directiveId: string;
  status: string;
  approvalStatus: string;
  sourceLabel: string;
  confidence: number;
  approvalRequired: true;
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type DailyMissionRevenuePriority = {
  id: string;
  title: string;
  detail: string;
  sourceLabel: string;
  confidence: number;
  approvalRequired: true;
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type DailyMissionLeadPriority = {
  leadId: string;
  source: string;
  propertyAddress: string;
  priority: string;
  score: number;
  recommendedAction: string;
  missingData: string[];
  sourceLabel: string;
  approvalRequired: true;
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type DailyMission = {
  ok: true;
  missionDate: string;
  generatedAt: string;
  title: "CEO Daily Mission";
  greeting: "Good Morning Moses";
  summary: string;
  status: DailyMissionStatus;
  overnightSummary: string[];
  urgentCeoDecisions: DailyMissionDecision[];
  draftsReady: DailyMissionDraft[];
  revenuePriorities: DailyMissionRevenuePriority[];
  leadPriorities: DailyMissionLeadPriority[];
  connectorHealth: DailyMissionConnectorHealth[];
  dfdOperating: DfdOperatingReport | null;
  dataGaps: string[];
  estimatedCeoTimeMinutes: number;
  sourceLabels: string[];
  morningBrief: LiveMorningBrief;
  safetyFlags: typeof dailyMissionSafetyFlags;
  providerCalled: false;
  liveExecutionAllowed: false;
  published: false;
  sent: false;
  workflowStarted: false;
};

export type DailyMissionInputs = {
  morningBrief: LiveMorningBrief;
  activationSnapshot?: CompanyActivationSnapshot | null;
  draftWorkspace?: CeoDraftWorkspaceReport | null;
  revenueCommandCenter?: RevenueCommandCenterReport | null;
  connectorRegistryHealth?: ReturnType<typeof getConnectorHealth>;
  providerReadiness?: ProviderReadinessReport;
  dfdOperating?: DfdOperatingReport | null;
  businessSnapshots?: BusinessDataSnapshotRecord[];
  generatedAt?: string;
  dataGaps?: string[];
};

const directiveStatusesForCeo = new Set<ExecutiveDirective["approval_status"]>([
  "recommended",
  "awaiting_ceo_approval",
  "changes_requested",
  "deferred",
  "executive_review",
  "ready_for_final_approval",
]);

function todayIso(generatedAt: string) {
  return generatedAt.slice(0, 10);
}

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

function providerStatusForConnector(connectorId: string, displayName: string, providerReadiness?: ProviderReadinessReport) {
  const normalizedId = normalize(connectorId);
  const normalizedName = normalize(displayName);

  return providerReadiness?.providers.find((provider) => normalize(provider.id) === normalizedId || normalize(provider.label) === normalizedName);
}

function createUnifiedConnectorHealth(input: DailyMissionInputs): DailyMissionConnectorHealth[] {
  const normalizedById = new Map(
    normalizeConnectorHealth({
      morningBrief: input.morningBrief,
      providerReadiness: input.providerReadiness,
    }).map((connector) => [connector.connectorId, connector]),
  );
  const liveById = new Map(input.morningBrief.connectorHealth.map((connector) => [connector.connectorId, connector]));
  const registry = input.connectorRegistryHealth ?? [];

  const registryHealth = registry.map((connector) => {
    const live = liveById.get(connector.connectorId);
    const provider = providerStatusForConnector(connector.connectorId, connector.displayName, input.providerReadiness);
    const normalized = normalizedById.get(connector.connectorId);
    const hasMissingCredentials = provider?.status === "missing" || Boolean(live?.lastDataGap);
    const hasSuccessfulRead = Boolean(live?.lastSuccessfulRead);
    const unifiedStatus: DailyMissionConnectorHealth["unifiedStatus"] = hasSuccessfulRead
      ? "healthy"
      : hasMissingCredentials
        ? "missing_credentials"
          : connector.healthStatus === "readiness_only"
          ? "readiness_only"
          : "degraded";

    return {
      connectorId: connector.connectorId,
      displayName: connector.displayName,
      connected: normalized?.connected ?? hasSuccessfulRead,
      authenticated: normalized?.authenticated ?? provider?.status === "configured",
      readOnly: true as const,
      healthy: normalized?.healthy ?? unifiedStatus === "healthy",
      lastFailure: normalized?.lastFailure ?? live?.lastDataGap ?? connector.lastFailedSync ?? null,
      sourceLabel: normalized?.sourceLabel ?? `connector:${connector.connectorId}:health`,
      unifiedStatus,
      registryStatus: connector.healthStatus,
      providerReadinessStatus: (provider?.status ?? "not_listed") as DailyMissionConnectorHealth["providerReadinessStatus"],
      lastSuccessfulRead: live?.lastSuccessfulRead ?? null,
      lastDataGap: live?.lastDataGap ?? null,
      authentication: (provider?.connectionState === "not_required" ? "not_required" : provider?.status ?? "unknown") as DailyMissionConnectorHealth["authentication"],
      permissions: provider?.permissionsRequired ?? [],
      dataFreshness: normalized?.dataFreshness ?? live?.lastSuccessfulRead ?? (live?.lastDataGap ? "data_gap" : "not_synced"),
      readOnlyProviderCalled: live?.providerCalled ?? false,
      liveExecutionAllowed: false as const,
    };
  });

  const internalConnectors = [...normalizedById.values()].filter((connector) => !registry.some((item) => item.connectorId === connector.connectorId));

  return [
    ...registryHealth,
    ...internalConnectors.map((connector) => ({
      connectorId: connector.connectorId,
      displayName: connector.displayName,
      connected: connector.connected,
      authenticated: connector.authenticated,
      readOnly: true as const,
      healthy: connector.healthy,
      lastFailure: connector.lastFailure,
      sourceLabel: connector.sourceLabel,
      unifiedStatus: connector.healthy ? ("healthy" as const) : connector.authenticated ? ("degraded" as const) : ("missing_credentials" as const),
      registryStatus: "internal_read_only",
      providerReadinessStatus: "not_listed" as const,
      lastSuccessfulRead: connector.lastSuccessfulRead,
      lastDataGap: connector.lastFailure,
      authentication: connector.authenticated ? ("configured" as const) : ("missing" as const),
      permissions: connector.permissions,
      dataFreshness: connector.dataFreshness,
      readOnlyProviderCalled: connector.providerCalled,
      liveExecutionAllowed: false as const,
    })),
  ];
}

function decisionFromDirective(directive: ExecutiveDirective): DailyMissionDecision {
  const recommendedAction =
    directive.approval_status === "changes_requested" ? "request_changes" : directive.approval_status === "deferred" ? "defer" : "review";

  return {
    id: directive.id,
    title: directive.title,
    reason: directive.governance_notes[0] ?? "CEO review is required before internal work changes.",
    expectedBusinessValue: directive.expected_business_value,
    riskLevel: directive.risk_level,
    status: directive.approval_status,
    recommendedAction,
    sourceLabel: `executive_directive:${directive.id}`,
    approvalRequired: true,
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

function createUrgentDecisions(activationSnapshot?: CompanyActivationSnapshot | null) {
  const directives = activationSnapshot?.directives ?? [];
  const explicit = directives.filter((directive) => directiveStatusesForCeo.has(directive.approval_status)).map(decisionFromDirective);

  return explicit.slice(0, 5);
}

function createDraftsReady(draftWorkspace?: CeoDraftWorkspaceReport | null) {
  return (draftWorkspace?.groups ?? [])
    .flatMap((group) => group.drafts)
    .filter((draft) => draft.approvalStatus === "pending_ceo_review" || draft.approvalStatus === "changes_requested")
    .slice(0, 6)
    .map((draft) => ({
      id: draft.id,
      title: draft.title,
      department: draft.department,
      directiveId: draft.directiveId,
      status: draft.status,
      approvalStatus: draft.approvalStatus,
      sourceLabel: draft.metadata.sourceLabel,
      confidence: draft.confidence,
      approvalRequired: true as const,
      providerCalled: false as const,
      liveExecutionAllowed: false as const,
    }));
}

function createRevenuePriorities(revenueCommandCenter?: RevenueCommandCenterReport | null): DailyMissionRevenuePriority[] {
  if (!revenueCommandCenter) {
    return [
      {
        id: "revenue-command-center-data-gap",
        title: "Review revenue command center data gap",
        detail: "Revenue Command Center did not load; review system health before revenue decisions.",
        sourceLabel: "revenue_command_center:data_gap",
        confidence: 35,
        approvalRequired: true,
        providerCalled: false,
        liveExecutionAllowed: false,
      },
    ];
  }

  return revenueCommandCenter.executiveBriefing.recommendedActions.slice(0, 4).map((action, index) => ({
    id: `revenue-priority-${index + 1}`,
    title: action,
    detail: revenueCommandCenter.executiveBriefing.risks[index] ?? revenueCommandCenter.executiveBriefing.summary,
    sourceLabel: "revenue_spine:command_center",
    confidence: Math.max(50, 78 - index * 6),
    approvalRequired: true,
    providerCalled: false,
    liveExecutionAllowed: false,
  }));
}

function createDfdRevenuePriorities(dfdOperating?: DfdOperatingReport | null): DailyMissionRevenuePriority[] {
  return (dfdOperating?.topPriorities ?? []).slice(0, 4).map((priority, index) => ({
    id: `dfd-roi-priority-${index + 1}`,
    title: priority.title,
    detail: `${priority.nextInternalAction} ${priority.rationale}`,
    sourceLabel: `dfd_operating_conductor:${priority.leadId}`,
    confidence: Math.max(60, Math.min(94, priority.roiRank)),
    approvalRequired: true as const,
    providerCalled: false as const,
    liveExecutionAllowed: false as const,
  }));
}

function createLeadPriorities(revenueCommandCenter?: RevenueCommandCenterReport | null): DailyMissionLeadPriority[] {
  return (revenueCommandCenter?.inbox ?? []).slice(0, 5).map((item) => ({
    leadId: item.lead.id,
    source: item.lead.source || "Unknown source",
    propertyAddress: item.lead.propertyAddress || "Property address not captured",
    priority: item.lead.priority || item.latestScore?.priority || "Low",
    score: item.latestScore?.score ?? item.lead.score ?? 0,
    recommendedAction: item.recommendedAction,
    missingData: item.latestScore?.missingData ?? [],
    sourceLabel: `lead:${item.lead.id}:revenue_spine`,
    approvalRequired: true,
    providerCalled: false,
    liveExecutionAllowed: false,
  }));
}

function estimateCeoTimeMinutes(input: {
  morningBrief: LiveMorningBrief;
  decisions: DailyMissionDecision[];
  drafts: DailyMissionDraft[];
  revenuePriorities: DailyMissionRevenuePriority[];
  leadPriorities: DailyMissionLeadPriority[];
  dataGaps: string[];
}) {
  const minutes =
    input.morningBrief.estimatedCeoTimeMinutes +
    input.decisions.length * 3 +
    input.drafts.length * 2 +
    Math.min(8, input.revenuePriorities.length * 2) +
    Math.min(8, input.leadPriorities.length) +
    Math.min(5, input.dataGaps.length);

  return Math.max(12, Math.min(45, minutes));
}

export function createDailyMissionFromInputs(input: DailyMissionInputs): DailyMission {
  const generatedAt = input.generatedAt ?? new Date().toISOString();
  const decisions = createUrgentDecisions(input.activationSnapshot);
  const drafts = createDraftsReady(input.draftWorkspace);
  const dfdOperating = input.dfdOperating ?? null;
  const revenuePriorities = [...createDfdRevenuePriorities(dfdOperating), ...createRevenuePriorities(input.revenueCommandCenter)].slice(0, 6);
  const leadPriorities = createLeadPriorities(input.revenueCommandCenter);
  const connectorHealth = createUnifiedConnectorHealth(input);
  const dataGaps = [
    ...(input.dataGaps ?? []),
    ...input.morningBrief.dataGaps,
    ...(dfdOperating?.dataGaps ?? []),
    ...connectorHealth.flatMap((connector) => (connector.lastDataGap ? [`${connector.displayName}: ${connector.lastDataGap}`] : [])),
  ];
  const uniqueDataGaps = [...new Set(dataGaps.filter(Boolean))];
  const status: DailyMissionStatus =
    decisions.length > 0 || leadPriorities.length > 0
      ? "urgent"
      : drafts.length > 0 || revenuePriorities.length > 0
        ? "watch"
        : uniqueDataGaps.length > 0
          ? "data_gap"
          : "ready";
  const sourceLabels = [
    ...input.morningBrief.sourceLabels,
    ...decisions.map((decision) => decision.sourceLabel),
    ...drafts.map((draft) => draft.sourceLabel),
    ...revenuePriorities.map((priority) => priority.sourceLabel),
    ...leadPriorities.map((priority) => priority.sourceLabel),
  ];

  return {
    ok: true,
    missionDate: todayIso(generatedAt),
    generatedAt,
    title: "CEO Daily Mission",
    greeting: "Good Morning Moses",
    summary:
      decisions.length + drafts.length + revenuePriorities.length + leadPriorities.length > 0
        ? `${decisions.length} CEO decision(s), ${drafts.length} draft(s), ${revenuePriorities.length} revenue priority item(s), and ${leadPriorities.length} lead priority item(s) are ready for review.`
        : "No urgent operating work is queued; review connector/data gaps and monitor live business snapshots.",
    status,
    overnightSummary: input.morningBrief.overnightSummary,
    urgentCeoDecisions: decisions,
    draftsReady: drafts,
    revenuePriorities,
    leadPriorities,
    connectorHealth,
    dfdOperating,
    dataGaps: uniqueDataGaps,
    estimatedCeoTimeMinutes: estimateCeoTimeMinutes({
      morningBrief: input.morningBrief,
      decisions,
      drafts,
      revenuePriorities,
      leadPriorities,
      dataGaps: uniqueDataGaps,
    }),
    sourceLabels: [...new Set(sourceLabels.filter(Boolean))],
    morningBrief: input.morningBrief,
    safetyFlags: dailyMissionSafetyFlags,
    providerCalled: false,
    liveExecutionAllowed: false,
    published: false,
    sent: false,
    workflowStarted: false,
  };
}

export async function getDailyMission(tenantIdValue: string): Promise<DailyMission> {
  const tenantId = requireTenantId(tenantIdValue, "daily_mission");
  const [morningBriefResult, activationResult, draftWorkspaceResult, leadsResult, snapshotsResult, providerReadiness] = await Promise.all([
    loadPartialData("Live Morning Brief", () => getLatestLiveMorningBrief(tenantId), null),
    loadPartialData("Company activation", getCompanyActivationSnapshot, null),
    loadPartialData("CEO Draft Workspace", () => getCeoDraftWorkspaceReport(tenantId), null),
    loadPartialData("Lead", () => listDbLeads({ tenantId }), []),
    loadPartialData("Business snapshots", () => getLatestBusinessSnapshots(tenantId, 40), []),
    Promise.resolve(createProviderReadinessReport()),
  ]);
  const revenueResult = await loadPartialData("Revenue Command Center", () => createRevenueCommandCenter(tenantId, leadsResult.data), null);
  const dfdOperating = createDfdOperatingReportFromInputs({ tenantId, leads: leadsResult.data, snapshots: snapshotsResult.data });

  return createDailyMissionFromInputs({
    morningBrief: morningBriefResult.data ?? (await getLatestLiveMorningBrief(tenantId)),
    activationSnapshot: activationResult.data,
    draftWorkspace: draftWorkspaceResult.data,
    revenueCommandCenter: revenueResult.data,
    connectorRegistryHealth: getConnectorHealth(),
    providerReadiness,
    dfdOperating,
    businessSnapshots: snapshotsResult.data,
    dataGaps: [morningBriefResult.gap, activationResult.gap, draftWorkspaceResult.gap, leadsResult.gap, snapshotsResult.gap, revenueResult.gap].filter(Boolean),
  });
}
