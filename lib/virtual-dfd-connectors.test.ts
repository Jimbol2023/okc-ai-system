import assert from "node:assert/strict";
import { test } from "node:test";

import { defaultAutonomyPolicies, evaluateAutonomyPolicy } from "@/lib/autonomy-policy";
import { evaluateConnectorAction, getEnterpriseConnector } from "@/lib/connector-platform";
import { createPropertyCandidate, type PropertyCandidateDb, type PropertyCandidateRecord } from "@/lib/property-candidate-foundation";
import {
  createVirtualDfdConnectorFoundationReport,
  createVirtualDfdRoiAttribution,
  evaluateVirtualDfdCostGate,
  evaluateVirtualDfdProviderGate,
  getNormalizedAddressForDraft,
  mapDealMachinePropertyToPropertyCandidateInput,
  mapGoogleGeocodeToPropertyCandidateInput,
  virtualDfdSafetyFlags,
} from "@/lib/virtual-dfd-connectors";

const collectedAt = "2026-08-20T20:30:00.000Z";

function createCandidateDb(seed: {
  candidates?: PropertyCandidateRecord[];
  leads?: Array<{ id: string; tenantId: string; propertyAddress: string; source: string }>;
  opportunities?: Array<{ id: string; tenantId: string; duplicateKey: string; propertyAddress: string; parcelId: string | null; county: string | null }>;
} = {}): PropertyCandidateDb & { candidates: PropertyCandidateRecord[]; leads: Array<{ id: string; tenantId: string; propertyAddress: string; source: string }>; audits: Array<{ action: string }> } {
  const candidates = [...(seed.candidates ?? [])];
  const leads = [...(seed.leads ?? [])];
  const opportunities = [...(seed.opportunities ?? [])];
  const audits: Array<{ action: string }> = [];

  return {
    candidates,
    leads,
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
          createdAt: "2026-08-20T20:30:00.000Z",
          updatedAt: "2026-08-20T20:30:00.000Z",
        };
        candidates.push(created);
        return created;
      },
      async update(args) {
        const existing = candidates.find((item) => item.id === args.where.id && item.tenantId === args.where.tenantId);
        if (!existing) throw new Error("missing candidate");
        Object.assign(existing, args.data);
        return existing;
      },
    },
    lead: {
      async findFirst(args) {
        return leads.find((item) => item.tenantId === args.where?.tenantId && item.propertyAddress === args.where?.propertyAddress) ?? null;
      },
    },
    propertyOpportunity: {
      async findFirst(args) {
        const where = args.where ?? {};
        return opportunities.find((item) => item.tenantId === where.tenantId && (item.duplicateKey === where.duplicateKey || item.propertyAddress === where.propertyAddress)) ?? null;
      },
    },
    revenueAuditEvent: {
      async create(args) {
        audits.push({ action: String(args.data.action) });
        return { id: `audit-${audits.length}` };
      },
    },
  };
}

test("Google contract maps official geocode fields to certification PropertyCandidate input only", async () => {
  const draft = mapGoogleGeocodeToPropertyCandidateInput({
    requestedAddress: "123 Main St Oklahoma City OK 73102",
    collectedAt,
    certificationOnly: true,
    result: {
      placeId: "place-123",
      formattedAddress: "123 Main St, Oklahoma City, OK 73102, USA",
      granularity: "ROOFTOP",
      location: { latitude: 35.4676, longitude: -97.5164 },
      addressComponents: [
        { longText: "Oklahoma City", shortText: "Oklahoma City", types: ["locality"] },
        { longText: "Oklahoma", shortText: "OK", types: ["administrative_area_level_1"] },
        { longText: "Oklahoma County", shortText: "Oklahoma County", types: ["administrative_area_level_2"] },
        { longText: "73102", shortText: "73102", types: ["postal_code"] },
      ],
    },
  });
  const db = createCandidateDb();
  const result = await createPropertyCandidate(db, draft.propertyCandidateInput, { tenantId: "default", actorId: "certifier" });

  assert.equal(draft.intendedSource, "virtual_dfd_internal_certification");
  assert.equal(result.candidate.source, "virtual_dfd_internal_certification");
  assert.equal(result.candidate.providerName, "Google Maps Platform");
  assert.equal(result.candidate.providerCalled, false);
  assert.equal(result.candidate.costCents, 0);
  assert.equal(result.candidate.creditsUsed, 0);
  assert.equal(draft.createsLead, false);
  assert.equal(draft.createsPropertyOpportunity, false);
  assert.equal(draft.createsRevenueTask, false);
  assert.equal("ownerName" in draft.propertyCandidateInput.sourceEvidence, false);
  assert.equal("distressIndicators" in draft.propertyCandidateInput.sourceEvidence, false);
});

test("DealMachine contract preserves permitted metadata but blocks skip trace, mail, and outreach", () => {
  const draft = mapDealMachinePropertyToPropertyCandidateInput({
    collectedAt,
    certificationOnly: true,
    result: {
      property_id: "dm-property-1",
      formatted_address: "500 NW 6th St",
      city: "Oklahoma City",
      state: "OK",
      zip_code: "73102",
      county: "Oklahoma County",
      parcel_id: "R123",
      owner_name: "Permitted Owner Metadata",
      mailing_address: "PO Box 1",
      credits_used: 1,
      provider_cost_cents: 15,
    },
  });

  assert.equal(draft.intendedSource, "virtual_dfd_internal_certification");
  assert.equal(draft.propertyCandidateInput.providerName, "DealMachine");
  assert.equal(draft.providerCostCents, 15);
  assert.equal(draft.creditsUsed, 1);
  assert.deepEqual(draft.propertyCandidateInput.sourceEvidence.blockedWorkflows, ["skip_trace", "direct_mail", "sms", "email", "seller_outreach"]);
  assert.deepEqual(draft.safetyFlags, virtualDfdSafetyFlags);
});

