import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

function source(path: string) {
  return readFileSync(join(process.cwd(), path), "utf8");
}

describe("tenant-isolated finance and sales conversion boundaries", () => {
  it("derives route tenant context from the authenticated request", () => {
    for (const path of [
      "app/api/finance/entries/route.ts",
      "app/api/sales-conversion/route.ts",
      "app/api/sales-conversion/assist/route.ts",
      "app/api/sales-conversion/attribution/route.ts",
      "app/api/sales-workspace/route.ts",
      "app/api/offer-readiness/route.ts",
    ]) {
      const route = source(path);
      assert.match(route, /getAuthenticatedRequestContext\(request\)/u, path);
      assert.match(route, /actor\.tenantId/u, path);
      assert.doesNotMatch(route, /payload\.tenantId/u, path);
    }
  });

  it("scopes finance reads and writes and rejects cross-tenant Lead relationships", () => {
    const finance = source("lib/finance.ts");
    assert.match(finance, /listFinanceEntries\(tenantId: string\)/u);
    assert.match(finance, /where: \{ tenantId \}/u);
    assert.match(finance, /id_tenantId: \{ id: input\.leadId, tenantId \}/u);
    assert.match(finance, /Lead not found for authenticated tenant/u);
    assert.match(finance, /data: \{\s*tenantId,/u);
  });

  it("scopes sales conversion and reporting queries to one tenant", () => {
    for (const path of ["lib/sales-conversion-assist.ts", "lib/sales-workspace.ts", "lib/offer-readiness.ts"]) {
      const implementation = source(path);
      assert.match(implementation, /\(tenantId: string\)/u, path);
      assert.match(implementation, /where: \{ tenantId \}/u, path);
    }

    const conversion = source("lib/sales-conversion-assist.ts");
    assert.match(conversion, /id_tenantId: \{ id: input\.leadId, tenantId \}/u);
    assert.match(conversion, /data: \{\s*tenantId,/u);
  });

  it("uses tenant-qualified Prisma relationships", () => {
    const schema = source("prisma/schema.prisma");
    for (const modelName of ["MarketingSalesAttribution", "SalesConversionAssist", "FinanceEntry"]) {
      const model = schema.match(new RegExp(`model ${modelName} \\{([\\s\\S]*?)\\n\\}`, "u"))?.[1] ?? "";
      assert.match(model, /tenantId\s+String/u, modelName);
      assert.match(model, /@@index\(\[tenantId/u, modelName);
    }
    assert.match(schema, /@relation\(fields: \[leadId, tenantId\], references: \[id, tenantId\]/u);
  });
});
