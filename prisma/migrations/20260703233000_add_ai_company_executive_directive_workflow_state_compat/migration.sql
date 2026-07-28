-- Compatibility marker for final CEO Decision Agenda workflow-state metadata.
-- The current AI company activation schema already owns workflowState.

CREATE INDEX IF NOT EXISTS "AiCompanyExecutiveDirective_workflowState_idx" ON "AiCompanyExecutiveDirective"("workflowState");
