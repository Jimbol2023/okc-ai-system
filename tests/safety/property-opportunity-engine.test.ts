import assert from "node:assert/strict";
import { test } from "node:test";

import {
  adaptExistingLeadsToPropertyOpportunities,
  assertPropertyOpportunityEngineSafety,
  classifyLeadProvenance,
  createExistingLeadEligibilityReport,
  createExistingLeadAdaptationDryRun,
  createPropertyOpportunityAcquisitionReviewTask,
  createPropertyOpportunityDuplicateKey,
  createPropertyOpportunitySummary,
  createPropertyOpportunityStreamAudit,
  defaultPropertyOpportunityFilters,
  listPropertyOpportunityFilters,
  propertyOpportunitySafetyFlags,
  savePropertyOpportunityFilter,
  scorePropertyOpportunity,
  upsertManualDfdPropertyOpportunity,
  type PropertyOpportunityDb,
  type PropertyOpportunityRecord,
  type PropertyOpportunitySavedFilterRecord,
} from "@/lib/property-opportunity-engine";
import type { StoredLead } from "@/lib/leads-storage";

function createMockDb(): PropertyOpportunityDb & {
  opportunities: PropertyOpportunityRecord[];
  filters: PropertyOpportunitySavedFilterRecord[];
  tasks: Array<{ id: string; [key: string]: unknown }>;
} {
  const opportunities: PropertyOpportunityRecord[] = [];
  const filters: PropertyOpportunitySavedFilterRecord[] = [];
  const tasks: Array<{ id: string; [key: string]: unknown }> = [];

  return {
    opportunities,
    filters,
    tasks,
    propertyOpportunity: {
      async findMany(args: { where?: { tenantId?: string } }) {
        return opportunities.filter((opportunity) => !args.where?.tenantId || opportunity.tenantId === args.where.tenantId);
      },
      async findFirst(args: { where?: { id?: string; tenantId?: string; duplicateKey?: string } }) {
        return opportunities.find((opportunity) => {
          const where = args.where ?? {};
          return (
            (!where.id || opportunity.id === where.id) &&
            (!where.tenantId || opportunity.tenantId === where.tenantId) &&
            (!where.duplicateKey || opportunity.duplicateKey === where.duplicateKey)
          );
        }) ?? null;
      },
      async upsert(args: {
        where: { tenantId_duplicateKey: { tenantId: string; duplicateKey: string } };
        update: Partial<PropertyOpportunityRecord>;
        create: Omit<PropertyOpportunityRecord, "id" | "createdAt" | "updatedAt">;
      }) {
        const existing = opportunities.find(
          (opportunity) =>
            opportunity.tenantId === args.where.tenantId_duplicateKey.tenantId &&
            opportunity.duplicateKey === args.where.tenantId_duplicateKey.duplicateKey,
        );

        if (existing) {
          Object.assign(existing, args.update, { updatedAt: "2026-08-07T14:00:00.000Z" });
          return existing;
        }

        const created = {
          ...args.create,
          id: `opportunity-${opportunities.length + 1}`,
          createdAt: "2026-08-07T13:00:00.000Z",
          updatedAt: "2026-08-07T13:00:00.000Z",
        };
        opportunities.push(created);
        return created;
      },
      async update() {
        throw new Error("not needed in property opportunity safety tests");
      },
    },
    propertyOpportunitySavedFilter: {
      async findMany(args: { where?: { tenantId?: string } }) {
        return filters.filter((filter) => !args.where?.tenantId || filter.tenantId === args.where.tenantId);
      },
      async upsert(args: {
        where: { tenantId_filterKey: { tenantId: string; filterKey: string } };
        update: Partial<PropertyOpportunitySavedFilterRecord>;
        create: Omit<PropertyOpportunitySavedFilterRecord, "id" | "createdAt" | "updatedAt">;
      }) {
        const existing = filters.find(
          (filter) => filter.tenantId === args.where.tenantId_filterKey.tenantId && filter.filterKey === args.where.tenantId_filterKey.filterKey,
        );

        if (existing) {
          Object.assign(existing, args.update, { updatedAt: "2026-08-07T14:00:00.000Z" });
          return existing;
        }

        const created = {
          ...args.create,
          id: `filter-${filters.length + 1}`,
          createdAt: "2026-08-07T13:00:00.000Z",
          updatedAt: "2026-08-07T13:00:00.000Z",
        };
        filters.push(created);
        return created;
      },
    },
    revenueTask: {
      async findFirst(args: { where?: { source?: string; status?: string; taskType?: string } }) {
        return tasks.find((task) => {
          const where = args.where ?? {};
          return (
            (!where.source || task.source === where.source) &&
            (!where.status || task.status === where.status) &&
            (!where.taskType || task.taskType === where.taskType)
          );
        }) ?? null;
      },
      async create(args: { data: Record<string, unknown> }) {
        const task = { id: `task-${tasks.length + 1}`, ...args.data };
        tasks.push(task);
        return task;
      },
    },
  };
}

