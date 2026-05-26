import { phase11SeoLocalAuthorityForbiddenDrift, phase11SeoLocalAuthorityHumanBoundary } from "./phase-11-seo-local-authority-scope";
import { phase11SeoLocalAuthoritySignalFamilies } from "./phase-11-seo-local-authority-signal-audit";

export const phase11ManualLocalAuthorityPolicyFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  policyOnly: true,
  operatorLeverageOnly: true,
  implementationAuthorized: false,
  routeChangeEnabled: false,
  uiChangeEnabled: false,
  metadataChangeEnabled: false,
  contentPublishingEnabled: false,
  sitemapChangeEnabled: false,
  robotsChangeEnabled: false,
  analyticsEnabled: false,
  rankTrackingEnabled: false,
  seoCrawlerEnabled: false,
  scrapingEnabled: false,
  geocodingEnabled: false,
  externalApiEnabled: false,
  fetchNetworkEnabled: false,
  providerActivated: false,
  leadCreationEnabled: false,
  crmMutationEnabled: false,
  campaignEnabled: false,
  spendIncreaseEnabled: false,
  auditWritingEnabled: false,
  phase12ImplementationEnabled: false,
  goLiveAuthorized: false,
} as const;

export const phase11ManualLocalAuthorityLanes = [
  "stop_compliance_and_truthfulness_first",
  "local_market_claim_review",
  "seller_trust_signal_review",
  "service_area_clarity_review",
  "as_is_value_proposition_review",
  "source_tracking_alignment_review",
  "content_gap_visibility_review",
  "local_authority_evidence_review",
  "conversion_path_clarity_review",
  "technical_seo_visibility_review",
  "operator_content_focus_review",
  "defer_until_human_approved",
] as const;

export const phase11SeoLocalAuthoritySummaryStates = [
  "seo_authority_blocked",
  "truthfulness_review_required",
  "local_claim_unverified",
  "service_area_visible",
  "trust_signal_visible",
  "content_gap_visible",
  "authority_evidence_needed",
  "conversion_path_visible",
  "technical_visibility_review_only",
  "operator_focus_only",
  "not_ready",
] as const;

export type Phase11ManualLocalAuthorityPolicy = {
  phase: "Phase 11: SEO & Local Authority Engine";
  phaseStep: "Phase 11C — Manual Local Authority Advisory Policy";
  previousStep: "Phase 11B — SEO & Local Authority Signal Audit";
  phaseDecision: "manual_policy_only";
  implementationDecision: "not_authorized";
  routeDecision: "not_authorized";
  uiDecision: "not_authorized";
  metadataDecision: "not_authorized";
  contentPublishDecision: "not_authorized";
  sitemapDecision: "not_authorized";
  robotsDecision: "not_authorized";
  analyticsDecision: "not_authorized";
  scrapingDecision: "not_authorized";
  externalApiDecision: "not_authorized";
  fetchNetworkDecision: "not_authorized";
  providerDecision: "not_authorized";
  leadCreationDecision: "not_authorized";
  crmMutationDecision: "not_authorized";
  campaignDecision: "not_authorized";
  spendDecision: "not_authorized";
  recommendedNextExactStep: "Phase 11D — SEO & Local Authority Implementation Scope";
  nextStageRecommendation: "Phase 11D — SEO & Local Authority Implementation Scope";
  signalReferences: typeof phase11SeoLocalAuthoritySignalFamilies;
  localAuthorityLanes: typeof phase11ManualLocalAuthorityLanes;
  summaryStates: typeof phase11SeoLocalAuthoritySummaryStates;
  policyRules: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase11ManualLocalAuthorityPolicyFlags;
};

export const phase11ManualLocalAuthorityPolicyRules = [
  "Manual local authority lanes are advisory visibility only and cannot trigger publishing, route/UI/content/metadata edits, analytics, rank tracking, scraping, geocoding, external APIs, campaigns, or spend increases.",
  "Local-market, service-area, and authority claims must remain unverified until the human operator verifies truthfulness and compliance.",
  "The highest-aROI policy is to stop compliance and truthfulness drift first, then focus human review on local claims, seller trust, service-area clarity, content gaps, conversion path clarity, technical visibility, and operator content focus.",
];

export const phase11ManualLocalAuthorityPolicyStopRules = [
  "Phase 11C defines manual local authority advisory lanes and summary states only.",
  "No implementation, route changes, UI changes, metadata changes, page/content publishing, sitemap changes, robots changes, analytics, rank tracking, SEO crawler activation, scraping, geocoding, external API behavior, fetch/network behavior, provider activation, lead creation, CRM mutation, outreach, ads, campaigns, spend increases, audit writing, Phase 12 implementation, or go-live is authorized.",
];

export const phase11ManualLocalAuthorityPolicyAiBoundary = [
  "rank and explain manual local authority lanes for human review only",
  "do not invent local-market claims, approve content, publish content, change routes, change UI, change metadata, write sitemap or robots files, run analytics, track rankings, crawl SEO targets, scrape, geocode, call external APIs, fetch network data, activate providers, create leads, mutate CRM records, launch campaigns, increase spend, or approve implementation",
];

