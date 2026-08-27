import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

import { createDbLead, setLeadDatabaseDependenciesForTest } from "../../lib/leads-db";
import type { StoredLead } from "../../lib/leads-storage";
import { assertOperationalEvidenceAllowed, evaluateOperationalEvidence, OperationalEvidenceBlockedError, operationalEvidenceFromLead } from "../../lib/operational-evidence-guard";
import { syncLeadRevenueSpine } from "../../lib/revenue-spine";

const legitimateEvidence = {
  tenantId: "tenant-okc",
  source: "public_seller_website",
  sourceType: "inbound_website_form",
  sourceReference: "submission-2026-08-24-001",
  observedAt: "2026-08-24T15:00:00.000Z",
  evidenceState: "real" as const,
  verificationState: "unverified" as const,
  identityValues: ["Human-submitted seller inquiry", "Oklahoma City, OK"],
};

test("provenance-complete legitimate operational evidence passes", () => {
  assert.deepEqual(evaluateOperationalEvidence(legitimateEvidence).reasonCodes, []);
  assert.equal(evaluateOperationalEvidence(legitimateEvidence).allowed, true);
});

test("JSONPlaceholder providers and known demo identities fail closed", () => {
  for (const evidence of [
    { ...legitimateEvidence, source: "https://jsonplaceholder.typicode.com/users" },
    { ...legitimateEvidence, identityValues: ["Leanne Graham", "Kulas Light"] },
  ]) {
    const decision = evaluateOperationalEvidence(evidence);
    assert.equal(decision.allowed, false);
    assert.ok(decision.reasonCodes.some((reason) => reason === "known_demo_provider" || reason === "known_demo_identity"));
  }
});

test("synthetic addresses and generated/demo leads fail closed", () => {
  for (const evidence of [
    { ...legitimateEvidence, identityValues: ["Victor Plains"] },
    { ...legitimateEvidence, source: "ai-generated", evidenceState: "synthetic" as const },
    { ...legitimateEvidence, sourceType: "demo_provider", evidenceState: "demo" as const },
  ]) {
    assert.equal(evaluateOperationalEvidence(evidence).allowed, false);
  }
});

test("missing required provenance and unapproved certification fail closed", () => {
  const missing = evaluateOperationalEvidence({ ...legitimateEvidence, sourceReference: "", sourceType: "", observedAt: null });
  assert.equal(missing.allowed, false);
  assert.ok(missing.reasonCodes.includes("source_reference_missing"));
  assert.ok(missing.reasonCodes.includes("source_type_missing"));
  assert.ok(missing.reasonCodes.includes("observation_timestamp_missing_or_invalid"));

  const certification = evaluateOperationalEvidence({ ...legitimateEvidence, evidenceState: "certification", certificationApproved: false });
  assert.equal(certification.allowed, false);
  assert.ok(certification.reasonCodes.includes("certification_not_approved"));
});

test("assertion exposes the canonical all-false safety decision", () => {
  assert.throws(
    () => assertOperationalEvidenceAllowed({ ...legitimateEvidence, evidenceState: "synthetic" }, "lead_persistence"),
    (error) => error instanceof OperationalEvidenceBlockedError && error.effect === "lead_persistence" && Object.entries(error.decision)
      .filter(([key]) => !["allowed", "reasonCodes"].includes(key))
      .every(([, value]) => value === false),
  );
});

function storedLead(overrides: Partial<StoredLead> = {}): StoredLead {
  return {
    id: "lead-integrity-1", timestamp: "2026-08-24T15:00:00.000Z", firstName: "Valid", lastName: "Seller", email: "seller@example.test", phone: "4055550100",
    propertyAddress: "100 Valid Evidence Ave", city: "Oklahoma City", state: "OK", zipCode: "73102", ownerName: "Valid Seller", mailingAddress: "",
    county: "Oklahoma", parcelId: "VALID-100", situationDetails: "Manual seller intake.", source: "manual_intake", sourceDetail: "operator intake | manual-100",
    status: "new", notes: [], followUps: [], analyzer: { arv: "", estimatedRepairs: "", desiredProfit: "20000" },
    distressFlags: { taxDelinquent: false, inheritedProperty: false, vacantProperty: false, foreclosureRisk: false, majorRepairs: false, tiredLandlord: false, urgentTimeline: false, outOfStateOwner: false },
    opportunityScore: "Low", score: 0, priority: "Low", scoreBreakdown: "Manual evidence requires review.", ...overrides,
  };
}

