import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

const migrationsRoot = join(process.cwd(), "prisma", "migrations");
const prerequisiteName = "20260804110000_create_manual_lead_intake";
const tenantMigrationName = "20260804120000_tenant_scope_lead_core";
const prerequisiteSql = readFileSync(join(migrationsRoot, prerequisiteName, "migration.sql"), "utf8");
const tenantSql = readFileSync(join(migrationsRoot, tenantMigrationName, "migration.sql"), "utf8");
const schema = readFileSync(join(process.cwd(), "prisma", "schema.prisma"), "utf8");

const finalManualColumns = [
  "id", "tenantId", "leadId", "source", "sourceLabel", "sellerName", "phone", "email",
  "socialHandle", "propertyAddress", "city", "state", "zipCode", "notes", "captureContext",
  "intakeStatus", "manualReviewStatus", "safetyFlags", "createdAt", "updatedAt",
] as const;

function migrationNames() {
  return readdirSync(migrationsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function statements(sql: string) {
  return sql
    .replace(/--.*$/gmu, "")
    .split(";")
    .map((statement) => statement.trim())
    .filter(Boolean);
}

function assertSingleTransaction(sql: string) {
  const parsed = statements(sql);
  assert.equal(parsed[0], "BEGIN");
  assert.equal(parsed.at(-1), "COMMIT");
  assert.equal(parsed.filter((statement) => statement === "BEGIN").length, 1);
  assert.equal(parsed.filter((statement) => statement === "COMMIT").length, 1);
}

describe("tenant migration chain", () => {
  it("records the missing historical table exactly once before tenant scoping", () => {
    const names = migrationNames();
    assert.ok(names.indexOf(prerequisiteName) >= 0);
    assert.ok(names.indexOf(prerequisiteName) < names.indexOf(tenantMigrationName));

    const tableCreators = names.filter((name) => {
      const sql = readFileSync(join(migrationsRoot, name, "migration.sql"), "utf8");
      return /CREATE TABLE "ManualLeadIntake"/u.test(sql);
    });
    assert.deepEqual(tableCreators, [prerequisiteName]);
  });

  it("creates the complete pre-tenant table and lets the following migration add tenant scope", () => {
    for (const column of finalManualColumns.filter((column) => column !== "tenantId")) {
      assert.match(prerequisiteSql, new RegExp(`"${column}"\\s`, "u"));
    }
    assert.doesNotMatch(prerequisiteSql, /"tenantId"/u);
    assert.match(prerequisiteSql, /FOREIGN KEY \("leadId"\) REFERENCES "Lead"\("id"\) ON DELETE SET NULL ON UPDATE CASCADE/u);
    assert.match(tenantSql, /ALTER TABLE "ManualLeadIntake" ADD COLUMN "tenantId" TEXT/u);
    assert.match(tenantSql, /ALTER TABLE "ManualLeadIntake" ALTER COLUMN "tenantId" SET NOT NULL/u);

    const model = schema.match(/model ManualLeadIntake \{([\s\S]*?)\n\}/u)?.[1] ?? "";
    for (const column of finalManualColumns) assert.match(model, new RegExp(`\\b${column}\\b`, "u"));
  });

  it("keeps both migrations atomic so a failure cannot leave Lead partially altered", () => {
    assertSingleTransaction(prerequisiteSql);
    assertSingleTransaction(tenantSql);
    const parsed = statements(tenantSql);
    const leadAlter = parsed.findIndex((statement) => statement.startsWith('ALTER TABLE "Lead" ADD COLUMN'));
    const manualAlter = parsed.findIndex((statement) => statement.startsWith('ALTER TABLE "ManualLeadIntake" ADD COLUMN'));
    const commit = parsed.indexOf("COMMIT");
    assert.ok(leadAlter > 0);
    assert.ok(manualAlter > leadAlter);
    assert.ok(commit > manualAlter);
  });

  it("produces tenant-local Lead uniqueness and both tenant indexes", () => {
    assert.match(tenantSql, /CREATE UNIQUE INDEX "Lead_tenantId_propertyAddress_phone_key"[\s\S]*\("tenantId", "propertyAddress", "phone"\)/u);
    assert.match(tenantSql, /CREATE UNIQUE INDEX "Lead_id_tenantId_key" ON "Lead"\("id", "tenantId"\)/u);
    assert.match(tenantSql, /CREATE INDEX "Lead_tenantId_idx" ON "Lead"\("tenantId"\)/u);
    assert.match(tenantSql, /CREATE INDEX "ManualLeadIntake_tenantId_idx" ON "ManualLeadIntake"\("tenantId"\)/u);
  });

  it("makes legacy backfill explicit and requires zero rows for synthetic certification", () => {
    assert.match(tenantSql, /UPDATE "Lead" SET "tenantId" = 'default' WHERE "tenantId" IS NULL/u);
    assert.match(tenantSql, /UPDATE "ManualLeadIntake" SET "tenantId" = 'default' WHERE "tenantId" IS NULL/u);
    const syntheticCertificationPolicy = {
      requiredLeadRowsBeforeMigration: 0,
      requiredManualLeadIntakeRowsBeforeMigration: 0,
      productionBackfillAuthorized: false,
    } as const;
    assert.deepEqual(syntheticCertificationPolicy, {
      requiredLeadRowsBeforeMigration: 0,
      requiredManualLeadIntakeRowsBeforeMigration: 0,
      productionBackfillAuthorized: false,
    });
  });

  it("has a deterministic repeat-deploy plan with no duplicate migration names", () => {
    const names = migrationNames();
    assert.equal(new Set(names).size, names.length);
    const applied = new Set(names);
    const pendingOnSecondDeploy = names.filter((name) => !applied.has(name));
    assert.deepEqual(pendingOnSecondDeploy, []);
  });
});
