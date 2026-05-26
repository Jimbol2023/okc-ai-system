import {
  phase10VirtualD4dFinalLockdownFlags,
  phase10VirtualD4dFinalLockdownRules,
} from "./phase-10-virtual-d4d-final-lockdown";

export const phase11SeoLocalAuthorityScopeFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  operatorLeverageOnly: true,
  scopeOnly: true,
  implementationAuthorized: false,
  providerActivated: false,
  automationEnabled: false,
  communicationEnabled: false,
  crmMutationEnabled: false,
  schemaChangeEnabled: false,
  storageMutationEnabled: false,
  runtimeJobsEnabled: false,
  routeChangeEnabled: false,
  uiChangeEnabled: false,
  metadataChangeEnabled: false,
  contentPublishingEnabled: false,
  sitemapChangeEnabled: false,
  robotsChangeEnabled: false,
  analyticsEnabled: false,
  rankTrackingEnabled: false,
  seoCrawlerEnabled: false,
  adEnabled: false,
  campaignEnabled: false,
  leadCreationEnabled: false,
  outreachEnabled: false,
  scrapingEnabled: false,
  geocodingEnabled: false,
  externalApiEnabled: false,
  fetchNetworkEnabled: false,
  auditWritingEnabled: false,
  spendIncreaseEnabled: false,
  phase12ImplementationEnabled: false,
  goLiveAuthorized: false,
} as const;

export type Phase11Decision = "not_authorized";

export type Phase11SeoLocalAuthorityScope = {
  phase: "Phase 11: SEO & Local Authority Engine";
  phaseStep: "Phase 11A — SEO & Local Authority Engine Scope";
  previousStep: "Phase 10F — Virtual D4D Final Lockdown";
  phaseDecision: "scope_only";
  primaryMetric: "acquisition_roi_per_operator_hour";
  aiRole: "operator_leverage_only";
  humanRole: "final_brand_judgment_local_market_claim_verification_content_approval_compliance_review_publishing_approval_spend_decisions_execution_owner";
  implementationDecision: Phase11Decision;
  providerDecision: Phase11Decision;
  automationDecision: Phase11Decision;
  communicationDecision: Phase11Decision;
  crmMutationDecision: Phase11Decision;
  schemaDecision: Phase11Decision;
  storageDecision: Phase11Decision;
  runtimeDecision: Phase11Decision;
  routeDecision: Phase11Decision;
  uiDecision: Phase11Decision;
  metadataDecision: Phase11Decision;
  contentPublishDecision: Phase11Decision;
  sitemapDecision: Phase11Decision;
  robotsDecision: Phase11Decision;
  analyticsDecision: Phase11Decision;
  adDecision: Phase11Decision;
  campaignDecision: Phase11Decision;
  leadCreationDecision: Phase11Decision;
  outreachDecision: Phase11Decision;
  scrapingDecision: Phase11Decision;
  externalApiDecision: Phase11Decision;
  fetchNetworkDecision: Phase11Decision;
  auditDecision: Phase11Decision;
  spendDecision: Phase11Decision;
  recommendedNextExactStep: "Phase 11B — SEO & Local Authority Signal Audit";
  nextStageRecommendation: "Phase 11B — SEO & Local Authority Signal Audit";
  phase10FinalLockdownReference: {
    flags: typeof phase10VirtualD4dFinalLockdownFlags;
    rules: typeof phase10VirtualD4dFinalLockdownRules;
  };
  scopePurpose: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase11SeoLocalAuthorityScopeFlags;
};

export const phase11SeoLocalAuthorityPurpose = [
  "Define read-only SEO & Local Authority planning for highest acquisition ROI per operator hour.",
  "Summarize truthful local-market claim requirements, service-area clarity, seller trust signals, content gap visibility, local authority evidence, conversion path clarity, technical SEO visibility, and operator content focus for human review only.",
  "Improve acquisition focus without changing routes, UI, metadata, page content, sitemap, robots, analytics, ads, campaigns, providers, lead records, CRM records, storage, audit logs, or publishing behavior.",
];

