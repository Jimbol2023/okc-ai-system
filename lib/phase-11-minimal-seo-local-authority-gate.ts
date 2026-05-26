import { phase11ManualLocalAuthorityLanes, phase11SeoLocalAuthoritySummaryStates } from "./phase-11-manual-local-authority-policy";
import { phase11SeoLocalAuthorityImplementationLanes } from "./phase-11-seo-local-authority-implementation-scope";
import { phase11SeoLocalAuthorityForbiddenDrift, phase11SeoLocalAuthorityHumanBoundary } from "./phase-11-seo-local-authority-scope";

export const phase11MinimalSeoLocalAuthorityGateFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  gateOnly: true,
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

export const phase11MinimalSeoLocalAuthorityGateChecks = [
  "minimal_readonly_seo_local_authority_package",
  "human_brand_judgment_required",
  "local_market_claim_verification_required",
  "content_compliance_review_required",
  "publishing_approval_required_before_any_content_change",
  "no_route_ui_metadata_publishing_boundary_required",
  "no_scraping_external_api_campaign_spend_boundary_required",
  "phase_11f_lockdown_ready",
] as const;

export type Phase11MinimalSeoLocalAuthorityGate = {
  phase: "Phase 11: SEO & Local Authority Engine";
  phaseStep: "Phase 11E — Minimal SEO & Local Authority Gate";
  previousStep: "Phase 11D — SEO & Local Authority Implementation Scope";
  phaseDecision: "minimal_gate_only";
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
  auditDecision: "not_authorized";
  recommendedNextExactStep: "Phase 11F — SEO & Local Authority Final Lockdown";
  nextStageRecommendation: "Phase 11F — SEO & Local Authority Final Lockdown";
  gateChecks: typeof phase11MinimalSeoLocalAuthorityGateChecks;
  implementationLaneReferences: typeof phase11SeoLocalAuthorityImplementationLanes;
  policyLaneReferences: typeof phase11ManualLocalAuthorityLanes;
  summaryStateReferences: typeof phase11SeoLocalAuthoritySummaryStates;
  gateRules: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase11MinimalSeoLocalAuthorityGateFlags;
};

export const phase11MinimalSeoLocalAuthorityGateRules = [
  "Phase 11E can only decide whether a minimal read-only SEO/local authority visibility package is worth carrying to final lockdown.",
  "A minimal package is only advisory if it preserves human brand judgment, local-market claim verification, content approval, compliance review, publishing approval, no route/UI/metadata changes, no publishing, and no scraping/network/campaign/spend boundaries.",
  "The gate cannot approve implementation, content publishing, sitemap/robots edits, analytics, rank tracking, scraping, external APIs, CRM mutation, provider activation, campaigns, spend increases, Phase 12 implementation, or go-live.",
];

export const phase11MinimalSeoLocalAuthorityGateStopRules = [
  "Phase 11E is a minimal gate only.",
  "No implementation, route changes, UI changes, metadata changes, page/content publishing, sitemap changes, robots changes, analytics, rank tracking, SEO crawler activation, scraping, geocoding, external API behavior, fetch/network behavior, provider activation, lead creation, CRM mutation, outreach, ads, campaigns, spend increases, audit writing, Phase 12 implementation, or go-live is authorized.",
];

export const phase11MinimalSeoLocalAuthorityGateAiBoundary = [
  "summarize whether minimal read-only SEO/local authority visibility is worth final lockdown review",
  "do not approve implementation, publish content, edit routes, edit UI, edit metadata, write sitemap or robots files, run analytics, track rankings, crawl SEO targets, scrape, geocode, call external APIs, fetch network data, activate providers, create leads, mutate CRM records, launch campaigns, increase spend, write audits, approve Phase 12 implementation, or authorize go-live",
];

