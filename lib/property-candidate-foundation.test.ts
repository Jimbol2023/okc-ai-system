import assert from "node:assert/strict";
import { test } from "node:test";

import type { StoredLead } from "@/lib/leads-storage";
import {
  assertPropertyCandidateSafety,
  assertPropertyCandidateSourceAllowed,
  createPropertyCandidate,
  createPropertyCandidateInputFromCountyRecord,
  createPropertyCandidateInputFromManualDfd,
  createPropertyCandidateQueue,
  createPropertyCandidateDuplicateKey,
  enabledPropertyCandidateSources,
  promotePropertyCandidate,
  propertyCandidateSafetyFlags,
  reviewPropertyCandidate,
  type PropertyCandidateDb,
  type PropertyCandidateRecord,
} from "@/lib/property-candidate-foundation";
import {
  createPropertyOpportunityDuplicateKey,
  propertyOpportunitySafetyFlags,
  scorePropertyOpportunity,
  type PropertyOpportunityDb,
  type PropertyOpportunityRecord,
} from "@/lib/property-opportunity-engine";

type TenantLead = StoredLead & { tenantId?: string };

function candidate(overrides: Partial<PropertyCandidateRecord> = {}): PropertyCandidateRecord {
  return {
    id: "candidate-1",
    tenantId: "tenant-alpha",
    source: "manual_virtual_dfd",
    sourceDetail: "Manual DFD evidence.",
    sourceRecordId: null,
    propertyAddress: "123 Candidate Ave",
    normalizedAddress: "123 candidate ave, oklahoma city, ok, 73102",
    city: "Oklahoma City",
    state: "OK",
    zipCode: "73102",
    county: "Oklahoma",
    parcelId: "P-123",
    latitude: null,
    longitude: null,
    coordinateSource: null,
    ownerName: "Candidate Owner",
    mailingAddress: "PO Box 1, Edmond, OK",
    sourceEvidence: { sourceLabel: "test" },
    observations: [{ observedAt: "2026-08-16", note: "Manual review evidence.", condition: "manual", source: "manual_virtual_dfd" }],
    distressIndicators: ["vacantProperty", "majorRepairs", "taxDelinquent", "outOfStateOwner"],
    confidence: 86,
    duplicateKey: "parcel:oklahoma:p-123",
    duplicateStatus: "unique",
    providerName: null,
    providerRequestId: null,
    retrievedAt: null,
    costCents: 0,
    creditsUsed: 0,
    reviewStatus: "new",
    createdBy: "tester",
    providerCalled: false,
    providerWrite: false,
    sent: false,
    published: false,
    outreach: false,
    crmMutated: false,
    skipTracePerformed: false,
    directMailSent: false,
    externalExecutionAllowed: false,
    liveExecutionAllowed: false,
    createdAt: "2026-08-16T21:00:00.000Z",
    updatedAt: "2026-08-16T21:00:00.000Z",
    ...overrides,
  };
}

function opportunity(overrides: Partial<PropertyOpportunityRecord> = {}): PropertyOpportunityRecord {
  return {
    id: "opportunity-1",
    tenantId: "tenant-alpha",
    canonicalAddress: "123 candidate ave, oklahoma city, ok 73102",
    propertyAddress: "123 Candidate Ave",
    city: "Oklahoma City",
    state: "OK",
    zipCode: "73102",
    county: "Oklahoma",
    parcelId: "P-123",
    ownerName: "Candidate Owner",
    mailingAddress: "PO Box 1, Edmond, OK",
    source: "property_candidate_manual_virtual_dfd",
    sourceDetail: "Verified candidate.",
    evidence: {},
    distressIndicators: ["vacantProperty"],
    observations: [],
    photoMetadata: [],
    opportunityScore: 80,
    opportunityPriority: "High",
    confidence: 82,
    duplicateKey: "parcel:oklahoma:p-123",
    duplicateRisk: false,
    missingEvidence: [],
    recommendedAction: "Create an approval-required acquisition review task for this property opportunity.",
    safetyFlags: propertyOpportunitySafetyFlags,
    providerCalled: false,
    sent: false,
    published: false,
    crmMutated: false,
    liveExecutionAllowed: false,
    createdBy: "tester",
    createdAt: "2026-08-16T21:00:00.000Z",
    updatedAt: "2026-08-16T21:00:00.000Z",
    ...overrides,
  };
}