test("duplicate certification covers candidate, lead, opportunity, parcel conflict, and address conflict", () => {
  const base = {
    requestedAddress: "123 Main St Oklahoma City OK 73102",
    collectedAt,
    result: { formattedAddress: "123 Main St, Oklahoma City, OK 73102, USA" },
  };
  const duplicateKey = mapGoogleGeocodeToPropertyCandidateInput(base).duplicateKey;

  assert.equal(mapGoogleGeocodeToPropertyCandidateInput({ ...base, duplicateKeys: { propertyCandidates: [duplicateKey] } }).duplicateStatus, "duplicate_candidate");
  assert.equal(mapGoogleGeocodeToPropertyCandidateInput({ ...base, duplicateKeys: { leads: [duplicateKey] } }).duplicateStatus, "duplicate_existing_lead");
  assert.equal(mapGoogleGeocodeToPropertyCandidateInput({ ...base, duplicateKeys: { propertyOpportunities: [duplicateKey] } }).duplicateStatus, "duplicate_existing_opportunity");
  assert.equal(mapGoogleGeocodeToPropertyCandidateInput({ ...base, duplicateKeys: { conflictingParcels: [duplicateKey] } }).duplicateStatus, "conflicting_parcel");
  assert.equal(mapGoogleGeocodeToPropertyCandidateInput({ ...base, duplicateKeys: { conflictingAddresses: [duplicateKey] } }).duplicateStatus, "conflicting_address");
});

test("review boundary keeps certification candidate new until governed review", async () => {
  const draft = mapGoogleGeocodeToPropertyCandidateInput({
    requestedAddress: "900 Preview Ave Oklahoma City OK",
    collectedAt,
    certificationOnly: true,
    result: { formattedAddress: "900 Preview Ave, Oklahoma City, OK, USA" },
  });
  const db = createCandidateDb();
  const result = await createPropertyCandidate(db, draft.propertyCandidateInput, { tenantId: "default", actorId: "certifier" });

  assert.equal(result.candidate.reviewStatus, "new");
  assert.equal(db.leads.length, 0);
  assert.equal(result.providerCalled, false);
  assert.equal(result.externalExecutionAllowed, false);
});

test("cost controls default to zero budget and fail closed", () => {
  const gate = evaluateVirtualDfdCostGate({ connectorId: "google_geocode", requestedQueries: 1 });

  assert.equal(gate.allowed, false);
  assert.ok(gate.blockedReasons.includes("circuit_breaker_open"));
  assert.ok(gate.blockedReasons.includes("daily_query_limit_exceeded"));
  assert.equal(gate.dailyDollarLimitCents, 0);
  assert.equal(gate.providerCalled, false);
});

test("UEIP registry and autonomy keep Level 3 provider reads disabled", () => {
  assert.ok(getEnterpriseConnector("google_geocode"));
  assert.ok(getEnterpriseConnector("dealmachine_property_search"));
  const connectorPlan = evaluateConnectorAction({ connectorId: "dealmachine_property_search", actionKey: "search_property_candidates", module: "Property Intelligence" });
  const policy = defaultAutonomyPolicies.find((item) => item.subjectKey === "dealmachine_property_search");
  assert.ok(policy);
  const autonomyDecision = evaluateAutonomyPolicy({
    policy,
    requestedAction: "search_property_candidates",
    requestedLevel: 3,
    evidence: ["tenant_id", "preview_environment", "account_api_capability", "credential_scope", "feature_flag", "hard_credit_budget", "ueip_audit"],
  });
  const providerGate = evaluateVirtualDfdProviderGate({ connectorId: "dealmachine_property_search", actionKey: "search_property_candidates" });

  assert.equal(connectorPlan.decision, "fallback_required");
  assert.equal(autonomyDecision.decision, "blocked");
  assert.equal(providerGate.decision, "blocked");
  assert.equal(providerGate.providerCalled, false);
});

test("ROI prep records future attribution sources and excludes certification records", () => {
  const attribution = createVirtualDfdRoiAttribution({
    source: "google_geocode",
    candidateCount: 1,
    verifiedCandidateCount: 0,
    creditsUsed: 0,
    providerCostCents: 0,
    certificationRecord: true,
  });
  const zeroRevenue = createVirtualDfdRoiAttribution({
    source: "dealmachine_property_search",
    candidateCount: 1,
    verifiedCandidateCount: 1,
    creditsUsed: 0,
    providerCostCents: 0,
    realizedRevenueCents: 0,
  });

  assert.equal(attribution.excludedFromBusinessRoi, true);
  assert.equal(attribution.roiState, "INSUFFICIENT_REAL_OUTCOME_DATA");
  assert.equal(zeroRevenue.roiState, "ZERO_REVENUE");
  assert.equal(attribution.fabricatedRoi, false);
});

test("foundation report declares reused architecture and disabled Preview-only state", () => {
  const draft = mapGoogleGeocodeToPropertyCandidateInput({
    requestedAddress: "1 Test Way Oklahoma City OK",
    collectedAt,
    certificationOnly: true,
    result: { formattedAddress: "1 Test Way, Oklahoma City, OK, USA" },
  });
  const report = createVirtualDfdConnectorFoundationReport();

  assert.equal(report.existingArchitectureReused, "20260816210000_add_property_candidate_foundation");
  assert.equal(report.costControls.google_geocode.dailyDollarLimitCents, 0);
  assert.ok(report.disabledFlags.includes("virtual_dfd_connectors"));
  assert.equal(report.safetyState.providerCalled, false);
  assert.equal(getNormalizedAddressForDraft(draft), "1 test way, oklahoma city, ok, usa");
});
