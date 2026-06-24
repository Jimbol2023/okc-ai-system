export const LEAD_SOURCE_TAGS = [
  "driving_for_dollars",
  "tax_delinquent",
  "county_list",
  "probate",
  "vacant",
  "out_of_state_owner",
  "zillow",
  "unlisted_owner",
  "facebook",
  "instagram",
  "linkedin",
  "youtube",
  "google_business_profile",
  "referral",
  "cold_call",
  "inbound_web",
  "buyer_referral",
  "manual_import",
] as const;

export type LeadSourceTag = (typeof LEAD_SOURCE_TAGS)[number];

const SOURCE_ALIASES: Record<string, LeadSourceTag> = {
  county: "county_list",
  county_import: "county_list",
  county_list_import: "county_list",
  county_records: "county_list",
  public_records: "county_list",
  public_record: "county_list",
  public_list: "county_list",
  tax: "tax_delinquent",
  tax_list: "tax_delinquent",
  delinquent_tax: "tax_delinquent",
  delinquent_tax_list: "tax_delinquent",
  tax_delinquent_list: "tax_delinquent",
  assessor: "tax_delinquent",
  assessor_export: "tax_delinquent",
  propstream_tax_list: "tax_delinquent",
  propstream: "manual_import",
  probate_list: "probate",
  estate: "probate",
  estate_list: "probate",
  heirship: "probate",
  heir: "probate",
  dealmachine: "driving_for_dollars",
  d4d: "driving_for_dollars",
  driving: "driving_for_dollars",
  driving_for_dollars_list: "driving_for_dollars",
  zillow_fsbo: "zillow",
  fsbo: "zillow",
  unlisted: "unlisted_owner",
  off_market: "unlisted_owner",
  off_market_owner: "unlisted_owner",
  facebook_ad: "facebook",
  facebook_ads: "facebook",
  fb: "facebook",
  instagram_ad: "instagram",
  instagram_ads: "instagram",
  ig: "instagram",
  linkedin_ad: "linkedin",
  linkedin_ads: "linkedin",
  youtube_ad: "youtube",
  youtube_ads: "youtube",
  google_business: "google_business_profile",
  google_business_profile_listing: "google_business_profile",
  google_local: "google_business_profile",
  gbp: "google_business_profile",
  website: "inbound_web",
  web: "inbound_web",
  inbound: "inbound_web",
  social: "inbound_web",
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