const manualOpportunity = {
  propertyAddress: "123 Internal Review Ave",
  city: "Oklahoma City",
  state: "OK",
  zipCode: "73102",
  county: "Oklahoma",
  parcelId: "P-123",
  ownerName: "Test Owner",
  mailingAddress: "PO Box 1, Dallas, TX",
  source: "manual_dfd",
  sourceDetail: "Operator saw visible vacancy and repairs.",
  distressFlags: {
    vacantProperty: true,
    majorRepairs: true,
    outOfStateOwner: true,
    taxDelinquent: true,
  },
  observations: [{ observedAt: "2026-08-07", note: "Boarded window and overgrown yard.", condition: "visible_distress", source: "manual_dfd" }],
  photoMetadata: [{ fileName: "front.jpg", contentType: "image/jpeg", caption: "Front exterior." }],
  evidence: { sourceLabel: "manual_dfd_test" },
};

function storedLead(overrides: Partial<StoredLead> = {}): StoredLead {
  return {
    id: "lead-1",
    timestamp: "2026-08-07T13:00:00.000Z",
    firstName: "Test",
    lastName: "Owner",
    email: "",
    phone: "",
    propertyAddress: "123 Internal Review Ave",
    city: "Oklahoma City",
    state: "OK",
    zipCode: "73102",
    ownerName: "Test Owner",
    mailingAddress: "PO Box 1, Dallas, TX",
    county: "Oklahoma",
    parcelId: "P-123",
    situationDetails: "Imported property-first record with visible distress.",
    source: "county_list",
    status: "new",
    notes: [],
    followUps: [],
    analyzer: { arv: "", estimatedRepairs: "", desiredProfit: "20000" },
    distressFlags: {
      taxDelinquent: true,
      inheritedProperty: false,
      vacantProperty: true,
      foreclosureRisk: false,
      majorRepairs: false,
      tiredLandlord: false,
      urgentTimeline: false,
      outOfStateOwner: true,
    },
    opportunityScore: "Medium",
    score: 50,
    priority: "Medium",
    scoreBreakdown: "Stored test score.",
    ...overrides,
  };
}

test("manual DFD opportunity scoring is advisory and exposes no unsafe actions", async () => {
  const db = createMockDb();
  const result = await upsertManualDfdPropertyOpportunity(db, manualOpportunity, { tenantId: "default", actorId: "tester" });

  assert.equal(result.created, true);
  assert.equal(result.providerCalled, false);
  assert.equal(result.sent, false);
  assert.equal(result.published, false);
  assert.equal(result.crmMutated, false);
  assert.equal(result.liveExecutionAllowed, false);
  assert.equal(result.opportunity.opportunityPriority, "High");
  assert.equal(result.opportunity.safetyFlags, propertyOpportunitySafetyFlags);
  assert.ok(result.summary.morningBriefSignals.length > 0);
  assert.ok(result.summary.exceptionInboxItems.some((item) => item.type === "high_value_acquisition_review"));
  assert.ok(result.summary.exceptionInboxItems.every((item) => item.ceoBusinessDecisionRequired === false));
  assertPropertyOpportunityEngineSafety({ opportunities: [result.opportunity], summary: result.summary });
});

test("duplicate keys prefer parcel identity and duplicate submissions update the existing opportunity", async () => {
  const db = createMockDb();
  const duplicateKey = createPropertyOpportunityDuplicateKey(manualOpportunity);

  assert.equal(duplicateKey, "parcel:oklahoma:p-123");

  const first = await upsertManualDfdPropertyOpportunity(db, manualOpportunity);
  const second = await upsertManualDfdPropertyOpportunity(db, { ...manualOpportunity, sourceDetail: "Second observation." });

  assert.equal(first.opportunity.id, second.opportunity.id);
  assert.equal(second.created, false);
  assert.equal(second.opportunity.duplicateRisk, true);
  assert.ok(second.summary.exceptionInboxItems.some((item) => item.type === "duplicate_property_conflict"));
});

