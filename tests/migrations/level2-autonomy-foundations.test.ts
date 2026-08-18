import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const sql = readFileSync("prisma/migrations/20260818190000_add_level2_autonomy_foundations_canonical/migration.sql", "utf8");

test("canonical Level-2 migration is additive and dormant", () => {
  for (const table of ["AutonomyPolicy", "ConnectorExecutionAttempt", "BusinessOutcomeEvent", "AutonomousRunRecord", "DepartmentSLA"]) assert.match(sql, new RegExp(`CREATE TABLE "${table}"`));
  assert.doesNotMatch(sql, /(?:UPDATE|DELETE FROM|ALTER TABLE)\s+"?(?:Lead|PropertyOpportunity)"?/i);
  assert.match(sql, /'deny', true, 50, true/);
  assert.match(sql, /Foundation is disabled at Level 1/);
});
