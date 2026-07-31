import type { BuyerDemandOpportunityPrioritizationV1, BuyerDemandPriority } from "@/lib/buyer-demand-opportunity-prioritization";
import { assertBuyerDemandOpportunityPrioritizationSafety } from "@/lib/buyer-demand-opportunity-prioritization";

export type BuyerDemandCertificationStatus = "certified" | "partial" | "blocked";

export type BuyerDemandCertificationPacketV1 = {
  schemaVersion: "buyer-demand-certification-v1";
  tenantId: string;
  generatedAt: string;
  certificationStatus: BuyerDemandCertificationStatus;
  prioritizationSchemaVersion: string | null;
  priorityCount: number;
  topPriority: BuyerDemandPriority | null;
  demandAlignmentConfidence: {
    average: number;
    highest: number;
    lowest: number;
  };
  sourceReferences: string[];
  missingBuyerDemandEvidence: string[];
  readinessFailures: string[];
  ceoReviewNotes: string[];
  recommendedManualReviewPosture: "ready_for_ceo_review" | "review_gaps_before_use" | "blocked_until_valid_prioritization";
  safetyProof: {
    readOnly: true;
    advisoryOnly: true;
    requiresHumanReview: true;
    providerReadsPerformed: false;
    providerWritesAllowed: false;
    externalApiAllowed: false;
    crmMutationAllowed: false;
    leadCreationAllowed: false;
    buyerMatchCreationAllowed: false;
    buyerContactAllowed: false;
    sellerContactAllowed: false;
    outreachAllowed: false;
    campaignAllowed: false;
    publishingAllowed: false;
    adsAllowed: false;
    scrapingAllowed: false;
    taskCreationAllowed: false;
    approvalCreationAllowed: false;
    automationAllowed: false;
    persistenceAllowed: false;
    memoryPersistenceAllowed: false;
    kpiPersistenceAllowed: false;
    externalExecutionAllowed: false;
  };
  providerCalled: false;
  liveExecutionAllowed: false;
};

const unsafePattern = /ya29\.|GOCSPX-|refresh-token|client-secret|BEGIN PRIVATE KEY|authorization|bearer\s+|https:\/\/www\.googleapis\.com|googleapis\.com|send_email|send_sms|publish_post|reply_to_review|create_lead|crm_mutation|autonomous_work_order|provider_write|drive\.files\.create|drafts\.send|calendar\.events\.insert|ads\.create|website_edit|scrape|deal_blast|buyer_contact|seller_contact|create_match|campaign_launch/iu;

function average(values: number[]) {
  return values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : 0;
}

function isPrioritization(value: unknown): value is BuyerDemandOpportunityPrioritizationV1 {
  return Boolean(value && typeof value === "object" && (value as { schemaVersion?: unknown }).schemaVersion === "buyer-demand-opportunity-prioritization-v1");
}

function createSafetyProof(): BuyerDemandCertificationPacketV1["safetyProof"] {
  return {
    readOnly: true,
    advisoryOnly: true,
    requiresHumanReview: true,
    providerReadsPerformed: false,
    providerWritesAllowed: false,
    externalApiAllowed: false,
    crmMutationAllowed: false,
    leadCreationAllowed: false,
    buyerMatchCreationAllowed: false,
    buyerContactAllowed: false,
    sellerContactAllowed: false,
    outreachAllowed: false,
    campaignAllowed: false,
    publishingAllowed: false,
    adsAllowed: false,
    scrapingAllowed: false,
    taskCreationAllowed: false,
    approvalCreationAllowed: false,
    automationAllowed: false,
    persistenceAllowed: false,
    memoryPersistenceAllowed: false,
    kpiPersistenceAllowed: false,
    externalExecutionAllowed: false,
  };
}

function statusFromReadiness(input: {
  validContract: boolean;
  priorityCount: number;
  readinessFailures: string[];
  missingBuyerDemandEvidence: string[];
  everyPriorityReviewable: boolean;
  everyPriorityReferenced: boolean;
}): BuyerDemandCertificationStatus {
  if (!input.validContract || input.priorityCount === 0 || !input.everyPriorityReviewable) return "blocked";
  if (!input.everyPriorityReferenced || input.readinessFailures.length > 0 || input.missingBuyerDemandEvidence.length > 0) return "partial";
  return "certified";
}

