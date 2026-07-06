CREATE TABLE "BusinessDataSnapshot" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL DEFAULT 'default',
  "snapshotDate" TIMESTAMP(3) NOT NULL,
  "provider" TEXT NOT NULL,
  "connectorId" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'data_gap',
  "sourceLabel" TEXT NOT NULL,
  "provenance" TEXT NOT NULL,
  "freshness" TEXT NOT NULL,
  "summary" TEXT NOT NULL,
  "metrics" JSONB NOT NULL,
  "records" JSONB NOT NULL,
  "dataGaps" JSONB NOT NULL,
  "assumptions" JSONB NOT NULL,
  "safetyFlags" JSONB NOT NULL,
  "providerCalled" BOOLEAN NOT NULL DEFAULT false,
  "sent" BOOLEAN NOT NULL DEFAULT false,
  "published" BOOLEAN NOT NULL DEFAULT false,
  "crmMutated" BOOLEAN NOT NULL DEFAULT false,
  "liveExecutionAllowed" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "BusinessDataSnapshot_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "BusinessDataSnapshot_tenantId_snapshotDate_provider_category_key" ON "BusinessDataSnapshot"("tenantId", "snapshotDate", "provider", "category");
CREATE INDEX "BusinessDataSnapshot_tenantId_idx" ON "BusinessDataSnapshot"("tenantId");
CREATE INDEX "BusinessDataSnapshot_snapshotDate_idx" ON "BusinessDataSnapshot"("snapshotDate");
CREATE INDEX "BusinessDataSnapshot_provider_idx" ON "BusinessDataSnapshot"("provider");
CREATE INDEX "BusinessDataSnapshot_connectorId_idx" ON "BusinessDataSnapshot"("connectorId");
CREATE INDEX "BusinessDataSnapshot_category_idx" ON "BusinessDataSnapshot"("category");
CREATE INDEX "BusinessDataSnapshot_status_idx" ON "BusinessDataSnapshot"("status");
CREATE INDEX "BusinessDataSnapshot_providerCalled_idx" ON "BusinessDataSnapshot"("providerCalled");
CREATE INDEX "BusinessDataSnapshot_liveExecutionAllowed_idx" ON "BusinessDataSnapshot"("liveExecutionAllowed");
CREATE INDEX "BusinessDataSnapshot_createdAt_idx" ON "BusinessDataSnapshot"("createdAt");
