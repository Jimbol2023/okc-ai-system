import type { AiWorkforceDepartmentName } from "@/lib/ai-workforce";
import type { CrossConnectorCertificationPacketV1 } from "@/lib/cross-connector-certification";
import { assertCrossConnectorCertificationSafety } from "@/lib/cross-connector-certification";
import type { BuyerDemandSignals, RankedSignal } from "@/lib/buyer-demand-types";
import { r78FinalFlags, r78FinalLockdownRules } from "@/lib/r78-buyer-demand-alignment-final-lockdown-contract";

export type BuyerDemandOpportunityCategory = "page_content_opportunity" | "city_local_market_opportunity" | "buyer_fit_opportunity" | "local_trust_opportunity" | "demand_data_gap_opportunity";

export type BuyerDemandPriority = {
  id: string;
  category: BuyerDemandOpportunityCategory;
  title: string;
  summary: string;
  demandAlignmentConfidence: number;
  score: number;
  scoreExplanation: string;
  recommendedOwner: AiWorkforceDepartmentName;
  safeNextReviewStep: string;
  sourceReferences: string[];
  missingBuyerDemandEvidence: string[];
  requiresHumanReview: true;
  advisoryOnly: true;
  providerCalled: false;
  liveExecutionAllowed: false;
  externalWritesAllowed: false;
  crmMutationAllowed: false;
  leadCreationAllowed: false;
  outreachAllowed: false;
  campaignAllowed: false;
  buyerContactAllowed: false;
  sellerContactAllowed: false;
  matchCreationAllowed: false;
  dealBlastAllowed: false;
  scrapingAllowed: false;
  persistenceAllowed: false;
  automationAllowed: false;
};

export type BuyerDemandOpportunityPrioritizationV1 = {
  schemaVersion: "buyer-demand-opportunity-prioritization-v1";
  tenantId: string;
  generatedAt: string;
  certificationStatus: CrossConnectorCertificationPacketV1["certificationStatus"];
  priorities: BuyerDemandPriority[];
  demandSignalsSummary: {
    hotZipCount: number;
    hotPriceRangeCount: number;
    hotPropertyTypeCount: number;
    activeBuyerTierCount: number;
  };
  dataGaps: string[];
  sourceReferences: string[];
  r78Doctrine: {
    lockdownEnforced: true;
    rulesReviewed: typeof r78FinalLockdownRules;
  };
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
    campaignAllowed: false;
    buyerContactAllowed: false;
    sellerContactAllowed: false;
    matchCreationAllowed: false;
    dealBlastAllowed: false;
    scrapingAllowed: false;
    providerActivationAllowed: false;
    externalApiAllowed: false;
    persistenceAllowed: false;
    automationAllowed: false;
    memoryPersistenceAllowed: false;
    kpiPersistenceAllowed: false;
  };
  providerCalled: false;
  liveExecutionAllowed: false;
};

const unsafePattern = /ya29\.|GOCSPX-|refresh-token|client-secret|BEGIN PRIVATE KEY|authorization|bearer\s+|https:\/\/www\.googleapis\.com|googleapis\.com|send_email|send_sms|publish_post|reply_to_review|create_lead|crm_mutation|autonomous_work_order|provider_write|drive\.files\.create|drafts\.send|calendar\.events\.insert|ads\.create|website_edit|scrape|deal_blast|buyer_contact|seller_contact|create_match|campaign_launch/iu;

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "buyer-demand";
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function topLabel(signals: RankedSignal[], fallback: string) {
  return signals[0]?.label ?? fallback;
}

function totalBuyerActivity(signals: BuyerDemandSignals) {
  return signals.hotZips.reduce((sum, item) => sum + item.count, 0) + signals.hotPriceRanges.reduce((sum, item) => sum + item.count, 0) + signals.hotPropertyTypes.reduce((sum, item) => sum + item.count, 0);
}