function lead(overrides: Partial<TenantLead> = {}): TenantLead {
  return {
    id: "lead-1",
    timestamp: "2026-08-16T21:00:00.000Z",
    firstName: "Lead",
    lastName: "Owner",
    email: "",
    phone: "",
    propertyAddress: "123 Candidate Ave",
    city: "Oklahoma City",
    state: "OK",
    zipCode: "73102",
    ownerName: "Lead Owner",
    mailingAddress: "PO Box 1, Edmond, OK",
    county: "Oklahoma",
    parcelId: "P-123",
    situationDetails: "Seller provenance exists.",
    source: "website_form",
    status: "new",
    notes: [],
    followUps: [],
    analyzer: { arv: "", estimatedRepairs: "", desiredProfit: "" },
    distressFlags: {},
    opportunityScore: "Low",
    score: 0,
    priority: "Low",
    scoreBreakdown: "",
    ...overrides,
  };
}

function createMockCandidateDb(seed: {
  candidates?: PropertyCandidateRecord[];
  leads?: TenantLead[];
  opportunities?: PropertyOpportunityRecord[];
} = {}): PropertyCandidateDb & {
  candidates: PropertyCandidateRecord[];
  leads: TenantLead[];
  opportunities: PropertyOpportunityRecord[];
  audits: Array<{ action: string; safeMetadata?: unknown }>;
} {
  const candidates = [...(seed.candidates ?? [])];
  const leads = [...(seed.leads ?? [])];
  const opportunities = [...(seed.opportunities ?? [])];
  const audits: Array<{ action: string; safeMetadata?: unknown }> = [];

  return {
    candidates,
    leads,
    opportunities,
    audits,
    propertyCandidate: {
      async findMany(args) {
        return candidates.filter((item) => !args.where?.tenantId || item.tenantId === args.where.tenantId);
      },
      async findFirst(args) {
        const where = args.where ?? {};
        return candidates.find((item) => (!where.id || item.id === where.id) && (!where.tenantId || item.tenantId === where.tenantId) && (!where.duplicateKey || item.duplicateKey === where.duplicateKey)) ?? null;
      },
      async create(args) {
        const created = {
          ...args.data,
          id: `candidate-${candidates.length + 1}`,
          createdAt: "2026-08-16T21:00:00.000Z",
          updatedAt: "2026-08-16T21:00:00.000Z",
        };
        candidates.push(created);
        return created;
      },
      async update(args) {
        const existing = candidates.find((item) => item.id === args.where.id && item.tenantId === args.where.tenantId);
        if (!existing) throw new Error("missing candidate in mock");
        Object.assign(existing, args.data, { updatedAt: "2026-08-16T22:00:00.000Z" });
        return existing;
      },
    },
    lead: {
      async findFirst(args) {
        return leads.find((item) => item.tenantId === args.where?.tenantId && item.propertyAddress === args.where?.propertyAddress) ?? null;
      },
      async create(args) {
        const created = lead({
          id: `lead-${leads.length + 1}`,
          tenantId: String(args.data.tenantId),
          propertyAddress: String(args.data.propertyAddress),
          source: String(args.data.source),
        });
        leads.push(created);
        return { id: created.id };
      },
    },
    propertyOpportunity: {
      async findFirst(args) {
        return opportunities.find((item) => item.tenantId === args.where?.tenantId && (item.duplicateKey === args.where?.duplicateKey || item.propertyAddress === args.where?.propertyAddress)) ?? null;
      },
    },
    revenueAuditEvent: {
      async create(args) {
        audits.push({ action: String(args.data.action), safeMetadata: args.data.safeMetadata });
        return { id: `audit-${audits.length}` };
      },
    },
  };
}