export function getPhase11ManualLocalAuthorityPolicy(): Phase11ManualLocalAuthorityPolicy {
  const result: Phase11ManualLocalAuthorityPolicy = {
    phase: "Phase 11: SEO & Local Authority Engine",
    phaseStep: "Phase 11C — Manual Local Authority Advisory Policy",
    previousStep: "Phase 11B — SEO & Local Authority Signal Audit",
    phaseDecision: "manual_policy_only",
    implementationDecision: "not_authorized",
    routeDecision: "not_authorized",
    uiDecision: "not_authorized",
    metadataDecision: "not_authorized",
    contentPublishDecision: "not_authorized",
    sitemapDecision: "not_authorized",
    robotsDecision: "not_authorized",
    analyticsDecision: "not_authorized",
    scrapingDecision: "not_authorized",
    externalApiDecision: "not_authorized",
    fetchNetworkDecision: "not_authorized",
    providerDecision: "not_authorized",
    leadCreationDecision: "not_authorized",
    crmMutationDecision: "not_authorized",
    campaignDecision: "not_authorized",
    spendDecision: "not_authorized",
    recommendedNextExactStep: "Phase 11D — SEO & Local Authority Implementation Scope",
    nextStageRecommendation: "Phase 11D — SEO & Local Authority Implementation Scope",
    signalReferences: phase11SeoLocalAuthoritySignalFamilies,
    localAuthorityLanes: phase11ManualLocalAuthorityLanes,
    summaryStates: phase11SeoLocalAuthoritySummaryStates,
    policyRules: phase11ManualLocalAuthorityPolicyRules,
    stopRules: phase11ManualLocalAuthorityPolicyStopRules,
    aiOperatorLeverageBoundary: phase11ManualLocalAuthorityPolicyAiBoundary,
    humanOwnershipBoundary: phase11SeoLocalAuthorityHumanBoundary,
    forbiddenDrift: phase11SeoLocalAuthorityForbiddenDrift,
    flags: phase11ManualLocalAuthorityPolicyFlags,
  };
  assertPhase11ManualLocalAuthorityPolicySafe(result);
  return result;
}

export function assertPhase11ManualLocalAuthorityPolicySafe(result: Phase11ManualLocalAuthorityPolicy) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "policyOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.policyRules, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift, result.localAuthorityLanes, result.summaryStates].flat().join(" ");
  const unsafePattern = /route changes are authorized|UI changes are authorized|metadata changes are authorized|page\/content publishing is authorized|analytics is authorized|rank tracking is authorized|scraping is authorized|geocoding is authorized|external API behavior is authorized|fetch\/network behavior is authorized|provider activation is authorized|lead creation is authorized|CRM mutation is authorized|campaigns are authorized|spend increases are authorized|Phase 12 implementation is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 11C — Manual Local Authority Advisory Policy") throw new Error("Phase 11C step must remain pinned.");
  if (result.previousStep !== "Phase 11B — SEO & Local Authority Signal Audit") throw new Error("Phase 11C previous step must remain Phase 11B.");
  if (result.phaseDecision !== "manual_policy_only") throw new Error("Phase 11C must remain manual-policy-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 11C decisions must remain not_authorized.");
  if (result.localAuthorityLanes.join("|") !== phase11ManualLocalAuthorityLanes.join("|")) throw new Error("Phase 11C local authority lanes are missing.");
  if (result.summaryStates.join("|") !== phase11SeoLocalAuthoritySummaryStates.join("|")) throw new Error("Phase 11C summary states are missing.");
  if (result.signalReferences.join("|") !== phase11SeoLocalAuthoritySignalFamilies.join("|")) throw new Error("Phase 11C signal references are missing.");
  if (unsafeTrue.length > 0) throw new Error("Phase 11C blocked flags cannot turn true.");
  if (!/advisory lanes and summary states only/i.test(result.stopRules.join(" "))) throw new Error("Phase 11C stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not invent local-market claims/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 11C AI boundary is missing.");
  if (!/content approval/i.test(result.humanOwnershipBoundary.join(" ")) || !/publishing approval/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 11C human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 11D — SEO & Local Authority Implementation Scope") throw new Error("Phase 11C must hand off to Phase 11D.");
  if (unsafePattern.test(text)) throw new Error("Phase 11C wording must not imply unsafe authorization.");
}

export function getPhase11ManualLocalAuthorityPolicySummary() {
  const result = getPhase11ManualLocalAuthorityPolicy();
  return `${result.phase} / ${result.phaseStep}: defines manual local authority lanes and summary states for highest acquisition ROI per operator hour with human-owned content approval, local-market claim verification, compliance review, and publishing approval. No publishing, no route/UI/metadata changes, no scraping, no external API/fetch/network behavior, no outreach, no CRM mutation, no spend increase, no Phase 12 implementation, and no go-live are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
