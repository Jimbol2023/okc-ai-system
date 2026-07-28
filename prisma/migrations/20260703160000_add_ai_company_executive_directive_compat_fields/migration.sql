-- Compatibility marker for camelCase directive fields from the activation
-- branch. Those fields are already present in the current AI company
-- activation schema and remain internal/approval-gated.

CREATE INDEX IF NOT EXISTS "AiCompanyExecutiveDirective_businessGoal_idx" ON "AiCompanyExecutiveDirective"("businessGoal");
CREATE INDEX IF NOT EXISTS "AiCompanyExecutiveDirective_sourceDepartment_idx" ON "AiCompanyExecutiveDirective"("sourceDepartment");
CREATE INDEX IF NOT EXISTS "AiCompanyExecutiveDirective_approvedAt_idx" ON "AiCompanyExecutiveDirective"("approvedAt");
