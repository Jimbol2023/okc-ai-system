CREATE TABLE "AiMemoryEvent" (
    "id" TEXT NOT NULL,
    "leadId" TEXT,
    "jobId" TEXT,
    "actionId" TEXT,
    "eventType" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "sellerReply" TEXT,
    "aiSuggestedReply" TEXT,
    "humanFinalReply" TEXT,
    "approvalDecision" TEXT,
    "messageChannel" TEXT,
    "messageStatus" TEXT,
    "sellerIntent" TEXT,
    "sellerSentiment" TEXT,
    "confidence" DOUBLE PRECISION,
    "outcome" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiMemoryEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AiMemoryEvent_leadId_idx" ON "AiMemoryEvent"("leadId");
CREATE INDEX "AiMemoryEvent_jobId_idx" ON "AiMemoryEvent"("jobId");
CREATE INDEX "AiMemoryEvent_actionId_idx" ON "AiMemoryEvent"("actionId");
CREATE INDEX "AiMemoryEvent_eventType_idx" ON "AiMemoryEvent"("eventType");
CREATE INDEX "AiMemoryEvent_source_idx" ON "AiMemoryEvent"("source");
CREATE INDEX "AiMemoryEvent_createdAt_idx" ON "AiMemoryEvent"("createdAt");
