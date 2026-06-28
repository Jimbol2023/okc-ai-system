import { z } from "zod";

export const knowledgeCategories = [
  "sop",
  "sales_script",
  "marketing_template",
  "ai_prompt",
  "oklahoma_guidance",
  "lesson_learned",
] as const;

export const knowledgeStatuses = ["draft", "active", "archived"] as const;

export const knowledgeCategorySchema = z.enum(knowledgeCategories);
export const knowledgeStatusSchema = z.enum(knowledgeStatuses);

export const createKnowledgeItemSchema = z.object({
  title: z.string().trim().min(3, "Title is required.").max(140, "Title must stay under 140 characters."),
  category: knowledgeCategorySchema,
  content: z.string().trim().min(20, "Content must be at least 20 characters.").max(8000, "Content must stay under 8,000 characters."),
  tags: z.array(z.string().trim().min(1).max(40)).max(12, "Use 12 tags or fewer.").optional(),
  status: knowledgeStatusSchema.default("draft"),
  source: z.string().trim().min(2, "Source is required.").max(80, "Source must stay under 80 characters.").default("manual"),
});

export type CreateKnowledgeItemInput = z.infer<typeof createKnowledgeItemSchema>;
export type KnowledgeCategory = z.infer<typeof knowledgeCategorySchema>;
export type KnowledgeStatus = z.infer<typeof knowledgeStatusSchema>;
