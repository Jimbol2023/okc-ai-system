import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { getFeatureFlag } from "../../lib/feature-flags";
import { assertProfessionalCaseTransition, boundedScheduledProfessionalCaseBatch, professionalCaseStatuses, scheduledProfessionalCaseProductionCap } from "../../lib/professional-case-runtime";

test("professional case writes remain canary-gated and internal-only by default", () => {
  const flag = getFeatureFlag("professional_case_runtime");
  assert.equal(flag?.enabled, false);
  assert.equal(flag?.requiresAdminApproval, true);
  const governedFlagRuntime = readFileSync("lib/governed-feature-flags.ts", "utf8");
  assert.match(governedFlagRuntime, /tenantId_flagKey/);
  assert.match(governedFlagRuntime, /definition\.requiresAdminApproval && !record\.updatedBy/);
});

test("professional case lifecycle permits remediation but blocks unsafe skipping", () => {
  assert.deepEqual(professionalCaseStatuses, ["intake", "routed", "assigned", "working", "dependency_waiting", "qa_required", "executive_review", "decided", "outcome_due", "closed"]);
  assert.doesNotThrow(() => assertProfessionalCaseTransition("qa_required", "working"));
  assert.doesNotThrow(() => assertProfessionalCaseTransition("qa_required", "executive_review"));
  assert.throws(() => assertProfessionalCaseTransition("working", "decided"), /invalid_professional_case_transition/);
  assert.throws(() => assertProfessionalCaseTransition("closed", "working"), /invalid_professional_case_transition/);
});

test("scheduled internal production is capped at fifteen cases", () => {
  assert.equal(scheduledProfessionalCaseProductionCap, 15);
  assert.deepEqual(boundedScheduledProfessionalCaseBatch(Array.from({ length: 40 }, (_, index) => index)), Array.from({ length: 15 }, (_, index) => index));
});

test("professional case persistence has seven additive records and database tenant isolation", () => {
  const schema = readFileSync("prisma/schema.prisma", "utf8");
  for (const model of ["ProfessionalCase", "ProfessionalAssignment", "ProfessionalContribution", "ProfessionalReview", "ProfessionalDecision", "ProfessionalOutcome", "ProfessionalCaseEvent"]) {
    assert.match(schema, new RegExp(`model ${model} \\{`));
  }
  assert.match(schema, /@@unique\(\[id, tenantId\]\)/);
  assert.equal((schema.match(/@relation\(fields: \[caseId, tenantId\], references: \[id, tenantId\]/g) ?? []).length, 6);

  const migration = readFileSync("prisma/migrations/20260715120000_add_professional_case_runtime/migration.sql", "utf8");
  assert.equal((migration.match(/FOREIGN KEY \("caseId", "tenantId"\)/g) ?? []).length, 6);
  assert.match(migration, /ProfessionalCase_tenantId_idempotencyKey_key/);
  assert.match(migration, /ProfessionalAssignment_tenantId_status_leaseExpiresAt_idx/);
});

test("runtime uses atomic claims, independent QA, and never grants execution", () => {
  const runtime = readFileSync("lib/professional-case-runtime.ts", "utf8");
  assert.match(runtime, /professionalAssignment\.updateMany/);
  assert.match(runtime, /retryEvent/);
  assert.match(runtime, /self_review_blocked/);
  assert.match(runtime, /qa_pass_required_before_decision/);
  assert.match(runtime, /external_execution_authority_blocked/);
  assert.match(runtime, /executionAuthorized: false/);
  assert.match(runtime, /source_reference_or_data_gap_required/);
});
