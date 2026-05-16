CREATE TABLE "AiPerformanceMetric" (
  "id" TEXT NOT NULL,
  "date" TIMESTAMP(3) NOT NULL,
  "totalLeads" INTEGER NOT NULL DEFAULT 0,
  "newLeads" INTEGER NOT NULL DEFAULT 0,
  "contactedLeads" INTEGER NOT NULL DEFAULT 0,
  "negotiatingLeads" INTEGER NOT NULL DEFAULT 0,
  "underContractLeads" INTEGER NOT NULL DEFAULT 0,
  "closedLeads" INTEGER NOT NULL DEFAULT 0,
  "sellerReplies" INTEGER NOT NULL DEFAULT 0,
  "aiClassifications" INTEGER NOT NULL DEFAULT 0,
  "avgConfidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "humanApprovalsNeeded" INTEGER NOT NULL DEFAULT 0,
  "suggestedReplies" INTEGER NOT NULL DEFAULT 0,
  "dncCount" INTEGER NOT NULL DEFAULT 0,
  "hotLeads" INTEGER NOT NULL DEFAULT 0,
  "automationScheduled" INTEGER NOT NULL DEFAULT 0,
  "automationIdle" INTEGER NOT NULL DEFAULT 0,
  "staleNewLeads" INTEGER NOT NULL DEFAULT 0,
  "overdueFollowUps" INTEGER NOT NULL DEFAULT 0,
  "systemWarnings" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "AiPerformanceMetric_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AiPerformanceMetric_date_key" ON "AiPerformanceMetric"("date");
CREATE INDEX "AiPerformanceMetric_date_idx" ON "AiPerformanceMetric"("date");
CREATE INDEX "AiPerformanceMetric_createdAt_idx" ON "AiPerformanceMetric"("createdAt");