function createMockOpportunityDb(records: PropertyOpportunityRecord[] = []): PropertyOpportunityDb & { opportunities: PropertyOpportunityRecord[]; tasks: unknown[] } {
  const opportunities = records;
  const tasks: unknown[] = [];

  return {
    opportunities,
    tasks,
    propertyOpportunity: {
      async findMany(args: { where?: { tenantId?: string } }) {
        return opportunities.filter((item) => !args.where?.tenantId || item.tenantId === args.where.tenantId);
      },
      async findFirst(args: { where?: { id?: string; tenantId?: string; duplicateKey?: string } }) {
        const where = args.where ?? {};
        return opportunities.find((item) => (!where.id || item.id === where.id) && (!where.tenantId || item.tenantId === where.tenantId) && (!where.duplicateKey || item.duplicateKey === where.duplicateKey)) ?? null;
      },
      async upsert(args) {
        const existing = opportunities.find((item) => item.tenantId === args.where.tenantId_duplicateKey.tenantId && item.duplicateKey === args.where.tenantId_duplicateKey.duplicateKey);
        if (existing) {
          Object.assign(existing, args.update);
          return existing;
        }
        const created = {
          ...args.create,
          id: `opportunity-${opportunities.length + 1}`,
          createdAt: "2026-08-16T21:00:00.000Z",
          updatedAt: "2026-08-16T21:00:00.000Z",
        };
        opportunities.push(created);
        return created;
      },
      async update() {
        throw new Error("opportunity update not used");
      },
    },
    propertyOpportunitySavedFilter: {
      async findMany() {
        return [];
      },
      async upsert() {
        throw new Error("filter upsert not used");
      },
    },
    revenueTask: {
      async findFirst() {
        return null;
      },
      async create(args: { data: Record<string, unknown> }) {
        tasks.push(args.data);
        return { id: `task-${tasks.length}` };
      },
    },
  };
}

const manualDfdInput = {
  propertyAddress: "123 Candidate Ave",
  city: "Oklahoma City",
  state: "OK",
  zipCode: "73102",
  county: "Oklahoma",
  parcelId: "P-123",
  ownerName: "Candidate Owner",
  mailingAddress: "PO Box 1, Edmond, OK",
  source: "manual_dfd",
  sourceDetail: "Manual virtual DFD observation.",
  distressFlags: { vacantProperty: true, majorRepairs: true, taxDelinquent: true, outOfStateOwner: true },
  observations: [{ observedAt: "2026-08-16", note: "Overgrown yard and boarded window.", condition: "manual_observation", source: "manual_dfd" }],
  photoMetadata: [],
  evidence: { sourceLabel: "manual_dfd_test" },
};

test("candidate creation from manual DFD stages only a PropertyCandidate", async () => {
  const db = createMockCandidateDb();
  const result = await createPropertyCandidate(db, createPropertyCandidateInputFromManualDfd(manualDfdInput), { tenantId: "tenant-alpha", actorId: "tester" });

  assert.equal(result.candidate.source, "manual_virtual_dfd");
  assert.equal(result.candidate.duplicateStatus, "unique");
  assert.equal(result.candidate.reviewStatus, "new");
  assert.equal(result.candidate.costCents, 0);
  assert.equal(result.candidate.creditsUsed, 0);
  assert.equal(db.candidates.length, 1);
  assert.equal(db.leads.length, 0);
  assert.equal(db.opportunities.length, 0);
  assert.equal(result.providerCalled, false);
  assert.equal(result.providerWrite, false);
  assert.equal(result.outreach, false);
  assert.equal(result.skipTracePerformed, false);
  assert.equal(result.directMailSent, false);
  assert.equal(result.externalExecutionAllowed, false);
  assert.equal(result.liveExecutionAllowed, false);
  assert.deepEqual(propertyCandidateSafetyFlags, {
    providerCalled: false,
    providerWrite: false,
    sent: false,
    published: false,
    outreach: false,
    crmMutated: false,
    skipTracePerformed: false,
    directMailSent: false,
    externalExecutionAllowed: false,
    liveExecutionAllowed: false,
  });
});

test("candidate creation from county evidence does not call providers or create downstream records", async () => {
  const db = createMockCandidateDb();
  const result = await createPropertyCandidate(db, createPropertyCandidateInputFromCountyRecord({
    propertyAddress: "456 County Ave",
    city: "Oklahoma City",
    state: "OK",
    zipCode: "73103",
    county: "Oklahoma",
    parcelId: "P-456",
    ownerName: "County Owner",
    mailingAddress: "PO Box 456, Tulsa, OK",
    taxStatus: "delinquent",
    assessedValue: 99000,
    lastSaleDate: "2021-04-01",
    yearBuilt: 1960,
    squareFeet: 1000,
    bedrooms: 3,
    bathrooms: 1,
    propertyType: "single_family",
    routeName: "Manual County Route",
    latitude: 35.5,
    longitude: -97.5,
    notes: ["County row imported by operator."],
    photoMetadata: [],
    distressFlags: {},
  }), { tenantId: "tenant-alpha" });

  assert.equal(result.candidate.source, "county_import");
  assert.equal(result.candidate.coordinateSource, "manual_import");
  assert.equal(result.candidate.distressIndicators.includes("taxDelinquent"), true);
  assert.equal(db.leads.length, 0);
  assert.equal(db.opportunities.length, 0);
  assert.equal(result.providerCalled, false);
  assert.equal(result.liveExecutionAllowed, false);
});