test("unsafe enrichment request is blocked and penalized without provider calls", async () => {
  const safeScore = scorePropertyOpportunity(manualOpportunity);
  const unsafeScore = scorePropertyOpportunity({ ...manualOpportunity, unsafeEnrichmentRequested: true });
  const db = createMockDb();
  const result = await upsertManualDfdPropertyOpportunity(db, { ...manualOpportunity, unsafeEnrichmentRequested: true });

  assert.ok(unsafeScore.opportunityScore < safeScore.opportunityScore);
  assert.equal(result.unsafeEnrichmentBlocked, true);
  assert.equal(result.providerCalled, false);
  assert.equal(result.opportunity.providerCalled, false);
});

test("saved acquisition filters persist the required MVP filter set safely", async () => {
  const db = createMockDb();
  const seeded = await listPropertyOpportunityFilters(db);

  assert.equal(seeded.filters.length, defaultPropertyOpportunityFilters.length);
  assert.ok(seeded.filters.some((filter) => filter.filterKey === "missing_owner_data"));
  assert.ok(seeded.filters.every((filter) => filter.providerCalled === false));

  const saved = await savePropertyOpportunityFilter(db, {
    name: "High Confidence DFD",
    filterKey: "driving_for_dollars",
    criteria: { source: "manual_dfd", minConfidence: 70 },
  });

  assert.equal(saved.filter.name, "High Confidence DFD");
  assert.equal(db.filters.length, defaultPropertyOpportunityFilters.length);
});

test("acquisition review task creation is approval-required and deduped", async () => {
  const db = createMockDb();
  const { opportunity } = await upsertManualDfdPropertyOpportunity(db, manualOpportunity);
  const first = await createPropertyOpportunityAcquisitionReviewTask(db, opportunity.id, { actorId: "tester" });
  const second = await createPropertyOpportunityAcquisitionReviewTask(db, opportunity.id, { actorId: "tester" });

  assert.equal(first.created, true);
  assert.equal(second.created, false);
  assert.equal(first.taskId, second.taskId);
  assert.equal(first.requiresApproval, true);
  assert.equal(first.providerCalled, false);
  assert.equal(first.crmMutated, false);
  assert.equal(db.tasks.length, 1);
});

test("summary routes missing owner evidence to Exception Inbox without creating a CEO business decision", () => {
  const summary = createPropertyOpportunitySummary([
    {
      id: "opportunity-missing-owner",
      tenantId: "default",
      canonicalAddress: "456 review st, oklahoma city, ok",
      propertyAddress: "456 Review St",
      city: "Oklahoma City",
      state: "OK",
      zipCode: "73103",
      county: "Oklahoma",
      parcelId: null,
      ownerName: null,
      mailingAddress: null,
      source: "manual_dfd",
      sourceDetail: null,
      evidence: {},
      distressIndicators: ["vacantProperty"],
      observations: [],
      photoMetadata: [],
      opportunityScore: 51,
      opportunityPriority: "Medium",
      confidence: 61,
      duplicateKey: "address:456 review st, oklahoma city, ok",
      duplicateRisk: false,
      missingEvidence: ["parcel ID", "owner name or mailing address"],
      recommendedAction: "Complete missing property evidence before acquisition review.",
      safetyFlags: propertyOpportunitySafetyFlags,
      providerCalled: false,
      sent: false,
      published: false,
      crmMutated: false,
      liveExecutionAllowed: false,
      createdBy: null,
      createdAt: "2026-08-07T13:00:00.000Z",
    },
  ]);

  assert.equal(summary.missingOwnerEvidence, 1);
  assert.ok(summary.exceptionInboxItems.some((item) => item.type === "missing_owner_evidence"));
  assert.ok(summary.exceptionInboxItems.every((item) => item.ceoBusinessDecisionRequired === false));
});

test("stream audit detects a starved property opportunity engine and recommends the source adapter", () => {
  const audit = createPropertyOpportunityStreamAudit([], { generatedAt: "2026-08-07T14:00:00.000Z" });

  assert.equal(audit.streamState, "starved");
  assert.equal(audit.totalOpportunities, 0);
  assert.equal(audit.exactRecommendedNextImplementation, "IMPLEMENT_EXISTING_LEAD_AND_IMPORT_TO_PROPERTY_OPPORTUNITY_ADAPTER");
  assert.ok(audit.bottlenecks.includes("No persisted property opportunities exist yet."));
  assert.equal(audit.providerCalled, false);
  assert.equal(audit.sent, false);
  assert.equal(audit.published, false);
  assert.equal(audit.crmMutated, false);
  assert.equal(audit.liveExecutionAllowed, false);
});

