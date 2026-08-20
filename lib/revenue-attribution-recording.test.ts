import assert from "node:assert/strict";
import test from "node:test";

import {
  assertNoTenantOverride,
  calculateSpeedToLead,
  recordRevenueLedgerCorrection,
  recordRevenueLedgerEvent,
  type LedgerWriteDb,
  type RevenueRecordingContext,
} from "@/lib/revenue-attribution-recording";
import { createRevenueAttributionLedgerReport } from "@/lib/revenue-attribution-ledger";
import { createTodaysRevenueWork } from "@/lib/todays-revenue-work";
import type { StoredLead } from "@/lib/leads-storage";

const context: RevenueRecordingContext = {
  tenantId: "tenant-jcapital",
  actorId: "ceo@example.com",
  role: "ceo_admin",
};

class FakeLedgerDb implements LedgerWriteDb {
  calls: Array<{ query: string; values: unknown[] }> = [];
  audits: Parameters<LedgerWriteDb["audit"]>[0][] = [];
  leadTenantAllowed = true;
  propertyTenantAllowed = true;

  async raw<T>(query: string, ...values: unknown[]) {
    this.calls.push({ query, values });

    if (query.includes('FROM "Lead"')) {
      return (this.leadTenantAllowed ? [{ id: values[0] }] : []) as T[];
    }

    if (query.includes('FROM "PropertyOpportunity"')) {
      return (this.propertyTenantAllowed ? [{ id: values[0] }] : []) as T[];
    }

    if (query.includes('UPDATE "')) {
      return [{ id: values[2] }] as T[];
    }

    if (query.includes('"BusinessOutcomeEvent"')) return [{ id: "boe-1" }] as T[];
    if (query.includes('"RevenueAttributionChain"')) return [{ id: "chain-1" }] as T[];
    if (query.includes('"SourceSpend"')) return [{ id: "spend-1" }] as T[];
    if (query.includes('"LeadOutcomeEvent"')) return [{ id: "lead-outcome-1" }] as T[];
    if (query.includes('"AppointmentOutcomeEvent"')) return [{ id: "appointment-1" }] as T[];
    if (query.includes('"ContractOutcomeEvent"')) return [{ id: "contract-1" }] as T[];
    if (query.includes('"ClosedRevenueOutcomeEvent"')) return [{ id: "closed-1" }] as T[];

    return [] as T[];
  }

  async audit(input: Parameters<LedgerWriteDb["audit"]>[0]) {
    this.audits.push(input);
    return input;
  }

  count(tableName: string) {
    return this.calls.filter((call) => call.query.includes(`"${tableName}"`)).length;
  }
}

const leadFields = {
  leadId: "lead-1",
  sourceType: "owned_intake",
  sourceDetail: "website",
  campaignId: "probate-guide",
  referralCode: "attorney-1",
  landingPage: "/probate",
  verificationStatus: "PARTIAL" as const,
  businessContext: "real_business" as const,
  isTestRecord: false,
};

test("records source spend with computed spend and deterministic idempotency", async () => {
  const db = new FakeLedgerDb();
  const result = await recordRevenueLedgerEvent(
    {
      kind: "source_spend",
      source: "website",
      campaign: "probate-guide",
      periodStart: new Date("2026-08-01T00:00:00.000Z"),
      periodEnd: new Date("2026-08-20T00:00:00.000Z"),
      providerFeesCents: 100,
      mailSpendCents: 200,
      adSpendCents: 300,
      otherSpendCents: 400,
      creditsConsumed: 2,
      currency: "USD",
      evidenceSource: "manual_invoice",
      verificationStatus: "VERIFIED",
      businessContext: "real_business",
      isTestRecord: false,
    },
    context,
    db,
  );

  assert.equal(result.kind, "source_spend");
  assert.equal(result.providerCalled, false);
  assert.equal(result.liveExecutionAllowed, false);
  assert.equal(db.calls[0].values[6], 1000);
  assert.match(result.idempotencyKey, /tenant-jcapital:website:probate-guide/);
  assert.equal(db.audits[0].action, "source_spend_recorded");
});

