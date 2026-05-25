export const LEAD_SOURCE_TAGS = [
  "driving_for_dollars",
  "tax_delinquent",
  "vacant",
  "out_of_state_owner",
  "referral",
  "cold_call",
  "inbound_web",
  "buyer_referral",
  "manual_import",
] as const;

export type LeadSourceTag = (typeof LEAD_SOURCE_TAGS)[number];

const SOURCE_ALIASES: Record<string, LeadSourceTag> = {
  county: "tax_delinquent",
  county_import: "tax_delinquent",
  tax: "tax_delinquent",
  tax_list: "tax_delinquent",
  delinquent_tax: "tax_delinquent",
  delinquent_tax_list: "tax_delinquent",
  tax_delinquent_list: "tax_delinquent",
  assessor: "tax_delinquent",
  assessor_export: "tax_delinquent",
  propstream_tax_list: "tax_delinquent",
  propstream: "manual_import",
  dealmachine: "driving_for_dollars",
  d4d: "driving_for_dollars",
  driving: "driving_for_dollars",
  driving_for_dollars_list: "driving_for_dollars",
  website: "inbound_web",
  web: "inbound_web",
  inbound: "inbound_web",
  buyer: "buyer_referral",
  import: "manual_import",
  manual: "manual_import",
};

export function normalizeLeadSourceTag(value: string | null | undefined): LeadSourceTag {
  const normalized = value?.trim().toLowerCase().replace(/[\s-]+/g, "_") ?? "";

  if (LEAD_SOURCE_TAGS.includes(normalized as LeadSourceTag)) {
    return normalized as LeadSourceTag;
  }

  return SOURCE_ALIASES[normalized] ?? "manual_import";
}

export function formatLeadSourceTag(source: string) {
  return normalizeLeadSourceTag(source)
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
