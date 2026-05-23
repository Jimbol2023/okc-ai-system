import { z1RevenueOpsFlags } from "./z1-lead-source-taxonomy";

export const z1CrmIntakeFields = ["status", "source", "source detail", "created timestamp", "property address", "contact info", "seller notes", "next action placeholder", "follow-up placeholder"] as const;

export type Z1CrmIntakeInput = {
  status?: string;
  source?: string | null;
  sourceDetail?: string;
  createdTimestamp?: string;
  propertyAddress?: string;
  contactName?: string;
  phone?: string;
  email?: string;
  sellerNotes?: string;
  nextActionPlaceholder?: string;
  followUpPlaceholder?: string;
};

export function reviewZ1CrmIntakeReadiness(input: Z1CrmIntakeInput) {
  const missingReadinessFields = [
    ["status", input.status],
    ["source", input.source],
    ["source detail", input.sourceDetail],
    ["created timestamp", input.createdTimestamp],
    ["property address", input.propertyAddress],
    ["contact info", input.phone || input.email],
    ["seller notes", input.sellerNotes],
    ["next action placeholder", input.nextActionPlaceholder],
    ["follow-up placeholder", input.followUpPlaceholder],
  ].filter(([, value]) => !String(value ?? "").trim()).map(([label]) => label);

  return {
    ready: missingReadinessFields.length === 0,
    missingReadinessFields,
    crmFields: z1CrmIntakeFields,
  };
}

export function createZ1CrmIntakeReadinessReview() {
  return {
    phase: "Z1D" as const,
    flags: z1RevenueOpsFlags,
    planningOnly: true,
    manualOperationsRemainPrimary: true,
    crmFields: z1CrmIntakeFields,
  };
}
