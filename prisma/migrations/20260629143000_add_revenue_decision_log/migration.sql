CREATE TABLE "RevenueDecisionLog" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL DEFAULT 'default',
    "leadId" TEXT,
    "taskId" TEXT,
    "auditEventId" TEXT,
    "aiMemoryEventId" TEXT,
    "connectorKey" TEXT,
    "pipelineEventId" TEXT,
    "recommendationType" TEXT NOT NULL,
    "recommendation" TEXT NOT NULL,
    "confidence" INTEGER NOT NULL,
    "supportingEvidence" JSONB NOT NULL,
    "assumptions" JSONB NOT NULL,
    "missingData" JSONB NOT NULL,
    "userDecision" TEXT NOT NULL DEFAULT 'pending',
    "modifiedAction" TEXT,
    "outcome" TEXT NOT NULL DEFAULT 'unknown',
    "advisoryOnly" BOOLEAN NOT NULL DEFAULT true,
    "providerCalled" BOOLEAN NOT NULL DEFAULT false,
    "outreachSent" BOOLEAN NOT NULL DEFAULT false,
    "requiresApproval" BOOLEAN NOT NULL DEFAULT true,
    "safeMetadata" JSONB,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RevenueDecisionLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "RevenueDecisionLog_tenantId_idx" ON "RevenueDecisionLog"("tenantId");
CREATE INDEX "RevenueDecisionLog_leadId_idx" ON "RevenueDecisionLog"("leadId");
CREATE INDEX "RevenueDecisionLog_taskId_idx" ON "RevenueDecisionLog"("taskId");
CREATE INDEX "RevenueDecisionLog_auditEventId_idx" ON "RevenueDecisionLog"("auditEventId");
CREATE INDEX "RevenueDecisionLog_aiMemoryEventId_idx" ON "RevenueDecisionLog"("aiMemoryEventId");
CREATE INDEX "RevenueDecisionLog_connectorKey_idx" ON "RevenueDecisionLog"("connectorKey");
CREATE INDEX "RevenueDecisionLog_pipelineEventId_idx" ON "RevenueDecisionLog"("pipelineEventId");
CREATE INDEX "RevenueDecisionLog_recommendationType_idx" ON "RevenueDecisionLog"("recommendationType");
CREATE INDEX "RevenueDecisionLog_userDecision_idx" ON "RevenueDecisionLog"("userDecision");
CREATE INDEX "RevenueDecisionLog_outcome_idx" ON "RevenueDecisionLog"("outcome");
CREATE INDEX "RevenueDecisionLog_advisoryOnly_idx" ON "RevenueDecisionLog"("advisoryOnly");
CREATE INDEX "RevenueDecisionLog_providerCalled_idx" ON "RevenueDecisionLog"("providerCalled");
CREATE INDEX "RevenueDecisionLog_outreachSent_idx" ON "RevenueDecisionLog"("outreachSent");
CREATE INDEX "RevenueDecisionLog_createdAt_idx" ON "RevenueDecisionLog"("createdAt");
