import {
  assertCrossConnectorIntelligenceSafety,
  createCrossConnectorIntelligenceReport,
  type CrossConnectorIntelligenceReportV1,
} from "@/lib/cross-connector-intelligence";
import type { BusinessDataSnapshotRecord } from "@/lib/read-only-business-connections";

export type CrossConnectorCertificationStatus = "certified" | "partial" | "blocked";

export type CrossConnectorCertificationPacketV1 = {
  schemaVersion: "cross-connector-certification-v1";
  tenantId: string;
  generatedAt: string;
  certificationStatus: CrossConnectorCertificationStatus;
  intelligence: CrossConnectorIntelligenceReportV1;
  evidenceChain: Array<{
    stage: "found_us" | "visited_pages" | "stayed_or_left" | "local_trust" | "highest_opportunities";
    label: string;
    signalCount: number;
    confidence: number;
    evidenceHashes: string[];
    sourceLabels: string[];
    dataGaps: string[];
  }>;
  evidenceHashCount: number;
  readinessFailures: string[];
  ceoReviewNotes: string[];
  topOpportunity: CrossConnectorIntelligenceReportV1["highestBusinessOpportunities"][number] | null;
  safetyProof: {
    providerReadsPerformed: false;
    providerWritesAllowed: false;
    crmMutationAllowed: false;
    leadCreationAllowed: false;
    outreachAllowed: false;
    publishingAllowed: false;
    adsAllowed: false;
    scrapingAllowed: false;
    taskCreationAllowed: false;
    approvalCreationAllowed: false;
    automationAllowed: false;
    memoryPersistenceAllowed: false;
    kpiPersistenceAllowed: false;
    externalExecutionAllowed: false;
  };
  providerCalled: false;
  liveExecutionAllowed: false;
};

const unsafePattern = /ya29\.|GOCSPX-|refresh-token|client-secret|BEGIN PRIVATE KEY|authorization|bearer\s+|https:\/\/www\.googleapis\.com|googleapis\.com|send_email|send_sms|publish_post|reply_to_review|create_lead|crm_mutation|autonomous_work_order|provider_write|drive\.files\.create|drafts\.send|calendar\.events\.insert|ads\.create|website_edit|scrape/iu;

function average(values: number[]) {
  return values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : 0;
}

function chainStage(input: {
  stage: CrossConnectorCertificationPacketV1["evidenceChain"][number]["stage"];
  label: string;
  signals: Array<{ confidence: number; evidenceHash: string; sourceLabel: string; missingData: string[] }>;
}) {
  return {
    stage: input.stage,
    label: input.label,
    signalCount: input.signals.length,
    confidence: average(input.signals.map((signal) => signal.confidence)),
    evidenceHashes: [...new Set(input.signals.map((signal) => signal.evidenceHash))],
    sourceLabels: [...new Set(input.signals.map((signal) => signal.sourceLabel))],
    dataGaps: [...new Set(input.signals.flatMap((signal) => signal.missingData))],
  };
}

function certificationStatus(report: CrossConnectorIntelligenceReportV1): CrossConnectorCertificationStatus {
  const requiredChainPresent =
    report.foundUsSignals.length > 0 &&
    report.visitedPageSignals.length > 0 &&
    report.engagementSignals.length + report.exitOrDropoffSignals.length > 0 &&
    report.localTrustSignals.length > 0 &&
    report.highestBusinessOpportunities.length > 0;
  if (requiredChainPresent && report.dataGaps.length === 0) return "certified";
  if (report.evidenceReferences.length === 0 || report.highestBusinessOpportunities.length === 0) return "blocked";
  return "partial";
}

