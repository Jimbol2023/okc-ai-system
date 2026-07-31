import type { BusinessDataSnapshotRecord } from "@/lib/read-only-business-connections";
import { createCrossConnectorIntelligenceReport } from "@/lib/cross-connector-intelligence";
import type { BuyerDemandOpportunityPrioritizationV1 } from "@/lib/buyer-demand-opportunity-prioritization";

export const searchMarketDeliverableIds = [
  "seo-growth-plan",
  "executive-seo-brief",
  "local-visibility-report",
  "content-opportunity-portfolio",
  "measurement-limitations-brief",
  "monday-search-market-intelligence-packet",
] as const;

export type SearchMarketDeliverableId = (typeof searchMarketDeliverableIds)[number];
export type SearchMarketEvidenceSnapshotV1 = BusinessDataSnapshotRecord & {
  tenantId: string;
  contractVersion: "business-data-snapshot-v1";
  evidenceHash: string;
};
export type SearchMarketMaterialityPolicyV1 = {
  relativeChangePercent: 20;
  minimumImpressionChange: 25;
  minimumClickChange: 3;
  topCohortSize: 10;
  completeDataLagDays: 3;
  windowDays: 28;
};
export const searchMarketMaterialityPolicy: SearchMarketMaterialityPolicyV1 = { relativeChangePercent: 20, minimumImpressionChange: 25, minimumClickChange: 3, topCohortSize: 10, completeDataLagDays: 3, windowDays: 28 };

export type SearchMarketObservationWindowsV1 = { current: { startDate: string; endDate: string }; comparison: { startDate: string; endDate: string } };
export function createSearchMarketObservationWindows(now = new Date()): SearchMarketObservationWindowsV1 {
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  end.setUTCDate(end.getUTCDate() - searchMarketMaterialityPolicy.completeDataLagDays);
  const start = new Date(end); start.setUTCDate(start.getUTCDate() - (searchMarketMaterialityPolicy.windowDays - 1));
  const comparisonEnd = new Date(start); comparisonEnd.setUTCDate(comparisonEnd.getUTCDate() - 1);
  const comparisonStart = new Date(comparisonEnd); comparisonStart.setUTCDate(comparisonStart.getUTCDate() - (searchMarketMaterialityPolicy.windowDays - 1));
  const date = (value: Date) => value.toISOString().slice(0, 10);
  return { current: { startDate: date(start), endDate: date(end) }, comparison: { startDate: date(comparisonStart), endDate: date(comparisonEnd) } };
}

