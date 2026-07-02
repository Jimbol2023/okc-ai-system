CREATE TABLE "AiDepartmentMemoryEvent" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL DEFAULT 'default',
    "memoryKey" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "directiveId" TEXT,
    "assignmentId" TEXT,
    "draftQueueItemId" TEXT,
    "eventType" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "lesson" TEXT NOT NULL,
    "recommendation" TEXT NOT NULL,
    "metrics" JSONB NOT NULL,
    "evidenceLabels" JSONB NOT NULL,
    "confidence" INTEGER NOT NULL,
    "outcome" TEXT NOT NULL DEFAULT 'insufficient_outcome_data',
    "assumptions" JSONB NOT NULL,
    "providerCalled" BOOLEAN NOT NULL DEFAULT false,
    "sent" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "liveExecutionAllowed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiDepartmentMemoryEvent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AiDepartmentIntelligenceSnapshot" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL DEFAULT 'default',
    "snapshotKey" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "highRoiFocus" TEXT NOT NULL,
    "lessonsLearned" JSONB NOT NULL,
    "recommendationQueue" JSONB NOT NULL,
    "memoryStatus" TEXT NOT NULL,
    "confidence" INTEGER NOT NULL,
    "sourceLabels" JSONB NOT NULL,
    "assumptions" JSONB NOT NULL,
    "providerCalled" BOOLEAN NOT NULL DEFAULT false,
    "sent" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "liveExecutionAllowed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiDepartmentIntelligenceSnapshot_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AiDepartmentMemoryEvent_memoryKey_key" ON "AiDepartmentMemoryEvent"("memoryKey");
CREATE INDEX "AiDepartmentMemoryEvent_tenantId_idx" ON "AiDepartmentMemoryEvent"("tenantId");
CREATE INDEX "AiDepartmentMemoryEvent_department_idx" ON "AiDepartmentMemoryEvent"("department");
CREATE INDEX "AiDepartmentMemoryEvent_directiveId_idx" ON "AiDepartmentMemoryEvent"("directiveId");
CREATE INDEX "AiDepartmentMemoryEvent_assignmentId_idx" ON "AiDepartmentMemoryEvent"("assignmentId");
CREATE INDEX "AiDepartmentMemoryEvent_draftQueueItemId_idx" ON "AiDepartmentMemoryEvent"("draftQueueItemId");
CREATE INDEX "AiDepartmentMemoryEvent_eventType_idx" ON "AiDepartmentMemoryEvent"("eventType");
CREATE INDEX "AiDepartmentMemoryEvent_outcome_idx" ON "AiDepartmentMemoryEvent"("outcome");
CREATE INDEX "AiDepartmentMemoryEvent_providerCalled_idx" ON "AiDepartmentMemoryEvent"("providerCalled");
CREATE INDEX "AiDepartmentMemoryEvent_liveExecutionAllowed_idx" ON "AiDepartmentMemoryEvent"("liveExecutionAllowed");
CREATE INDEX "AiDepartmentMemoryEvent_createdAt_idx" ON "AiDepartmentMemoryEvent"("createdAt");

CREATE UNIQUE INDEX "AiDepartmentIntelligenceSnapshot_snapshotKey_key" ON "AiDepartmentIntelligenceSnapshot"("snapshotKey");
CREATE INDEX "AiDepartmentIntelligenceSnapshot_tenantId_idx" ON "AiDepartmentIntelligenceSnapshot"("tenantId");
CREATE INDEX "AiDepartmentIntelligenceSnapshot_department_idx" ON "AiDepartmentIntelligenceSnapshot"("department");
CREATE INDEX "AiDepartmentIntelligenceSnapshot_memoryStatus_idx" ON "AiDepartmentIntelligenceSnapshot"("memoryStatus");
CREATE INDEX "AiDepartmentIntelligenceSnapshot_confidence_idx" ON "AiDepartmentIntelligenceSnapshot"("confidence");
CREATE INDEX "AiDepartmentIntelligenceSnapshot_providerCalled_idx" ON "AiDepartmentIntelligenceSnapshot"("providerCalled");
CREATE INDEX "AiDepartmentIntelligenceSnapshot_liveExecutionAllowed_idx" ON "AiDepartmentIntelligenceSnapshot"("liveExecutionAllowed");
CREATE INDEX "AiDepartmentIntelligenceSnapshot_createdAt_idx" ON "AiDepartmentIntelligenceSnapshot"("createdAt");
