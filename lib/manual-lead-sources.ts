export const manualLeadSources = [
  "website_form",
  "phone_call",
  "facebook_message",
  "instagram_dm",
  "google_business_profile",
  "referral",
  "door_knocking_offline",
  "tiktok",
  "linkedin",
] as const;

export type ManualLeadSource = (typeof manualLeadSources)[number];

export const manualLeadSourceLabels: Record<ManualLeadSource, string> = {
  website_form: "Website form",
  phone_call: "Phone call",
  facebook_message: "Facebook message",
  instagram_dm: "Instagram DM",
  google_business_profile: "Google Business Profile",
  referral: "Referral",
  door_knocking_offline: "Door knocking / offline",
  tiktok: "TikTok",
  linkedin: "LinkedIn",
};