test("stream audit flags thin single-source flow even when scoring works", async () => {
  const db = createMockDb();
  const { opportunity } = await upsertManualDfdPropertyOpportunity(db, manualOpportunity);
  const audit = createPropertyOpportunityStreamAudit([opportunity], { generatedAt: "2026-08-07T14:00:00.000Z" });

  assert.equal(audit.streamState, "thin");
  assert.equal(audit.activeSourceChannels, 1);
  assert.ok(audit.bottlenecks.some((bottleneck) => /fewer than two active source channels/i.test(bottleneck)));
  assert.ok(audit.sourceHealth.some((source) => source.channel === "manual_dfd" && source.count === 1));
});

test("stream audit detects cleanup-heavy owner evidence gaps before scaling", () => {
  const opportunities: PropertyOpportunityRecord[] = Array.from({ length: 4 }, (_, index) => ({
    id: `opportunity-cleanup-${index}`,
    tenantId: "default",
    canonicalAddress: `${index} cleanup st, oklahoma city, ok`,
    propertyAddress: `${index} Cleanup St`,
    city: "Oklahoma City",
    state: "OK",
    zipCode: "73103",
    county: "Oklahoma",
    parcelId: null,
    ownerName: null,
    mailingAddress: null,
    source: "county_tax_import",
    sourceDetail: null,
    evidence: { sourceLabel: "county_tax_import" },
    distressIndicators: ["taxDelinquent"],
    observations: [{ observedAt: "2026-08-07", note: "County list row.", condition: "tax_record", source: "county_tax_import" }],
    photoMetadata: [],
    opportunityScore: 48,
    opportunityPriority: "Medium",
    confidence: 61,
    duplicateKey: `address:${index} cleanup st`,
    duplicateRisk: false,
    missingEvidence: ["owner name or mailing address"],
    recommendedAction: "Complete missing property evidence before acquisition review.",
    safetyFlags: propertyOpportunitySafetyFlags,
    providerCalled: false,
    sent: false,
    published: false,
    crmMutated: false,
    liveExecutionAllowed: false,
    createdBy: null,
    createdAt: "2026-08-07T13:00:00.000Z",
  }));
  const audit = createPropertyOpportunityStreamAudit(opportunities, { generatedAt: "2026-08-07T14:00:00.000Z" });

  assert.equal(audit.streamState, "needs_cleanup");
  assert.equal(audit.sourceHealth[0]?.channel, "tax_county");
  assert.ok(audit.bottlenecks.some((bottleneck) => /Owner evidence gaps/i.test(bottleneck)));
});

test("existing lead adapter converts property leads into opportunity records without external action", async () => {
  const db = createMockDb();
  const report = await adaptExistingLeadsToPropertyOpportunities(db, [
    storedLead(),
    storedLead({
      id: "lead-2",
      propertyAddress: "789 DFD Watch Ave",
      parcelId: "",
      source: "driving_for_dollars",
      distressFlags: {
        taxDelinquent: false,
        inheritedProperty: false,
        vacantProperty: true,
        foreclosureRisk: false,
        majorRepairs: true,
        tiredLandlord: false,
        urgentTimeline: false,
        outOfStateOwner: false,
      },
    }),
    storedLead({ id: "lead-missing-address", propertyAddress: "" }),
  ], { tenantId: "default", actorId: "adapter-test", generatedAt: "2026-08-07T14:00:00.000Z" });

  assert.equal(report.scannedLeads, 3);
  assert.equal(report.eligiblePropertyLeads, 2);
  assert.equal(report.createdOpportunities, 2);
  assert.equal(report.skippedMissingPropertyAddress, 1);
  assert.equal(report.providerCalled, false);
  assert.equal(report.sent, false);
  assert.equal(report.published, false);
  assert.equal(report.crmMutated, false);
  assert.equal(report.liveExecutionAllowed, false);
  assert.equal(db.opportunities.length, 2);
  assert.ok(report.streamAudit.sourceHealth.some((source) => source.channel === "tax_county"));
  assert.ok(report.streamAudit.sourceHealth.some((source) => source.channel === "manual_dfd"));
});

