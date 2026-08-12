import assert from "node:assert/strict";
import { test } from "node:test";

import type { StoredLead } from "@/lib/leads-storage";
import {
  createRealOperationsReadinessReport,
  parseRealOperationsActivationRequest,
  realOperationsProductionApprovalPhrase,
} from "@/lib/real-operations-activation";

const lead = {
  id: "real-lead",
  source: "website_form",
  sourceDetail: "seller intake",
  propertyAddress: "123 Main St",
  city: "Oklahoma City",
  state: "OK",
  zipCode: "73102",
  parcelId: "",
  county: "Oklahoma",
} as StoredLead;

function readinessDb(options: { migration?: boolean; tables?: boolean } = {}) {
  const { migration = true, tables = true } = options;
  return {
    propertyOpportunity: { async count() { return 0; } },
    async $queryRawUnsafe(query: string, tenantId?: string) {
      if (query.includes("information_schema.tables")) {
        return tables
          ? ["Lead", "PropertyOpportunity", "PropertyOpportunitySavedFilter", "RevenueTask", "RevenueAuditEvent"].map((table_name) => ({ table_name }))
          : [{ table_name: "Lead" }];
      }
      if (query.includes("_prisma_migrations")) return migration ? [{ migration_name: "20260807160000_add_property_opportunity_engine", finished: true, rolled_back: false }] : [];
      assert.equal(tenantId, "default");
      return [{ total: 0 }];
    },
  };
}

test("aggregate readiness certifies only the authenticated canonical tenant with real eligible inventory", async () => {
  const report = await createRealOperationsReadinessReport({ db: readinessDb(), tenantId: "default", leads: [lead], environment: "preview" });
  assert.equal(report.classification, "REAL_OPERATIONS_DRY_RUN_READY");
  assert.equal(report.readyForProductionAuthorization, true);
  assert.equal(report.exactApprovalPhrase, realOperationsProductionApprovalPhrase);
  assert.equal(report.inventory.eligiblePropertyLeads, 1);
  assert.equal(report.providerCalled, false);
  assert.equal(report.externalExecutionAllowed, false);
});

test("aggregate readiness blocks noncanonical tenants, missing schema, and ambiguous inventory", async () => {
  const wrongTenant = await createRealOperationsReadinessReport({ db: readinessDb(), tenantId: "other", leads: [lead] });
  const missingSchema = await createRealOperationsReadinessReport({ db: readinessDb({ tables: false }), tenantId: "default", leads: [lead] });
  const ambiguous = await createRealOperationsReadinessReport({ db: readinessDb(), tenantId: "default", leads: [{ ...lead, source: "unknown" }] });

  assert.equal(wrongTenant.readyForProductionAuthorization, false);
  assert.equal(missingSchema.persistence.schemaReady, false);
  assert.equal(ambiguous.inventory.ambiguousLeads, 1);
  assert.equal(ambiguous.exactApprovalPhrase, null);
});

test("activation request cannot override authenticated tenant and defaults to no-write dry run", () => {
  assert.deepEqual(parseRealOperationsActivationRequest({}), { ok: true, mode: "dry_run", confirmation: null });
  assert.deepEqual(parseRealOperationsActivationRequest({ tenantId: "other", mode: "execute" }), {
    ok: false,
    status: 400,
    error: "Tenant is derived from the authenticated session.",
  });
  assert.equal(parseRealOperationsActivationRequest({ mode: "unknown" }).ok, false);
});
