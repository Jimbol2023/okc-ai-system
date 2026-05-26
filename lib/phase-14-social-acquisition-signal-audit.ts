import { sellerBenefits, sellerProcess, trustPoints } from "./content/homepage";
import { LEAD_SOURCE_TAGS } from "./lead-source";
import {
  phase14SocialAcquisitionForbiddenDrift,
  phase14SocialAcquisitionHumanBoundary,
} from "./phase-14-facebook-tiktok-acquisition-scope";
import { phase11SeoLocalAuthorityForbiddenDrift } from "./phase-11-seo-local-authority-scope";
import { phase12ConversionOptimizationForbiddenDrift } from "./phase-12-conversion-optimization-scope";
import { phase13SafetyComplianceForbiddenDrift } from "./phase-13-safety-compliance-scope";
import { sourceQualitySignals, sourceQualityLanes } from "./source-quality-intelligence";
import { leadIntakeSchema } from "./validations/lead";

export const phase14SocialAcquisitionSignalAuditFlags = {
  readOnly: true,
  advisoryOnly: true,
  planningOnly: true,
  signalAuditOnly: true,
  operatorLeverageOnly: true,
  implementationAuthorized: false,
  providerActivated: false,
  pixelEnabled: false,
  trackingEnabled: false,
  analyticsEnabled: false,
  adAccountMutationEnabled: false,
  adEnabled: false,
  campaignEnabled: false,
  audienceUploadEnabled: false,
  creativePublishingEnabled: false,
  leadFormSyncEnabled: false,
  leadImportEnabled: false,
  webhookEnabled: false,
  crmMutationEnabled: false,
  sourceMutationEnabled: false,
  storageMutationEnabled: false,
  outreachEnabled: false,
  spendIncreaseEnabled: false,
  goLiveAuthorized: false,
  phase15ImplementationEnabled: false,
} as const;

export type Phase14SocialAcquisitionSignalFamily =
  | "phase_13_final_lockdown_handoff"
  | "public_homepage_contact_sell_your_house_layout_lead_capture_homepage_content"
  | "lead_intake_source_tracking_lead_source_source_quality_import_cleanup_source_attribution"
  | "safety_compliance_consent_dnc_outreach_provider_approval_no_send_no_call"
  | "conversion_local_authority_truthful_claims_trust_cta_no_pressure_conversion_path"
  | "campaign_spend_go_live_blocked_governance_readiness_boundaries"
  | "no_facebook_tiktok_sdk_ad_account_pixel_tracking_audience_lead_sync_webhook_campaign_creative_budget";

export const phase14SocialAcquisitionSignalFamilies: Phase14SocialAcquisitionSignalFamily[] = [
  "phase_13_final_lockdown_handoff",
  "public_homepage_contact_sell_your_house_layout_lead_capture_homepage_content",
  "lead_intake_source_tracking_lead_source_source_quality_import_cleanup_source_attribution",
  "safety_compliance_consent_dnc_outreach_provider_approval_no_send_no_call",
  "conversion_local_authority_truthful_claims_trust_cta_no_pressure_conversion_path",
  "campaign_spend_go_live_blocked_governance_readiness_boundaries",
  "no_facebook_tiktok_sdk_ad_account_pixel_tracking_audience_lead_sync_webhook_campaign_creative_budget",
];

export type Phase14SocialAcquisitionSignalAudit = {
  phase: "Phase 14: Facebook & TikTok Acquisition Engine";
  phaseStep: "Phase 14B — Social Acquisition Signal Audit";
  previousStep: "Phase 14A — Facebook & TikTok Acquisition Engine Scope";
  phaseDecision: "signal_audit_only";
  implementationDecision: "not_authorized";
  providerDecision: "not_authorized";
  pixelDecision: "not_authorized";
  trackingDecision: "not_authorized";
  adAccountDecision: "not_authorized";
  adDecision: "not_authorized";
  campaignDecision: "not_authorized";
  audienceDecision: "not_authorized";
  creativeDecision: "not_authorized";
  leadFormDecision: "not_authorized";
  importDecision: "not_authorized";
  webhookDecision: "not_authorized";
  crmMutationDecision: "not_authorized";
  sourceDecision: "not_authorized";
  storageDecision: "not_authorized";
  outreachDecision: "not_authorized";
  spendDecision: "not_authorized";
  goLiveDecision: "not_authorized";
  recommendedNextExactStep: "Phase 14C — Manual Social Acquisition Advisory Policy";
  nextStageRecommendation: "Phase 14C — Manual Social Acquisition Advisory Policy";
  signalFamilies: Phase14SocialAcquisitionSignalFamily[];
  groundedReferences: {
    publicSurfaces: string[];
    leadSourceTags: typeof LEAD_SOURCE_TAGS;
    leadIntakeSchema: typeof leadIntakeSchema;
    sourceQualitySignals: typeof sourceQualitySignals;
    sourceQualityLanes: typeof sourceQualityLanes;
    homepageContent: {
      sellerBenefits: typeof sellerBenefits;
      sellerProcess: typeof sellerProcess;
      trustPoints: typeof trustPoints;
    };
    phase11ForbiddenDrift: typeof phase11SeoLocalAuthorityForbiddenDrift;
    phase12ForbiddenDrift: typeof phase12ConversionOptimizationForbiddenDrift;
    phase13ForbiddenDrift: typeof phase13SafetyComplianceForbiddenDrift;
  };
  auditPurpose: string[];
  stopRules: string[];
  aiOperatorLeverageBoundary: string[];
  humanOwnershipBoundary: string[];
  forbiddenDrift: string[];
  flags: typeof phase14SocialAcquisitionSignalAuditFlags;
};