function priority(input: {
  generatedAt: string;
  category: BuyerDemandOpportunityCategory;
  title: string;
  summary: string;
  owner: AiWorkforceDepartmentName;
  baseScore: number;
  certificationConfidence: number;
  demandEvidenceCount: number;
  missing: string[];
  sourceReferences: string[];
  safeNextReviewStep: string;
}): BuyerDemandPriority {
  const dataCompleteness = input.missing.length > 0 ? 45 : 82;
  const manualUsefulness = input.category === "demand_data_gap_opportunity" ? 58 : 78;
  const governanceRisk = 22;
  const score = clamp(input.baseScore + input.certificationConfidence * 0.18 + Math.min(18, input.demandEvidenceCount * 3) + dataCompleteness * 0.12 + manualUsefulness * 0.12 - governanceRisk * 0.1 - input.missing.length * 6);
  const demandAlignmentConfidence = clamp((input.certificationConfidence + dataCompleteness + Math.min(100, input.demandEvidenceCount * 12)) / 3);
  return {
    id: ["buyer-demand-priority", input.generatedAt.slice(0, 10), input.category, slug(input.title)].join("-"),
    category: input.category,
    title: input.title,
    summary: input.summary.slice(0, 360),
    demandAlignmentConfidence,
    score,
    scoreExplanation: `Score ${score}/100 combines cross-connector confidence ${clamp(input.certificationConfidence)}, buyer-demand evidence count ${input.demandEvidenceCount}, evidence completeness ${dataCompleteness}, governance risk ${governanceRisk}, and manual review usefulness ${manualUsefulness}.`,
    recommendedOwner: input.owner,
    safeNextReviewStep: input.safeNextReviewStep,
    sourceReferences: [...new Set(input.sourceReferences)].slice(0, 10),
    missingBuyerDemandEvidence: [...new Set(input.missing)].slice(0, 8),
    requiresHumanReview: true,
    advisoryOnly: true,
    providerCalled: false,
    liveExecutionAllowed: false,
    externalWritesAllowed: false,
    crmMutationAllowed: false,
    leadCreationAllowed: false,
    outreachAllowed: false,
    campaignAllowed: false,
    buyerContactAllowed: false,
    sellerContactAllowed: false,
    matchCreationAllowed: false,
    dealBlastAllowed: false,
    scrapingAllowed: false,
    persistenceAllowed: false,
    automationAllowed: false,
  };
}

export function createBuyerDemandOpportunityPrioritization(input: {
  tenantId: string;
  certification: CrossConnectorCertificationPacketV1;
  buyerDemandSignals: BuyerDemandSignals | null;
  generatedAt?: string;
}): BuyerDemandOpportunityPrioritizationV1 {
  assertCrossConnectorCertificationSafety(input.certification);
  if (input.certification.tenantId !== input.tenantId) throw new Error("cross_tenant_buyer_demand_prioritization_blocked");
  const generatedAt = input.generatedAt ?? input.certification.generatedAt;
  const signals = input.buyerDemandSignals;
  const demandEvidenceCount = signals ? signals.hotZips.length + signals.hotPriceRanges.length + signals.hotPropertyTypes.length : 0;
  const buyerActivity = signals ? totalBuyerActivity(signals) : 0;
  const certificationConfidence = input.certification.evidenceChain.length ? Math.round(input.certification.evidenceChain.reduce((sum, stage) => sum + stage.confidence, 0) / input.certification.evidenceChain.length) : 0;
  const sourceReferences = [
    ...input.certification.evidenceChain.flatMap((stage) => stage.sourceLabels),
    ...input.certification.evidenceChain.flatMap((stage) => stage.evidenceHashes.map((hash) => `evidence:${hash}`)),
    ...(signals?.hotZips.map((item) => `buyer-demand:zip:${item.label}`) ?? []),
    ...(signals?.hotPriceRanges.map((item) => `buyer-demand:price:${item.label}`) ?? []),
    ...(signals?.hotPropertyTypes.map((item) => `buyer-demand:type:${item.label}`) ?? []),
  ];
  const demandGaps = [
    ...(!signals ? ["Internal buyer-demand signals are unavailable."] : []),
    ...(signals && signals.hotZips.length === 0 ? ["No hot ZIP buyer-demand evidence is available."] : []),
    ...(signals && signals.hotPriceRanges.length === 0 ? ["No buyer price-range demand evidence is available."] : []),
    ...(signals && signals.hotPropertyTypes.length === 0 ? ["No buyer property-type demand evidence is available."] : []),
    ...input.certification.readinessFailures,
  ];
  const priorities = [
    priority({
      generatedAt,
      category: "page_content_opportunity",
      title: "Review buyer-demand fit for visited pages",
      summary: `Use certified cross-connector page evidence with internal buyer preferences around ${topLabel(signals?.hotPropertyTypes ?? [], "property type demand")} and ${topLabel(signals?.hotPriceRanges ?? [], "price range demand")}.`,
      owner: "Marketing",
      baseScore: 66,
      certificationConfidence,
      demandEvidenceCount,
      missing: demandGaps.filter((gap) => /GA4|property-type|price-range|page|visited|google_analytics/i.test(gap)),
      sourceReferences,
      safeNextReviewStep: "Prepare a manual page/content review priority; do not publish, edit the site, contact buyers, or launch campaigns.",
    }),
    priority({
      generatedAt,
      category: "city_local_market_opportunity",
      title: "Review local market demand alignment",
      summary: `Compare local discovery evidence with internal buyer location demand, led by ${topLabel(signals?.hotZips ?? [], "available ZIP demand")}.`,
      owner: "SEO",
      baseScore: 64,
      certificationConfidence,
      demandEvidenceCount,
      missing: demandGaps.filter((gap) => /GBP|ZIP|location|local|google_business_profile/i.test(gap)),
      sourceReferences,
      safeNextReviewStep: "Prepare a manual local-market review note; do not post, reply, change GBP, collect outside data, or contact anyone.",
    }),
    priority({
      generatedAt,
      category: "buyer_fit_opportunity",
      title: "Review buyer-fit readiness before acquisition emphasis",
      summary: `${buyerActivity} internal weighted buyer-demand activity signal(s) are available for manual comparison against the certified opportunity chain.`,
      owner: "Acquisitions",
      baseScore: 62,
      certificationConfidence,
      demandEvidenceCount,
      missing: demandGaps.filter((gap) => /buyer|demand|price|property|ZIP/i.test(gap)),
      sourceReferences,
      safeNextReviewStep: "Prepare buyer-fit review context for acquisitions; do not create matches, leads, campaigns, deal blasts, or outreach.",
    }),
    priority({
      generatedAt,
      category: "local_trust_opportunity",
      title: "Review local trust against buyer demand",
      summary: "Use GBP local trust evidence with internal buyer-demand context to decide whether a human should review local credibility gaps.",
      owner: "SEO",
      baseScore: 58,
      certificationConfidence,
      demandEvidenceCount,
      missing: demandGaps.filter((gap) => /GBP|review|local|trust|google_business_profile/i.test(gap)),
      sourceReferences,
      safeNextReviewStep: "Review local trust readiness internally; do not reply, post, contact, or mutate profile data.",
    }),
    ...(demandGaps.length > 0 ? [priority({
      generatedAt,
      category: "demand_data_gap_opportunity",
      title: "Resolve buyer-demand evidence gaps",
      summary: "Buyer-demand prioritization is limited by missing internal evidence or certification gaps.",
      owner: "Operations",
      baseScore: 56,
      certificationConfidence,
      demandEvidenceCount,
      missing: demandGaps,
      sourceReferences,
      safeNextReviewStep: "Review internal data gaps manually; do not collect outside data, activate providers, create records, or contact buyers/sellers.",
    })] : []),
  ].sort((a, b) => b.score - a.score || b.demandAlignmentConfidence - a.demandAlignmentConfidence);
  const report: BuyerDemandOpportunityPrioritizationV1 = {
    schemaVersion: "buyer-demand-opportunity-prioritization-v1",
    tenantId: input.tenantId,
    generatedAt,
    certificationStatus: input.certification.certificationStatus,
    priorities,
    demandSignalsSummary: {
      hotZipCount: signals?.hotZips.length ?? 0,
      hotPriceRangeCount: signals?.hotPriceRanges.length ?? 0,
      hotPropertyTypeCount: signals?.hotPropertyTypes.length ?? 0,
      activeBuyerTierCount: signals ? Object.values(signals.byBuyerTier).reduce((sum, count) => sum + count, 0) : 0,
    },
    dataGaps: [...new Set(demandGaps)].slice(0, 12),
    sourceReferences: [...new Set(sourceReferences)].slice(0, 20),
    r78Doctrine: {
      lockdownEnforced: r78FinalFlags.buyerDemandAlignmentLockdownEnforced,
      rulesReviewed: r78FinalLockdownRules,
    },
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
      campaignAllowed: false,
      buyerContactAllowed: false,
      sellerContactAllowed: false,
      matchCreationAllowed: false,
      dealBlastAllowed: false,
      scrapingAllowed: false,
      providerActivationAllowed: false,
      externalApiAllowed: false,
      persistenceAllowed: false,
      automationAllowed: false,
      memoryPersistenceAllowed: false,
      kpiPersistenceAllowed: false,
    },
    providerCalled: false,
    liveExecutionAllowed: false,
  };
  assertBuyerDemandOpportunityPrioritizationSafety(report);
  return report;
}

