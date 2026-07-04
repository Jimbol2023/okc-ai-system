import { z } from "zod";

export const knowledgeSourceTypes = [
  "official_documentation",
  "approved_github_repository",
  "internal_company_knowledge",
  "user_created_documentation",
  "public_reference_material",
  "ai_generated_recommendation",
] as const;

export const knowledgeApprovalStatuses = ["pending_review", "approved", "rejected", "deprecated"] as const;
export const knowledgeVisibilityLevels = ["enterprise_shared", "business_private", "module_scoped"] as const;
export const knowledgeSensitivityLabels = ["public", "internal", "confidential", "restricted", "credential_adjacent", "prompt_library", "strategy_sensitive"] as const;
export const knowledgeCitationUsageTypes = ["factual", "inferred", "recommended"] as const;

export const knowledgeSourceTypeSchema = z.enum(knowledgeSourceTypes);
export const knowledgeApprovalStatusSchema = z.enum(knowledgeApprovalStatuses);
export const knowledgeVisibilitySchema = z.enum(knowledgeVisibilityLevels);
export const knowledgeSensitivitySchema = z.enum(knowledgeSensitivityLabels);
export const knowledgeCitationUsageSchema = z.enum(knowledgeCitationUsageTypes);

export const registerKnowledgeSourceSchema = z.object({
  title: z.string().trim().min(3, "Title is required.").max(180, "Title must stay under 180 characters."),
  sourceType: knowledgeSourceTypeSchema,
  sourceUri: z.string().trim().url("Use a valid URL for external sources.").max(500).optional().or(z.literal("")),
  owner: z.string().trim().min(2, "Owner is required.").max(120),
  versionRef: z.string().trim().min(1).max(120).default("unversioned"),
  trustScore: z.coerce.number().int().min(0).max(100).default(50),
  license: z.string().trim().min(2, "License status is required.").max(120),
  provenance: z.string().trim().min(10, "Provenance must explain where this source came from.").max(1000),
  categories: z.array(z.string().trim().min(2).max(80)).min(1, "Choose at least one category.").max(12),
  businessModule: z.string().trim().min(2).max(80).default("enterprise"),
  visibility: knowledgeVisibilitySchema.default("enterprise_shared"),
  sensitivity: knowledgeSensitivitySchema.default("internal"),
  reviewCadenceDays: z.coerce.number().int().min(1).max(730).optional(),
  staleAfter: z.string().trim().datetime().optional().or(z.literal("")),
  contradictionRisk: z.coerce.number().int().min(0).max(100).default(0),
});

export const agentContextQuerySchema = z.object({
  agent: z.string().trim().min(2).max(80).default("general_ai"),
  task: z.string().trim().min(2).max(240).default("general guidance"),
  role: z.string().trim().min(2).max(80).default("operator"),
  businessModule: z.string().trim().min(2).max(80).default("enterprise"),
  maxSources: z.coerce.number().int().min(1).max(12).default(6),
  maxEstimatedTokens: z.coerce.number().int().min(200).max(6000).default(1800),
});

export type RegisterKnowledgeSourceInput = z.infer<typeof registerKnowledgeSourceSchema>;
export type AgentContextQuery = z.infer<typeof agentContextQuerySchema>;
export type KnowledgeSourceType = z.infer<typeof knowledgeSourceTypeSchema>;
export type KnowledgeApprovalStatus = z.infer<typeof knowledgeApprovalStatusSchema>;
export type KnowledgeVisibility = z.infer<typeof knowledgeVisibilitySchema>;
export type KnowledgeSensitivity = z.infer<typeof knowledgeSensitivitySchema>;
export type KnowledgeCitationUsage = z.infer<typeof knowledgeCitationUsageSchema>;