export const phase14SocialAcquisitionSignalAuditPurpose = [
  "Audit existing social acquisition signal families without activating Facebook/TikTok providers, SDKs, APIs, webhooks, pixels, tracking, audiences, campaigns, ads, creatives, lead imports, CRM mutation, source mutation, storage writes, outreach, spend, or go-live.",
  "Reference public acquisition surfaces, lead intake/source tracking, source-quality doctrine, safety/compliance doctrine, conversion/local authority doctrine, and campaign/spend/go-live blocked boundaries as existing advisory signals only.",
  "Support highest acquisition ROI per operator hour by making channel fit, source tracking readiness, seller-trust claim risk, creative truthfulness, audience sensitivity, landing alignment, lead import risk, tracking boundaries, spend guardrails, and human campaign approval easier for humans to review.",
];

export const phase14SocialAcquisitionSignalAuditStopRules = [
  "Phase 14B audits existing social acquisition signal families only.",
  "No implementation, Facebook/TikTok provider activation, SDK imports, env reads, credential reads, API calls, webhooks, lead-form sync, pixel installation, event tracking, analytics, custom audiences, lookalike audiences, retargeting, audience upload, campaign creation, ad creation, creative publishing, copy publishing, budget changes, spend increases, campaign launch, ad account mutation, route/UI/form/content/metadata/API/schema/storage/auth/security mutations, lead creation, lead import, CRM mutation, source mutation, storage writes, audit writing, outreach, SMS/email/calling, AI voice, queues, runtime jobs, polling, consent collection, DNC/opt-out bypass, platform/legal approval by AI, Phase 15 implementation, or go-live is authorized.",
];

export const phase14SocialAcquisitionSignalAuditAiBoundary = [
  "summarize existing social acquisition signals for human review only",
  "flag channel fit, source tracking readiness, trust claim risk, creative truthfulness, audience sensitivity, landing alignment, lead import risk, tracking boundaries, spend guardrails, and human approval needs",
  "do not activate providers, import SDKs, read env or credentials, call APIs, create webhooks, install pixels, track events, upload audiences, create campaigns or ads, publish creatives, sync lead forms, import leads, mutate CRM/source/storage, launch outreach, increase spend, approve platform/legal decisions, implement Phase 15, or authorize go-live",
];

export function getPhase14SocialAcquisitionSignalAudit(): Phase14SocialAcquisitionSignalAudit {
  const result: Phase14SocialAcquisitionSignalAudit = {
    phase: "Phase 14: Facebook & TikTok Acquisition Engine",
    phaseStep: "Phase 14B — Social Acquisition Signal Audit",
    previousStep: "Phase 14A — Facebook & TikTok Acquisition Engine Scope",
    phaseDecision: "signal_audit_only",
    implementationDecision: "not_authorized",
    providerDecision: "not_authorized",
    pixelDecision: "not_authorized",
    trackingDecision: "not_authorized",
    adAccountDecision: "not_authorized",
    adDecision: "not_authorized",
    campaignDecision: "not_authorized",
    audienceDecision: "not_authorized",
    creativeDecision: "not_authorized",
    leadFormDecision: "not_authorized",
    importDecision: "not_authorized",
    webhookDecision: "not_authorized",
    crmMutationDecision: "not_authorized",
    sourceDecision: "not_authorized",
    storageDecision: "not_authorized",
    outreachDecision: "not_authorized",
    spendDecision: "not_authorized",
    goLiveDecision: "not_authorized",
    recommendedNextExactStep: "Phase 14C — Manual Social Acquisition Advisory Policy",
    nextStageRecommendation: "Phase 14C — Manual Social Acquisition Advisory Policy",
    signalFamilies: phase14SocialAcquisitionSignalFamilies,
    groundedReferences: {
      publicSurfaces: ["/", "/contact", "/sell-your-house", "components/forms/lead-capture-form.tsx", "lib/content/homepage.ts"],
      leadSourceTags: LEAD_SOURCE_TAGS,
      leadIntakeSchema,
      sourceQualitySignals,
      sourceQualityLanes,
      homepageContent: { sellerBenefits, sellerProcess, trustPoints },
      phase11ForbiddenDrift: phase11SeoLocalAuthorityForbiddenDrift,
      phase12ForbiddenDrift: phase12ConversionOptimizationForbiddenDrift,
      phase13ForbiddenDrift: phase13SafetyComplianceForbiddenDrift,
    },
    auditPurpose: phase14SocialAcquisitionSignalAuditPurpose,
    stopRules: phase14SocialAcquisitionSignalAuditStopRules,
    aiOperatorLeverageBoundary: phase14SocialAcquisitionSignalAuditAiBoundary,
    humanOwnershipBoundary: phase14SocialAcquisitionHumanBoundary,
    forbiddenDrift: phase14SocialAcquisitionForbiddenDrift,
    flags: phase14SocialAcquisitionSignalAuditFlags,
  };
  assertPhase14SocialAcquisitionSignalAuditSafe(result);
  return result;
}

