import { reviewZ2LeadLifecycleHygiene, type Z2LifecycleLeadInput } from "./z2-lead-lifecycle-hygiene";
import { normalizeZ2CrmStatus, z2CrmStatusTaxonomy, z2CrmWorkflowFlags } from "./z2-crm-status-taxonomy";

export const z2ManualNextActions = [
  "review_new_lead",
  "complete_missing_info",
  "verify_duplicate",
  "call_seller_manually",
  "text_or_email_only_after_manual_approval",
  "schedule_appointment",
  "review_property_details",
  "prepare_conservative_offer",
  "follow_up_manually",
  "move_to_negotiation_review",
  "prepare_contract_review",
  "prepare_buyer_disposition_review",
  "coordinate_closing_manually",
  "mark_dead_after_review",
  "no_contact_dnc",
] as const;

export type Z2ManualNextAction = (typeof z2ManualNextActions)[number];
export type Z2ManualActionConfidence = "high" | "medium" | "low";

export type Z2ManualNextActionMetadata = {
  label: string;
  requiresHumanReview: true;
};

export const z2ManualNextActionMetadata: Record<Z2ManualNextAction, Z2ManualNextActionMetadata> = {
  review_new_lead: { label: "Review new lead", requiresHumanReview: true },
  complete_missing_info: { label: "Complete missing info", requiresHumanReview: true },
  verify_duplicate: { label: "Verify duplicate", requiresHumanReview: true },
  call_seller_manually: { label: "Call seller manually", requiresHumanReview: true },
  text_or_email_only_after_manual_approval: { label: "Text or email only after manual approval", requiresHumanReview: true },
  schedule_appointment: { label: "Schedule appointment", requiresHumanReview: true },
  review_property_details: { label: "Review property details", requiresHumanReview: true },
  prepare_conservative_offer: { label: "Prepare conservative offer", requiresHumanReview: true },
  follow_up_manually: { label: "Follow up manually", requiresHumanReview: true },
  move_to_negotiation_review: { label: "Move to negotiation review", requiresHumanReview: true },
  prepare_contract_review: { label: "Prepare contract review", requiresHumanReview: true },
  prepare_buyer_disposition_review: { label: "Prepare buyer disposition review", requiresHumanReview: true },
  coordinate_closing_manually: { label: "Coordinate closing manually", requiresHumanReview: true },
  mark_dead_after_review: { label: "Mark dead after review", requiresHumanReview: true },
  no_contact_dnc: { label: "No contact - DNC", requiresHumanReview: true },
};

export type Z2ManualNextActionResult = {
  action: Z2ManualNextAction;
  actionLabel: string;
  whyRecommended: string;
  confidence: Z2ManualActionConfidence;
  requiredHumanReview: true;
  blockedExecutionFlags: typeof z2CrmWorkflowFlags;
  triggeredBy: string[];
  missingData: string[];
  flags: typeof z2CrmWorkflowFlags;
};

function hasText(value: unknown) {
  return String(value ?? "").trim().length > 0;
}

function missingDataFor(input: Z2LifecycleLeadInput) {
  const checks: Array<[string, unknown]> = [
    ["status", input.status],
    ["source", input.source],
    ["source detail", input.sourceDetail],
    ["property address", input.propertyAddress],
    ["seller context", input.sellerNotes || input.situationDetails],
    ["contact info", input.phone || input.email],
    ["next action placeholder", input.nextActionPlaceholder],
    ["follow-up placeholder", input.followUpPlaceholder || input.nextFollowUpAt],
  ];
  return checks.filter(([, value]) => !hasText(value)).map(([label]) => label);
}

function result(action: Z2ManualNextAction, whyRecommended: string, confidence: Z2ManualActionConfidence, triggeredBy: string[], missingData: string[]): Z2ManualNextActionResult {
  return {
    action,
    actionLabel: z2ManualNextActionMetadata[action].label,
    whyRecommended,
    confidence,
    requiredHumanReview: true,
    blockedExecutionFlags: z2CrmWorkflowFlags,
    triggeredBy,
    missingData,
    flags: z2CrmWorkflowFlags,
  };
}

export function classifyZ2ManualNextAction(input: Z2LifecycleLeadInput): Z2ManualNextActionResult {
  const status = normalizeZ2CrmStatus(input.status);
  const metadata = status ? z2CrmStatusTaxonomy[status] : null;
  const hygiene = reviewZ2LeadLifecycleHygiene(input);
  const missingData = missingDataFor(input);

  if (input.doNotContact || input.blocked || status === "do_not_contact") {
    return result("no_contact_dnc", "Lead is DNC or blocked. No contact or outreach is allowed.", "high", ["DNC/blocked signal"], missingData);
  }

  if (status === "closed" || status === "dead") {
    return result("mark_dead_after_review", "Lead is terminal; no execution, contact, or active workflow is recommended.", "high", [`terminal status: ${status}`], missingData);
  }

  if (!status || hygiene.issues.some((issue) => issue.includes("missing status") || issue.includes("invalid status"))) {
    return result("review_new_lead", "Status is missing or invalid, so the safest manual action is operator review.", "low", hygiene.issues, missingData);
  }

  if (hygiene.issues.some((issue) => issue.includes("incomplete intake data"))) {
    return result("complete_missing_info", "Lead is missing intake data required for confident manual revenue work.", "high", hygiene.issues, missingData);
  }

  if (hygiene.issues.includes("duplicate review required")) {
    return result("verify_duplicate", "Duplicate risk is present and must be reviewed manually before advancing.", "high", ["duplicate review required"], missingData);
  }

  const triggeredBy = [`status: ${status}`, ...(metadata?.safeNextManualActionHints ?? [])];
  const actionByStatus: Record<string, Z2ManualNextAction> = {
    new: "review_new_lead",
    needs_review: "review_new_lead",
    validated: "call_seller_manually",
    manual_contact_needed: "call_seller_manually",
    contacted: "text_or_email_only_after_manual_approval",
    follow_up_needed: "follow_up_manually",
    appointment_needed: "schedule_appointment",
    appointment_set: "review_property_details",
    offer_review_needed: "prepare_conservative_offer",
    offer_made: "move_to_negotiation_review",
    negotiating: "prepare_contract_review",
    contract_review_needed: "prepare_contract_review",
    under_contract: "prepare_buyer_disposition_review",
    buyer_disposition_needed: "prepare_buyer_disposition_review",
    closing_coordination_needed: "coordinate_closing_manually",
    incomplete: "complete_missing_info",
    duplicate_review: "verify_duplicate",
  };
  const action = actionByStatus[status] ?? "review_new_lead";
  const confidence: Z2ManualActionConfidence = hygiene.warnings.length > 0 ? "medium" : "high";

  return result(action, `${z2ManualNextActionMetadata[action].label} is recommended from the current advisory CRM status.`, confidence, triggeredBy, missingData);
}

export function createZ2ManualNextActionClassifierReview() {
  return {
    phase: "Z2C" as const,
    flags: z2CrmWorkflowFlags,
    advisoryOnly: true,
    deterministic: true,
    actions: z2ManualNextActions,
    outboundCommunicationAllowed: false,
    autonomousStatusChangeAllowed: false,
  };
}
