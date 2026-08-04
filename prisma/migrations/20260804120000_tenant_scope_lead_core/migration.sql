-- Tenant isolation is mandatory for lead, CRM, property-pipeline, and DFD workflows.
-- Existing rows are assigned to the legacy tenant explicitly during migration.
-- The explicit transaction prevents a missing prerequisite or later SQL error from
-- leaving Lead partially tenant-scoped.
BEGIN;

ALTER TABLE "Lead" ADD COLUMN "tenantId" TEXT;
UPDATE "Lead" SET "tenantId" = 'default' WHERE "tenantId" IS NULL;
ALTER TABLE "Lead" ALTER COLUMN "tenantId" SET NOT NULL;

DROP INDEX IF EXISTS "Lead_propertyAddress_phone_key";
CREATE UNIQUE INDEX "Lead_tenantId_propertyAddress_phone_key"
  ON "Lead"("tenantId", "propertyAddress", "phone");
CREATE UNIQUE INDEX "Lead_id_tenantId_key" ON "Lead"("id", "tenantId");
CREATE INDEX "Lead_tenantId_idx" ON "Lead"("tenantId");

ALTER TABLE "ManualLeadIntake" ADD COLUMN "tenantId" TEXT;
UPDATE "ManualLeadIntake" SET "tenantId" = 'default' WHERE "tenantId" IS NULL;
ALTER TABLE "ManualLeadIntake" ALTER COLUMN "tenantId" SET NOT NULL;
CREATE INDEX "ManualLeadIntake_tenantId_idx" ON "ManualLeadIntake"("tenantId");

COMMIT;
