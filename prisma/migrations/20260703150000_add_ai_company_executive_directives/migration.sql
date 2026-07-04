-- Compatibility table for the CEO Decision Agenda / AI COO directive registry.
-- Metadata-only: approvals do not authorize publishing, outreach, scraping, providers, or workflow execution.

CREATE TABLE "AiCompanyExecutiveDirective" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL DEFAULT 'default',
    "directiveKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "objective" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'awaiting_ceo_approval',
    "riskLevel" TEXT NOT NULL DEFAULT 'medium',
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "decision" TEXT,
    "decisionNote" TEXT,
    "decidedBy" TEXT,
    "decidedAt" TIMESTAMP(3),
    "deferReminderAt" TIMESTAMP(3),
    "tags" JSONB NOT NULL DEFAULT '[]',
    "source" TEXT NOT NULL DEFAULT 'company_orchestrator_directive_registry',
    "assumptions" JSONB NOT NULL DEFAULT '[]',
    "safeMetadata" JSONB,
    "providerCalled" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "sent" BOOLEAN NOT NULL DEFAULT false,
    "scraped" BOOLEAN NOT NULL DEFAULT false,
    "outreachSent" BOOLEAN NOT NULL DEFAULT false,
    "workflowStarted" BOOLEAN NOT NULL DEFAULT false,
    "liveExecutionAllowed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiCompanyExecutiveDirective_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AiCompanyExecutiveDirective_tenantId_directiveKey_key" ON "AiCompanyExecutiveDirective"("tenantId", "directiveKey");
CREATE INDEX "AiCompanyExecutiveDirective_tenantId_idx" ON "AiCompanyExecutiveDirective"("tenantId");
CREATE INDEX "AiCompanyExecutiveDirective_directiveKey_idx" ON "AiCompanyExecutiveDirective"("directiveKey");
CREATE INDEX "AiCompanyExecutiveDirective_status_idx" ON "AiCompanyExecutiveDirective"("status");
CREATE INDEX "AiCompanyExecutiveDirective_riskLevel_idx" ON "AiCompanyExecutiveDirective"("riskLevel");
CREATE INDEX "AiCompanyExecutiveDirective_priority_idx" ON "AiCompanyExecutiveDirective"("priority");
CREATE INDEX "AiCompanyExecutiveDirective_decision_idx" ON "AiCompanyExecutiveDirective"("decision");
CREATE INDEX "AiCompanyExecutiveDirective_deferReminderAt_idx" ON "AiCompanyExecutiveDirective"("deferReminderAt");
CREATE INDEX "AiCompanyExecutiveDirective_createdAt_idx" ON "AiCompanyExecutiveDirective"("createdAt");
