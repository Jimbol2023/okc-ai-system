CREATE TABLE "MarketingDraft" (
  "id" TEXT NOT NULL,
  "channel" TEXT NOT NULL,
  "topic" TEXT NOT NULL,
  "sourceLabel" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'draft',
  "draftCopy" TEXT NOT NULL,
  "assetNotes" TEXT,
  "assumptions" JSONB,
  "safetyFlags" JSONB,
  "createdSource" TEXT NOT NULL DEFAULT 'template',
  "createdBy" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "MarketingDraft_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MarketingApproval" (
  "id" TEXT NOT NULL,
  "draftId" TEXT NOT NULL,
  "decision" TEXT NOT NULL,
  "editedCopy" TEXT,
  "note" TEXT NOT NULL,
  "reviewer" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "MarketingApproval_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MarketingAccountConnection" (
  "id" TEXT NOT NULL,
  "platform" TEXT NOT NULL,
  "accountName" TEXT NOT NULL,
  "handle" TEXT NOT NULL,
  "profileUrl" TEXT NOT NULL,
  "verificationStatus" TEXT NOT NULL DEFAULT 'manual_setup',
  "proofNote" TEXT NOT NULL,
  "lastVerifiedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "MarketingAccountConnection_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MarketingPublishAssist" (
  "id" TEXT NOT NULL,
  "draftId" TEXT NOT NULL,
  "preparedCopy" TEXT NOT NULL,
  "assetChecklist" JSONB NOT NULL,
  "manualPostingChecklist" JSONB NOT NULL,
  "sourceLabel" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'ready_for_manual_publish',
  "manualPublishedUrl" TEXT,
  "manualPublishedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "MarketingPublishAssist_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "MarketingDraft_channel_idx" ON "MarketingDraft"("channel");
CREATE INDEX "MarketingDraft_status_idx" ON "MarketingDraft"("status");
CREATE INDEX "MarketingDraft_sourceLabel_idx" ON "MarketingDraft"("sourceLabel");
CREATE INDEX "MarketingDraft_createdAt_idx" ON "MarketingDraft"("createdAt");

CREATE INDEX "MarketingApproval_draftId_idx" ON "MarketingApproval"("draftId");
CREATE INDEX "MarketingApproval_decision_idx" ON "MarketingApproval"("decision");
CREATE INDEX "MarketingApproval_createdAt_idx" ON "MarketingApproval"("createdAt");

CREATE UNIQUE INDEX "MarketingAccountConnection_platform_key" ON "MarketingAccountConnection"("platform");
CREATE INDEX "MarketingAccountConnection_verificationStatus_idx" ON "MarketingAccountConnection"("verificationStatus");
CREATE INDEX "MarketingAccountConnection_lastVerifiedAt_idx" ON "MarketingAccountConnection"("lastVerifiedAt");

CREATE INDEX "MarketingPublishAssist_draftId_idx" ON "MarketingPublishAssist"("draftId");
CREATE INDEX "MarketingPublishAssist_status_idx" ON "MarketingPublishAssist"("status");
CREATE INDEX "MarketingPublishAssist_sourceLabel_idx" ON "MarketingPublishAssist"("sourceLabel");
CREATE INDEX "MarketingPublishAssist_createdAt_idx" ON "MarketingPublishAssist"("createdAt");

ALTER TABLE "MarketingApproval"
  ADD CONSTRAINT "MarketingApproval_draftId_fkey"
  FOREIGN KEY ("draftId") REFERENCES "MarketingDraft"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "MarketingPublishAssist"
  ADD CONSTRAINT "MarketingPublishAssist_draftId_fkey"
  FOREIGN KEY ("draftId") REFERENCES "MarketingDraft"("id") ON DELETE CASCADE ON UPDATE CASCADE;