export const phase11SeoLocalAuthorityStopRules = [
  "Phase 11A is scope only.",
  "No implementation, route changes, UI changes, metadata changes, page/content publishing, sitemap changes, robots changes, analytics, rank tracking, SEO crawler activation, scraping, geocoding, external API behavior, fetch/network behavior, provider activation, lead creation, CRM mutation, outreach, ads, campaigns, spend increases, audit writing, Phase 12 implementation, or go-live is authorized.",
];

export const phase11SeoLocalAuthorityAiBoundary = [
  "summarize SEO and local authority gaps for human review only",
  "surface truthful local-market claim requirements, service-area clarity, seller trust signals, content gaps, local authority evidence, conversion path clarity, technical SEO visibility, and operator content focus",
  "do not invent local-market claims, publish content, edit metadata, change routes, change UI, write sitemap or robots files, run analytics, track rankings, crawl SEO targets, scrape, geocode, call external APIs, fetch network data, activate providers, create leads, mutate CRM records, launch campaigns, increase spend, write audits, approve Phase 12 implementation, or authorize go-live",
];

export const phase11SeoLocalAuthorityHumanBoundary = [
  "final brand judgment",
  "local-market claim verification",
  "content approval",
  "compliance review",
  "publishing approval",
  "spend decisions",
  "seller communication judgment",
  "manual execution",
  "future implementation approval",
];

export const phase11SeoLocalAuthorityForbiddenDrift = [
  "implementation",
  "route changes",
  "UI changes",
  "metadata changes",
  "page/content publishing",
  "sitemap changes",
  "robots changes",
  "analytics",
  "rank tracking",
  "SEO crawler activation",
  "scraping",
  "geocoding",
  "external API behavior",
  "fetch/network behavior",
  "provider activation",
  "lead creation",
  "CRM mutation",
  "outreach",
  "ads",
  "campaign activation",
  "spend increase",
  "audit writing",
  "Phase 12 implementation",
  "go-live",
];

export function getPhase11SeoLocalAuthorityScope(): Phase11SeoLocalAuthorityScope {
  const result: Phase11SeoLocalAuthorityScope = {
    phase: "Phase 11: SEO & Local Authority Engine",
    phaseStep: "Phase 11A — SEO & Local Authority Engine Scope",
    previousStep: "Phase 10F — Virtual D4D Final Lockdown",
    phaseDecision: "scope_only",
    primaryMetric: "acquisition_roi_per_operator_hour",
    aiRole: "operator_leverage_only",
    humanRole: "final_brand_judgment_local_market_claim_verification_content_approval_compliance_review_publishing_approval_spend_decisions_execution_owner",
    implementationDecision: "not_authorized",
    providerDecision: "not_authorized",
    automationDecision: "not_authorized",
    communicationDecision: "not_authorized",
    crmMutationDecision: "not_authorized",
    schemaDecision: "not_authorized",
    storageDecision: "not_authorized",
    runtimeDecision: "not_authorized",
    routeDecision: "not_authorized",
    uiDecision: "not_authorized",
    metadataDecision: "not_authorized",
    contentPublishDecision: "not_authorized",
    sitemapDecision: "not_authorized",
    robotsDecision: "not_authorized",
    analyticsDecision: "not_authorized",
    adDecision: "not_authorized",
    campaignDecision: "not_authorized",
    leadCreationDecision: "not_authorized",
    outreachDecision: "not_authorized",
    scrapingDecision: "not_authorized",
    externalApiDecision: "not_authorized",
    fetchNetworkDecision: "not_authorized",
    auditDecision: "not_authorized",
    spendDecision: "not_authorized",
    recommendedNextExactStep: "Phase 11B — SEO & Local Authority Signal Audit",
    nextStageRecommendation: "Phase 11B — SEO & Local Authority Signal Audit",
    phase10FinalLockdownReference: { flags: phase10VirtualD4dFinalLockdownFlags, rules: phase10VirtualD4dFinalLockdownRules },
    scopePurpose: phase11SeoLocalAuthorityPurpose,
    stopRules: phase11SeoLocalAuthorityStopRules,
    aiOperatorLeverageBoundary: phase11SeoLocalAuthorityAiBoundary,
    humanOwnershipBoundary: phase11SeoLocalAuthorityHumanBoundary,
    forbiddenDrift: phase11SeoLocalAuthorityForbiddenDrift,
    flags: phase11SeoLocalAuthorityScopeFlags,
  };
  assertPhase11SeoLocalAuthorityScopeSafe(result);
  return result;
}

