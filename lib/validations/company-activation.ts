import { z } from "zod";

export const companyDirectiveDecisionSchema = z.object({
  decision: z.enum(["approve", "reject", "request_changes", "defer"]),
  note: z.string().trim().max(1000, "Note must stay under 1,000 characters.").optional(),
  reviewReminderAt: z.string().trim().datetime("Use a valid reminder date.").optional().or(z.literal("")),
});

export type CompanyDirectiveDecisionInput = z.infer<typeof companyDirectiveDecisionSchema>;
