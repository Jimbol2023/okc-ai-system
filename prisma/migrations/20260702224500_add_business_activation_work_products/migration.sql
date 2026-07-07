-- Sprint 12 business activation keeps all work internal, source-labeled, and approval-gated.
ALTER TABLE "AiCompanyDraftQueueItem" ADD COLUMN "workProduct" JSONB;
ALTER TABLE "AiCompanyDraftQueueItem" ADD COLUMN "qualityChecklist" JSONB;

CREATE TABLE "AiCompanyOpportunityQueueItem" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL DEFAULT 'default',
    "source" TEXT NOT NULL,
    "sourceLabel" TEXT NOT NULL,
    "address" TEXT,
    "addressMissingReason" TEXT,
    "ownerName" TEXT,
    "contactInfo" TEXT,
    "leadScore" INTEGER NOT NULL DEFAULT 0,
    "confidence" INTEGER NOT NULL DEFAULT 0,
    "estimatedValue" TEXT,
    "opportunityType" TEXT NOT NULL,
    "motivationSignal" TEXT NOT NULL,
    "recommendedAction" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'manual_review',
    "assumptions" JSONB NOT NULL,
    "safetyFlags" JSONB NOT NULL,
    "providerCalled" BOOLEAN NOT NULL DEFAULT false,
    "sent" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "liveExecutionAllowed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiCompanyOpportunityQueueItem_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AiCompanyOpportunityQueueItem_tenantId_idx" ON "AiCompanyOpportunityQueueItem"("tenantId");
CREATE INDEX "AiCompanyOpportunityQueueItem_source_idx" ON "AiCompanyOpportunityQueueItem"("source");
CREATE INDEX "AiCompanyOpportunityQueueItem_sourceLabel_idx" ON "AiCompanyOpportunityQueueItem"("sourceLabel");
CREATE INDEX "AiCompanyOpportunityQueueItem_status_idx" ON "AiCompanyOpportunityQueueItem"("status");
CREATE INDEX "AiCompanyOpportunityQueueItem_confidence_idx" ON "AiCompanyOpportunityQueueItem"("confidence");
CREATE INDEX "AiCompanyOpportunityQueueItem_leadScore_idx" ON "AiCompanyOpportunityQueueItem"("leadScore");
CREATE INDEX "AiCompanyOpportunityQueueItem_providerCalled_idx" ON "AiCompanyOpportunityQueueItem"("providerCalled");
CREATE INDEX "AiCompanyOpportunityQueueItem_liveExecutionAllowed_idx" ON "AiCompanyOpportunityQueueItem"("liveExecutionAllowed");
CREATE INDEX "AiCompanyOpportunityQueueItem_createdAt_idx" ON "AiCompanyOpportunityQueueItem"("createdAt");
