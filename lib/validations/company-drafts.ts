import { z } from "zod";

export const companyDraftEditSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(180, "Title must stay under 180 characters."),
  body: z.string().trim().min(1, "Body is required.").max(8000, "Body must stay under 8,000 characters."),
  messaging: z.string().trim().max(3000, "Messaging must stay under 3,000 characters.").optional().or(z.literal("")),
  cta: z.string().trim().max(500, "CTA must stay under 500 characters.").optional().or(z.literal("")),
  metadata: z.string().trim().max(3000, "Metadata must stay under 3,000 characters.").optional().or(z.literal("")),
  note: z.string().trim().max(1000, "Note must stay under 1,000 characters.").optional().or(z.literal("")),
});

export const companyDraftDecisionSchema = z.object({
  decision: z.enum(["approve", "reject", "request_changes"]),
  note: z.string().trim().max(1000, "Note must stay under 1,000 characters.").optional().or(z.literal("")),
});

export type CompanyDraftEditInput = z.infer<typeof companyDraftEditSchema>;
export type CompanyDraftDecisionInput = z.infer<typeof companyDraftDecisionSchema>;
