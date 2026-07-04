-- Add final CEO Decision Agenda workflow-state compatibility metadata.
-- Metadata-only compatibility: this does not authorize execution, outreach, scraping, providers, or publishing.

ALTER TABLE "AiCompanyExecutiveDirective"
  ADD COLUMN IF NOT EXISTS "workflowState" TEXT NOT NULL DEFAULT 'blocked_awaiting_ceo_approval';

CREATE INDEX IF NOT EXISTS "AiCompanyExecutiveDirective_workflowState_idx" ON "AiCompanyExecutiveDirective"("workflowState");
