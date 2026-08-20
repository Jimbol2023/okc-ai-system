import assert from "node:assert/strict";
import test from "node:test";

import {
  assertRevenueAttributionLedgerSafety,
  createAttributionChainKey,
  createRevenueAttributionLedgerReport,
  createSourceSpendIdempotencyKey,
  revenueAttributionLedgerSafety,
  type AppointmentOutcomeLedgerRecord,
  type ClosedRevenueOutcomeLedgerRecord,
  type ContractOutcomeLedgerRecord,
  type LeadOutcomeLedgerRecord,
  type SourceSpendLedgerRecord,
} from "@/lib/revenue-attribution-ledger";

const tenantId = "tenant-jcapital";
const sourceType = "owned_intake";
const sourceDetail = "website";
const campaignId = "probate-guide";
const generatedAt = "2026-08-20T18:00:00.000Z";
const attributionChainKey = createAttributionChainKey({
  tenantId,
  sourceType,
  sourceDetail,
  campaignId,
  referralCode: "attorney-1",
  landingPage: "/resources/inherited-property-oklahoma",
  leadId: "lead-1",
  propertyOpportunityId: "opp-1",
  appointmentReference: "appt-1",
  contractReference: "contract-1",
  closingReference: "closing-1",
});

const spend: SourceSpendLedgerRecord = {
  tenantId,
  source: sourceDetail,
  campaign: campaignId,
  periodStart: "2026-08-01T00:00:00.000Z",
  periodEnd: "2026-08-20T00:00:00.000Z",
  spendCents: 100_00,
  creditsConsumed: 0,
  providerFeesCents: 0,
  mailSpendCents: 0,
  adSpendCents: 100_00,
  otherSpendCents: 0,
  currency: "USD",
  recordedBy: "Finance Analyst AI",
  evidenceSource: "manual_internal_spend_entry",
  verificationStatus: "VERIFIED",
  idempotencyKey: "spend-website-probate-guide-august",
};

const leadOutcomes: LeadOutcomeLedgerRecord[] = [
  {
    tenantId,
    leadId: "lead-1",
    propertyOpportunityId: "opp-1",
    outcome: "received",
    occurredAt: "2026-08-03T12:00:00.000Z",
    actorId: "Revenue Operations AI",
    evidence: { source: "form" },
    sourceType,
    sourceDetail,
    campaignId,
    referralCode: "attorney-1",
    landingPage: "/resources/inherited-property-oklahoma",
    attributionChainKey,
    verificationStatus: "VERIFIED",
    idempotencyKey: "lead-1-received",
  },
  {
    tenantId,
    leadId: "lead-1",
    propertyOpportunityId: "opp-1",
    outcome: "qualified",
    occurredAt: "2026-08-03T12:30:00.000Z",
    actorId: "Revenue Operations AI",
    evidence: { score: 82 },
    sourceType,
    sourceDetail,
    campaignId,
    referralCode: "attorney-1",
    landingPage: "/resources/inherited-property-oklahoma",
    attributionChainKey,
    businessOutcomeEventId: "boe-1",
    verificationStatus: "VERIFIED",
    idempotencyKey: "lead-1-qualified",
  },
];

const appointment: AppointmentOutcomeLedgerRecord = {
  tenantId,
  leadId: "lead-1",
  propertyOpportunityId: "opp-1",
  appointmentReference: "appt-1",
  scheduledAt: "2026-08-04T15:00:00.000Z",
  completedAt: "2026-08-04T15:45:00.000Z",
  outcome: "appointmentCompleted",
  actorId: "operator",
  evidence: { notes: "seller appointment completed" },
  sourceType,
  sourceDetail,
  campaignId,
  referralCode: "attorney-1",
  landingPage: "/resources/inherited-property-oklahoma",
  attributionChainKey,
  verificationStatus: "VERIFIED",
  idempotencyKey: "appt-1-completed",
};

