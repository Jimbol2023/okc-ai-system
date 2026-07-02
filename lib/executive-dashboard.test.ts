import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createExecutiveRecommendations, createExecutiveWorkforceReport, createRevenueCommandCenter } from "./executive-dashboard";
import type { BusinessIntelligenceReport } from "./business-intelligence";
import { createInheritedPropertyCampaignDirective, runCompanyOrchestrator } from "./company-orchestrator";
import { createContentIntelligenceReport } from "./content-intelligence";
import { createMarketingPlatformRegistryReport } from "./marketing-platform-registry";

describe("executive dashboard recommendations", () => {
  it("prioritizes daily revenue and cleanup work without execution", () => {
    const recommendations = createExecutiveRecommendations({
      followUpsDue: 2,
      missingInfoCount: 3,
      offerReadyCount: 1,
      marketingAwaitingApproval: 1,
      canvaAwaitingDesign: 1,
      financeGapCount: 2,
      providerMissingCount: 4,
    });

    assert.ok(recommendations.some((recommendation) => /follow-ups/i.test(recommendation)));
    assert.ok(recommendations.some((recommendation) => /missing seller\/property/i.test(recommendation)));
    assert.ok(recommendations.some((recommendation) => /finance entries/i.test(recommendation)));
    assert.ok(recommendations.every((recommendation) => !/send now|publish now|call provider/i.test(recommendation)));
  });

  it("returns a monitoring recommendation for clean state", () => {
    const recommendations = createExecutiveRecommendations({
      followUpsDue: 0,
      missingInfoCount: 0,
      offerReadyCount: 0,
      marketingAwaitingApproval: 0,
      canvaAwaitingDesign: 0,
      financeGapCount: 0,
      providerMissingCount: 0,
    });

    assert.deepEqual(recommendations, [
      "Monitor new leads, keep source tracking clean, and maintain manual review discipline.",
    ]);
  });
});

describe("revenue command center", () => {
  it("groups high-ROI daily signals without execution authority", () => {
    const report = createRevenueCommandCenter({
      newLeadsToday: 2,
      qualifiedLeads: 5,
      followUpsDue: 3,
      offerReadyCount: 2,
      missingInfoCount: 1,
      marketingAwaitingApproval: 4,
      canvaAwaitingDesign: 2,
      readyForManualPublish: 1,
      manuallyPublished: 1,
      providerMissingCount: 3,
      revenuePipeline: {
        actionableLeads: 4,
        closingBlockedLeads: 1,
        estimatedPipelineValueLabel: "$25,000",
        workFirstLeads: [{ id: "lead-1" }],
      } as never,
      financeKpis: {
        cashFlowCents: 150000,
        missingData: [],
      } as never,
      businessIntelligence: {
        summary: {
          topChannel: {
            source: "facebook",
            totalLeads: 6,
            qualifiedLeads: 3,
            closedLeads: 1,
            conversionRate: 17,
            qualifiedShare: 60,
          },
        },
      } as BusinessIntelligenceReport,
      referralSummary: {
        clickCount: 12,
        leadCount: 2,
        referralToLeadConversion: 17,
      } as never,
      websiteSeoReady: true,
      activeKnowledgeItems: 4,
    });

    assert.equal(report.title, "Revenue Command Center");
    assert.equal(report.safetyFlags.providerCalled, false);
    assert.equal(report.safetyFlags.liveExecutionAllowed, false);
    assert.equal(report.safetyFlags.externalActionsBlocked, true);
    assert.equal(report.safetyFlags.humanApprovalRequired, true);
    assert.ok(report.sections.some((section) => section.id === "revenue"));
    assert.ok(report.sections.some((section) => section.id === "marketing"));
    assert.ok(report.sections.some((section) => section.id === "seo"));
    assert.ok(report.sections.some((section) => section.id === "lead_intelligence"));
    assert.ok(report.nextBestActions.some((action) => /follow-ups/i.test(action)));
    assert.ok(report.nextBestActions.some((action) => /facebook/i.test(action)));
    assert.ok(report.highRoiDecisionFilter.some((filter) => /qualified seller leads/i.test(filter)));
  });

  it("keeps source labels and assumptions visible for lead-source recommendations", () => {
    const report = createRevenueCommandCenter({
      newLeadsToday: 0,
      qualifiedLeads: 0,
      followUpsDue: 0,
      offerReadyCount: 0,
      missingInfoCount: 0,
      marketingAwaitingApproval: 0,
      canvaAwaitingDesign: 0,
      readyForManualPublish: 0,
      manuallyPublished: 0,
      providerMissingCount: 0,
      revenuePipeline: {
        actionableLeads: 0,
        closingBlockedLeads: 0,
        estimatedPipelineValueLabel: "Unavailable",
        workFirstLeads: [],
      } as never,
      financeKpis: {
        cashFlowCents: 0,
        missingData: ["Manual finance entries needed."],
      } as never,
      businessIntelligence: {
        summary: {
          topChannel: null,
        },
      } as BusinessIntelligenceReport,
      referralSummary: null,
      websiteSeoReady: false,
      activeKnowledgeItems: 0,
    });

    const allItems = report.sections.flatMap((section) => section.items);

    assert.ok(allItems.every((item) => item.sourceLabel.length > 0));
    assert.ok(allItems.every((item) => item.assumption.length > 0));
    assert.ok(report.nextBestActions.every((action) => !/publish now|send now|call provider|scrape/i.test(action)));
    assert.equal(report.safetyFlags.publishingBlocked, true);
    assert.equal(report.safetyFlags.outreachBlocked, true);
    assert.equal(report.safetyFlags.scrapingBlocked, true);
    assert.equal(report.safetyFlags.adsBlocked, true);
  });
});

