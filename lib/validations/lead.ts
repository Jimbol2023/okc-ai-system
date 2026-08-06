import { z } from "zod";

export const leadIntakeSchema = z.object({
  firstName: z.string().trim().min(2, "First name is required."),
  lastName: z.string().trim().min(2, "Last name is required."),
  email: z.email("Enter a valid email address."),
  phone: z
    .string()
    .trim()
    .min(10, "Phone number is required.")
    .max(25, "Phone number is too long."),
  propertyAddress: z.string().trim().min(5, "Property address is required."),
  city: z.string().trim().min(2, "City is required."),
  state: z.string().trim().length(2, "Use a two-letter state abbreviation."),
  zipCode: z
    .string()
    .trim()
    .regex(/^\d{5}$/, "Use a valid 5-digit ZIP code."),
  message: z
    .string()
    .trim()
    .max(1000, "Keep notes under 1,000 characters.")
    .optional()
    .or(z.literal("")),
  source: z.string().trim().min(2, "Lead source is required."),
  referralCode: z.string().trim().max(48, "Referral code must stay under 48 characters.").optional().or(z.literal("")),
  referralCampaign: z.string().trim().max(80, "Referral campaign must stay under 80 characters.").optional().or(z.literal("")),
  referralSource: z.string().trim().max(60, "Referral source must stay under 60 characters.").optional().or(z.literal("")),
  referralLandingPage: z.string().trim().max(220, "Referral landing page must stay under 220 characters.").optional().or(z.literal(""))
  ,contactPermission: z.enum(["contact_requested", "internal_review_only"]),
  consentStatus: z.enum(["affirmed", "not_granted"]),
  consentSource: z.literal("public_seller_form"),
  consentTimestamp: z.iso.datetime(),
  doNotContact: z.boolean(),
  optOutReason: z.string().trim().max(240).optional().or(z.literal("")),
  website: z.string().max(0).optional().or(z.literal(""))
});

export type LeadIntakeInput = z.infer<typeof leadIntakeSchema>;
