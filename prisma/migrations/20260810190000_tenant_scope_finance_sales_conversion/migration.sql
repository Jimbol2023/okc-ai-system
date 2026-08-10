BEGIN;

-- Sales ownership must be derivable from exactly one existing Lead.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM "MarketingSalesAttribution" attribution
    LEFT JOIN "Lead" lead ON lead."id" = attribution."leadId"
    WHERE lead."id" IS NULL
  ) THEN
    RAISE EXCEPTION 'tenant isolation blocked: orphaned MarketingSalesAttribution lead reference';
  END IF;

  IF EXISTS (
    SELECT 1 FROM "SalesConversionAssist" assist
    LEFT JOIN "Lead" lead ON lead."id" = assist."leadId"
    WHERE lead."id" IS NULL
  ) THEN
    RAISE EXCEPTION 'tenant isolation blocked: orphaned SalesConversionAssist lead reference';
  END IF;

  IF EXISTS (
    SELECT 1 FROM "FinanceEntry" finance
    LEFT JOIN "Lead" lead ON lead."id" = finance."leadId"
    WHERE finance."leadId" IS NOT NULL AND lead."id" IS NULL
  ) THEN
    RAISE EXCEPTION 'tenant isolation blocked: orphaned FinanceEntry lead reference';
  END IF;
END $$;

-- Prove the governed database has one authoritative tenant context before any
-- legacy Finance row can be assigned. Target tables are excluded because their
-- tenant columns do not exist yet and may not supply ownership evidence.
CREATE TEMP TABLE "_Phase1ObservedTenant" ("tenantId" TEXT PRIMARY KEY) ON COMMIT DROP;

DO $$
DECLARE
  tenant_table RECORD;
BEGIN
  FOR tenant_table IN
    SELECT table_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND column_name = 'tenantId'
      AND table_name NOT IN ('FinanceEntry', 'MarketingSalesAttribution', 'SalesConversionAssist')
  LOOP
    EXECUTE format(
      'INSERT INTO "_Phase1ObservedTenant" ("tenantId") SELECT DISTINCT "tenantId" FROM %I WHERE "tenantId" IS NOT NULL ON CONFLICT DO NOTHING',
      tenant_table.table_name
    );
  END LOOP;

  IF EXISTS (SELECT 1 FROM "FinanceEntry") AND (
    (SELECT COUNT(*) FROM "_Phase1ObservedTenant") <> 1
    OR NOT EXISTS (SELECT 1 FROM "_Phase1ObservedTenant" WHERE "tenantId" = 'default')
  ) THEN
    RAISE EXCEPTION 'tenant isolation blocked: FinanceEntry ownership is not proven as the sole default tenant context';
  END IF;

  IF EXISTS (
    SELECT 1 FROM "FinanceEntry" finance
    JOIN "Lead" lead ON lead."id" = finance."leadId"
    WHERE lead."tenantId" <> 'default'
  ) THEN
    RAISE EXCEPTION 'tenant isolation blocked: FinanceEntry related Lead is not owned by default';
  END IF;
END $$;

ALTER TABLE "FinanceEntry" ADD COLUMN "tenantId" TEXT;
ALTER TABLE "MarketingSalesAttribution" ADD COLUMN "tenantId" TEXT;
ALTER TABLE "SalesConversionAssist" ADD COLUMN "tenantId" TEXT;

UPDATE "MarketingSalesAttribution" attribution
SET "tenantId" = lead."tenantId"
FROM "Lead" lead
WHERE lead."id" = attribution."leadId";

UPDATE "SalesConversionAssist" assist
SET "tenantId" = lead."tenantId"
FROM "Lead" lead
WHERE lead."id" = assist."leadId";

UPDATE "FinanceEntry" SET "tenantId" = 'default';

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM "MarketingSalesAttribution" WHERE "tenantId" IS NULL)
    OR EXISTS (SELECT 1 FROM "SalesConversionAssist" WHERE "tenantId" IS NULL)
    OR EXISTS (SELECT 1 FROM "FinanceEntry" WHERE "tenantId" IS NULL) THEN
    RAISE EXCEPTION 'tenant isolation blocked: tenant backfill left null ownership';
  END IF;

  IF EXISTS (
    SELECT 1 FROM "MarketingSalesAttribution" attribution
    JOIN "Lead" lead ON lead."id" = attribution."leadId"
    WHERE attribution."tenantId" <> lead."tenantId"
  ) OR EXISTS (
    SELECT 1 FROM "SalesConversionAssist" assist
    JOIN "Lead" lead ON lead."id" = assist."leadId"
    WHERE assist."tenantId" <> lead."tenantId"
  ) THEN
    RAISE EXCEPTION 'tenant isolation blocked: sales ownership does not match related Lead';
  END IF;
END $$;

ALTER TABLE "FinanceEntry" ALTER COLUMN "tenantId" SET NOT NULL;
ALTER TABLE "MarketingSalesAttribution" ALTER COLUMN "tenantId" SET NOT NULL;
ALTER TABLE "SalesConversionAssist" ALTER COLUMN "tenantId" SET NOT NULL;

DROP INDEX "MarketingSalesAttribution_leadId_idx";
DROP INDEX "SalesConversionAssist_leadId_idx";
ALTER TABLE "MarketingSalesAttribution" DROP CONSTRAINT "MarketingSalesAttribution_leadId_fkey";
ALTER TABLE "SalesConversionAssist" DROP CONSTRAINT "SalesConversionAssist_leadId_fkey";

CREATE INDEX "FinanceEntry_tenantId_idx" ON "FinanceEntry"("tenantId");
CREATE INDEX "FinanceEntry_tenantId_entryDate_idx" ON "FinanceEntry"("tenantId", "entryDate");
CREATE INDEX "MarketingSalesAttribution_tenantId_idx" ON "MarketingSalesAttribution"("tenantId");
CREATE INDEX "MarketingSalesAttribution_tenantId_leadId_idx" ON "MarketingSalesAttribution"("tenantId", "leadId");
CREATE INDEX "SalesConversionAssist_tenantId_idx" ON "SalesConversionAssist"("tenantId");
CREATE INDEX "SalesConversionAssist_tenantId_leadId_idx" ON "SalesConversionAssist"("tenantId", "leadId");

ALTER TABLE "MarketingSalesAttribution"
  ADD CONSTRAINT "MarketingSalesAttribution_leadId_tenantId_fkey"
  FOREIGN KEY ("leadId", "tenantId") REFERENCES "Lead"("id", "tenantId")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SalesConversionAssist"
  ADD CONSTRAINT "SalesConversionAssist_leadId_tenantId_fkey"
  FOREIGN KEY ("leadId", "tenantId") REFERENCES "Lead"("id", "tenantId")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "FinanceEntry"
  ADD CONSTRAINT "FinanceEntry_leadId_tenantId_fkey"
  FOREIGN KEY ("leadId", "tenantId") REFERENCES "Lead"("id", "tenantId")
  ON DELETE RESTRICT ON UPDATE CASCADE;

COMMIT;
