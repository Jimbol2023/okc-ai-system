import { z } from "zod";

import { referralPartnerTypes } from "@/lib/referrals";

const shortText = (field: string) => z.string().trim().min(2, `${field} is required.`);

export const referralPartnerSchema = z.object({
  name: shortText("Partner name").max(120, "Partner name must stay under 120 characters."),
  partnerType: z.enum(referralPartnerTypes).default("other"),
  status: z.string().trim().max(40, "Status must stay under 40 characters.").optional().or(z.literal("")),
  notes: z.string().trim().max(1000, "Notes must stay under 1,000 characters.").optional().or(z.literal("")),
});

export const referralLinkSchema = z.object({
  partnerId: z.string().trim().max(80, "Partner ID must stay under 80 characters.").optional().or(z.literal("")),
  referralCode: z
    .string()
    .trim()
    .min(2, "Referral code is required.")
    .max(48, "Referral code must stay under 48 characters.")
    .regex(/^[a-zA-Z0-9_-]+$/, "Referral code can use letters, numbers, underscores, and hyphens."),
  landingPage: z.string().trim().max(220, "Landing page must stay under 220 characters.").optional().or(z.literal("")),
  campaign: z.string().trim().max(80, "Campaign must stay under 80 characters.").optional().or(z.literal("")),
  status: z.string().trim().max(40, "Status must stay under 40 characters.").optional().or(z.literal("")),
  notes: z.string().trim().max(1000, "Notes must stay under 1,000 characters.").optional().or(z.literal("")),
});

export const referralTrackSchema = z.object({
  ref: z.string().trim().max(48).optional().nullable(),
  campaign: z.string().trim().max(80).optional().nullable(),
  source: z.string().trim().max(60).optional().nullable(),
  landingPage: z.string().trim().max(220).optional().nullable(),
  duplicateKey: z.string().trim().max(120).optional().nullable(),
});

export type ReferralPartnerInput = z.infer<typeof referralPartnerSchema>;
export type ReferralLinkInput = z.infer<typeof referralLinkSchema>;
export type ReferralTrackInput = z.infer<typeof referralTrackSchema>;
