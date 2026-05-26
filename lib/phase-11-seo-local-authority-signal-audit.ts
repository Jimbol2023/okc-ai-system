import { sellerBenefits, sellerProcess, trustPoints } from "./content/homepage";
import {
  phase11SeoLocalAuthorityForbiddenDrift,
  phase11SeoLocalAuthorityHumanBoundary,
} from "./phase-11-seo-local-authority-scope";
import {
  r80AllowedConcepts,
  r80DangerousWordingPatterns,
  r80GovernanceBoundary,
  r80ScopeFlags,
} from "./r80-acquisition-research-workbench-scope-contract";

export const phase11SeoLocalAuthoritySignalAuditFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  signalAuditOnly: true,
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

export type Phase11SeoLocalAuthoritySignalFamily =
  | "phase_10_final_lockdown_handoff"
  | "public_homepage_contact_sell_your_house_public_layout_and_homepage_content"
  | "oklahoma_city_local_focus_as_is_no_repairs_no_commissions_simple_process_timeline_copy"
  | "lead_source_and_source_tracking_doctrine"
  | "r80_research_boundary_no_scraping_geocoding_external_api_provider_lead_creation_contact_automation"
  | "manual_review_only_no_crawler_rank_tracker_generator_publisher_sitemap_metadata_analytics";

export const phase11SeoLocalAuthoritySignalFamilies: Phase11SeoLocalAuthoritySignalFamily[] = [
  "phase_10_final_lockdown_handoff",
  "public_homepage_contact_sell_your_house_public_layout_and_homepage_content",
  "oklahoma_city_local_focus_as_is_no_repairs_no_commissions_simple_process_timeline_copy",
  "lead_source_and_source_tracking_doctrine",
  "r80_research_boundary_no_scraping_geocoding_external_api_provider_lead_creation_contact_automation",
  "manual_review_only_no_crawler_rank_tracker_generator_publisher_sitemap_metadata_analytics",
];

export type Phase11SeoLocalAuthoritySignalAudit = {
  phase: "Phase 11: SEO & Local Authority Engine";
  phaseStep: "Phase 11B — SEO & Local Authority Signal Audit";
  previousStep: "Phase 11A — SEO & Local Authority Engine Scope";
  phaseDecision: "signal_audit_only";
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
  recommendedNextExactStep: "Phase 11C — Manual Local Authority Advisory Policy";
  nextStageRecommendation: "Phase 11C — Manual Local Authority Advisory Policy";
  signalFamilies: Phase11SeoLocalAuthoritySignalFamily[];
  groundedReferences: {
    publicRoutes: string[];
    homepageContent: {
      sellerBenefits: typeof sellerBenefits;
      sellerProcess: typeof sellerProcess;
      trustPoints: typeof trustPoints;
    };
    r80AllowedConcepts: typeof r80AllowedConcepts;
    r80DangerousWordingPatterns: typeof r80DangerousWordingPatterns;
    r80GovernanceBoundary: typeof r80GovernanceBoundary;
    r80ScopeFlags: typeof r80ScopeFlags;
  };
  auditPurpose: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase11SeoLocalAuthoritySignalAuditFlags;
};

export const phase11SeoLocalAuthoritySignalAuditPurpose = [
  "Audit existing SEO and local authority signal families without changing routes, UI, metadata, content, sitemap, robots, analytics, rank tracking, crawlers, providers, leads, CRM records, campaigns, spend, storage, or audit logs.",
  "Reference current public website surfaces, homepage content, Oklahoma City trust/value copy, source-tracking doctrine, and R80 research boundaries as existing signals only.",
  "Support highest acquisition ROI per operator hour by making truthful local authority gaps, service-area clarity, seller trust signals, content gaps, conversion path clarity, and technical SEO visibility easier for humans to review.",
];

export const phase11SeoLocalAuthoritySignalAuditStopRules = [
  "Phase 11B audits existing SEO and local-authority signal families only.",
  "No implementation, route changes, UI changes, metadata changes, page/content publishing, sitemap changes, robots changes, analytics, rank tracking, SEO crawler activation, scraping, geocoding, external API behavior, fetch/network behavior, provider activation, lead creation, CRM mutation, outreach, ads, campaigns, spend increases, audit writing, Phase 12 implementation, or go-live is authorized.",
];

export const phase11SeoLocalAuthoritySignalAuditAiBoundary = [
  "summarize existing SEO and local authority signals for human review only",
  "flag truthful local-market claim requirements, service-area clarity, trust signals, content gaps, conversion path clarity, technical SEO visibility, and R80 research boundaries",
  "do not publish content, edit routes, edit UI, edit metadata, write sitemap or robots files, run analytics, track rankings, crawl SEO targets, scrape, geocode, call external APIs, fetch network data, activate providers, create leads, mutate CRM records, launch campaigns, increase spend, or write audits",
];