test("records lead, appointment, contract, and closed revenue outcomes with material event links", async () => {
  const db = new FakeLedgerDb();

  await recordRevenueLedgerEvent(
    {
      ...leadFields,
      kind: "lead_outcome",
      outcome: "qualified",
      occurredAt: new Date("2026-08-20T12:00:00.000Z"),
      evidence: { note: "qualified by operator" },
    },
    context,
    db,
  );
  const appointment = await recordRevenueLedgerEvent(
    {
      ...leadFields,
      kind: "appointment_outcome",
      appointmentReference: "appt-1",
      scheduledAt: new Date("2026-08-20T13:00:00.000Z"),
      completedAt: new Date("2026-08-20T14:00:00.000Z"),
      outcome: "completed",
      evidence: { note: "appointment completed" },
    },
    context,
    db,
  );
  const contract = await recordRevenueLedgerEvent(
    {
      ...leadFields,
      kind: "contract_outcome",
      contractReference: "contract-1",
      outcome: "signed",
      signedAt: new Date("2026-08-20T15:00:00.000Z"),
      expectedValueCents: 10_000_00,
      evidence: { note: "signed contract reference verified" },
    },
    context,
    db,
  );
  const closed = await recordRevenueLedgerEvent(
    {
      ...leadFields,
      kind: "closed_revenue",
      closingReference: "closing-1",
      contractReference: "contract-1",
      revenueType: "assignment_fee",
      grossRevenueCents: 12_000_00,
      directCostCents: 2_000_00,
      netRevenueCents: 10_000_00,
      closedAt: new Date("2026-08-20T16:00:00.000Z"),
      verificationSource: "settlement_statement_reference",
      verificationStatus: "VERIFIED",
      financeEntryId: "finance-1",
      projectedRevenue: false,
    },
    context,
    db,
  );

  assert.equal(appointment.businessOutcomeEventId, "boe-1");
  assert.equal(contract.businessOutcomeEventId, "boe-1");
  assert.equal(closed.businessOutcomeEventId, "boe-1");
  assert.equal(db.count("BusinessOutcomeEvent"), 3);
  assert.equal(db.count("LeadOutcomeEvent"), 1);
  assert.equal(db.count("AppointmentOutcomeEvent"), 1);
  assert.equal(db.count("ContractOutcomeEvent"), 1);
  assert.equal(db.count("ClosedRevenueOutcomeEvent"), 1);
});

test("rejects projected or mismatched closed revenue and prevents cross-tenant writes", async () => {
  const db = new FakeLedgerDb();
  const baseClosed = {
    ...leadFields,
    kind: "closed_revenue" as const,
    closingReference: "closing-1",
    revenueType: "assignment_fee" as const,
    grossRevenueCents: 12_000_00,
    directCostCents: 2_000_00,
    netRevenueCents: 10_000_00,
    closedAt: new Date("2026-08-20T16:00:00.000Z"),
    verificationSource: "settlement_statement_reference",
    verificationStatus: "VERIFIED" as const,
  };

  await assert.rejects(() => recordRevenueLedgerEvent({ ...baseClosed, projectedRevenue: true }, context, db), /projected_revenue/);
  await assert.rejects(() => recordRevenueLedgerEvent({ ...baseClosed, netRevenueCents: 12_000_00 }, context, db), /net_revenue/);

  db.leadTenantAllowed = false;
  await assert.rejects(() => recordRevenueLedgerEvent(baseClosed, context, db), /lead_not_found_for_tenant/);
});

test("enforces write permissions, tenant override denial, and correction audit", async () => {
  const db = new FakeLedgerDb();

  assert.throws(() => assertNoTenantOverride({ record: { tenantId: "other" } }), /tenant_override_denied/);
  await assert.rejects(
    () =>
      recordRevenueLedgerEvent(
        {
          kind: "source_spend",
          source: "website",
          periodStart: new Date("2026-08-01T00:00:00.000Z"),
          periodEnd: new Date("2026-08-20T00:00:00.000Z"),
          evidenceSource: "manual_invoice",
        },
        { ...context, role: "revenue_operations_ai" },
        db,
      ),
    /unauthorized_ledger_write/,
  );

  const correction = await recordRevenueLedgerCorrection(
    {
      targetType: "closed_revenue",
      targetId: "closed-1",
      correctionReason: "Corrected verification source after finance review.",
    },
    context,
    db,
  );

  assert.equal(correction.ok, true);
  assert.equal(db.audits.at(-1)?.action, "outcome_corrected");
});

