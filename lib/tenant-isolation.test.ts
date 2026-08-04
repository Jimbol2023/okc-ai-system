import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import { createDbLead, getDbLeadById, listDbLeads, setLeadDatabaseDependenciesForTest, updateDbLead } from "./leads-db";
import type { StoredLead } from "./leads-storage";
import { requireTenantId, resolvePublicIntakeTenant } from "./tenant-context";

const alpha = { tenantId: "tenant-alpha" } as const;
const beta = { tenantId: "tenant-beta" } as const;
const restores: Array<() => void> = [];

afterEach(() => {
  while (restores.length) restores.pop()?.();
});

function storedLead(id: string, address: string): StoredLead {
  return {
    id,
    timestamp: "2026-08-04T12:00:00.000Z",
    firstName: "Synthetic",
    lastName: id,
    email: `${id}@example.invalid`,
    phone: "4055550100",
    propertyAddress: address,
    city: "Oklahoma City",
    state: "OK",
    zipCode: "73102",
    ownerName: "Synthetic Owner",
    mailingAddress: address,
    county: "Oklahoma",
    parcelId: `parcel-${id}`,
    situationDetails: "Synthetic isolation fixture",
    source: "synthetic_test",
    status: "new",
    notes: [],
    followUps: [],
    analyzer: { arv: "", estimatedRepairs: "", desiredProfit: "20000" },
    distressFlags: {
      taxDelinquent: false,
      inheritedProperty: false,
      vacantProperty: false,
      foreclosureRisk: false,
      majorRepairs: false,
      tiredLandlord: false,
      urgentTimeline: false,
      outOfStateOwner: false,
    },
    opportunityScore: "Low",
    score: 10,
    priority: "Low",
    scoreBreakdown: "synthetic",
  };
}

function dbLead(tenantId: string, lead: StoredLead) {
  return {
    id: lead.id,
    tenantId,
    name: `${lead.firstName} ${lead.lastName}`,
    phone: lead.phone,
    propertyAddress: lead.propertyAddress,
    source: lead.source,
    status: lead.status,
    score: lead.score,
    priority: lead.priority,
    notes: null,
    payload: JSON.stringify(lead),
    lastContactedAt: null,
    nextFollowUpAt: null,
    followUpCount: 0,
    lastFollowUpMessage: null,
    automationStatus: "idle",
    approvalStatus: "pending_review",
    isHot: false,
    lastSellerReply: null,
    lastSellerReplyAt: null,
    lastSellerReplyIntent: null,
    lastSellerReplyConfidence: null,
    suggestedReply: null,
    requiresHumanApproval: false,
    doNotContact: false,
    optOutReason: null,
    optOutAt: null,
    createdAt: new Date(lead.timestamp),
    updatedAt: new Date(lead.timestamp),
  };
}

describe("tenant-scoped lead data access", () => {
  it("allows Alpha to list only Alpha leads and cannot read a Beta lead by identifier", async () => {
    const alphaLead = storedLead("alpha-lead", "100 Alpha Ave");
    const betaLead = storedLead("beta-lead", "200 Beta Blvd");
    const records = [dbLead(alpha.tenantId, alphaLead), dbLead(beta.tenantId, betaLead)];
    const queries: unknown[] = [];
    const db = {
      lead: {
        async findMany(args: { where: { tenantId: string } }) {
          queries.push(args);
          return records.filter((record) => record.tenantId === args.where.tenantId);
        },
        async findFirst(args: { where: { id?: string; tenantId: string } }) {
          queries.push(args);
          return records.find((record) => record.id === args.where.id && record.tenantId === args.where.tenantId) ?? null;
        },
      },
    };
    restores.push(setLeadDatabaseDependenciesForTest({ db: db as never }));

    assert.deepEqual((await listDbLeads(alpha)).map((lead) => lead.id), ["alpha-lead"]);
    assert.equal(await getDbLeadById(alpha, "beta-lead"), null);
    assert.ok(queries.every((query) => JSON.stringify(query).includes("tenant-alpha")));
  });

  it("cannot update a Beta lead from Alpha and never reaches the mutation", async () => {
    let updateCalls = 0;
    const db = {
      lead: {
        async findFirst() { return null; },
        async update() { updateCalls += 1; throw new Error("must_not_run"); },
      },
    };
    restores.push(setLeadDatabaseDependenciesForTest({ db: db as never }));

    await assert.rejects(updateDbLead(alpha, storedLead("beta-lead", "200 Beta Blvd")), /tenant_scoped_lead_not_found/);
    assert.equal(updateCalls, 0);
  });

  it("does not deduplicate Alpha against Beta and records Alpha on create, sync, and audit boundaries", async () => {
    const incoming = storedLead("alpha-new", "Shared Address");
    const created = dbLead(alpha.tenantId, incoming);
    const observed: { where?: unknown; createTenant?: string; syncTenant?: string } = {};
    const db = {
      lead: {
        async findFirst(args: { where: unknown }) { observed.where = args.where; return null; },
        async create(args: { data: { tenantId: string } }) { observed.createTenant = args.data.tenantId; return created; },
      },
    };
    restores.push(setLeadDatabaseDependenciesForTest({
      db: db as never,
      audit: (async () => { throw new Error("unexpected_dedupe_audit"); }) as never,
      sync: (async (input: { tenantId: string }) => { observed.syncTenant = input.tenantId; }) as never,
    }));

    const result = await createDbLead(alpha, incoming);
    assert.equal(result.created, true);
    assert.deepEqual(observed.where, { tenantId: "tenant-alpha", propertyAddress: "Shared Address", phone: "4055550100" });
    assert.equal(observed.createTenant, "tenant-alpha");
    assert.equal(observed.syncTenant, "tenant-alpha");
  });

  it("fails closed for missing tenant identity and requires an explicit public-intake mapping", () => {
    assert.throws(() => requireTenantId(undefined, "authenticated_workflow"), /tenant_id_required/);
    assert.throws(() => requireTenantId("default/ambiguous", "authenticated_workflow"), /tenant_id_invalid/);
    assert.throws(() => resolvePublicIntakeTenant({}), /tenant_id_required/);
    assert.equal(resolvePublicIntakeTenant({ PUBLIC_INTAKE_TENANT_ID: beta.tenantId }), beta.tenantId);
  });
});
