import type { StoredLead } from "@/lib/leads-storage";
import type { LeadIntakeInput } from "@/lib/validations/lead";

export const PUBLIC_INTAKE_INTERNAL_ONLY_CLASSIFICATION = "PUBLIC_INTAKE_INTERNAL_ONLY_READY";

export type PublicLeadIntakeAuditPayload = {
  payload: Record<string, unknown>;
  intake: LeadIntakeInput;
  lead: Pick<StoredLead, "id" | "source" | "timestamp" | "referralCode" | "referralCampaign" | "referralSource" | "referralLandingPage">;
  created: boolean;
  referer?: string | null;
};

function optionalText(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

export function buildPublicLeadInternalFields() {
  return {
    status: "new" as const,
    nextFollowUpAt: null,
    automationStatus: "idle",
    followUpCount: 0,
    approvalStatus: "needs_human_review" as const,
    requiresHumanApproval: true
  };
}

export function createPublicLeadIntakeAuditMetadata(input: PublicLeadIntakeAuditPayload) {
  const sourcePage =
    optionalText(input.payload.sourcePage) ??
    optionalText(input.intake.referralLandingPage) ??
    optionalText(input.referer) ??
    null;

  return {
    classification: PUBLIC_INTAKE_INTERNAL_ONLY_CLASSIFICATION,
    created: input.created,
    intakeTimestamp: input.lead.timestamp,
    source: input.lead.source,
    sourcePage,
    referralCode: input.lead.referralCode ?? null,
    referralCampaign: input.lead.referralCampaign ?? null,
    referralSource: input.lead.referralSource ?? null,
    referralLandingPage: input.lead.referralLandingPage ?? null,
    utmSource: optionalText(input.payload.utmSource) ?? optionalText(input.payload.utm_source),
    utmMedium: optionalText(input.payload.utmMedium) ?? optionalText(input.payload.utm_medium),
    utmCampaign: optionalText(input.payload.utmCampaign) ?? optionalText(input.payload.utm_campaign),
    utmTerm: optionalText(input.payload.utmTerm) ?? optionalText(input.payload.utm_term),
    utmContent: optionalText(input.payload.utmContent) ?? optionalText(input.payload.utm_content),
    consentNotice:
      optionalText(input.payload.consentNotice) ??
      optionalText(input.payload.noticeAccepted) ??
      optionalText(input.payload.consentState) ??
      null,
    propertyContextCaptured: Boolean(input.intake.propertyAddress && input.intake.message !== undefined),
    dashboardVisible: true,
    automationStatus: "idle",
    nextFollowUpAt: null,
    requiresHumanApproval: true,
    providerCalled: false,
    sent: false,
    published: false,
    crmMutation: false,
    outreach: false,
    scraping: false,
    recurringAutomation: false,
    syntheticLeads: false,
    liveExecution: false,
    externalExecutionAllowed: false
  };
}
