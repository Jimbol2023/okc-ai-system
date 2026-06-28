import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { calculateFinanceKpis } from "./finance";

describe("finance KPI calculations", () => {
  it("reports missing finance data safely", () => {
    const result = calculateFinanceKpis({ entries: [], leadCount: 0 });

    assert.equal(result.totalMarketingSpendCents, 0);
    assert.equal(result.costPerLeadCents, null);
    assert.equal(result.costPerAcquisitionCents, null);
    assert.ok(result.missingData.includes("No manual finance entries have been recorded yet."));
    assert.equal(result.safetyFlags.providerCalled, false);
    assert.equal(result.safetyFlags.spendAutomated, false);
  });

  it("calculates CPL, CPA, gross profit, and cash flow from manual entries", () => {
    const result = calculateFinanceKpis({
      leadCount: 10,
      entries: [
        { entryType: "marketing_spend", amountCents: 100000, dealReference: null, leadId: null },
        { entryType: "deal_revenue", amountCents: 1200000, dealReference: "deal-1", leadId: null },
        { entryType: "deal_expense", amountCents: 200000, dealReference: "deal-1", leadId: null },
      ],
    });

    assert.equal(result.totalMarketingSpendCents, 100000);
    assert.equal(result.grossProfitCents, 1000000);
    assert.equal(result.cashFlowCents, 900000);
    assert.equal(result.costPerLeadCents, 10000);
    assert.equal(result.costPerAcquisitionCents, 100000);
    assert.equal(result.grossProfitPerDealCents, 1000000);
  });
});
