ALTER TABLE "BusinessDataSnapshot"
ADD COLUMN "version" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN "contractVersion" TEXT NOT NULL DEFAULT 'business-data-snapshot-v1',
ADD COLUMN "evidenceHash" TEXT,
ADD COLUMN "observationStart" TIMESTAMP(3),
ADD COLUMN "observationEnd" TIMESTAMP(3),
ADD COLUMN "traceId" TEXT,
ADD COLUMN "reliability" JSONB;

CREATE INDEX "BusinessDataSnapshot_tenantId_connectorId_category_evidenceHash_idx"
ON "BusinessDataSnapshot"("tenantId", "connectorId", "category", "evidenceHash");

CREATE INDEX "BusinessDataSnapshot_tenantId_traceId_idx"
ON "BusinessDataSnapshot"("tenantId", "traceId");