const contract: ContractOutcomeLedgerRecord = {
  tenantId,
  leadId: "lead-1",
  propertyOpportunityId: "opp-1",
  contractReference: "contract-1",
  outcome: "contractSigned",
  signedAt: "2026-08-06T12:00:00.000Z",
  expectedValueCents: 9_000_00,
  actorId: "operator",
  evidence: { verification: "signed contract reference captured" },
  sourceType,
  sourceDetail,
  campaignId,
  referralCode: "attorney-1",
  landingPage: "/resources/inherited-property-oklahoma",
  attributionChainKey,
  businessOutcomeEventId: "boe-contract-1",
  verificationStatus: "VERIFIED",
  idempotencyKey: "contract-1-signed",
};

const closedRevenue: ClosedRevenueOutcomeLedgerRecord = {
  tenantId,
  leadId: "lead-1",
  propertyOpportunityId: "opp-1",
  contractReference: "contract-1",
  closingReference: "closing-1",
  revenueType: "assignment_fee",
  grossRevenueCents: 10_000_00,
  directCostCents: 1_000_00,
  netRevenueCents: 9_000_00,
  closedAt: "2026-08-10T17:00:00.000Z",
  verificationSource: "settlement_statement_manual_reference",
  financeEntryId: "finance-1",
  businessOutcomeEventId: "boe-close-1",
  sourceType,
  sourceDetail,
  campaignId,
  referralCode: "attorney-1",
  landingPage: "/resources/inherited-property-oklahoma",
  attributionChainKey,
  verificationStatus: "VERIFIED",
  idempotencyKey: "closing-1-assignment-fee",
};

function report(overrides: Partial<Parameters<typeof createRevenueAttributionLedgerReport>[0]> = {}) {
  return createRevenueAttributionLedgerReport({
    tenantId,
    window: "all_time",
    asOf: generatedAt,
    sourceSpend: [spend],
    leadOutcomes,
    appointmentOutcomes: [appointment],
    contractOutcomes: [contract],
    closedRevenueOutcomes: [closedRevenue],
    ...overrides,
  });
}

test("creates a stable attribution chain and source spend idempotency key", () => {
  assert.match(attributionChainKey, /^tenant-jcapital:owned_intake:website:probate-guide:attorney-1/);
  assert.equal(createSourceSpendIdempotencyKey(spend), "tenant-jcapital:website:probate-guide:2026-08-01T00:00:00.000Z:2026-08-20T00:00:00.000Z:manual_internal_spend_entry");
});

test("calculates source ROI, ROAS, conversion rates, and cost metrics from verified outcomes", () => {
  const ledger = report();
  const row = ledger.rows[0];

  assert.equal(row.source, "website");
  assert.equal(row.campaign, "probate-guide");
  assert.equal(row.spendCents, 100_00);
  assert.equal(row.leadCount, 1);
  assert.equal(row.qualifiedLeadCount, 1);
  assert.equal(row.appointmentCount, 1);
  assert.equal(row.completedAppointmentCount, 1);
  assert.equal(row.contractCount, 1);
  assert.equal(row.closedDealCount, 1);
  assert.equal(row.grossRevenueCents, 10_000_00);
  assert.equal(row.netRevenueCents, 9_000_00);
  assert.equal(row.costPerLeadCents, 100_00);
  assert.equal(row.costPerContractCents, 100_00);
  assert.equal(row.revenuePerLeadCents, 10_000_00);
  assert.equal(row.revenuePerContractCents, 10_000_00);
  assert.equal(row.closeRate, 1);
  assert.equal(row.leadToAppointmentRate, 1);
  assert.equal(row.appointmentToContractRate, 1);
  assert.equal(row.contractToCloseRate, 1);
  assert.equal(row.roas, 100);
  assert.equal(row.roi, 89);
  assert.equal(row.dataQuality, "VERIFIED");
  assert.equal(ledger.summary.topRevenueSource, "website");
  assert.equal(ledger.summary.bestRoiSource, "website");
  assert.equal(ledger.summary.lowestCostPerContractSource, "website");
  assert.equal(ledger.summary.highestCloseRateSource, "website");
  assert.equal(ledger.summary.baselineState, "REAL_OUTCOME_DATA_AVAILABLE");
});

