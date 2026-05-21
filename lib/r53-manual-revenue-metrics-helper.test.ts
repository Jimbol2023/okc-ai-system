import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertManualRevenueMetricsInvariants,
  deriveManualRevenueMetrics,
  type R53ManualRevenueMetricsResult,
} from "./r53-manual-revenue-metrics-helper";

function assertSafety(result: R53ManualRevenueMetricsResult) {
  const invariantCheck = assertManualRevenueMetricsInvariants(result);

  assert.equal(result.sourceMode, "in_memory_input_only");
  assert.equal(result.readOnly, true);
  assert.equal(result.persistenceWritten, false);
  assert.equal(result.providerCalled, false);
  assert.equal(result.sent, false);
  assert.equal(result.automationExecuted, false);
  assert.equal(result.pollingEnabled, false);
  assert.equal(result.liveExecutionAllowed, false);
  assert.equal(result.simulationOnly, true);
  assert.equal(result.advisoryOnly, true);
  assert.equal(invariantCheck.passed, true);
  assert.deepEqual(invariantCheck.warningCodes, []);
}

describe("R53 manual revenue metrics helper", () => {
  it("empty input returns zero metrics and preserves safety flags", () => {
    const result = deriveManualRevenueMetrics();

    assert.equal(result.inputRecordsProvided, 0);
    assert.equal(result.inputRecordsProcessed, 0);
    assert.equal(result.metricValues.total_leads_provided, 0);
    assert.equal(result.metricValues.leads_needing_review, 0);
    assert.equal(result.metricValues.manual_seller_calls_recorded, 0);
    assert.equal(result.referenceDateSource, "omitted_or_invalid");
    assertSafety(result);
  });

  it("derives mixed lead status counts from in-memory records", () => {
    const result = deriveManualRevenueMetrics({
      leads: [
        {
          status: "new",
          reviewStatus: "reviewed",
          source: "tax list",
          address: "123 Main",
          phone: "555-0100",
          motivation: "repairs",
          timeline: "30 days",
          manualSellerCallRecorded: true,
          sellerOutcome: "interested",
          buyerReady: true,
          buyerPackageComplete: true,
          stage: "near_contract",
          humanReviewRequired: true,
        },
        {
          status: "blocked",
          source: "driving",
          propertyAddress: "456 Oak",
          sellerPhone: "555-0101",
          sellerMotivation: "vacant",
          sellerTimeline: "soon",
          blockedReason: "missing review",
          governanceBlocked: true,
        },
      ],
    });

    assert.equal(result.metricValues.total_leads_provided, 2);
    assert.equal(result.metricValues.leads_needing_review, 1);
    assert.equal(result.metricValues.manually_reviewed_leads, 1);
    assert.equal(result.metricValues.manual_seller_calls_recorded, 1);
    assert.equal(result.metricValues.seller_outcomes_recorded, 1);
    assert.equal(result.metricValues.buyer_ready_leads, 1);
    assert.equal(result.metricValues.near_contract_opportunities, 1);
    assert.equal(result.metricValues.blocked_leads, 1);
    assert.equal(result.metricValues.governance_blocked_count, 1);
    assert.equal(result.metricValues.human_review_required_count, 1);
    assertSafety(result);
  });

  it("counts DNC and opt-out blocked leads", () => {
    const result = deriveManualRevenueMetrics({
      leads: [
        { dnc: true, source: "list", address: "1 A", phone: "1", motivation: "x", timeline: "x" },
        { complianceStatus: "opt_out", source: "list", address: "2 B", phone: "2", motivation: "x", timeline: "x" },
        { status: "do_not_contact", source: "list", address: "3 C", phone: "3", motivation: "x", timeline: "x" },
      ],
    });

    assert.equal(result.metricValues.dnc_opt_out_blocked_leads, 3);
    assertSafety(result);
  });

  it("counts due and overdue manual follow-ups with a provided reference date", () => {
    const result = deriveManualRevenueMetrics({
      referenceDate: "2026-05-21T12:00:00.000Z",
      leads: [
        { nextFollowUpAt: "2026-05-20T12:00:00.000Z" },
        { followUpDueAt: "2026-05-21T12:00:00.000Z" },
        { nextFollowUpDate: "2026-05-22T12:00:00.000Z" },
      ],
    });

    assert.equal(result.referenceDateSource, "provided");
    assert.equal(result.metricValues.manual_follow_ups_due, 3);
    assert.equal(result.metricValues.manual_follow_ups_overdue, 1);
    assertSafety(result);
  });

  it("does not use nondeterministic overdue logic without a valid reference date", () => {
    const result = deriveManualRevenueMetrics({
      referenceDate: "not-a-date",
      leads: [{ nextFollowUpAt: "2020-01-01T00:00:00.000Z" }],
    });

    assert.equal(result.referenceDateSource, "omitted_or_invalid");
    assert.equal(result.metricValues.manual_follow_ups_due, 1);
    assert.equal(result.metricValues.manual_follow_ups_overdue, 0);
    assert.ok(result.warningCodes.includes("invalid_reference_date_ignored"));
    assertSafety(result);
  });

  it("counts missing critical data without inventing facts", () => {
    const result = deriveManualRevenueMetrics({
      leads: [
        { source: "tax list", address: "123 Main", phone: "555", motivation: "vacant", timeline: "30 days" },
        { address: "456 Oak", phone: "555" },
        { source: "web", motivation: "repairs", timeline: "soon" },
      ],
    });

    assert.equal(result.metricValues.missing_critical_data_count, 2);
    assertSafety(result);
  });

  it("distinguishes buyer-ready leads from incomplete buyer packages", () => {
    const result = deriveManualRevenueMetrics({
      leads: [
        { buyerReady: true, buyerPackageComplete: true },
        { buyerReadiness: "buyer_ready", buyerPackageStatus: "incomplete" },
        { dispositionStatus: "disposition_ready" },
      ],
    });

    assert.equal(result.metricValues.buyer_ready_leads, 3);
    assert.equal(result.metricValues.incomplete_buyer_packages, 2);
    assertSafety(result);
  });

  it("counts near-contract and near-close opportunities", () => {
    const result = deriveManualRevenueMetrics({
      leads: [
        { pipelineStage: "offer_ready" },
        { stage: "pending_contract" },
        { status: "under_contract" },
        { pipelineStage: "closing_ready" },
      ],
    });

    assert.equal(result.metricValues.near_contract_opportunities, 2);
    assert.equal(result.metricValues.near_close_opportunities, 2);
    assertSafety(result);
  });

  it("excludes unsafe runtime provider automation and persistence metrics", () => {
    const result = deriveManualRevenueMetrics();
    const excludedIds = result.excludedUnsafeMetrics.map((metric) => metric.id);
    const metricIds = result.metrics.map((metric) => metric.id);

    assert.ok(excludedIds.includes("live_send_count"));
    assert.ok(excludedIds.includes("provider_delivery_count"));
    assert.ok(excludedIds.includes("twilio_success_failure_count"));
    assert.ok(excludedIds.includes("automation_agent_cycle_count"));
    assert.ok(excludedIds.includes("autonomous_follow_up_count"));
    assert.ok(excludedIds.includes("persistence_backed_audit_log_count"));
    assert.equal(metricIds.includes("live_send_count" as never), false);
    assert.equal(metricIds.includes("provider_delivery_count" as never), false);
    assertSafety(result);
  });

  it("bounds input processing and records bounded-input warnings", () => {
    const leads = Array.from({ length: 6 }, (_, index) => ({
      status: index % 2 === 0 ? "new" : "reviewed",
      source: "list",
      address: `${index} Main`,
      phone: "555",
      motivation: "seller",
      timeline: "soon",
    }));
    const result = deriveManualRevenueMetrics({ leads, maxRecords: 3 });

    assert.equal(result.inputRecordsProvided, 6);
    assert.equal(result.inputRecordsProcessed, 3);
    assert.equal(result.inputRecordsSkippedByBound, 3);
    assert.equal(result.metricValues.total_leads_provided, 6);
    assert.equal(result.metricValues.leads_needing_review, 2);
    assert.ok(result.warningCodes.includes("input_bounded"));
    assertSafety(result);
  });

  it("tolerates malformed input records without throwing", () => {
    const result = deriveManualRevenueMetrics({
      leads: [
        null,
        "not-a-record",
        17,
        { status: "needs_review", source: "web", address: "123", phone: "555", motivation: "x", timeline: "x" },
      ],
    });

    assert.equal(result.inputRecordsProvided, 4);
    assert.equal(result.inputRecordsProcessed, 1);
    assert.equal(result.metricValues.leads_needing_review, 1);
    assert.ok(result.warningCodes.includes("malformed_records_skipped"));
    assertSafety(result);
  });

  it("classifies every included metric as read-only safe now or safe future derived", () => {
    const result = deriveManualRevenueMetrics();
    const allowedClassifications = new Set(["safe_read_only_now", "safe_future_derived_metric"]);

    assert.ok(result.metrics.every((metric) => metric.readOnly === true));
    assert.ok(result.metrics.every((metric) => allowedClassifications.has(metric.dataSourceSafety)));
    assertSafety(result);
  });
});