test("tenant isolation keeps duplicate detection scoped to the active tenant", async () => {
  const db = createMockCandidateDb({
    candidates: [candidate({ tenantId: "tenant-beta", duplicateKey: "parcel:oklahoma:p-123" })],
  });
  const result = await createPropertyCandidate(db, createPropertyCandidateInputFromManualDfd(manualDfdInput), { tenantId: "tenant-alpha" });

  assert.equal(result.duplicateStatus, "unique");
  assert.equal(db.candidates.filter((item) => item.tenantId === "tenant-alpha").length, 1);
});

test("duplicate doctrine prefers parcel identity and falls back to address identity", () => {
  assert.equal(createPropertyCandidateDuplicateKey(manualDfdInput), "parcel:oklahoma:p-123");
  assert.equal(createPropertyCandidateDuplicateKey({ ...manualDfdInput, parcelId: "" }), "address:123 candidate ave, oklahoma city, ok, 73102");
  assert.equal(createPropertyOpportunityDuplicateKey(manualDfdInput), createPropertyCandidateDuplicateKey(manualDfdInput));
});

test("duplicate candidate detection creates a second record and never silently merges", async () => {
  const existing = candidate();
  const db = createMockCandidateDb({ candidates: [existing] });
  const result = await createPropertyCandidate(db, createPropertyCandidateInputFromManualDfd(manualDfdInput), { tenantId: "tenant-alpha" });

  assert.equal(result.duplicateStatus, "duplicate_candidate");
  assert.equal(result.candidate.reviewStatus, "needs_verification");
  assert.equal(db.candidates.length, 2);
  assert.notEqual(db.candidates[0]?.id, db.candidates[1]?.id);
  assert.ok(db.audits.some((audit) => audit.action === "candidate_duplicate_detected"));
});

test("duplicate Lead and duplicate PropertyOpportunity are detected before candidate promotion", async () => {
  const leadDb = createMockCandidateDb({ leads: [lead({ tenantId: "tenant-alpha" })] });
  const leadDuplicate = await createPropertyCandidate(leadDb, createPropertyCandidateInputFromManualDfd(manualDfdInput), { tenantId: "tenant-alpha" });

  assert.equal(leadDuplicate.duplicateStatus, "duplicate_existing_lead");

  const opportunityDb = createMockCandidateDb({ opportunities: [opportunity()] });
  const opportunityDuplicate = await createPropertyCandidate(opportunityDb, createPropertyCandidateInputFromManualDfd(manualDfdInput), { tenantId: "tenant-alpha" });

  assert.equal(opportunityDuplicate.duplicateStatus, "duplicate_existing_opportunity");
});

test("conflicting parcel and address states require human resolution", async () => {
  const conflictingParcelDb = createMockCandidateDb({
    candidates: [candidate({ duplicateKey: "parcel:oklahoma:p-123", normalizedAddress: "999 other ave, oklahoma city, ok 73102" })],
  });
  const conflictingParcel = await createPropertyCandidate(conflictingParcelDb, createPropertyCandidateInputFromManualDfd({
    ...manualDfdInput,
    propertyAddress: "999 Other Ave",
    parcelId: "P-123",
  }), { tenantId: "tenant-alpha" });

  assert.equal(conflictingParcel.duplicateStatus, "duplicate_candidate");

  const conflictingAddressDb = createMockCandidateDb({
    candidates: [candidate({ duplicateKey: "parcel:oklahoma:p-999", parcelId: "P-999" })],
  });
  const conflictingAddress = await createPropertyCandidate(conflictingAddressDb, createPropertyCandidateInputFromManualDfd({
    ...manualDfdInput,
    parcelId: "P-321",
  }), { tenantId: "tenant-alpha" });

  assert.equal(conflictingAddress.duplicateStatus, "conflicting_address");
});

test("promotion requires verified unique candidate and preserves no automatic Lead or Opportunity creation", async () => {
  const candidateDb = createMockCandidateDb({ candidates: [candidate()] });
  const opportunityDb = createMockOpportunityDb();

  await assert.rejects(
    () => promotePropertyCandidate(candidateDb, opportunityDb, "candidate-1", { path: "property_only", sellerProvenance: {} }, { tenantId: "tenant-alpha" }),
    /property_candidate_promotion_requires_verified_unique_candidate/,
  );

  assert.equal(opportunityDb.opportunities.length, 0);
  assert.equal(candidateDb.leads.length, 0);

  const reviewed = await reviewPropertyCandidate(candidateDb, "candidate-1", { reviewStatus: "verified_candidate" }, { tenantId: "tenant-alpha" });
  assert.equal(reviewed.candidate.reviewStatus, "verified_candidate");
});

