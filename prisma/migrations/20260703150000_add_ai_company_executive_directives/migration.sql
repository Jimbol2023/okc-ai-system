-- Compatibility layer for the CEO Decision Agenda / AI COO directive registry.
-- The stronger AI company activation migration already creates the directive
-- table, so this migration only adds metadata fields safely and idempotently.

ALTER TABLE "AiCompanyExecutiveDirective"
  ADD COLUMN IF NOT EXISTS "directiveKey" TEXT,
  ADD COLUMN IF NOT EXISTS "summary" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "objective" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "approvalStatus" TEXT NOT NULL DEFAULT 'awaiting_ceo_approval',
  ADD COLUMN IF NOT EXISTS "priority" TEXT NOT NULL DEFAULT 'normal',
  ADD COLUMN IF NOT EXISTS "decision" TEXT,
  ADD COLUMN IF NOT EXISTS "decisionNote" TEXT,
  ADD COLUMN IF NOT EXISTS "decidedBy" TEXT,
  ADD COLUMN IF NOT EXISTS "decidedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "deferReminderAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "tags" JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS "source" TEXT NOT NULL DEFAULT 'company_orchestrator_directive_registry',
  ADD COLUMN IF NOT EXISTS "assumptions" JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS "safeMetadata" JSONB,
  ADD COLUMN IF NOT EXISTS "scraped" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "outreachSent" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "workflowStarted" BOOLEAN NOT NULL DEFAULT false;

CREATE UNIQUE INDEX IF NOT EXISTS "AiCompanyExecutiveDirective_tenantId_directiveKey_key"
  ON "AiCompanyExecutiveDirective"("tenantId", "directiveKey");
CREATE INDEX IF NOT EXISTS "AiCompanyExecutiveDirective_directiveKey_idx" ON "AiCompanyExecutiveDirective"("directiveKey");
CREATE INDEX IF NOT EXISTS "AiCompanyExecutiveDirective_approvalStatus_idx" ON "AiCompanyExecutiveDirective"("approvalStatus");
CREATE INDEX IF NOT EXISTS "AiCompanyExecutiveDirective_priority_idx" ON "AiCompanyExecutiveDirective"("priority");
CREATE INDEX IF NOT EXISTS "AiCompanyExecutiveDirective_decision_idx" ON "AiCompanyExecutiveDirective"("decision");
CREATE INDEX IF NOT EXISTS "AiCompanyExecutiveDirective_deferReminderAt_idx" ON "AiCompanyExecutiveDirective"("deferReminderAt");
