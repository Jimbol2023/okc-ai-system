export const z1RevenueOpsFlags = {
  providerCalled: false,
  sent: false,
  runtimeActivationAllowed: false,
  providerActivationAllowed: false,
  approvalGrantsExecution: false,
  auditWritingAllowed: false,
  schemaChangesAuthorized: false,
  migrationsAuthorized: false,
  storageAuthorized: false,
} as const;

export const z1LeadSourceLabels = [
  "homepage_hero",
  "homepage_form",
  "seller_page",
  "manual_dashboard_entry",
  "tax_list_upload",
  "d4d_manual",
  "referral_partner",
  "cold_call_manual",
  "facebook_ad",
  "google_local",
  "probate_referral",
  "out_of_state_owner",
] as const;

export type Z1LeadSourceLabel = (typeof z1LeadSourceLabels)[number];

const sourceAliases: Record<string, Z1LeadSourceLabel> = {
  dashboard_manual: "manual_dashboard_entry",
  seller_page_form: "seller_page",
  website: "homepage_form",
  web: "homepage_form",
  d4d: "d4d_manual",
  tax: "tax_list_upload",
  cold_call: "cold_call_manual",
  referral: "referral_partner",
  probate: "probate_referral",
  absentee_owner: "out_of_state_owner",
};

export function normalizeZ1LeadSource(value: string | null | undefined): Z1LeadSourceLabel | null {
  const normalized = value?.trim().toLowerCase().replace(/[\s-]+/g, "_") ?? "";

  if (z1LeadSourceLabels.includes(normalized as Z1LeadSourceLabel)) {
    return normalized as Z1LeadSourceLabel;
  }

  return sourceAliases[normalized] ?? null;
}

export function createZ1LeadSourceTaxonomyReview() {
  return {
    phase: "Z1A" as const,
    flags: z1RevenueOpsFlags,
    planningOnly: true,
    manualOperationsRemainPrimary: true,
    sourceLabels: z1LeadSourceLabels,
    aliases: sourceAliases,
  };
}
