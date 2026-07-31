import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { GET as knowledgeDecisionGet, POST as knowledgeDecisionPost } from "../app/(dashboard)/dashboard/knowledge/decision/route";
import { AUTH_COOKIE_NAME, createSessionToken } from "./auth";
import { createArchitectureImprovementBacklog, createExecutiveDashboardReport, createExecutiveRecommendations, createExecutiveWorkforceReport, createOperatingCompanyReport, createRevenueCommandCenter } from "./executive-dashboard";
import type { BusinessIntelligenceReport } from "./business-intelligence";
import { createInheritedPropertyCampaignDirective, runCompanyOrchestrator } from "./company-orchestrator";
import { createContentIntelligenceReport } from "./content-intelligence";
import { createMarketingPlatformRegistryReport } from "./marketing-platform-registry";
import { readOnlyBusinessSafetyFlags, setReadOnlyBusinessConnectionsDbForTest, type BusinessDataSnapshotRecord } from "./read-only-business-connections";

process.env.AUTH_SECRET ||= "test-auth-secret-for-json-route-coverage-12345";
process.env.ADMIN_EMAIL ||= "moses@example.com";
process.env.ADMIN_PASSWORD ||= "test-password-12345";

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

describe("operating company report", () => {
  it("coordinates all departments toward deal closing without granting execution", () => {
    const report = createOperatingCompanyReport({
      followUpsDue: 3,
      offerReadyCount: 2,
      missingInfoCount: 4,
      marketingAwaitingApproval: 1,
      canvaAwaitingDesign: 1,
      providerMissingCount: 2,
      financeGapCount: 1,
      qualifiedLeads: 5,
      newLeadsToday: 2,
      revenuePipeline: {
        actionableLeads: 4,
      } as never,
      websiteSeoReady: true,
      activeKnowledgeItems: 6,
    });

    assert.equal(report.closeGoal, "2-5 deals/month");
    assert.equal(report.departmentCommandMatrix.filter((item) => item.lifecycleStatus === "active").length, 21);
    assert.equal(report.departmentCommandMatrix.filter((item) => item.lifecycleStatus !== "active").length, 11);
    assert.equal(report.safetyFlags.providerCalled, false);
    assert.equal(report.safetyFlags.liveExecutionAllowed, false);
    assert.equal(report.safetyFlags.externalActionsBlocked, true);
    assert.ok(report.departmentCommandMatrix.some((item) => item.department === "Revenue AI" && item.nextHandoff.includes("Approval AI")));
    assert.ok(report.departmentCommandMatrix.some((item) => item.department === "Driving for Dollars AI" && /requires CEO-approved/i.test(item.blocker)));
    assert.ok(report.departmentCommandMatrix.some((item) => item.department === "Google Maps AI" && /blocked/i.test(item.blocker)));
    assert.ok(report.departmentCommandMatrix.every((item) => item.approvalRequired));
    assert.ok(report.departmentCommandMatrix.every((item) => item.providerCalled === false));
    assert.ok(report.departmentCommandMatrix.every((item) => item.liveExecutionAllowed === false));
    assert.ok(report.departmentCommandMatrix.filter((item) => item.lifecycleStatus === "active").every((item) => item.activeExecutionOwner === true));
    assert.ok(report.departmentCommandMatrix.filter((item) => item.lifecycleStatus !== "active").every((item) => item.activeExecutionOwner === false));
  });

  it("keeps the deal-closing work queue source-labeled and manual", () => {
    const report = createOperatingCompanyReport({
      followUpsDue: 0,
      offerReadyCount: 0,
      missingInfoCount: 0,
      marketingAwaitingApproval: 0,
      canvaAwaitingDesign: 0,
      providerMissingCount: 0,
      financeGapCount: 0,
      qualifiedLeads: 0,
      newLeadsToday: 0,
      revenuePipeline: {
        actionableLeads: 0,
      } as never,
      websiteSeoReady: false,
      activeKnowledgeItems: 0,
    });

    assert.ok(report.dealClosingWorkQueue.some((item) => item.id === "d4d_county_review"));
    assert.ok(report.dealClosingWorkQueue.some((item) => item.id === "offer_ready_review"));
    assert.ok(report.dealClosingWorkQueue.every((item) => item.sourceLabel.length > 0));
    assert.ok(report.dealClosingWorkQueue.every((item) => item.assumption.length > 0));
    assert.ok(report.dealClosingWorkQueue.every((item) => !/send now|publish now|scrape now|activate provider/i.test(item.nextManualAction)));
    assert.ok(report.dealClosingWorkQueue.some((item) => /No map crawling/i.test(item.safetyBoundary)));
  });

  it("keeps architecture improvement backlog approval-gated and source-backed", () => {
    const backlog = createArchitectureImprovementBacklog();

    assert.equal(backlog.length, 7);
    assert.ok(backlog.some((item) => item.id === "identity-rbac-foundation"));
    assert.ok(backlog.some((item) => item.id === "api-contract-standardization"));
    assert.ok(backlog.every((item) => item.ownerDepartment.length > 0));
    assert.ok(backlog.every((item) => item.businessValue.length > 0));
    assert.ok(backlog.every((item) => item.nextSafeAction.length > 0));
    assert.ok(backlog.every((item) => item.ceoApprovalRequired === true));
    assert.ok(backlog.every((item) => item.sourceBasis.length > 0));
    assert.ok(backlog.every((item) => item.sourceBasis.every((source) => source.category.length > 0 && source.label.length > 0 && source.reference.length > 0)));
    assert.ok(backlog.flatMap((item) => item.sourceBasis).some((source) => source.category === "official_vendor_doc"));
    assert.ok(backlog.flatMap((item) => item.sourceBasis).some((source) => source.category === "maintained_oss_pattern"));
    assert.ok(backlog.every((item) => item.providerCalled === false));
    assert.ok(backlog.every((item) => item.liveExecutionAllowed === false));
    assert.ok(backlog.every((item) => item.externalExecutionAllowed === false));
  });

  it("preserves handoff readiness as read-only advisory workflow context", () => {
    const report = createOperatingCompanyReport({
      followUpsDue: 2,
      offerReadyCount: 1,
      missingInfoCount: 3,
      marketingAwaitingApproval: 1,
      canvaAwaitingDesign: 0,
      providerMissingCount: 2,
      financeGapCount: 1,
      qualifiedLeads: 4,
      newLeadsToday: 1,
      revenuePipeline: {
        actionableLeads: 2,
      } as never,
      websiteSeoReady: true,
      activeKnowledgeItems: 5,
    });

    assert.equal(report.workflowHandoffReadiness.length, report.dealClosingWorkQueue.length);
    assert.ok(report.workflowHandoffReadiness.every((item) => item.currentOwner.length > 0));
    assert.ok(report.workflowHandoffReadiness.every((item) => item.nextDepartment.length > 0));
    assert.ok(report.workflowHandoffReadiness.every((item) => item.blocker.length > 0));
    assert.ok(report.workflowHandoffReadiness.every((item) => item.evidenceRequired.length > 0));
    assert.ok(report.workflowHandoffReadiness.every((item) => item.approvalRequirement.includes("CEO approval")));
    assert.ok(report.workflowHandoffReadiness.every((item) => item.providerCalled === false));
    assert.ok(report.workflowHandoffReadiness.every((item) => item.liveExecutionAllowed === false));
    assert.ok(report.workflowHandoffReadiness.every((item) => item.outreachBlocked === true));
    assert.ok(report.workflowHandoffReadiness.every((item) => item.scrapingBlocked === true));
    assert.ok(report.workflowHandoffReadiness.every((item) => item.workflowStarted === false));
  });
});