function numberMetric(snapshot: BusinessDataSnapshotRecord | undefined, key: string) {
  const value = snapshot?.metrics?.[key];
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function topDimensions(snapshot: BusinessDataSnapshotRecord | undefined) {
  return new Set((snapshot?.records ?? []).slice(0, searchMarketMaterialityPolicy.topCohortSize).map((record) => typeof record.dimension === "string" ? record.dimension : typeof record.page === "string" ? record.page : typeof record.query === "string" ? record.query : "").filter(Boolean));
}

export function evaluateSearchMarketMateriality(current: BusinessDataSnapshotRecord[], previous: BusinessDataSnapshotRecord[]) {
  if (current.length === 0) return { material: false, reasons: ["no_current_evidence"] } as const;
  if (previous.length === 0) return { material: true, reasons: ["initial_evidence"] } as const;
  const reasons: string[] = [];
  for (const snapshot of current) {
    const prior = previous.find((candidate) => candidate.connectorId === snapshot.connectorId && candidate.category === snapshot.category);
    if (!prior || prior.status !== snapshot.status) reasons.push(`evidence_state_changed:${snapshot.connectorId}:${snapshot.category}`);
    if (snapshot.category === "search_console_indexing" && prior?.summary !== snapshot.summary) reasons.push("indexing_state_changed");
    const currentDimensions = topDimensions(snapshot); const priorDimensions = topDimensions(prior);
    if ([...currentDimensions].some((value) => !priorDimensions.has(value)) || [...priorDimensions].some((value) => !currentDimensions.has(value))) reasons.push(`top_cohort_changed:${snapshot.category}`);
    for (const [metric, minimum] of [["impressions", searchMarketMaterialityPolicy.minimumImpressionChange], ["clicks", searchMarketMaterialityPolicy.minimumClickChange]] as const) {
      const next = numberMetric(snapshot, metric); const before = numberMetric(prior, metric);
      if (next == null || before == null) continue;
      const absolute = Math.abs(next - before); const relative = before === 0 ? (next === 0 ? 0 : 100) : Math.abs((next - before) / before) * 100;
      if (relative >= searchMarketMaterialityPolicy.relativeChangePercent && absolute >= minimum) reasons.push(`${metric}_material_change`);
    }
  }
  return { material: reasons.length > 0, reasons: [...new Set(reasons)] };
}

export function assertTenantSearchMarketEvidence(tenantId: string, snapshots: BusinessDataSnapshotRecord[]): asserts snapshots is SearchMarketEvidenceSnapshotV1[] {
  if (!tenantId.trim()) throw new Error("tenant_id_required");
  for (const snapshot of snapshots) {
    if (snapshot.tenantId !== tenantId) throw new Error("cross_tenant_search_evidence_blocked");
    if (snapshot.contractVersion !== "business-data-snapshot-v1" || !snapshot.evidenceHash) throw new Error("search_evidence_contract_invalid");
  }
}

export type SearchMarketDeliverableV1 = {
  schemaVersion: "search-market-deliverable-v1";
  deliverableId: SearchMarketDeliverableId;
  responsibleProfessionalId: string;
  independentReviewerId: "marketing-quality-reviewer";
  observationWindow: SearchMarketObservationWindowsV1;
  evidenceCutoff: string;
  sourceReferences: string[];
  provenance: string[];
  verifiedObservations: string[];
  assumptions: string[];
  conflicts: string[];
  missingData: string[];
  recommendedManualDecision: string;
  qaStatus: "qa_required";
  authorityLimitations: string[];
  noActionFallback: string;
};

export type SearchMarketIntelligencePacketV1 = {
  schemaVersion: "search-market-intelligence-packet-v1";
  tenantId: string;
  packetKind: "delta" | "monday";
  evidenceCutoff: string;
  observationWindows: SearchMarketObservationWindowsV1;
  deliverables: SearchMarketDeliverableV1[];
  topCeoDecisions: Array<{ priority: number; title: string; rationale: string; evidenceReferences: string[]; humanDecisionRequired: true }>;
  evidenceHashes: string[];
  dataGaps: string[];
  promotionState: "calibration_ready";
  providerCalledByAssembly: false;
  externalWritesAllowed: false;
  liveExecutionAllowed: false;
};

const ownerByDeliverable: Record<SearchMarketDeliverableId, string> = {
  "seo-growth-plan": "senior-seo-director",
  "executive-seo-brief": "senior-seo-director",
  "local-visibility-report": "local-visibility-specialist",
  "content-opportunity-portfolio": "content-intelligence-strategist",
  "measurement-limitations-brief": "senior-analytics-specialist",
  "monday-search-market-intelligence-packet": "marketing-intelligence-director",
};

export function createSearchMarketIntelligencePacket(input: { tenantId: string; packetKind: "delta" | "monday"; snapshots: BusinessDataSnapshotRecord[]; buyerDemandPrioritization?: BuyerDemandOpportunityPrioritizationV1 | null; now?: Date }): SearchMarketIntelligencePacketV1 {
  assertTenantSearchMarketEvidence(input.tenantId, input.snapshots);
  const now = input.now ?? new Date(); const evidenceCutoff = now.toISOString(); const observationWindows = createSearchMarketObservationWindows(now);
  const gsc = input.snapshots.filter((snapshot) => snapshot.connectorId === "google_search_console");
  const ga4 = input.snapshots.find((snapshot) => snapshot.connectorId === "google_analytics");
  const gbp = input.snapshots.find((snapshot) => snapshot.connectorId === "google_business_profile");
  const crossConnector = createCrossConnectorIntelligenceReport({ tenantId: input.tenantId, snapshots: input.snapshots, generatedAt: evidenceCutoff });
  const sourceReferences = [...new Set([...input.snapshots.map((snapshot) => snapshot.sourceLabel).filter(Boolean), ...crossConnector.evidenceReferences.map((reference) => reference.sourceLabel)])];
  const verifiedObservations = [
    ...gsc.filter((snapshot) => snapshot.status === "fresh" || snapshot.status === "partial").map((snapshot) => snapshot.summary),
    ...(ga4 && (ga4.status === "fresh" || ga4.status === "partial") ? [`GA4 read-only evidence: ${ga4.summary}`] : []),
    ...(gbp && (gbp.status === "fresh" || gbp.status === "partial") ? [`GBP read-only evidence: ${gbp.summary}`] : []),
    ...crossConnector.foundUsSignals.map((signal) => `Cross-connector found-us signal: ${signal.summary}`),
    ...crossConnector.visitedPageSignals.map((signal) => `Cross-connector visited-page signal: ${signal.summary}`),
    ...crossConnector.localTrustSignals.map((signal) => `Cross-connector local-trust signal: ${signal.summary}`),
    ...(input.buyerDemandPrioritization ? input.buyerDemandPrioritization.priorities.slice(0, 3).map((priority) => `Buyer-demand review priority: ${priority.title} (${priority.score}/100).`) : []),
  ];
  const dataGaps = [...new Set([...input.snapshots.flatMap((snapshot) => snapshot.dataGaps), ...crossConnector.dataGaps, ...(input.buyerDemandPrioritization?.dataGaps ?? []), ...(!ga4 ? ["GA4 evidence is unavailable; conversion and attribution conclusions are blocked."] : []), ...(!gbp ? ["Google Business Profile evidence is unavailable; local visibility conclusions are blocked."] : []), ...(gsc.length === 0 ? ["Search Console evidence is unavailable."] : [])])];
  const common = { schemaVersion: "search-market-deliverable-v1" as const, independentReviewerId: "marketing-quality-reviewer" as const, observationWindow: observationWindows, evidenceCutoff, sourceReferences, provenance: input.snapshots.map((snapshot) => snapshot.provenance), verifiedObservations, assumptions: ["No traffic, ranking, conversion, or revenue outcome is forecast.", "GA4 key-event evidence is conversion-readiness context only, not proof of closed revenue.", "GBP evidence is local visibility and review-readiness context only; it does not authorize profile changes or replies."], conflicts: [], missingData: dataGaps, qaStatus: "qa_required" as const, authorityLimitations: ["Internal advisory analysis only.", "No publishing, website changes, provider writes, CRM mutations, outreach, or workflow execution."], noActionFallback: "Retain the current state and request verified evidence; connector availability never creates a fact or authority." };
  const decisions = verifiedObservations.slice(0, 5).map((observation, index) => ({ priority: index + 1, title: `Review verified search observation ${index + 1}`, rationale: observation, evidenceReferences: sourceReferences, humanDecisionRequired: true as const }));
  const deliverables = searchMarketDeliverableIds.map((deliverableId) => ({ ...common, deliverableId, responsibleProfessionalId: ownerByDeliverable[deliverableId], recommendedManualDecision: decisions[0]?.title ?? "Request verified Search Console evidence before making a search decision." }));
  return { schemaVersion: "search-market-intelligence-packet-v1", tenantId: input.tenantId, packetKind: input.packetKind, evidenceCutoff, observationWindows, deliverables, topCeoDecisions: decisions, evidenceHashes: input.snapshots.map((snapshot) => snapshot.evidenceHash), dataGaps, promotionState: "calibration_ready", providerCalledByAssembly: false, externalWritesAllowed: false, liveExecutionAllowed: false };
}
