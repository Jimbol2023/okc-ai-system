import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  createProductionSchemaAlignmentReadinessProof,
  productionSchemaAlignmentMigration,
  type ProductionSchemaAlignmentDepartmentKey,
} from "./production-schema-alignment-readiness";

const schemaColumns = productionSchemaAlignmentMigration.requiredColumns.map((columnName) => ({
  columnName,
  dataType: columnName === "version" ? "integer" : columnName === "reliability" ? "jsonb" : "text",
  isNullable: columnName === "version" || columnName === "contractVersion" ? "NO" : "YES",
  columnDefault: columnName === "version" ? "1" : columnName === "contractVersion" ? "'business-data-snapshot-v1'::text" : null,
}));
const departmentVerification = Object.fromEntries(
  ([
    "ceo_dashboard",
    "draft_workspace",
    "production_dry_run",
    "search_market_intelligence",
    "revenue_intelligence",
    "buyer_demand",
    "cross_connector_certification",
    "department_os_morning_brief",
  ] satisfies ProductionSchemaAlignmentDepartmentKey[]).map((key) => [key, "passed"]),
);
const backupEvidence = {
  pitrOrBackupEnabled: true,
  latestKnownRecoverablePoint: "2026-07-31T11:55:00.000Z",
  recoveryOwner: "CEO / operator",
  targetRto: "30 minutes",
  targetRpo: "5 minutes",
  rollbackDecisionAuthority: "CEO",
  applicationRollbackPath: "Redeploy previous production build after PITR decision.",
};

