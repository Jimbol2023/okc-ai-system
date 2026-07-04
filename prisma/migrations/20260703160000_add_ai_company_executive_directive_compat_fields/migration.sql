-- Add camelCase directive fields expected by the AI COO / CEO Decision Agenda runtime.
-- Metadata-only compatibility: this does not authorize execution, outreach, scraping, providers, or publishing.

ALTER TABLE "AiCompanyExecutiveDirective"
  ADD COLUMN IF NOT EXISTS "businessGoal" TEXT NOT NULL DEFAULT 'generate_revenue',
  ADD COLUMN IF NOT EXISTS "sourceDepartment" TEXT NOT NULL DEFAULT 'Executive AI',
  ADD COLUMN IF NOT EXISTS "assignedDepartments" JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS "requestedOutputs" JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS "approvalStatus" TEXT NOT NULL DEFAULT 'awaiting_ceo_approval',
  ADD COLUMN IF NOT EXISTS "approvedBy" TEXT,
  ADD COLUMN IF NOT EXISTS "approvedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "expectedBusinessValue" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "governanceNotes" JSONB NOT NULL DEFAULT '[]';

CREATE INDEX IF NOT EXISTS "AiCompanyExecutiveDirective_businessGoal_idx" ON "AiCompanyExecutiveDirective"("businessGoal");
CREATE INDEX IF NOT EXISTS "AiCompanyExecutiveDirective_sourceDepartment_idx" ON "AiCompanyExecutiveDirective"("sourceDepartment");
CREATE INDEX IF NOT EXISTS "AiCompanyExecutiveDirective_approvalStatus_idx" ON "AiCompanyExecutiveDirective"("approvalStatus");
CREATE INDEX IF NOT EXISTS "AiCompanyExecutiveDirective_approvedAt_idx" ON "AiCompanyExecutiveDirective"("approvedAt");
