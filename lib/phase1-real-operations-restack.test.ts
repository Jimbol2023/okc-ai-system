import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("Phase 1 tenant-scoped Finance and Real Operations projection coexist", () => {
  const source = readFileSync(new URL("./executive-dashboard.ts", import.meta.url), "utf8");

  assert.match(source, /loadPartialData\("Finance", \(\) => listFinanceEntries\(tenantId\), \[\]\)/);
  assert.match(source, /listPropertyOpportunities\(createPrismaPropertyOpportunityDb\(prisma\), tenantId\)/);
  assert.match(source, /propertyOpportunitySummary/);
});
