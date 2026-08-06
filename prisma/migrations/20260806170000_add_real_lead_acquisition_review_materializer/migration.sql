-- Expand-only schema for internal, tenant-scoped lead work materialization.
ALTER TABLE "RevenueTask"
  ADD COLUMN "idempotencyKey" TEXT,
  ADD COLUMN "materializationVersion" TEXT,
  ADD COLUMN "sourceProvenance" JSONB,
  ADD COLUMN "captureTimestamp" TIMESTAMP(3),
  ADD COLUMN "scoreEvidence" JSONB,
  ADD COLUMN "propertyEvidence" JSONB,
  ADD COLUMN "missingEvidence" JSONB,
  ADD COLUMN "contactPosture" JSONB,
  ADD COLUMN "providerCalled" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "outreach" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "sent" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "published" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "crmMutation" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "externalExecutionAllowed" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "liveExecutionAllowed" BOOLEAN NOT NULL DEFAULT false;

CREATE UNIQUE INDEX "RevenueTask_tenantId_idempotencyKey_key" ON "RevenueTask"("tenantId", "idempotencyKey");
CREATE INDEX "RevenueTask_tenantId_taskType_status_idx" ON "RevenueTask"("tenantId", "taskType", "status");

ALTER TABLE "RevenueTask" DROP CONSTRAINT "RevenueTask_leadId_fkey";
ALTER TABLE "RevenueTask"
  ADD CONSTRAINT "RevenueTask_leadId_tenantId_fkey"
  FOREIGN KEY ("leadId", "tenantId") REFERENCES "Lead"("id", "tenantId")
  ON DELETE RESTRICT ON UPDATE CASCADE;