export function getPhase11MinimalSeoLocalAuthorityGate(): Phase11MinimalSeoLocalAuthorityGate {
  const result: Phase11MinimalSeoLocalAuthorityGate = {
    phase: "Phase 11: SEO & Local Authority Engine",
    phaseStep: "Phase 11E — Minimal SEO & Local Authority Gate",
    previousStep: "Phase 11D — SEO & Local Authority Implementation Scope",
    phaseDecision: "minimal_gate_only",
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
    auditDecision: "not_authorized",
    recommendedNextExactStep: "Phase 11F — SEO & Local Authority Final Lockdown",
    nextStageRecommendation: "Phase 11F — SEO & Local Authority Final Lockdown",
    gateChecks: phase11MinimalSeoLocalAuthorityGateChecks,
    implementationLaneReferences: phase11SeoLocalAuthorityImplementationLanes,
    policyLaneReferences: phase11ManualLocalAuthorityLanes,
    summaryStateReferences: phase11SeoLocalAuthoritySummaryStates,
    gateRules: phase11MinimalSeoLocalAuthorityGateRules,
    stopRules: phase11MinimalSeoLocalAuthorityGateStopRules,
    aiOperatorLeverageBoundary: phase11MinimalSeoLocalAuthorityGateAiBoundary,
    humanOwnershipBoundary: phase11SeoLocalAuthorityHumanBoundary,
    forbiddenDrift: phase11SeoLocalAuthorityForbiddenDrift,
    flags: phase11MinimalSeoLocalAuthorityGateFlags,
  };
  assertPhase11MinimalSeoLocalAuthorityGateSafe(result);
  return result;
}

export function assertPhase11MinimalSeoLocalAuthorityGateSafe(result: Phase11MinimalSeoLocalAuthorityGate) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "gateOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.gateRules, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift, result.gateChecks].flat().join(" ");
  const unsafePattern = /implementation is authorized|route changes are authorized|UI changes are authorized|metadata changes are authorized|page\/content publishing is authorized|sitemap changes are authorized|analytics is authorized|rank tracking is authorized|scraping is authorized|external API behavior is authorized|fetch\/network behavior is authorized|provider activation is authorized|lead creation is authorized|CRM mutation is authorized|campaigns are authorized|spend increases are authorized|audit writing is authorized|Phase 12 implementation is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 11E — Minimal SEO & Local Authority Gate") throw new Error("Phase 11E step must remain pinned.");
  if (result.previousStep !== "Phase 11D — SEO & Local Authority Implementation Scope") throw new Error("Phase 11E previous step must remain Phase 11D.");
  if (result.phaseDecision !== "minimal_gate_only") throw new Error("Phase 11E must remain minimal-gate-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 11E decisions must remain not_authorized.");
  if (result.gateChecks.join("|") !== phase11MinimalSeoLocalAuthorityGateChecks.join("|")) throw new Error("Phase 11E gate checks are missing.");
  if (result.implementationLaneReferences.join("|") !== phase11SeoLocalAuthorityImplementationLanes.join("|")) throw new Error("Phase 11E implementation lane references are missing.");
  if (result.policyLaneReferences.join("|") !== phase11ManualLocalAuthorityLanes.join("|")) throw new Error("Phase 11E policy lane references are missing.");
  if (unsafeTrue.length > 0) throw new Error("Phase 11E blocked flags cannot turn true.");
  if (!/minimal gate only/i.test(result.stopRules.join(" "))) throw new Error("Phase 11E stop rules are missing.");
  if (!/do not approve implementation/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 11E AI boundary is missing.");
  if (!/publishing approval/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 11E human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 11F — SEO & Local Authority Final Lockdown") throw new Error("Phase 11E must hand off to Phase 11F.");
  if (unsafePattern.test(text)) throw new Error("Phase 11E wording must not imply unsafe authorization.");
}

export function getPhase11MinimalSeoLocalAuthorityGateSummary() {
  const result = getPhase11MinimalSeoLocalAuthorityGate();
  return `${result.phase} / ${result.phaseStep}: gates a minimal read-only SEO/local authority package for highest acquisition ROI per operator hour with human-owned content approval, local-market claim verification, compliance review, and publishing approval. No publishing, no route/UI/metadata changes, no scraping, no external API/fetch/network behavior, no outreach, no CRM mutation, no spend increase, no Phase 12 implementation, and no go-live are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
