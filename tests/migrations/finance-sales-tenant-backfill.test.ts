import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

const sql = readFileSync(
  join(process.cwd(), "prisma/migrations/20260810190000_tenant_scope_finance_sales_conversion/migration.sql"),
  "utf8",
);

describe("finance and sales tenant backfill migration", () => {
  it("is atomic and blocks orphaned ownership before adding tenant columns", () => {
    assert.match(sql, /^BEGIN;/u);
    assert.match(sql, /COMMIT;\s*$/u);
    const orphanCheck = sql.indexOf("orphaned MarketingSalesAttribution");
    const addColumn = sql.indexOf('ALTER TABLE "FinanceEntry" ADD COLUMN "tenantId"');
    assert.ok(orphanCheck > 0 && orphanCheck < addColumn);
    assert.match(sql, /orphaned SalesConversionAssist lead reference/u);
    assert.match(sql, /orphaned FinanceEntry lead reference/u);
  });

  it("requires exactly one authoritative default tenant before Finance backfill", () => {
    assert.match(sql, /information_schema\.columns/u);
    assert.match(sql, /COUNT\(\*\) FROM "_Phase1ObservedTenant"\) <> 1/u);
    assert.match(sql, /"tenantId" = 'default'/u);
    assert.match(sql, /FinanceEntry ownership is not proven as the sole default tenant context/u);
    assert.match(sql, /FinanceEntry related Lead is not owned by default/u);
  });

  it("derives both sales tenant values from Lead and verifies equality", () => {
    assert.match(sql, /UPDATE "MarketingSalesAttribution"[\s\S]*SET "tenantId" = lead\."tenantId"/u);
    assert.match(sql, /UPDATE "SalesConversionAssist"[\s\S]*SET "tenantId" = lead\."tenantId"/u);
    assert.match(sql, /sales ownership does not match related Lead/u);
    assert.match(sql, /FOREIGN KEY \("leadId", "tenantId"\) REFERENCES "Lead"\("id", "tenantId"\)/u);
  });
});