export function createBuyerDemandCertificationPacket(input: {
  tenantId: string;
  prioritization: BuyerDemandOpportunityPrioritizationV1 | unknown | null;
  generatedAt?: string;
  additionalDataGaps?: string[];
}): BuyerDemandCertificationPacketV1 {
  const generatedAt = input.generatedAt ?? new Date().toISOString();
  const candidate = input.prioritization;
  const validContract = isPrioritization(candidate);
  if (validContract && candidate.tenantId !== input.tenantId) throw new Error("cross_tenant_buyer_demand_certification_blocked");

  const prioritization = validContract ? candidate : null;
  if (prioritization) assertBuyerDemandOpportunityPrioritizationSafety(prioritization);

  const priorities = prioritization?.priorities ?? [];
  const confidences = priorities.map((priority) => priority.demandAlignmentConfidence);
  const everyPriorityReviewable = priorities.every((priority) => priority.advisoryOnly && priority.requiresHumanReview && !priority.providerCalled && !priority.liveExecutionAllowed);
  const everyPriorityReferenced = priorities.every((priority) => priority.sourceReferences.length > 0);
  const sourceReferences = [
    ...(prioritization?.sourceReferences ?? []),
    ...priorities.flatMap((priority) => priority.sourceReferences),
  ];
  const missingBuyerDemandEvidence = [
    ...(prioritization?.dataGaps ?? []),
    ...priorities.flatMap((priority) => priority.missingBuyerDemandEvidence),
    ...(input.additionalDataGaps ?? []),
  ];
  const readinessFailures = [
    ...(!validContract ? ["Buyer-demand prioritization contract is missing or invalid."] : []),
    ...(priorities.length === 0 ? ["Buyer-demand certification requires at least one priority."] : []),
    ...(!everyPriorityReviewable ? ["One or more buyer-demand priorities failed advisory/manual-review safety checks."] : []),
    ...(!everyPriorityReferenced ? ["One or more buyer-demand priorities is missing source references."] : []),
    ...(input.additionalDataGaps ?? []),
  ];
  const certificationStatus = statusFromReadiness({
    validContract,
    priorityCount: priorities.length,
    readinessFailures,
    missingBuyerDemandEvidence,
    everyPriorityReviewable,
    everyPriorityReferenced,
  });
  const packet: BuyerDemandCertificationPacketV1 = {
    schemaVersion: "buyer-demand-certification-v1",
    tenantId: input.tenantId,
    generatedAt,
    certificationStatus,
    prioritizationSchemaVersion: prioritization?.schemaVersion ?? null,
    priorityCount: priorities.length,
    topPriority: priorities[0] ?? null,
    demandAlignmentConfidence: {
      average: average(confidences),
      highest: confidences.length ? Math.max(...confidences) : 0,
      lowest: confidences.length ? Math.min(...confidences) : 0,
    },
    sourceReferences: [...new Set(sourceReferences)].slice(0, 24),
    missingBuyerDemandEvidence: [...new Set(missingBuyerDemandEvidence)].slice(0, 16),
    readinessFailures: [...new Set(readinessFailures)].slice(0, 16),
    ceoReviewNotes: [
      certificationStatus === "certified" ? "Buyer-demand priorities are ready for CEO/operator review." : "Buyer-demand certification is not fully ready; review gaps before using the priorities for operating decisions.",
      "Certification is readiness-only and does not authorize Sprint 28, production reads, recurring jobs, buyer matching, outreach, CRM actions, publishing, persistence, or external execution.",
    ],
    recommendedManualReviewPosture:
      certificationStatus === "certified" ? "ready_for_ceo_review" : certificationStatus === "partial" ? "review_gaps_before_use" : "blocked_until_valid_prioritization",
    safetyProof: createSafetyProof(),
    providerCalled: false,
    liveExecutionAllowed: false,
  };
  assertBuyerDemandCertificationSafety(packet);
  return packet;
}

export function assertBuyerDemandCertificationSafety(packet: BuyerDemandCertificationPacketV1) {
  const unsafe = [
    packet.providerCalled,
    packet.liveExecutionAllowed,
    !packet.safetyProof.readOnly,
    !packet.safetyProof.advisoryOnly,
    !packet.safetyProof.requiresHumanReview,
    packet.safetyProof.providerReadsPerformed,
    packet.safetyProof.providerWritesAllowed,
    packet.safetyProof.externalApiAllowed,
    packet.safetyProof.crmMutationAllowed,
    packet.safetyProof.leadCreationAllowed,
    packet.safetyProof.buyerMatchCreationAllowed,
    packet.safetyProof.buyerContactAllowed,
    packet.safetyProof.sellerContactAllowed,
    packet.safetyProof.outreachAllowed,
    packet.safetyProof.campaignAllowed,
    packet.safetyProof.publishingAllowed,
    packet.safetyProof.adsAllowed,
    packet.safetyProof.scrapingAllowed,
    packet.safetyProof.taskCreationAllowed,
    packet.safetyProof.approvalCreationAllowed,
    packet.safetyProof.automationAllowed,
    packet.safetyProof.persistenceAllowed,
    packet.safetyProof.memoryPersistenceAllowed,
    packet.safetyProof.kpiPersistenceAllowed,
    packet.safetyProof.externalExecutionAllowed,
  ];
  if (unsafe.some(Boolean)) throw new Error("Buyer-Demand Certification safety contract failed.");
  if (unsafePattern.test(JSON.stringify(packet))) throw new Error("Buyer-Demand Certification exposed unsafe provider, secret, or execution content.");
  return true;
}
