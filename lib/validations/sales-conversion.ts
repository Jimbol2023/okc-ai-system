import { z } from "zod";

import { marketingChannels } from "@/types/marketing-workflow";
import { salesAssistApprovalStatuses, salesAttributionStatuses } from "@/types/sales-conversion";

export const salesAttributionSchema = z.object({
  leadId: z.string().trim().min(1, "Lead ID is required."),
  marketingDraftId: z.string().trim().min(1).optional().or(z.literal("")),
  canvaAssetAssistId: z.string().trim().min(1).optional().or(z.literal("")),
  publishAssistId: z.string().trim().min(1).optional().or(z.literal("")),
  channel: z.enum(marketingChannels),
  topic: z.string().trim().min(2, "Topic is required.").max(120, "Topic must stay under 120 characters."),
  sourceLabel: z.string().trim().min(2, "Source label is required.").max(80, "Source label must stay under 80 characters."),
  manualPostUrl: z.string().trim().url("Enter a valid manual post URL.").max(300, "Manual post URL must stay under 300 characters.").optional().or(z.literal("")),
  attributionStatus: z.enum(salesAttributionStatuses),
  attributionNote: z.string().trim().min(5, "Attribution note is required.").max(1000, "Attribution note must stay under 1,000 characters."),
});

export const salesAssistRequestSchema = z.object({
  leadId: z.string().trim().min(1, "Lead ID is required."),
  manualApprovalStatus: z.enum(salesAssistApprovalStatuses).optional(),
});

export type SalesAttributionInput = z.infer<typeof salesAttributionSchema>;
export type SalesAssistRequestInput = z.infer<typeof salesAssistRequestSchema>;