describe("knowledge page decision compatibility route", () => {
  it("returns JSON for unsupported methods instead of an HTML response", async () => {
    const response = await knowledgeDecisionGet();
    const data = await response.json();

    assert.equal(response.status, 405);
    assert.match(response.headers.get("content-type") ?? "", /application\/json/);
    assert.equal(data.ok, false);
    assert.equal(data.providerCalled, false);
    assert.equal(data.liveExecutionAllowed, false);
    assert.equal(data.externalExecutionAllowed, false);
  });

  it("returns JSON for invalid authenticated decision payloads without provider or execution authority", async () => {
    const token = await createSessionToken("moses@example.com");
    const response = await knowledgeDecisionPost(
      new Request("https://jcapitalpropertygroup.com/dashboard/knowledge/decision", {
        method: "POST",
        headers: {
          cookie: `${AUTH_COOKIE_NAME}=${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({ decision: "approve 001" }),
      }),
    );
    const data = await response.json();

    assert.equal(response.status, 400);
    assert.match(response.headers.get("content-type") ?? "", /application\/json/);
    assert.equal(data.ok, false);
    assert.equal(data.providerCalled, false);
    assert.equal(data.sent, false);
    assert.equal(data.published, false);
    assert.equal(data.liveExecutionAllowed, false);
    assert.equal(data.externalExecutionAllowed, false);
  });
});

describe("daily startup", () => {
  it("surfaces a CEO decision agenda without activation or provider execution", async () => {
    const report = await createExecutiveDashboardReport();

    assert.equal(report.dailyStartup.companyOperatingMode, "daily_startup_ready");
    assert.equal(report.dailyStartup.safety.providerCalled, false);
    assert.equal(report.dailyStartup.safety.liveExecutionAllowed, false);
    assert.equal(report.dailyStartup.safety.publishingBlocked, true);
    assert.equal(report.dailyStartup.safety.emailBlocked, true);
    assert.equal(report.dailyStartup.safety.smsBlocked, true);
    assert.equal(report.dailyStartup.safety.scrapingBlocked, true);
    assert.equal(report.dailyStartup.safety.adsBlocked, true);
    assert.equal(report.dailyStartup.safety.outreachBlocked, true);
    assert.equal(report.dailyStartup.safety.workflowExecutionBlocked, true);
    assert.equal(report.dailyStartup.safety.recommendationsOnly, true);
    assert.ok(report.dailyStartup.active_executive_directives.some((directive) => directive.id === "campaign-001"));
    assert.ok(report.dailyStartup.ceo_decision_agenda.some((item) => item.title.includes("Inherited Property") && item.recommended_action === "approve"));
    assert.ok(report.dailyStartup.blocked_items.some((item) => /No department work starts/i.test(item)));
    assert.ok(report.dailyStartup.ceo_decision_agenda.every((item) => item.approval_required));
  });

  it("surfaces GA4 governed read-only metrics as dashboard widgets without execution controls", async () => {
    const ga4Snapshot: BusinessDataSnapshotRecord = {
      tenantId: "default",
      contractVersion: "business-data-snapshot-v1",
      evidenceHash: "ga4-dashboard-hash",
      observationStart: "2026-07-01T00:00:00.000Z",
      observationEnd: "2026-07-10T00:00:00.000Z",
      snapshotDate: new Date("2026-07-11T00:00:00.000Z"),
      provider: "Google Analytics",
      connectorId: "google_analytics",
      category: "google_analytics_traffic",
      status: "fresh",
      sourceLabel: "ueip:ga4:analytics_page_performance_read:readonly",
      provenance: "GA4 dashboard fixture.",
      freshness: "2026-07-11T00:00:00.000Z",
      summary: "42 sessions, 20 active users, and 3 key events across top GA4 pages.",
      metrics: { sessions: 42, activeUsers: 20, pageViews: 88, keyEvents: 3, topPages: 4 },
      records: [{ dimension: "/moore", sessions: 12 }],
      dataGaps: [],
      assumptions: [],
      safetyFlags: readOnlyBusinessSafetyFlags,
      providerCalled: false,
      sent: false,
      published: false,
      crmMutated: false,
      liveExecutionAllowed: false,
    };
    const gbpPerformanceSnapshot: BusinessDataSnapshotRecord = {
      ...ga4Snapshot,
      evidenceHash: "gbp-performance-dashboard-hash",
      provider: "Google Business Profile",
      connectorId: "google_business_profile",
      category: "google_business_profile_performance",
      sourceLabel: "ueip:gbp:gbp_performance_read:readonly",
      provenance: "GBP performance dashboard fixture.",
      summary: "GBP local visibility evidence is visible.",
      metrics: { metricSeries: 2, callClicks: 5, directionRequests: 3 },
      records: [{ metric: "CALL_CLICKS", total: 5 }],
    };
    const gbpReviewsSnapshot: BusinessDataSnapshotRecord = {
      ...ga4Snapshot,
      evidenceHash: "gbp-reviews-dashboard-hash",
      provider: "Google Business Profile",
      connectorId: "google_business_profile",
      category: "google_business_profile_reviews",
      sourceLabel: "ueip:gbp:gbp_reviews_read:readonly",
      provenance: "GBP reviews dashboard fixture.",
      summary: "GBP review readiness evidence is visible.",
      metrics: { reviews: 6, reviewRows: 6 },
      records: [{ reviewId: "r1", starRating: "FIVE" }],
    };
    const restore = setReadOnlyBusinessConnectionsDbForTest({
      businessDataSnapshot: {
        async upsert() { return ga4Snapshot; },
        async findMany() { return [ga4Snapshot, gbpPerformanceSnapshot, gbpReviewsSnapshot]; },
      },
      dailyBriefingSnapshot: {
        async create() { return {}; },
        async findFirst() { return null; },
      },
    } as never);
    try {
      const report = await createExecutiveDashboardReport();
      const widgetIds = report.widgets.map((widget) => widget.id);
      assert.ok(widgetIds.includes("ga4_sessions"));
      assert.ok(widgetIds.includes("ga4_top_pages"));
      assert.ok(widgetIds.includes("ga4_key_events"));
      assert.ok(widgetIds.includes("gbp_local_visibility"));
      assert.ok(widgetIds.includes("gbp_reviews"));
      assert.equal(report.widgets.find((widget) => widget.id === "ga4_sessions")?.value, 42);
      assert.equal(report.widgets.find((widget) => widget.id === "ga4_key_events")?.value, 3);
      assert.equal(report.widgets.find((widget) => widget.id === "gbp_local_visibility")?.value, 2);
      assert.equal(report.widgets.find((widget) => widget.id === "gbp_reviews")?.value, 6);
      assert.equal(JSON.stringify(report.widgets).includes("provider_write"), false);
      assert.equal(report.safetyFlags.outreachSent, false);
      assert.equal(report.safetyFlags.adsCreated, false);
      assert.equal(report.safetyFlags.scrapingStarted, false);
    } finally {
      restore();
    }
  });
});