test("property-only promotion creates a PropertyOpportunity only after verification and no task creation", async () => {
  const candidateDb = createMockCandidateDb({ candidates: [candidate({ reviewStatus: "verified_candidate" })] });
  const opportunityDb = createMockOpportunityDb();
  const result = await promotePropertyCandidate(candidateDb, opportunityDb, "candidate-1", { path: "property_only", sellerProvenance: {} }, { tenantId: "tenant-alpha" });

  assert.equal(result.promotedTarget.targetType, "PropertyOpportunity");
  assert.equal(opportunityDb.opportunities.length, 1);
  assert.equal(opportunityDb.tasks.length, 0);
  assert.equal(candidateDb.leads.length, 0);
  assert.equal(result.providerCalled, false);
  assert.equal(result.crmMutated, false);
  assert.equal(result.outreach, false);
  assert.equal(result.liveExecutionAllowed, false);
});

test("seller-provenance promotion creates a Lead only after explicit provenance", async () => {
  const candidateDb = createMockCandidateDb({ candidates: [candidate({ reviewStatus: "verified_candidate" })] });
  const opportunityDb = createMockOpportunityDb();

  await assert.rejects(
    () => promotePropertyCandidate(candidateDb, opportunityDb, "candidate-1", { path: "seller_provenance", sellerProvenance: {} }, { tenantId: "tenant-alpha" }),
    /seller_provenance_required_for_lead_promotion/,
  );

  const result = await promotePropertyCandidate(candidateDb, opportunityDb, "candidate-1", {
    path: "seller_provenance",
    sellerProvenance: { provenanceType: "inbound_form", sourceRecordId: "form-1" },
  }, { tenantId: "tenant-alpha" });

  assert.equal(result.promotedTarget.targetType, "Lead");
  assert.equal(candidateDb.leads.length, 1);
  assert.equal(opportunityDb.opportunities.length, 0);
  assert.equal(result.outreach, false);
});

test("existing >=72 acquisition threshold is preserved without mutating the score model", () => {
  const score = scorePropertyOpportunity(manualDfdInput);

  assert.ok(score.opportunityScore >= 72);
  assert.equal(score.opportunityPriority, "High");
  assert.match(score.recommendedAction, /acquisition review task/i);
});

test("reserved provider sources and unsafe safety fields are blocked", async () => {
  for (const source of enabledPropertyCandidateSources) {
    assert.doesNotThrow(() => assertPropertyCandidateSourceAllowed(source));
  }
  assert.throws(() => assertPropertyCandidateSourceAllowed("google_geocode"), /property_candidate_source_reserved:google_geocode/);
  assert.throws(() => assertPropertyCandidateSourceAllowed("google_street_view"), /property_candidate_source_reserved:google_street_view/);
  assert.throws(() => assertPropertyCandidateSourceAllowed("dealmachine_property_search"), /property_candidate_source_reserved:dealmachine_property_search/);
  assert.throws(() => assertPropertyCandidateSafety({ ...candidate(), providerCalled: true }), /PropertyCandidate must remain internal-only/);
});

test("queue ranks candidates without provider calls, provider writes, outreach, skip trace, direct mail, or external execution", () => {
  const queue = createPropertyCandidateQueue([
    candidate({ id: "safe", duplicateStatus: "unique" }),
    candidate({ id: "duplicate", duplicateStatus: "duplicate_candidate" }),
  ], "2026-08-16T22:00:00.000Z");

  assert.equal(queue.totals.new, 2);
  assert.equal(queue.totals.duplicateOrConflict, 1);
  assert.equal(queue.providerCalled, false);
  assert.equal(queue.providerWrite, false);
  assert.equal(queue.outreach, false);
  assert.equal(queue.skipTracePerformed, false);
  assert.equal(queue.directMailSent, false);
  assert.equal(queue.externalExecutionAllowed, false);
  assert.equal(queue.liveExecutionAllowed, false);
  assert.ok(queue.ranked.every((item) => item.providerCalled === false && item.liveExecutionAllowed === false));
});
