import type { BusinessDataCategory, BusinessDataSnapshotRecord } from "@/lib/read-only-business-connections";

export type CrossConnectorSignalKind = "found_us" | "visited_pages" | "engaged_here" | "left_here" | "local_trust";
export type CrossConnectorOpportunityType = "search_to_page_opportunity" | "page_conversion_opportunity" | "local_trust_opportunity" | "data_quality_opportunity";

export type CrossConnectorSignal = {
  id: string;
  kind: CrossConnectorSignalKind;
  connectorId: string;
  category: BusinessDataCategory;
  title: string;
  summary: string;
  sourceLabel: string;
  evidenceHash: string;
  confidence: number;
  observationWindow: { start: string | null; end: string | null };
  missingData: string[];
  advisoryOnly: true;
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type CrossConnectorOpportunity = {
  id: string;
  opportunityType: CrossConnectorOpportunityType;
  title: string;
  businessQuestion: string;
  supportingSignals: string[];
  evidenceReferences: string[];
  confidence: number;
  score: number;
  recommendedInternalReview: string;
  missingData: string[];
  requiresHumanReview: true;
  advisoryOnly: true;
  providerCalled: false;
  liveExecutionAllowed: false;
  externalWritesAllowed: false;
};

export type CrossConnectorIntelligenceReportV1 = {
  schemaVersion: "cross-connector-intelligence-v1";
  tenantId: string;
  generatedAt: string;
  narrative: "People found us, visited pages, engaged or left, and showed local trust context.";
  foundUsSignals: CrossConnectorSignal[];
  visitedPageSignals: CrossConnectorSignal[];
  engagementSignals: CrossConnectorSignal[];
  exitOrDropoffSignals: CrossConnectorSignal[];
  localTrustSignals: CrossConnectorSignal[];
  highestBusinessOpportunities: CrossConnectorOpportunity[];
  dataGaps: string[];
  evidenceReferences: Array<{ connectorId: string; category: BusinessDataCategory; sourceLabel: string; evidenceHash: string }>;
  safety: {
    readOnly: true;
    advisoryOnly: true;
    requiresHumanReview: true;
    providerCalled: false;
    liveExecutionAllowed: false;
    externalWritesAllowed: false;
    crmMutationAllowed: false;
    leadCreationAllowed: false;
    outreachAllowed: false;
    publishingAllowed: false;
    scrapingAllowed: false;
    automationAllowed: false;
    memoryPersistenceAllowed: false;
    kpiPersistenceAllowed: false;
    taskCreationAllowed: false;
    approvalsCreationAllowed: false;
    adsAllowed: false;
    websiteEditsAllowed: false;
  };
  providerCalled: false;
  liveExecutionAllowed: false;
};

const requiredCategories: BusinessDataCategory[] = [
  "search_console_performance",
  "google_analytics_traffic",
  "google_business_profile_performance",
  "google_business_profile_reviews",
];

const unsafePattern = /ya29\.|GOCSPX-|refresh-token|client-secret|BEGIN PRIVATE KEY|authorization|bearer\s+|https:\/\/www\.googleapis\.com|googleapis\.com|analyticsdata\.googleapis\.com|searchconsole\.googleapis\.com|mybusiness\.googleapis\.com|businessprofileperformance\.googleapis\.com|send_email|send_sms|publish_post|reply_to_review|create_lead|crm_mutation|autonomous_work_order|provider_write|drive\.files\.create|drafts\.send|calendar\.events\.insert|ads\.create|website_edit|scrape/iu;

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "signal";
}