test("closed revenue linked to a FinanceEntry is counted once by the ledger boundary", () => {
  const ledger = createRevenueAttributionLedgerReport({
    tenantId: context.tenantId,
    window: "all_time",
    asOf: "2026-08-20T18:00:00.000Z",
    sourceSpend: [],
    leadOutcomes: [],
    appointmentOutcomes: [],
    contractOutcomes: [],
    closedRevenueOutcomes: [
      {
        tenantId: context.tenantId,
        leadId: "lead-1",
        closingReference: "closing-1",
        revenueType: "assignment_fee",
        grossRevenueCents: 10_000_00,
        directCostCents: 1_000_00,
        netRevenueCents: 9_000_00,
        closedAt: "2026-08-20T16:00:00.000Z",
        verificationSource: "settlement_statement_reference",
        financeEntryId: "finance-1",
        sourceType: "owned_intake",
        sourceDetail: "website",
        attributionChainKey: "chain-1",
        verificationStatus: "VERIFIED",
      },
    ],
  });

  assert.equal(ledger.summary.totalNetRevenueCents, 9_000_00);
  assert.equal(ledger.summary.totalClosedDeals, 1);
});

test("calculates speed-to-lead classifications without sending outreach", () => {
  const hot = calculateSpeedToLead({
    leadId: "lead-hot",
    priority: "High",
    leadReceivedAt: "2026-08-20T12:00:00.000Z",
    firstInternalReviewAt: "2026-08-20T12:04:00.000Z",
    now: "2026-08-20T12:10:00.000Z",
  });
  const missing = calculateSpeedToLead({
    leadId: "lead-missing",
    priority: "High",
    leadReceivedAt: "2026-08-19T12:00:00.000Z",
    now: "2026-08-20T13:00:00.000Z",
  });

  assert.equal(hot.slaClassification, "HOT_LEAD_UNDER_5_MINUTES");
  assert.equal(missing.slaClassification, "NO_CONTACT_EVIDENCE");
  assert.equal(hot.sent, false);
  assert.equal(hot.liveExecutionAllowed, false);
});

test("creates today's revenue work from hot leads, overdue follow-ups, and ledger gaps", () => {
  const lead: StoredLead = {
    id: "lead-1",
    timestamp: "2026-08-20T12:00:00.000Z",
    firstName: "Avery",
    lastName: "Seller",
    email: "seller@example.test",
    phone: "4055550101",
    propertyAddress: "123 Main St",
    city: "Oklahoma City",
    state: "OK",
    zipCode: "73102",
    ownerName: "",
    mailingAddress: "",
    county: "Oklahoma",
    parcelId: "parcel-1",
    situationDetails: "Manual review.",
    source: "website",
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
      urgentTimeline: true,
      outOfStateOwner: false,
    },
    opportunityScore: "High",
    score: 80,
    priority: "High",
    scoreBreakdown: "Urgent timeline.",
    nextFollowUpAt: "2026-08-20T12:05:00.000Z",
  };
  const ledger = createRevenueAttributionLedgerReport({
    tenantId: context.tenantId,
    window: "all_time",
    sourceSpend: [
      {
        tenantId: context.tenantId,
        source: "website",
        periodStart: "2026-08-01T00:00:00.000Z",
        periodEnd: "2026-08-20T00:00:00.000Z",
        spendCents: 100_00,
        recordedBy: "operator",
        evidenceSource: "manual_invoice",
        verificationStatus: "VERIFIED",
      },
    ],
    leadOutcomes: [],
    appointmentOutcomes: [],
    contractOutcomes: [],
    closedRevenueOutcomes: [],
  });
  const work = createTodaysRevenueWork({ leads: [lead], ledger, now: new Date("2026-08-20T13:00:00.000Z") });

  assert.equal(work.summary.providerCalled, false);
  assert.equal(work.summary.sent, false);
  assert.equal(work.items.some((item) => item.category === "hot_new_lead"), true);
  assert.equal(work.items.some((item) => item.category === "overdue_follow_up"), true);
  assert.equal(work.items.some((item) => item.category === "spend_without_contracts"), true);
});