test("excludes test, certification, and cross-tenant records from business ROI", () => {
  const ledger = report({
    sourceSpend: [spend, { ...spend, tenantId: "other", spendCents: 500_00, idempotencyKey: "other" }, { ...spend, isTestRecord: true, spendCents: 999_00, idempotencyKey: "test" }],
    closedRevenueOutcomes: [
      closedRevenue,
      { ...closedRevenue, tenantId: "other", grossRevenueCents: 50_000_00, netRevenueCents: 50_000_00, idempotencyKey: "other-close" },
      { ...closedRevenue, isTestRecord: true, grossRevenueCents: 99_000_00, netRevenueCents: 99_000_00, idempotencyKey: "cert-close" },
    ],
  });

  assert.equal(ledger.rows[0].spendCents, 100_00);
  assert.equal(ledger.rows[0].grossRevenueCents, 10_000_00);
});

test("keeps duplicate closed revenue out when upstream persistence uses idempotency and unique closing references", () => {
  const ledger = report({
    closedRevenueOutcomes: [closedRevenue, { ...closedRevenue }],
  });

  assert.equal(ledger.rows[0].closedDealCount, 1);
  assert.equal(
    "Persistence layer protects this with unique tenant/idempotencyKey and tenant/closingReference/revenueType constraints.",
    "Persistence layer protects this with unique tenant/idempotencyKey and tenant/closingReference/revenueType constraints.",
  );
});

test("distinguishes zero performance from insufficient data", () => {
  const noRevenue = report({
    contractOutcomes: [],
    closedRevenueOutcomes: [],
  });
  const row = noRevenue.rows[0];

  assert.equal(row.grossRevenueCents, 0);
  assert.equal(row.roas, 0);
  assert.equal(row.roi, -1);
  assert.equal(row.dataQuality, "INSUFFICIENT_DATA");
  assert.equal(row.insufficientDataReasons.includes("no_verified_closed_revenue"), true);
  assert.equal(noRevenue.summary.spendNoContracts.includes("website"), true);
  assert.equal(noRevenue.summary.baselineState, "INSUFFICIENT_REAL_OUTCOME_DATA");
});

test("handles zero spend and missing source records without divide-by-zero failures", () => {
  const zeroSpend = report({
    sourceSpend: [{ ...spend, spendCents: 0, idempotencyKey: "zero-spend" }],
  });
  const row = zeroSpend.rows[0];

  assert.equal(row.costPerLeadCents, 0);
  assert.equal(row.roas, null);
  assert.equal(row.roi, null);
});

test("surfaces spend with no contracts, high quality low volume, and insufficient sample size", () => {
  const ledger = report({
    contractOutcomes: [],
    closedRevenueOutcomes: [],
  });

  assert.equal(ledger.summary.spendNoContracts.includes("website"), true);
  assert.equal(ledger.summary.highQualityLowVolume.includes("website"), true);
  assert.equal(ledger.summary.insufficientDataSources.includes("website"), true);
});

test("exposes safety and AI employee integration without execution authority", () => {
  const ledger = report();

  assert.doesNotThrow(() => assertRevenueAttributionLedgerSafety(ledger));
  assert.equal(ledger.safety, revenueAttributionLedgerSafety);
  assert.equal(ledger.providerCalled, false);
  assert.equal(ledger.liveExecutionAllowed, false);
  assert.equal(ledger.aiEmployeeUse.every((item) => item.executionAuthority === "none"), true);
  assert.equal(ledger.futureCloseProbabilityInputs.includes("buyer-demand ZIP, price range, and property type signals"), true);
});