export function assertPhase14SocialAcquisitionSignalAuditSafe(result: Phase14SocialAcquisitionSignalAudit) {
  const allowedTrue = new Set(["readOnly", "advisoryOnly", "planningOnly", "signalAuditOnly", "operatorLeverageOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const text = [result.auditPurpose, result.stopRules, result.aiOperatorLeverageBoundary, result.humanOwnershipBoundary, result.forbiddenDrift, result.signalFamilies].flat().join(" ");
  const unsafePattern = /provider activation is authorized|pixel installation is authorized|tracking activation is authorized|audience upload is authorized|campaign creation is authorized|ad creation is authorized|creative publishing is authorized|lead import is authorized|CRM mutation is authorized|source mutation is authorized|outreach is authorized|spend increases are authorized|Phase 15 implementation is authorized|go-live is authorized/i;

  if (result.phaseStep !== "Phase 14B — Social Acquisition Signal Audit") throw new Error("Phase 14B step must remain pinned.");
  if (result.previousStep !== "Phase 14A — Facebook & TikTok Acquisition Engine Scope") throw new Error("Phase 14B previous step must remain Phase 14A.");
  if (result.phaseDecision !== "signal_audit_only") throw new Error("Phase 14B must remain signal-audit-only.");
  if (Object.entries(result).some(([key, value]) => key.endsWith("Decision") && key !== "phaseDecision" && value !== "not_authorized")) throw new Error("Phase 14B decisions must remain not_authorized.");
  if (result.signalFamilies.join("|") !== phase14SocialAcquisitionSignalFamilies.join("|")) throw new Error("Phase 14B must include all social acquisition signal families.");
  if (unsafeTrue.length > 0) throw new Error("Phase 14B blocked flags cannot turn true.");
  if (!/lead_intake_source_tracking/i.test(result.signalFamilies.join(" ")) || !/no_facebook_tiktok_sdk/i.test(result.signalFamilies.join(" "))) throw new Error("Phase 14B repo-grounded signals are missing.");
  if (!/audits existing social acquisition signal families only/i.test(result.stopRules.join(" "))) throw new Error("Phase 14B stop rules are missing.");
  if (!/human review only/i.test(result.aiOperatorLeverageBoundary.join(" ")) || !/do not activate providers/i.test(result.aiOperatorLeverageBoundary.join(" "))) throw new Error("Phase 14B AI boundary is missing.");
  if (!/creative approval/i.test(result.humanOwnershipBoundary.join(" ")) || !/campaign approval/i.test(result.humanOwnershipBoundary.join(" "))) throw new Error("Phase 14B human boundary is missing.");
  if (result.recommendedNextExactStep !== "Phase 14C — Manual Social Acquisition Advisory Policy") throw new Error("Phase 14B must hand off to Phase 14C.");
  if (unsafePattern.test(text)) throw new Error("Phase 14B wording must not imply unsafe authorization.");
}

export function getPhase14SocialAcquisitionSignalAuditSummary() {
  const result = getPhase14SocialAcquisitionSignalAudit();
  return `${result.phase} / ${result.phaseStep}: audits existing public acquisition, source tracking, source quality, safety/compliance, conversion/local-authority, and spend/go-live boundary signals for highest acquisition ROI per operator hour. Human-owned channel strategy, compliance judgment, ad claim approval, creative approval, audience approval, source judgment, spend approval, campaign approval, and provider approval remain required. No provider activation, no pixels/tracking, no campaigns/ads, no lead import, no outreach, no CRM mutation, no spend increase, no go-live, and no Phase 15 implementation are authorized. Next step: ${result.recommendedNextExactStep}.`;
}