test("lead persistence rejects unsafe provenance before database access", async () => {
  let dbCalls = 0;
  const restore = setLeadDatabaseDependenciesForTest({ db: { lead: { async findFirst() { dbCalls += 1; return null; }, async create() { dbCalls += 1; throw new Error("must_not_run"); } } } as never });
  try {
    for (const lead of [storedLead({ source: "" }), storedLead({ source: "demo_provider" }), storedLead({ firstName: "Leanne", lastName: "Graham" })]) {
      await assert.rejects(createDbLead({ tenantId: "tenant-okc" }, lead), /operational_evidence_blocked/);
    }
    assert.equal(dbCalls, 0);
  } finally { restore(); }
});

test("provenance-complete lead reaches tenant-scoped persistence", async () => {
  const lead = storedLead();
  let createCalls = 0;
  let createData: Record<string, unknown> | undefined;
  const dbRecord = { ...lead, tenantId: "tenant-okc", name: "Valid Seller", payload: JSON.stringify(lead), createdAt: new Date(lead.timestamp), updatedAt: new Date(lead.timestamp) };
  const restore = setLeadDatabaseDependenciesForTest({ db: { lead: { async findFirst() { return null; }, async create(input: { data: Record<string, unknown> }) { createCalls += 1; createData = input.data; return dbRecord; } } } as never, sync: (async () => undefined) as never });
  try {
    assert.equal((await createDbLead({ tenantId: "tenant-okc" }, lead)).created, true);
    assert.equal(createCalls, 1);
    assert.deepEqual(createData?.revenueLeadSources, {
      create: {
        tenantId: "tenant-okc",
        source: "manual_intake",
        sourceType: "manual_intake",
        sourceDetail: "operator intake | manual-100",
        sourceRecordId: "lead-integrity-1",
        confidence: 60,
        verified: false,
        importedBy: "lead_create",
      }
    });
  } finally { restore(); }
});

test("revenue materialization rejects unsafe evidence before its first write", async () => {
  await assert.rejects(syncLeadRevenueSpine({ tenantId: "tenant-okc", lead: storedLead({ sourceDetail: "certification fixture" }), action: "lead_created" }), /operational_evidence_blocked/);
  const source = readFileSync(resolve(process.cwd(), "lib/revenue-spine.ts"), "utf8");
  assert.ok(source.indexOf("assertOperationalEvidenceAllowed") < source.indexOf("prisma.revenueLeadSource.upsert"));
});

test("stored leads without revenue provenance cannot reach operational effects", () => {
  const decision = evaluateOperationalEvidence(operationalEvidenceFromLead({
    tenantId: "tenant-okc",
    source: "manual",
    createdAt: new Date(),
    name: "Unproven Owner",
    propertyAddress: "Unproven address",
    revenueLeadSources: [],
  }));
  assert.equal(decision.allowed, false);
  assert.ok(decision.reasonCodes.includes("source_type_missing"));
  assert.ok(decision.reasonCodes.includes("source_reference_missing"));
  assert.equal(decision.providerCalled, false);
  assert.equal(decision.providerWrite, false);
  assert.equal(decision.outreach, false);
  assert.equal(decision.crmMutated, false);
  assert.equal(decision.liveExecutionAllowed, false);
});

test("automation cannot persist, create ROI work, or trigger outreach", () => {
  const source = readFileSync(resolve(process.cwd(), "lib/automation-agent.ts"), "utf8");
  for (const forbidden of [
    "generateLeads",
    "fetchRealLeads",
    "createDbLead",
    "revenueTask.create",
    "propertyOpportunity.upsert",
    "propertyCandidate",
    "revenueLeadSource.create",
    "revenueLeadSource.upsert",
    "revenueLeadScore.create",
    "revenuePipelineEvent.create",
    "revenueDecisionLog.create",
    "sendSms",
    "twilio",
    "fetch(",
    ".update(",
    ".create(",
  ]) {
    assert.equal(source.includes(forbidden), false, `automation contains forbidden operational capability: ${forbidden}`);
  }
  assert.match(source, /processedFollowUpCount:\s*0/);
  assert.match(source, /smsSentCount:\s*0/);
});

test("outreach routes guard operational evidence before effects", () => {
  const liveRoute = readFileSync(resolve(process.cwd(), "app/api/send-sms/route.ts"), "utf8");
  assert.ok(liveRoute.indexOf("const evidenceDecision = evaluateOperationalEvidence") < liveRoute.indexOf("const liveResult = await executeControlledLiveSms"));
  const mockRoute = readFileSync(resolve(process.cwd(), "app/api/leads/[leadId]/mock-outreach/route.ts"), "utf8");
  assert.ok(mockRoute.indexOf("const evidenceDecision = evaluateOperationalEvidence") < mockRoute.indexOf("const updatedLead = await prisma.lead.update"));
  assert.match(mockRoute, /crmMutated:\s*false/);
});
