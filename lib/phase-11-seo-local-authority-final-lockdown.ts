import { phase11MinimalSeoLocalAuthorityGateChecks } from "./phase-11-minimal-seo-local-authority-gate";
import { phase11SeoLocalAuthorityForbiddenDrift, phase11SeoLocalAuthorityHumanBoundary } from "./phase-11-seo-local-authority-scope";

export const phase11SeoLocalAuthorityFinalLockdownFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  finalLockdownOnly: true,
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

export type Phase11SeoLocalAuthorityFinalLockdown = {
  phase: "Phase 11: SEO & Local Authority Engine";
  phaseStep: "Phase 11F — SEO & Local Authority Final Lockdown";
  previousStep: "Phase 11E — Minimal SEO & Local Authority Gate";
  phaseDecision: "final_lockdown_only";
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
  recommendedNextExactStep: "Phase 12 — Conversion Optimization Engine";
  nextStageRecommendation: "Phase 12 — Conversion Optimization Engine";
  gateReferences: typeof phase11MinimalSeoLocalAuthorityGateChecks;
  lockdownRules: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase11SeoLocalAuthorityFinalLockdownFlags;
};

export const phase11SeoLocalAuthorityFinalLockdownRules = [
  "Phase 11F locks Phase 11 as read-only planning for SEO & Local Authority intelligence.",
  "Phase 11F preserves the no-publishing, no-route-change, no-UI-change, no-metadata-change, no-sitemap-or-robots-change, no-analytics, no-rank-tracking, no-scraping, no-network, no-campaign, no-CRM-mutation, and no-spend-increase boundary.",
  "Phase 11F can recommend Phase 12 — Conversion Optimization Engine, but cannot implement Phase 12.",
];

export const phase11SeoLocalAuthorityFinalLockdownStopRules = [
  "Phase 11F is final lockdown only.",
  "No implementation, route changes, UI changes, metadata changes, page/content publishing, sitemap changes, robots changes, analytics, rank tracking, SEO crawler activation, scraping, geocoding, external API behavior, fetch/network behavior, provider activation, lead creation, CRM mutation, outreach, ads, campaigns, spend increases, audit writing, Phase 12 implementation, or go-live is authorized.",
];

export const phase11SeoLocalAuthorityFinalLockdownAiBoundary = [
  "summarize Phase 11 lockdown boundaries for human review only",
  "do not implement Phase 12, publish content, edit routes, edit UI, edit metadata, write sitemap or robots files, run analytics, track rankings, crawl SEO targets, scrape, geocode, call external APIs, fetch network data, activate providers, create leads, mutate CRM records, launch campaigns, increase spend, write audits, or authorize go-live",
];

export function getPhase11SeoLocalAuthorityFinalLockdown(): Phase11SeoLocalAuthorityFinalLockdown {
  const result: Phase11SeoLocalAuthorityFinalLockdown = {
    phase: "Phase 11: SEO & Local Authority Engine",
    phaseStep: "Phase 11F — SEO & Local Authority Final Lockdown",
    previousStep: "Phase 11E — Minimal SEO & Local Authority Gate",
    phaseDecision: "final_lockdown_only",
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
    recommendedNextExactStep: "Phase 12 — Conversion Optimization Engine",
    nextStageRecommendation: "Phase 12 — Conversion Optimization Engine",
    gateReferences: phase11MinimalSeoLocalAuthorityGateChecks,
    lockdownRules: phase11SeoLocalAuthorityFinalLockdownRules,
    stopRules: phase11SeoLocalAuthorityFinalLockdownStopRules,
    aiOperatorLeverageBoundary: phase11SeoLocalAuthorityFinalLockdownAiBoundary,
    humanOwnershipBoundary: phase11SeoLocalAuthorityHumanBoundary,
    forbiddenDrift: phase11SeoLocalAuthorityForbiddenDrift,
    flags: phase11SeoLocalAuthorityFinalLockdownFlags,
  };
  assertPhase11SeoLocalAuthorityFinalLockdownSafe(result);
  return result;
}

export function assertPhase11SeoLocalAuthorityFinalLockdownSafe(result: Phase11SeoLocalAuthorityFinalLockdown) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "finalLockdownOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.lockdownRules, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift].flat().join(" ");
  const unsafePattern = /implementation is authorized|route changes are authorized|UI changes are authorized|metadata changes are authorized|page\/content publishing is authorized|sitemap changes are authorized|robots changes are authorized|analytics is authorized|rank tracking is authorized|scraping is authorized|external API behavior is authorized|fetch\/network behavior is authorized|provider activation is authorized|lead creation is authorized|CRM mutation is authorized|campaigns are authorized|spend increases are authorized|audit writing is authorized|Phase 12 implementation is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 11F — SEO & Local Authority Final Lockdown") throw new Error("Phase 11F step must remain pinned.");
  if (result.previousStep !== "Phase 11E — Minimal SEO & Local Authority Gate") throw new Error("Phase 11F previous step must remain Phase 11E.");
  if (result.phaseDecision !== "final_lockdown_only") throw new Error("Phase 11F must remain final-lockdown-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 11F decisions must remain not_authorized.");
  if (result.gateReferences.join("|") !== phase11MinimalSeoLocalAuthorityGateChecks.join("|")) throw new Error("Phase 11F gate references are missing.");
  if (unsafeTrue.length > 0) throw new Error("Phase 11F blocked flags cannot turn true.");
  if (!/final lockdown only/i.test(result.stopRules.join(" "))) throw new Error("Phase 11F stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not implement Phase 12/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 11F AI boundary is missing.");
  if (!/content approval/i.test(result.humanOwnershipBoundary.join(" ")) || !/publishing approval/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 11F human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 12 — Conversion Optimization Engine") throw new Error("Phase 11F must recommend Phase 12.");
  if (unsafePattern.test(text)) throw new Error("Phase 11F wording must not imply unsafe authorization.");
}

export function getPhase11SeoLocalAuthorityFinalLockdownSummary() {
  const result = getPhase11SeoLocalAuthorityFinalLockdown();
  return `${result.phase} / ${result.phaseStep}: locks Phase 11 SEO & Local Authority planning for highest acquisition ROI per operator hour with human-owned content approval, local-market claim verification, compliance review, publishing approval, and spend decisions. No publishing, no route/UI/metadata changes, no scraping, no external API/fetch/network behavior, no outreach, no CRM mutation, no spend increase, no Phase 12 implementation, and no go-live are authorized. Next phase: ${result.recommendedNextExactStep}.`;
}