export function createCrossConnectorCertificationPacket(input: {
  tenantId: string;
  snapshots?: BusinessDataSnapshotRecord[];
  intelligence?: CrossConnectorIntelligenceReportV1;
  generatedAt?: string;
}): CrossConnectorCertificationPacketV1 {
  const generatedAt = input.generatedAt ?? new Date().toISOString();
  const intelligence = input.intelligence ?? createCrossConnectorIntelligenceReport({ tenantId: input.tenantId, snapshots: input.snapshots ?? [], generatedAt });
  assertCrossConnectorIntelligenceSafety(intelligence);
  const status = certificationStatus(intelligence);
  const evidenceChain = [
    chainStage({ stage: "found_us", label: "People found us", signals: intelligence.foundUsSignals }),
    chainStage({ stage: "visited_pages", label: "They visited these pages", signals: intelligence.visitedPageSignals }),
    chainStage({ stage: "stayed_or_left", label: "They stayed here or left here", signals: [...intelligence.engagementSignals, ...intelligence.exitOrDropoffSignals] }),
    chainStage({ stage: "local_trust", label: "Local discovery and trust context", signals: intelligence.localTrustSignals }),
    {
      stage: "highest_opportunities" as const,
      label: "Highest business opportunities",
      signalCount: intelligence.highestBusinessOpportunities.length,
      confidence: average(intelligence.highestBusinessOpportunities.map((opportunity) => opportunity.confidence)),
      evidenceHashes: intelligence.evidenceReferences.map((reference) => reference.evidenceHash),
      sourceLabels: intelligence.highestBusinessOpportunities.flatMap((opportunity) => opportunity.evidenceReferences),
      dataGaps: intelligence.highestBusinessOpportunities.flatMap((opportunity) => opportunity.missingData),
    },
  ];
  const readinessFailures = [
    ...evidenceChain.filter((stage) => stage.signalCount === 0).map((stage) => `${stage.label} evidence is unavailable.`),
    ...intelligence.dataGaps,
  ];
  const packet: CrossConnectorCertificationPacketV1 = {
    schemaVersion: "cross-connector-certification-v1",
    tenantId: input.tenantId,
    generatedAt,
    certificationStatus: status,
    intelligence,
    evidenceChain,
    evidenceHashCount: new Set(intelligence.evidenceReferences.map((reference) => reference.evidenceHash)).size,
    readinessFailures: [...new Set(readinessFailures)].slice(0, 12),
    ceoReviewNotes: [
      status === "certified" ? "Cross-connector evidence is ready for CEO/operator review." : "Cross-connector evidence is not fully certified; review data gaps before relying on the full funnel story.",
      "Certification is advisory readiness only and does not authorize provider reads, provider writes, CRM work, outreach, publishing, ads, scraping, tasks, approvals, automation, memory writes, or KPI writes.",
    ],
    topOpportunity: intelligence.highestBusinessOpportunities[0] ?? null,
    safetyProof: {
      providerReadsPerformed: false,
      providerWritesAllowed: false,
      crmMutationAllowed: false,
      leadCreationAllowed: false,
      outreachAllowed: false,
      publishingAllowed: false,
      adsAllowed: false,
      scrapingAllowed: false,
      taskCreationAllowed: false,
      approvalCreationAllowed: false,
      automationAllowed: false,
      memoryPersistenceAllowed: false,
      kpiPersistenceAllowed: false,
      externalExecutionAllowed: false,
    },
    providerCalled: false,
    liveExecutionAllowed: false,
  };
  assertCrossConnectorCertificationSafety(packet);
  return packet;
}

export function assertCrossConnectorCertificationSafety(packet: CrossConnectorCertificationPacketV1) {
  const unsafe = [
    packet.providerCalled,
    packet.liveExecutionAllowed,
    packet.safetyProof.providerReadsPerformed,
    packet.safetyProof.providerWritesAllowed,
    packet.safetyProof.crmMutationAllowed,
    packet.safetyProof.leadCreationAllowed,
    packet.safetyProof.outreachAllowed,
    packet.safetyProof.publishingAllowed,
    packet.safetyProof.adsAllowed,
    packet.safetyProof.scrapingAllowed,
    packet.safetyProof.taskCreationAllowed,
    packet.safetyProof.approvalCreationAllowed,
    packet.safetyProof.automationAllowed,
    packet.safetyProof.memoryPersistenceAllowed,
    packet.safetyProof.kpiPersistenceAllowed,
    packet.safetyProof.externalExecutionAllowed,
  ];
  if (unsafe.some(Boolean)) throw new Error("Cross-Connector Certification safety contract failed.");
  if (unsafePattern.test(JSON.stringify(packet))) throw new Error("Cross-Connector Certification exposed unsafe provider, secret, or execution content.");
  return true;
}
