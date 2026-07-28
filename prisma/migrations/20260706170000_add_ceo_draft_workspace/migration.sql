ALTER TABLE "AiCompanyDraftQueueItem"
  ADD COLUMN "title" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "body" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "messaging" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "cta" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "metadata" JSONB NOT NULL DEFAULT '{}',
  ADD COLUMN "priority" TEXT NOT NULL DEFAULT 'normal',
  ADD COLUMN "businessGoal" TEXT NOT NULL DEFAULT 'improve_executive_decisions',
  ADD COLUMN "executiveSummary" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "knowledgeTrace" JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN "assumptions" JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN "confidence" INTEGER NOT NULL DEFAULT 72,
  ADD COLUMN "approvalStatus" TEXT NOT NULL DEFAULT 'pending_ceo_review',
  ADD COLUMN "revisionCount" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "lastModifiedBy" TEXT,
  ADD COLUMN "lastModifiedAt" TIMESTAMP(3);

CREATE TABLE "AiCompanyDraftRevision" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL DEFAULT 'default',
  "draftQueueItemId" TEXT NOT NULL,
  "directiveId" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "note" TEXT,
  "reviewer" TEXT,
  "previousSnapshot" JSONB NOT NULL,
  "nextSnapshot" JSONB NOT NULL,
  "safetyFlags" JSONB NOT NULL,
  "providerCalled" BOOLEAN NOT NULL DEFAULT false,
  "sent" BOOLEAN NOT NULL DEFAULT false,
  "published" BOOLEAN NOT NULL DEFAULT false,
  "workflowStarted" BOOLEAN NOT NULL DEFAULT false,
  "liveExecutionAllowed" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "AiCompanyDraftRevision_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AiCompanyDraftQueueItem_approvalStatus_idx" ON "AiCompanyDraftQueueItem"("approvalStatus");
CREATE INDEX "AiCompanyDraftRevision_tenantId_idx" ON "AiCompanyDraftRevision"("tenantId");
CREATE INDEX "AiCompanyDraftRevision_draftQueueItemId_idx" ON "AiCompanyDraftRevision"("draftQueueItemId");
CREATE INDEX "AiCompanyDraftRevision_directiveId_idx" ON "AiCompanyDraftRevision"("directiveId");
CREATE INDEX "AiCompanyDraftRevision_action_idx" ON "AiCompanyDraftRevision"("action");
CREATE INDEX "AiCompanyDraftRevision_providerCalled_idx" ON "AiCompanyDraftRevision"("providerCalled");
CREATE INDEX "AiCompanyDraftRevision_liveExecutionAllowed_idx" ON "AiCompanyDraftRevision"("liveExecutionAllowed");
CREATE INDEX "AiCompanyDraftRevision_createdAt_idx" ON "AiCompanyDraftRevision"("createdAt");

ALTER TABLE "AiCompanyDraftRevision"
  ADD CONSTRAINT "AiCompanyDraftRevision_draftQueueItemId_fkey"
  FOREIGN KEY ("draftQueueItemId") REFERENCES "AiCompanyDraftQueueItem"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