describe("production schema alignment readiness", () => {
  it("verifies the approved migration hash without execution", () => {
    const proof = createProductionSchemaAlignmentReadinessProof({
      generatedAt: new Date("2026-07-31T12:00:00.000Z"),
      verifierIdentity: "codex",
    });
    const serialized = JSON.stringify(proof);

    assert.equal(proof.migration.migrationId, "20260716100000_harden_business_data_snapshots");
    assert.equal(proof.actualSha256, productionSchemaAlignmentMigration.expectedSha256);
    assert.equal(proof.hashMatchesExpected, true);
    assert.equal(proof.verificationTimestamp, "2026-07-31T12:00:00.000Z");
    assert.equal(proof.safety.migrationExecuted, false);
    assert.equal(proof.safety.databaseAltered, false);
    assert.equal(proof.safety.providerCalled, false);
    assert.equal(proof.safety.crmMutationAllowed, false);
    assert.equal(proof.safety.publishingAllowed, false);
    assert.equal(proof.safety.outreachAllowed, false);
    assert.equal(proof.safety.scrapingAllowed, false);
    assert.equal(proof.safety.automationAllowed, false);
    assert.equal(proof.safety.syntheticDataCreationAllowed, false);
    assert.equal(proof.safety.credentialsExposed, false);
    assert.equal(serialized.includes("postgresql://"), false);
    assert.equal(serialized.includes("googleapis.com"), false);
    assert.equal(serialized.includes("twilio"), false);
  });

  it("stays blocked when approved hash record, ledger, schema, or recovery evidence is missing", () => {
    const proof = createProductionSchemaAlignmentReadinessProof({
      actualSha256: productionSchemaAlignmentMigration.expectedSha256,
    });

    assert.equal(proof.approvedHashRecord.locationFound, false);
    assert.equal(proof.approvedHashRecord.status, "not_applicable_no_registry_found");
    assert.equal(proof.productionLedger.state, "unknown");
    assert.equal(proof.currentSchema.inspected, false);
    assert.equal(proof.classification, "PRODUCTION_SCHEMA_ALIGNMENT_BLOCKED");
    assert.equal(proof.approvedHashRecord.status, "not_applicable_no_registry_found");
    assert.equal(proof.remainingBlockers.some((blocker) => blocker.includes("immutable migration-hash record")), false);
    assert.ok(proof.remainingBlockers.some((blocker) => blocker.includes("migration ledger")));
    assert.ok(proof.remainingBlockers.some((blocker) => blocker.includes("PITR")));
  });

  it("documents exact read-only and post-migration verification commands", () => {
    const proof = createProductionSchemaAlignmentReadinessProof({
      actualSha256: productionSchemaAlignmentMigration.expectedSha256,
    });

    assert.ok(proof.readOnlyOperatorCommands.some((command) => command.includes("prisma migrate status")));
    assert.ok(proof.readOnlyOperatorCommands.some((command) => command.includes("_prisma_migrations")));
    assert.ok(proof.readOnlyOperatorCommands.some((command) => command.includes("information_schema.columns")));
    assert.ok(proof.postMigrationVerificationCommands.some((command) => command.includes("BusinessDataSnapshot")));
    assert.equal(proof.proposedExecutionCommand, "npm.cmd exec prisma migrate deploy --schema prisma/schema.prisma");
  });

  it("routes absent target migration to ready_to_execute when all preflight evidence is complete", () => {
    const proof = createProductionSchemaAlignmentReadinessProof({
      actualSha256: productionSchemaAlignmentMigration.expectedSha256,
      operatorEvidence: {
        ledgerState: "absent",
        pendingMigrationsInOrder: ["20260716100000_harden_business_data_snapshots"],
        schemaColumns,
        ...backupEvidence,
      },
    });

    assert.equal(proof.currentSchema.requiredColumnsPresent, true);
    assert.equal(proof.recovery.pitrOrBackupEnabled, true);
    assert.deepEqual(proof.remainingBlockers, []);
    assert.equal(proof.readinessState, "ready_to_execute");
    assert.equal(proof.classification, "READY_FOR_PRODUCTION_SCHEMA_ALIGNMENT");
  });

  it("routes already-applied migrations to verify-only or complete based on department proof", () => {
    const verifyOnly = createProductionSchemaAlignmentReadinessProof({
      actualSha256: productionSchemaAlignmentMigration.expectedSha256,
      operatorEvidence: {
        ledgerState: "applied_successfully",
        pendingMigrationsInOrder: [],
        schemaColumns,
        postMigrationLedgerVerified: true,
        readOnlySnapshotSelectVerified: true,
        ...backupEvidence,
      },
    });
    const complete = createProductionSchemaAlignmentReadinessProof({
      actualSha256: productionSchemaAlignmentMigration.expectedSha256,
      operatorEvidence: {
        ledgerState: "applied_successfully",
        pendingMigrationsInOrder: [],
        schemaColumns,
        postMigrationLedgerVerified: true,
        readOnlySnapshotSelectVerified: true,
        departmentVerification,
        ...backupEvidence,
      },
    });

    assert.equal(verifyOnly.readinessState, "already_applied_verify_only");
    assert.equal(verifyOnly.classification, "READY_FOR_PRODUCTION_SCHEMA_ALIGNMENT");
    assert.equal(complete.readinessState, "complete");
    assert.equal(complete.classification, "READY_FOR_PRODUCTION_SCHEMA_ALIGNMENT");
  });

  it("blocks failed or rolled-back ledger evidence", () => {
    for (const ledgerState of ["failed", "rolled_back"] as const) {
      const proof = createProductionSchemaAlignmentReadinessProof({
        actualSha256: productionSchemaAlignmentMigration.expectedSha256,
        operatorEvidence: {
          ledgerState,
          schemaColumns,
          ...backupEvidence,
        },
      });

      assert.equal(proof.classification, "PRODUCTION_SCHEMA_ALIGNMENT_BLOCKED");
      assert.ok(proof.remainingBlockers.some((blocker) => blocker.includes(ledgerState === "failed" ? "failed" : "rolled back")));
    }
  });

  it("blocks hash mismatch missing backup and unexpected pending migration chains", () => {
    const hashMismatch = createProductionSchemaAlignmentReadinessProof({
      actualSha256: "BAD_HASH",
      operatorEvidence: {
        ledgerState: "absent",
        pendingMigrationsInOrder: ["20260716100000_harden_business_data_snapshots"],
        schemaColumns,
        ...backupEvidence,
      },
    });
    const missingBackup = createProductionSchemaAlignmentReadinessProof({
      actualSha256: productionSchemaAlignmentMigration.expectedSha256,
      operatorEvidence: {
        ledgerState: "absent",
        pendingMigrationsInOrder: ["20260716100000_harden_business_data_snapshots"],
        schemaColumns,
      },
    });
    const unexpectedChain = createProductionSchemaAlignmentReadinessProof({
      actualSha256: productionSchemaAlignmentMigration.expectedSha256,
      operatorEvidence: {
        ledgerState: "absent",
        pendingMigrationsInOrder: ["20260715120000_add_professional_case_runtime", "20260716100000_harden_business_data_snapshots"],
        schemaColumns,
        ...backupEvidence,
      },
    });

    assert.equal(hashMismatch.readinessState, "blocked");
    assert.ok(hashMismatch.remainingBlockers.some((blocker) => blocker.includes("SHA256")));
    assert.equal(missingBackup.readinessState, "blocked");
    assert.ok(missingBackup.remainingBlockers.some((blocker) => blocker.includes("PITR")));
    assert.equal(unexpectedChain.readinessState, "blocked");
    assert.ok(unexpectedChain.remainingBlockers.some((blocker) => blocker.includes("Pending migration chain")));
  });

  it("marks applied schema alignment as review_required when department verification fails", () => {
    const proof = createProductionSchemaAlignmentReadinessProof({
      actualSha256: productionSchemaAlignmentMigration.expectedSha256,
      operatorEvidence: {
        ledgerState: "applied_successfully",
        pendingMigrationsInOrder: [],
        schemaColumns,
        postMigrationLedgerVerified: true,
        readOnlySnapshotSelectVerified: true,
        departmentVerification: { ...departmentVerification, revenue_intelligence: "failed" },
        ...backupEvidence,
      },
    });

    assert.equal(proof.readinessState, "review_required");
    assert.equal(proof.classification, "PRODUCTION_SCHEMA_ALIGNMENT_BLOCKED");
    assert.ok(proof.remainingBlockers.some((blocker) => blocker.includes("department compatibility")));
  });
});