export function assertPhase11SeoLocalAuthorityScopeSafe(result: Phase11SeoLocalAuthorityScope) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "operatorLeverageOnly", "scopeOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.scopePurpose, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift].flat().join(" ");
  const unsafePattern = /implementation is authorized|route changes are authorized|UI changes are authorized|metadata changes are authorized|page\/content publishing is authorized|sitemap changes are authorized|robots changes are authorized|analytics is authorized|rank tracking is authorized|SEO crawler activation is authorized|scraping is authorized|geocoding is authorized|external API behavior is authorized|fetch\/network behavior is authorized|provider activation is authorized|lead creation is authorized|CRM mutation is authorized|outreach is authorized|campaign activation is authorized|spend increase is authorized|audit writing is authorized|Phase 12 implementation is authorized|go-live is authorized/i;

  if (result.phase !== "Phase 11: SEO & Local Authority Engine") throw new Error("Phase 11A phase must remain pinned.");
  if (result.phaseStep !== "Phase 11A — SEO & Local Authority Engine Scope") throw new Error("Phase 11A step must remain pinned.");
  if (result.previousStep !== "Phase 10F — Virtual D4D Final Lockdown") throw new Error("Phase 11A previous step must remain Phase 10F.");
  if (result.primaryMetric !== "acquisition_roi_per_operator_hour" || result.aiRole !== "operator_leverage_only") throw new Error("Phase 11A alignment must remain pinned.");
  if (result.phaseDecision !== "scope_only") throw new Error("Phase 11A must remain scope-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 11A decisions must remain not_authorized.");
  if (result.phase10FinalLockdownReference.rules.join("|") !== phase10VirtualD4dFinalLockdownRules.join("|")) throw new Error("Phase 11A must preserve Phase 10F final lockdown reference.");
  if (unsafeTrue.length > 0) throw new Error("Phase 11A blocked flags cannot turn true.");
  if (!/No implementation, route changes/i.test(result.stopRules.join(" ")) || !/Phase 12 implementation/i.test(result.stopRules.join(" "))) throw new Error("Phase 11A stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not invent local-market claims/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 11A AI boundary is missing.");
  if (!/final brand judgment/i.test(result.humanOwnershipBoundary.join(" ")) || !/local-market claim verification/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 11A human boundary is missing.");
  if (!/metadata changes/i.test(result.forbiddenDrift.join(" ")) || !/go-live/i.test(result.forbiddenDrift.join(" "))) throw new Error("Phase 11A forbidden drift is missing.");
  if (result.recommendedNextExactStep !== "Phase 11B — SEO & Local Authority Signal Audit") throw new Error("Phase 11A must hand off to Phase 11B.");
  if (unsafePattern.test(text)) throw new Error("Phase 11A wording must not imply unsafe authorization.");
}

export function getPhase11SeoLocalAuthorityScopeSummary() {
  const result = getPhase11SeoLocalAuthorityScope();
  return `${result.phase} / ${result.phaseStep}: read-only SEO & Local Authority scope for highest acquisition ROI per operator hour with human-owned content approval, local-market claim verification, compliance review, publishing approval, and spend decisions. No publishing, no route changes, no UI changes, no metadata changes, no scraping, no external API/fetch/network behavior, no outreach, no CRM mutation, no spend increase, no Phase 12 implementation, and no go-live are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