export function getPhase11SeoLocalAuthoritySignalAudit(): Phase11SeoLocalAuthoritySignalAudit {
  const result: Phase11SeoLocalAuthoritySignalAudit = {
    phase: "Phase 11: SEO & Local Authority Engine",
    phaseStep: "Phase 11B — SEO & Local Authority Signal Audit",
    previousStep: "Phase 11A — SEO & Local Authority Engine Scope",
    phaseDecision: "signal_audit_only",
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
    recommendedNextExactStep: "Phase 11C — Manual Local Authority Advisory Policy",
    nextStageRecommendation: "Phase 11C — Manual Local Authority Advisory Policy",
    signalFamilies: phase11SeoLocalAuthoritySignalFamilies,
    groundedReferences: {
      publicRoutes: ["/", "/contact", "/sell-your-house", "app/(public)/layout.tsx", "lib/content/homepage.ts"],
      homepageContent: { sellerBenefits, sellerProcess, trustPoints },
      r80AllowedConcepts,
      r80DangerousWordingPatterns,
      r80GovernanceBoundary,
      r80ScopeFlags,
    },
    auditPurpose: phase11SeoLocalAuthoritySignalAuditPurpose,
    stopRules: phase11SeoLocalAuthoritySignalAuditStopRules,
    aiOperatorLeverageBoundary: phase11SeoLocalAuthoritySignalAuditAiBoundary,
    humanOwnershipBoundary: phase11SeoLocalAuthorityHumanBoundary,
    forbiddenDrift: phase11SeoLocalAuthorityForbiddenDrift,
    flags: phase11SeoLocalAuthoritySignalAuditFlags,
  };
  assertPhase11SeoLocalAuthoritySignalAuditSafe(result);
  return result;
}

export function assertPhase11SeoLocalAuthoritySignalAuditSafe(result: Phase11SeoLocalAuthoritySignalAudit) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "signalAuditOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.auditPurpose, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift, result.signalFamilies].flat().join(" ");
  const unsafePattern = /route changes are authorized|UI changes are authorized|metadata changes are authorized|page\/content publishing is authorized|sitemap changes are authorized|analytics is authorized|rank tracking is authorized|SEO crawler activation is authorized|scraping is authorized|geocoding is authorized|external API behavior is authorized|fetch\/network behavior is authorized|lead creation is authorized|CRM mutation is authorized|campaigns are authorized|spend increases are authorized|audit writing is authorized|Phase 12 implementation is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 11B — SEO & Local Authority Signal Audit") throw new Error("Phase 11B step must remain pinned.");
  if (result.previousStep !== "Phase 11A — SEO & Local Authority Engine Scope") throw new Error("Phase 11B previous step must remain Phase 11A.");
  if (result.phaseDecision !== "signal_audit_only") throw new Error("Phase 11B must remain signal-audit-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 11B decisions must remain not_authorized.");
  if (result.signalFamilies.join("|") !== phase11SeoLocalAuthoritySignalFamilies.join("|")) throw new Error("Phase 11B must include all SEO/local-authority signal families.");
  if (unsafeTrue.length > 0) throw new Error("Phase 11B blocked flags cannot turn true.");
  if (!/public_homepage_contact/i.test(result.signalFamilies.join(" ")) || !/r80_research_boundary/i.test(result.signalFamilies.join(" "))) throw new Error("Phase 11B repo-grounded signals are missing.");
  if (!/audits existing SEO and local-authority signal families only/i.test(result.stopRules.join(" "))) throw new Error("Phase 11B stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not publish content/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 11B AI boundary is missing.");
  if (!/content approval/i.test(result.humanOwnershipBoundary.join(" ")) || !/local-market claim verification/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 11B human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 11C — Manual Local Authority Advisory Policy") throw new Error("Phase 11B must hand off to Phase 11C.");
  if (unsafePattern.test(text)) throw new Error("Phase 11B wording must not imply unsafe authorization.");
}

export function getPhase11SeoLocalAuthoritySignalAuditSummary() {
  const result = getPhase11SeoLocalAuthoritySignalAudit();
  return `${result.phase} / ${result.phaseStep}: audits existing public website, homepage content, Oklahoma City trust copy, source-tracking, and R80 research-boundary signals for highest acquisition ROI per operator hour. Human-owned content approval and local-market claim verification remain required. No publishing, no route/UI/metadata changes, no scraping, no external API/fetch/network behavior, no outreach, no CRM mutation, no spend increase, no Phase 12 implementation, and no go-live are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