function numberMetric(snapshot: BusinessDataSnapshotRecord | undefined, key: string) {
  const value = snapshot?.metrics?.[key];
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function latestByCategory(snapshots: BusinessDataSnapshotRecord[]) {
  const byCategory = new Map<BusinessDataCategory, BusinessDataSnapshotRecord>();
  for (const snapshot of snapshots) {
    const category = snapshot.category as BusinessDataCategory;
    const current = byCategory.get(category);
    if (!current || new Date(snapshot.freshness).getTime() > new Date(current.freshness).getTime()) {
      byCategory.set(category, snapshot);
    }
  }
  return byCategory;
}

export function assertCrossConnectorEvidence(tenantId: string, snapshots: BusinessDataSnapshotRecord[]): asserts snapshots is Array<BusinessDataSnapshotRecord & { evidenceHash: string; contractVersion: "business-data-snapshot-v1" }> {
  if (!tenantId.trim()) throw new Error("tenant_id_required");
  for (const snapshot of snapshots) {
    if (snapshot.tenantId !== tenantId) throw new Error("cross_tenant_cross_connector_evidence_blocked");
    if (snapshot.contractVersion !== "business-data-snapshot-v1" || typeof snapshot.evidenceHash !== "string" || snapshot.evidenceHash.trim().length < 6) {
      throw new Error("cross_connector_evidence_contract_invalid");
    }
  }
}

function signal(input: {
  generatedAt: string;
  kind: CrossConnectorSignalKind;
  snapshot: BusinessDataSnapshotRecord & { evidenceHash: string };
  title: string;
  summary: string;
  confidence: number;
}): CrossConnectorSignal {
  return {
    id: ["cross-connector", input.generatedAt.slice(0, 10), input.kind, slug(input.snapshot.category), slug(input.snapshot.sourceLabel)].join("-"),
    kind: input.kind,
    connectorId: input.snapshot.connectorId,
    category: input.snapshot.category as BusinessDataCategory,
    title: input.title,
    summary: input.summary.slice(0, 360),
    sourceLabel: input.snapshot.sourceLabel,
    evidenceHash: input.snapshot.evidenceHash,
    confidence: Math.max(0, Math.min(100, Math.round(input.confidence))),
    observationWindow: {
      start: input.snapshot.observationStart ? new Date(input.snapshot.observationStart).toISOString() : null,
      end: input.snapshot.observationEnd ? new Date(input.snapshot.observationEnd).toISOString() : null,
    },
    missingData: input.snapshot.dataGaps.slice(0, 6),
    advisoryOnly: true,
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

function statusConfidence(snapshot: BusinessDataSnapshotRecord | undefined, base: number) {
  if (!snapshot) return 0;
  if (snapshot.status === "fresh") return base;
  if (snapshot.status === "partial") return Math.max(40, base - 18);
  if (snapshot.status === "stale") return 35;
  return 20;
}

function createSignals(generatedAt: string, byCategory: Map<BusinessDataCategory, BusinessDataSnapshotRecord>) {
  const search = byCategory.get("search_console_performance");
  const ga4 = byCategory.get("google_analytics_traffic");
  const gbpPerformance = byCategory.get("google_business_profile_performance");
  const gbpReviews = byCategory.get("google_business_profile_reviews");
  const foundUsSignals = search ? [signal({ generatedAt, kind: "found_us", snapshot: search as BusinessDataSnapshotRecord & { evidenceHash: string }, title: "People Found Us", summary: `${numberMetric(search, "impressions")} impression(s) and ${numberMetric(search, "clicks")} click(s) were observed in Search Console evidence. ${search.summary}`, confidence: statusConfidence(search, 84) })] : [];
  const visitedPageSignals = ga4 ? [signal({ generatedAt, kind: "visited_pages", snapshot: ga4 as BusinessDataSnapshotRecord & { evidenceHash: string }, title: "They Visited These Pages", summary: `${numberMetric(ga4, "sessions")} session(s), ${numberMetric(ga4, "activeUsers")} active user(s), and ${numberMetric(ga4, "topPages")} top page(s) were observed in GA4 evidence. ${ga4.summary}`, confidence: statusConfidence(ga4, 82) })] : [];
  const engagementSignals = ga4 ? [signal({ generatedAt, kind: "engaged_here", snapshot: ga4 as BusinessDataSnapshotRecord & { evidenceHash: string }, title: "They Stayed Here", summary: `${numberMetric(ga4, "pageViews")} page view(s) and ${numberMetric(ga4, "keyEvents") || numberMetric(ga4, "conversions")} key-event/conversion-readiness signal(s) were observed.`, confidence: statusConfidence(ga4, 74) })] : [];
  const exitOrDropoffSignals = ga4 ? [signal({ generatedAt, kind: "left_here", snapshot: ga4 as BusinessDataSnapshotRecord & { evidenceHash: string }, title: "They Left Here", summary: ga4.dataGaps.length > 0 ? `GA4 exit/drop-off interpretation is limited by: ${ga4.dataGaps[0]}` : "GA4 page/path evidence can guide a manual review of pages with visits but limited key-event readiness.", confidence: ga4.dataGaps.length > 0 ? 45 : statusConfidence(ga4, 63) })] : [];
  const localTrustSignals = [
    ...(gbpPerformance ? [signal({ generatedAt, kind: "local_trust" as const, snapshot: gbpPerformance as BusinessDataSnapshotRecord & { evidenceHash: string }, title: "Local Discovery Context", summary: `${numberMetric(gbpPerformance, "callClicks")} call click(s) and ${numberMetric(gbpPerformance, "directionRequests")} direction request(s) were observed as read-only GBP context.`, confidence: statusConfidence(gbpPerformance, 76) })] : []),
    ...(gbpReviews ? [signal({ generatedAt, kind: "local_trust" as const, snapshot: gbpReviews as BusinessDataSnapshotRecord & { evidenceHash: string }, title: "Review Readiness Context", summary: `${numberMetric(gbpReviews, "reviews")} review(s) were visible as read-only GBP review context.`, confidence: statusConfidence(gbpReviews, 72) })] : []),
  ];
  return { foundUsSignals, visitedPageSignals, engagementSignals, exitOrDropoffSignals, localTrustSignals };
}

function opportunity(input: {
  generatedAt: string;
  type: CrossConnectorOpportunityType;
  title: string;
  businessQuestion: string;
  signals: CrossConnectorSignal[];
  missingData: string[];
  score: number;
  recommendedInternalReview: string;
}): CrossConnectorOpportunity {
  const confidence = input.signals.length === 0 ? 20 : Math.round(input.signals.reduce((sum, item) => sum + item.confidence, 0) / input.signals.length);
  return {
    id: ["cross-connector-opportunity", input.generatedAt.slice(0, 10), input.type, slug(input.title)].join("-"),
    opportunityType: input.type,
    title: input.title,
    businessQuestion: input.businessQuestion,
    supportingSignals: input.signals.map((item) => item.id),
    evidenceReferences: [...new Set(input.signals.map((item) => item.sourceLabel))],
    confidence,
    score: Math.max(0, Math.min(100, Math.round(input.score + confidence * 0.2 - input.missingData.length * 5))),
    recommendedInternalReview: input.recommendedInternalReview,
    missingData: [...new Set(input.missingData)].slice(0, 8),
    requiresHumanReview: true,
    advisoryOnly: true,
    providerCalled: false,
    liveExecutionAllowed: false,
    externalWritesAllowed: false,
  };
}

export function createCrossConnectorIntelligenceReport(input: { tenantId: string; snapshots: BusinessDataSnapshotRecord[]; generatedAt?: string }): CrossConnectorIntelligenceReportV1 {
  assertCrossConnectorEvidence(input.tenantId, input.snapshots);
  const generatedAt = input.generatedAt ?? new Date().toISOString();
  const byCategory = latestByCategory(input.snapshots);
  const dataGaps = [
    ...requiredCategories.filter((category) => !byCategory.has(category)).map((category) => `Missing ${category} evidence; Sprint 26 will not fetch or infer it.`),
    ...input.snapshots.flatMap((snapshot) => snapshot.dataGaps.map((gap) => `${snapshot.category}: ${gap}`)),
  ];
  const signals = createSignals(generatedAt, byCategory);
  const allSignals = [...signals.foundUsSignals, ...signals.visitedPageSignals, ...signals.engagementSignals, ...signals.exitOrDropoffSignals, ...signals.localTrustSignals];
  const highestBusinessOpportunities = [
    opportunity({ generatedAt, type: "search_to_page_opportunity", title: "Review search demand against visited pages", businessQuestion: "Are people finding J Capital through searches that connect to pages with actual visits?", signals: [...signals.foundUsSignals, ...signals.visitedPageSignals], missingData: dataGaps.filter((gap) => /search_console|google_analytics/i.test(gap)), score: 72, recommendedInternalReview: "Have Marketing Intelligence compare top Search Console queries/pages with GA4 top pages before drafting any recommendation." }),
    opportunity({ generatedAt, type: "page_conversion_opportunity", title: "Review visited pages for conversion readiness", businessQuestion: "Which visited pages deserve manual improvement review because they show traffic, engagement, or key-event gaps?", signals: [...signals.visitedPageSignals, ...signals.engagementSignals, ...signals.exitOrDropoffSignals], missingData: dataGaps.filter((gap) => /google_analytics/i.test(gap)), score: 68, recommendedInternalReview: "Have Revenue Intelligence inspect GA4 page evidence as advisory conversion-readiness context only." }),
    opportunity({ generatedAt, type: "local_trust_opportunity", title: "Review local discovery and trust readiness", businessQuestion: "Does GBP local visibility or review evidence support a human review of local trust signals?", signals: signals.localTrustSignals, missingData: dataGaps.filter((gap) => /google_business_profile/i.test(gap)), score: 64, recommendedInternalReview: "Have the local visibility specialist review GBP evidence without replying, posting, editing the profile, or creating outreach." }),
    ...(dataGaps.length > 0 ? [opportunity({ generatedAt, type: "data_quality_opportunity", title: "Resolve cross-connector evidence gaps", businessQuestion: "Which missing evidence prevents a confident funnel story?", signals: allSignals.slice(0, 3), missingData: dataGaps, score: 58, recommendedInternalReview: "Review connector readiness manually; do not activate, fetch, retry, or mutate providers from this packet." })] : []),
  ].sort((a, b) => b.score - a.score).slice(0, 5);

  const report: CrossConnectorIntelligenceReportV1 = {
    schemaVersion: "cross-connector-intelligence-v1",
    tenantId: input.tenantId,
    generatedAt,
    narrative: "People found us, visited pages, engaged or left, and showed local trust context.",
    ...signals,
    highestBusinessOpportunities,
    dataGaps: [...new Set(dataGaps)].slice(0, 12),
    evidenceReferences: input.snapshots.map((snapshot) => ({ connectorId: snapshot.connectorId, category: snapshot.category as BusinessDataCategory, sourceLabel: snapshot.sourceLabel, evidenceHash: snapshot.evidenceHash as string })),
    safety: {
      readOnly: true,
      advisoryOnly: true,
      requiresHumanReview: true,
      providerCalled: false,
      liveExecutionAllowed: false,
      externalWritesAllowed: false,
      crmMutationAllowed: false,
      leadCreationAllowed: false,
      outreachAllowed: false,
      publishingAllowed: false,
      scrapingAllowed: false,
      automationAllowed: false,
      memoryPersistenceAllowed: false,
      kpiPersistenceAllowed: false,
      taskCreationAllowed: false,
      approvalsCreationAllowed: false,
      adsAllowed: false,
      websiteEditsAllowed: false,
    },
    providerCalled: false,
    liveExecutionAllowed: false,
  };
  assertCrossConnectorIntelligenceSafety(report);
  return report;
}

export function assertCrossConnectorIntelligenceSafety(report: CrossConnectorIntelligenceReportV1) {
  const unsafe = [
    report.providerCalled,
    report.liveExecutionAllowed,
    !report.safety.readOnly,
    !report.safety.advisoryOnly,
    !report.safety.requiresHumanReview,
    report.safety.providerCalled,
    report.safety.liveExecutionAllowed,
    report.safety.externalWritesAllowed,
    report.safety.crmMutationAllowed,
    report.safety.leadCreationAllowed,
    report.safety.outreachAllowed,
    report.safety.publishingAllowed,
    report.safety.scrapingAllowed,
    report.safety.automationAllowed,
    report.safety.memoryPersistenceAllowed,
    report.safety.kpiPersistenceAllowed,
    report.safety.taskCreationAllowed,
    report.safety.approvalsCreationAllowed,
    report.safety.adsAllowed,
    report.safety.websiteEditsAllowed,
    report.highestBusinessOpportunities.some((item) => !item.advisoryOnly || !item.requiresHumanReview || item.providerCalled || item.liveExecutionAllowed || item.externalWritesAllowed),
  ];
  if (unsafe.some(Boolean)) throw new Error("Cross-Connector Intelligence safety contract failed.");
  if (unsafePattern.test(JSON.stringify(report))) throw new Error("Cross-Connector Intelligence exposed unsafe provider, secret, or execution content.");
  return true;
}
