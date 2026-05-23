import { validateZ1LeadCapture, type Z1LeadCaptureInput } from "./z1-lead-capture-validation-plan";
import { z1RevenueOpsFlags } from "./z1-lead-source-taxonomy";

export type Z1ExistingLeadComparable = {
  phone?: string;
  email?: string;
  propertyAddress?: string;
};

function normalizePhone(value: string | undefined) {
  return (value ?? "").replace(/\D/g, "");
}

function normalizeComparable(value: string | undefined) {
  return (value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}

export function reviewZ1DuplicateIncompleteLead(input: Z1LeadCaptureInput, existingLeads: Z1ExistingLeadComparable[] = []) {
  const validation = validateZ1LeadCapture(input);
  const duplicateReasons = existingLeads.flatMap((lead) => {
    const reasons: string[] = [];
    if (normalizePhone(input.phone) && normalizePhone(input.phone) === normalizePhone(lead.phone)) reasons.push("duplicate phone");
    if (normalizeComparable(input.email) && normalizeComparable(input.email) === normalizeComparable(lead.email)) reasons.push("duplicate email");
    if (normalizeComparable(input.propertyAddress) && normalizeComparable(input.propertyAddress) === normalizeComparable(lead.propertyAddress)) reasons.push("duplicate address");
    return reasons;
  });
  const uniqueDuplicateReasons = [...new Set(duplicateReasons)];

  return {
    needsReview: uniqueDuplicateReasons.length > 0 || !validation.valid,
    duplicateReasons: uniqueDuplicateReasons,
    incompleteReasons: validation.issues.map((issue) => issue.message),
    automationAllowed: false,
    deletionAllowed: false,
  };
}

export function createZ1DuplicateIncompleteLeadReviewPlan() {
  return {
    phase: "Z1E" as const,
    flags: z1RevenueOpsFlags,
    planningOnly: true,
    checks: ["duplicate phone", "duplicate email", "duplicate address", "missing required fields", "incomplete seller situation", "invalid ZIP/contact info"],
    automationAllowed: false,
    deletionAllowed: false,
  };
}
