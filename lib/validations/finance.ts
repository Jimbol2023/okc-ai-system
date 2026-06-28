import { z } from "zod";

export const financeEntryTypes = ["marketing_spend", "deal_revenue", "deal_expense", "kpi_note"] as const;
export const financeCategories = [
  "paid_ads",
  "direct_mail",
  "data",
  "software",
  "contractor",
  "closing",
  "assignment_fee",
  "wholesale_revenue",
  "other",
] as const;

export const financeEntryTypeSchema = z.enum(financeEntryTypes);
export const financeCategorySchema = z.enum(financeCategories);

export const createFinanceEntrySchema = z.object({
  entryType: financeEntryTypeSchema,
  category: financeCategorySchema,
  source: z.string().trim().min(2, "Source is required.").max(100, "Source must stay under 100 characters."),
  amount: z.coerce.number().finite("Amount must be a number.").min(0, "Amount cannot be negative.").max(100000000, "Amount is too large."),
  entryDate: z
    .string()
    .trim()
    .min(1, "Date is required.")
    .refine((value) => !Number.isNaN(new Date(value).getTime()), "Enter a valid date."),
  notes: z.string().trim().min(3, "Notes are required.").max(1200, "Notes must stay under 1,200 characters."),
  leadId: z.string().trim().max(120, "Lead ID must stay under 120 characters.").optional().or(z.literal("")),
  dealReference: z.string().trim().max(160, "Deal reference must stay under 160 characters.").optional().or(z.literal("")),
  assumption: z.string().trim().max(800, "Assumption must stay under 800 characters.").optional().or(z.literal("")),
});

export type CreateFinanceEntryInput = z.infer<typeof createFinanceEntrySchema>;
export type FinanceEntryType = z.infer<typeof financeEntryTypeSchema>;
export type FinanceCategory = z.infer<typeof financeCategorySchema>;
