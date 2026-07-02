import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createContentIntelligenceReport } from "./content-intelligence";
import type { BusinessIntelligenceReport } from "./business-intelligence";

describe("content intelligence", () => {
  it("recommends create, refresh, repurpose, and source-topic focus without execution", () => {
    const report = createContentIntelligenceReport({
      marketingDrafts: [
        {
          id: "draft-1",
          topic: "How to Sell an Inherited House in Oklahoma",
          title: "Inherited property guide",
          status: "approved",
          sourceLabel: "facebook",
          canvaAssetAssists: [],
        },
      ] as never,
      knowledgeItems: [
        {
          id: "knowledge-1",
          title: "Probate Basics Oklahoma Property Owners",
          category: "seller_education",
          content: "Educational content",
          tags: [],
          status: "active",
          source: "manual",
          createdAt: new Date("2025-01-01T00:00:00.000Z"),
          updatedAt: new Date("2025-01-01T00:00:00.000Z"),
        },
      ],
      businessIntelligence: {
        summary: {
          topChannel: {
            source: "facebook",
            totalLeads: 8,
            qualifiedLeads: 4,
            closedLeads: 1,
            conversionRate: 13,
            qualifiedShare: 50,
          },
        },
      } as BusinessIntelligenceReport,
      performanceSnapshots: [
        {
          topic: "Inherited houses in Oklahoma",
          sourceLabel: "manual_content_snapshot",
          qualifiedLeads: 3,
          totalLeads: 5,
          engagementScore: 72,
          conversionScore: 60,
        },
      ],
    });

    assert.equal(report.department, "Content Intelligence AI");
    assert.equal(report.safety.providerCalled, false);
    assert.equal(report.safety.liveExecutionAllowed, false);
    assert.equal(report.safety.analyticsApiCalled, false);
    assert.equal(report.safety.publishingBlocked, true);
    assert.equal(report.safety.scrapingBlocked, true);
    assert.deepEqual(new Set(report.recommendations.map((recommendation) => recommendation.type)), new Set(["create_next", "refresh", "repurpose", "source_topic_focus"]));

    for (const recommendation of report.recommendations) {
      assert.equal(recommendation.approvalRequired, true);
      assert.equal(recommendation.providerCalled, false);
      assert.equal(recommendation.liveExecutionAllowed, false);
      assert.equal(recommendation.publishingBlocked, true);
      assert.equal(recommendation.scrapingBlocked, true);
      assert.ok(recommendation.sourceLabel.length > 0);
      assert.ok(recommendation.assumption.length > 0);
      assert.ok(recommendation.score >= 0 && recommendation.score <= 100);
      assert.doesNotMatch(recommendation.recommendedBrief, /publish now|post now|scrape|call api/i);
    }
  });
});