describe("executive workforce health", () => {
  it("surfaces revenue, brand, marketing, seo, content, lead, operations, and security health", () => {
    const businessIntelligence = {
      summary: {
        topChannel: {
          source: "facebook",
          totalLeads: 6,
          qualifiedLeads: 3,
          closedLeads: 1,
          conversionRate: 17,
          qualifiedShare: 60,
        },
      },
    } as BusinessIntelligenceReport;
    const brandHealth = createMarketingPlatformRegistryReport();
    const contentIntelligence = createContentIntelligenceReport({
      marketingDrafts: [],
      knowledgeItems: [],
      businessIntelligence,
    });
    const companyOrchestrator = runCompanyOrchestrator({
      directive: createInheritedPropertyCampaignDirective(),
    });
    const report = createExecutiveWorkforceReport({
      newLeadsToday: 2,
      qualifiedLeads: 3,
      followUpsDue: 1,
      offerReadyCount: 2,
      missingInfoCount: 1,
      marketingAwaitingApproval: 2,
      canvaAwaitingDesign: 1,
      providerMissingCount: 2,
      websiteSeoReady: true,
      activeKnowledgeItems: 4,
      revenuePipeline: {
        actionableLeads: 3,
        closingBlockedLeads: 1,
        estimatedPipelineValueLabel: "$25,000",
        workFirstLeads: [],
      } as never,
      financeKpis: {
        cashFlowCents: 100000,
        missingData: [],
      } as never,
      businessIntelligence,
      brandHealth,
      contentIntelligence,
      companyOrchestrator,
    });

    assert.deepEqual(report.healthCards.map((card) => card.id), [
      "revenue",
      "brand",
      "marketing",
      "seo",
      "content",
      "lead",
      "operations",
      "security",
    ]);
    assert.equal(report.brandHealth.safety.providerCalled, false);
    assert.equal(report.contentIntelligence.safety.providerCalled, false);
    assert.equal(report.contentIntelligence.safety.analyticsApiCalled, false);
    assert.equal(report.companyOrchestrator.internalName, "company-orchestrator");
    assert.equal(report.companyOrchestrator.safety.noDepartmentDirectCommunication, true);
    assert.equal(report.safetyFlags.liveExecutionAllowed, false);
    assert.equal(report.safetyFlags.publishingBlocked, true);
    assert.ok(report.healthCards.every((card) => card.sourceLabel.length > 0));
    assert.ok(report.healthCards.every((card) => card.assumption.length > 0));
  });
});
