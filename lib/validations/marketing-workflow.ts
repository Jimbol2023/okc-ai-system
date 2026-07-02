import { z } from "zod";

import {
  marketingApprovalDecisions,
  marketingCanvaAssetApprovalStatuses,
  marketingChannels,
  marketingConnectionStatuses,
  marketingDraftStatuses,
} from "@/types/marketing-workflow";

export const marketingChannelSchema = z.enum(marketingChannels);
export const marketingDraftStatusSchema = z.enum(marketingDraftStatuses);
export const marketingApprovalDecisionSchema = z.enum(marketingApprovalDecisions);
export const marketingConnectionStatusSchema = z.enum(marketingConnectionStatuses);
export const marketingCanvaAssetApprovalStatusSchema = z.enum(marketingCanvaAssetApprovalStatuses);

const shortText = (field: string) => z.string().trim().min(2, `${field} is required.`);

export const createMarketingDraftSchema = z.object({
  channel: marketingChannelSchema,
  topic: shortText("Topic").max(120, "Topic must stay under 120 characters."),
  sourceLabel: shortText("Source label").max(80, "Source label must stay under 80 characters."),
  referralLink: z.string().trim().url("Enter a valid referral link.").max(300, "Referral link must stay under 300 characters.").optional().or(z.literal("")),
  assetNotes: z.string().trim().max(1000, "Asset notes must stay under 1,000 characters.").optional().or(z.literal("")),
});

export const updateMarketingDraftSchema = z.object({
  topic: shortText("Topic").max(120, "Topic must stay under 120 characters.").optional(),
  sourceLabel: shortText("Source label").max(80, "Source label must stay under 80 characters.").optional(),
  referralLink: z.string().trim().url("Enter a valid referral link.").max(300, "Referral link must stay under 300 characters.").optional().or(z.literal("")),
  draftCopy: z.string().trim().min(20, "Draft copy must be at least 20 characters.").max(4000, "Draft copy must stay under 4,000 characters.").optional(),
  assetNotes: z.string().trim().max(1000, "Asset notes must stay under 1,000 characters.").optional().or(z.literal("")),
  status: marketingDraftStatusSchema.optional(),
});

export const marketingApprovalSchema = z.object({
  decision: marketingApprovalDecisionSchema,
  editedCopy: z.string().trim().min(20, "Edited copy must be at least 20 characters.").max(4000, "Edited copy must stay under 4,000 characters.").optional().or(z.literal("")),
  note: z.string().trim().min(3, "A review note is required.").max(800, "Review note must stay under 800 characters."),
  reviewer: z.string().trim().max(120, "Reviewer must stay under 120 characters.").optional().or(z.literal("")),
});

export const marketingAccountConnectionSchema = z.object({
  platform: marketingChannelSchema,
  accountName: shortText("Account name").max(120, "Account name must stay under 120 characters."),
  handle: shortText("Handle").max(120, "Handle must stay under 120 characters."),
  profileUrl: z.string().trim().url("Enter a valid profile URL.").max(300, "Profile URL must stay under 300 characters."),
  verificationStatus: marketingConnectionStatusSchema,
  proofNote: z.string().trim().min(5, "A manual proof note is required.").max(1000, "Proof note must stay under 1,000 characters."),
});

export const publishAssistSchema = z.object({
  manualPublishedUrl: z.string().trim().url("Enter a valid published URL.").max(300, "Published URL must stay under 300 characters.").optional().or(z.literal("")),
  markManuallyPublished: z.boolean().optional(),
});

export const canvaAssetAssistSchema = z.object({
  assetNotes: z.string().trim().max(1000, "Asset notes must stay under 1,000 characters.").optional().or(z.literal("")),
  intendedPlatforms: z.array(marketingChannelSchema).max(4, "Select no more than four intended platforms.").optional(),
  manualApprovalStatus: marketingCanvaAssetApprovalStatusSchema.optional(),
});

export type CreateMarketingDraftInput = z.infer<typeof createMarketingDraftSchema>;
export type UpdateMarketingDraftInput = z.infer<typeof updateMarketingDraftSchema>;
export type MarketingApprovalInput = z.infer<typeof marketingApprovalSchema>;
export type MarketingAccountConnectionInput = z.infer<typeof marketingAccountConnectionSchema>;
export type PublishAssistInput = z.infer<typeof publishAssistSchema>;
export type CanvaAssetAssistInput = z.infer<typeof canvaAssetAssistSchema>;