export function assertBuyerDemandOpportunityPrioritizationSafety(report: BuyerDemandOpportunityPrioritizationV1) {
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
    report.safety.campaignAllowed,
    report.safety.buyerContactAllowed,
    report.safety.sellerContactAllowed,
    report.safety.matchCreationAllowed,
    report.safety.dealBlastAllowed,
    report.safety.scrapingAllowed,
    report.safety.providerActivationAllowed,
    report.safety.externalApiAllowed,
    report.safety.persistenceAllowed,
    report.safety.automationAllowed,
    report.safety.memoryPersistenceAllowed,
    report.safety.kpiPersistenceAllowed,
    report.priorities.some((priorityItem) => !priorityItem.advisoryOnly || !priorityItem.requiresHumanReview || priorityItem.providerCalled || priorityItem.liveExecutionAllowed || priorityItem.externalWritesAllowed || priorityItem.crmMutationAllowed || priorityItem.leadCreationAllowed || priorityItem.outreachAllowed || priorityItem.campaignAllowed || priorityItem.buyerContactAllowed || priorityItem.sellerContactAllowed || priorityItem.matchCreationAllowed || priorityItem.dealBlastAllowed || priorityItem.scrapingAllowed || priorityItem.persistenceAllowed || priorityItem.automationAllowed),
  ];
  if (unsafe.some(Boolean)) throw new Error("Buyer-Demand Opportunity Prioritization safety contract failed.");
  if (unsafePattern.test(JSON.stringify(report))) throw new Error("Buyer-Demand Opportunity Prioritization exposed unsafe provider, secret, or execution content.");
  return true;
}