test("existing lead provenance gate fails closed and never adapts synthetic or ambiguous records", async () => {
  const db = createMockDb();
  const leads = [
    storedLead({ id: "real", source: "website_form", sourceDetail: "seller intake" }),
    storedLead({ id: "synthetic", source: "county_list", sourceDetail: "synthetic pressure harness" }),
    storedLead({ id: "test", source: "referral", sourceDetail: "acceptance fixture" }),
    storedLead({ id: "demo", source: "manual", sourceDetail: "demo record" }),
    storedLead({ id: "certification", source: "website", sourceDetail: "certification record" }),
    storedLead({ id: "ambiguous", source: "unknown_import", sourceDetail: "unverified" }),
  ];

  assert.equal(classifyLeadProvenance(leads[0]).classification, "real");
  const eligibility = createExistingLeadEligibilityReport(leads);
  assert.equal(eligibility.eligiblePropertyLeads, 1);
  assert.equal(eligibility.excludedLeads, 5);
  assert.deepEqual(eligibility.provenanceCounts, { real: 1, synthetic: 1, test: 1, demo: 1, certification: 1, ambiguous: 1 });

  const report = await adaptExistingLeadsToPropertyOpportunities(db, leads, { tenantId: "default" });
  assert.equal(report.createdOpportunities, 1);
  assert.equal(report.excludedLeads, 5);
  assert.equal((db.opportunities[0]?.evidence as { leadId?: string }).leadId, "real");
  assert.equal(report.providerCalled, false);
  assert.equal(report.liveExecutionAllowed, false);
});

test("aggregate adaptation dry run projects create, reuse, threshold, and task counts without writes", () => {
  const real = storedLead({ id: "real-a", source: "website_form", parcelId: "P-NEW" });
  const duplicate = storedLead({ id: "real-b", source: "referral", parcelId: "P-NEW" });
  const existingLead = storedLead({ id: "real-existing", source: "manual", parcelId: "P-EXISTING" });
  const existing = {
    ...createMockDb().opportunities[0],
    id: "opportunity-existing",
    tenantId: "default",
    duplicateKey: "parcel:oklahoma:p-existing",
    evidence: { leadId: "prior-lead" },
    opportunityScore: 80,
  } as PropertyOpportunityRecord;

  const report = createExistingLeadAdaptationDryRun({
    leads: [real, duplicate, existingLead, storedLead({ id: "synthetic", sourceDetail: "synthetic record" })],
    existingOpportunities: [existing],
    existingTasks: [{ source: "property_opportunity:opportunity-existing", status: "open" }],
  });

  assert.equal(report.totalLeads, 4);
  assert.equal(report.legitimateRealLeads, 3);
  assert.equal(report.eligibleForAdaptation, 3);
  assert.equal(report.duplicatePropertyIdentities, 1);
  assert.equal(report.wouldCreateOpportunity, 1);
  assert.equal(report.wouldReuseOrUpdateOpportunity, 2);
  assert.equal(report.opportunitiesAlreadyLinkedToLeads, 1);
  assert.equal(report.providerCalled, false);
  assert.equal(report.externalExecutionAllowed, false);
});

test("existing lead adapter is idempotent and does not create false duplicate conflicts on rerun", async () => {
  const db = createMockDb();
  const lead = storedLead();
  const first = await adaptExistingLeadsToPropertyOpportunities(db, [lead]);
  const second = await adaptExistingLeadsToPropertyOpportunities(db, [lead]);

  assert.equal(first.createdOpportunities, 1);
  assert.equal(second.createdOpportunities, 0);
  assert.equal(second.updatedOpportunities, 1);
  assert.equal(db.opportunities.length, 1);
  assert.equal(db.opportunities[0]?.duplicateRisk, false);
});

test("existing lead adapter flags true duplicate property keys across different leads", async () => {
  const db = createMockDb();
  const report = await adaptExistingLeadsToPropertyOpportunities(db, [
    storedLead({ id: "lead-a", parcelId: "P-DUPLICATE" }),
    storedLead({ id: "lead-b", parcelId: "P-DUPLICATE", situationDetails: "Second record for same parcel." }),
  ]);

  assert.equal(report.createdOpportunities, 1);
  assert.equal(report.updatedOpportunities, 1);
  assert.equal(db.opportunities.length, 1);
  assert.equal(db.opportunities[0]?.duplicateRisk, true);
  assert.ok(report.streamAudit.bottlenecks.some((bottleneck) => /Duplicate property conflicts/i.test(bottleneck)));
});
