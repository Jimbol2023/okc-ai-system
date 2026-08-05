import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createDailyMissionFromInputs, dailyMissionSafetyFlags, type DailyMissionInputs } from "./daily-mission";
import { createDfdOperatingReportFromInputs } from "./dfd-operating-conductor";
import { readOnlyBusinessSafetyFlags, type LiveMorningBrief } from "./read-only-business-connections";

const morningBrief: LiveMorningBrief = {
  greeting: "Good Morning Moses",
  generatedAt: "2026-07-06T12:00:00.000Z",
  overnightSummary: ["2 new/recent Gmail inbox signal(s).", "12 GA4 session(s) across top pages."],
  todayPriorities: ["Review new inbound demand", "Prioritize proven search pages"],
  estimatedCeoTimeMinutes: 14,
  sourceLabels: ["gmail:inbox:readonly", "ga4:data_api:readonly"],
  dataGaps: [],
  departmentRecommendations: [],
  connectorHealth: [
    {
      connectorId: "gmail",
      displayName: "Gmail",
      healthStatus: "healthy",
      lastSuccessfulRead: "2026-07-06T11:55:00.000Z",
      lastDataGap: null,
      providerCalled: true,
      liveExecutionAllowed: false,
    },
    {
      connectorId: "google_analytics",
      displayName: "Google Analytics",
      healthStatus: "degraded",
      lastSuccessfulRead: null,
      lastDataGap: "Missing required read-only credential/configuration: GOOGLE_ANALYTICS_PROPERTY_ID.",
      providerCalled: false,
      liveExecutionAllowed: false,
    },
  ],
  featureFlags: {
    connector_live_reads: true,
  } as never,
  providerCalled: true,
  liveExecutionAllowed: false,
  safetyFlags: readOnlyBusinessSafetyFlags,
};

const baseInputs: DailyMissionInputs = {
  morningBrief,
  activationSnapshot: {
    directives: [
      {
        id: "campaign-001",
        title: "Inherited property campaign",
        business_goal: "generate_revenue",
        source_department: "Executive AI",
        assigned_departments: ["Marketing AI", "SEO AI"],
        requested_outputs: ["SEO brief", "Campaign draft"],
        approval_status: "awaiting_ceo_approval",
        risk_level: "medium",
        expected_business_value: "Generate qualified seller conversations.",
        governance_notes: ["CEO approval required before internal work changes."],
      },
    ],
    assignments: [],
    draftQueueItems: [],
    latestDecision: null,
    providerCalled: false,
    liveExecutionAllowed: false,
  },
  draftWorkspace: {
    ok: true,
    title: "CEO Draft Workspace",
    summary: "1 internal department draft is visible for CEO review.",
    totals: {
      departments: 1,
      drafts: 1,
      approved: 0,
      rejected: 0,
      changesRequested: 0,
      pendingReview: 1,
    },
    groups: [
      {
        department: "Marketing AI",
        readyCount: 0,
        pendingCount: 1,
        drafts: [
          {
            id: "draft-1",
            directiveId: "campaign-001",
            title: "Seller education post",
            body: "Review-only draft body.",
            messaging: "Manual review required.",
            cta: "CEO review required.",
            metadata: {
              sourceLabel: "executive_directive:campaign-001",
              directiveId: "campaign-001",
              output: "Campaign draft",
              workItemType: "marketing_draft",
            },
            department: "Marketing AI",
            output: "Campaign draft",
            status: "draft_required",
            priority: "normal",
            businessGoal: "generate_revenue",
            createdAt: "2026-07-06T10:00:00.000Z",
            updatedAt: "2026-07-06T10:00:00.000Z",
            lastModifiedBy: null,
            lastModifiedAt: null,
            revisionCount: 0,
            approvalStatus: "pending_ceo_review",
            approvalRequired: true,
            knowledgePacks: ["Enterprise Knowledge Platform"],
            sourceRegistryEntries: ["executive_directive:campaign-001"],
            confidence: 72,
            assumptions: ["Internal review only."],
            executiveSummary: "Draft is ready for CEO review.",
            safetyFlags: {
              providerCalled: false,
              liveExecutionAllowed: false,
              published: false,
              sent: false,
              workflowStarted: false,
              externalExecutionAllowed: false,
              scrapingBlocked: true,
              outreachBlocked: true,
              adsBlocked: true,
              emailBlocked: true,
              smsBlocked: true,
              crmMutationBlocked: true,
              oauthWritesBlocked: true,
            },
            revisions: [],
          },
        ],
      },
    ],
    safetyFlags: {
      providerCalled: false,
      liveExecutionAllowed: false,
      published: false,
      sent: false,
      workflowStarted: false,
      externalExecutionAllowed: false,
      scrapingBlocked: true,
      outreachBlocked: true,
      adsBlocked: true,
      emailBlocked: true,
      smsBlocked: true,
      crmMutationBlocked: true,
      oauthWritesBlocked: true,
    },
  },
  revenueCommandCenter: {
    ok: true,
    providerCalled: false,
    outreachSent: false,
    summary: {
      totalLeads: 1,
      qualifiedLeads: 1,
      openTasks: 1,
      followUpDue: 1,
      duplicateWarnings: 0,
      missingDataRecords: 0,
      inactiveConnectors: 0,
    },
    inbox: [
      {
        lead: {
          id: "lead-1",
          source: "website",
          propertyAddress: "123 Main St",
          priority: "High",
          score: 78,
        },
        latestScore: {
          score: 78,
          confidence: 70,
          priority: "High",
          explanation: "High-intent source.",
          recommendedNextAction: "Review seller follow-up manually.",
          missingData: [],
          scoreBreakdown: {},
          assumptions: [],
          dataUsed: [],
        },
        duplicateWarnings: [],
        followUpFlags: ["follow-up due"],
        recommendedAction: "Review seller follow-up manually.",
      },
    ],
    sourcePerformance: [],
    referralPerformance: [],
    tasks: [],
    auditEvents: [],
    connectors: [],
    decisionLogs: [],
    connectorHealth: {
      total: 0,
      active: 0,
      readinessOnly: 0,
      inactive: 0,
      providerCallsAllowed: 0,
      approvalRequired: 0,
    },
    decisionFeedback: {
      total: 0,
      pending: 0,
      accepted: 0,
      modified: 0,
      ignored: 0,
      unknownOutcome: 0,
    },
    agentGovernance: {
      providerCalled: false,
      outreachSent: false,
      scrapingEnabled: false,
      browserAutomationEnabled: false,
      executionRequiresApproval: true,
      advisoryOnly: true,
      supportedDataSources: [],
      disabledByDefaultSources: [],
      aiAgentRoles: [],
    },
    executiveBriefing: {
      title: "Revenue growth briefing",
      summary: "1 qualified opportunity is visible.",
      risks: ["1 follow-up gap needs manual review."],
      recommendedActions: ["Work the highest ranked unified inbox items first."],
    },
  } as never,
  connectorRegistryHealth: [
    {
      connectorId: "gmail",
      displayName: "Gmail",
      healthStatus: "readiness_only",
      lastSuccessfulSync: null,
      lastFailedSync: null,
      retryPolicy: "Record data gap.",
      timeoutPolicy: "Short timeout.",
      circuitBreakerState: "not_applicable",
      providerCalled: false,
      liveExecutionAllowed: false,
    },
    {
      connectorId: "google_analytics",
      displayName: "Google Analytics",
      healthStatus: "readiness_only",
      lastSuccessfulSync: null,
      lastFailedSync: null,
      retryPolicy: "Record data gap.",
      timeoutPolicy: "Short timeout.",
      circuitBreakerState: "not_applicable",
      providerCalled: false,
      liveExecutionAllowed: false,
    },
  ],
  providerReadiness: {
    ok: true,
    providers: [
      {
        id: "google_analytics",
        label: "Google Analytics",
        status: "missing",
        configuredEnvKeys: [],
        missingEnvKeys: ["GOOGLE_ANALYTICS_PROPERTY_ID"],
        activationState: "blocked_readiness_only",
        readiness: "Missing",
        connectionState: "not_connected",
        authenticationRequired: true,
        supportedCapabilities: ["analytics readonly"],
        governanceLevel: "readiness_only",
        permissionsRequired: ["analytics.readonly"],
        providerCalled: false,
        liveExecutionAllowed: false,
        liveCallsAllowed: false,
        oauthStarted: false,
        published: false,
        scheduled: false,
        connectorWrite: false,
        adsCreated: false,
        enrichmentWritten: false,
        group: "ops_tooling",
        roiPriority: 1,
        requiredEnvKeys: ["GOOGLE_ANALYTICS_PROPERTY_ID"],
        safeNextAction: "Configure GA4 property ID.",
      },
    ],
    roiPriority: [],
    liveCallsAllowed: false,
    providerCalled: false,
    recommendedNextActions: [],
    safety: {
      readinessOnly: true,
      noLiveExternalFetches: true,
      noOAuthStarts: true,
      noAds: true,
      noPosting: true,
      noScraping: true,
      noEnrichmentWrites: true,
      noAutomatedOutreach: true,
    },
  },
};

describe("daily mission", () => {
  it("assembles the CEO daily loop from existing systems", () => {
    const mission = createDailyMissionFromInputs(baseInputs);

    assert.equal(mission.title, "CEO Daily Mission");
    assert.equal(mission.greeting, "Good Morning Moses");
    assert.equal(mission.urgentCeoDecisions.length, 1);
    assert.equal(mission.draftsReady.length, 1);
    assert.equal(mission.revenuePriorities.length, 1);
    assert.equal(mission.leadPriorities.length, 1);
    assert.ok(mission.connectorHealth.length >= 3);
    assert.ok(mission.sourceLabels.includes("gmail:inbox:readonly"));
    assert.ok(mission.sourceLabels.includes("lead:lead-1:revenue_spine"));
  });

  it("keeps mission safety flags non-executing even when read-only snapshots were called", () => {
    const mission = createDailyMissionFromInputs(baseInputs);

    assert.deepEqual(mission.safetyFlags, dailyMissionSafetyFlags);
    assert.equal(mission.providerCalled, false);
    assert.equal(mission.liveExecutionAllowed, false);
    assert.equal(mission.published, false);
    assert.equal(mission.sent, false);
    assert.equal(mission.workflowStarted, false);
    assert.equal(mission.safetyFlags.outreachBlocked, true);
    assert.equal(mission.safetyFlags.scrapingBlocked, true);
    assert.equal(mission.safetyFlags.adsBlocked, true);
  });

  it("unifies live connector reads, registry health, and provider readiness", () => {
    const mission = createDailyMissionFromInputs(baseInputs);
    const gmail = mission.connectorHealth.find((connector) => connector.connectorId === "gmail");
    const analytics = mission.connectorHealth.find((connector) => connector.connectorId === "google_analytics");
    const leadDatabase = mission.connectorHealth.find((connector) => connector.connectorId === "lead_database");

    assert.equal(gmail?.unifiedStatus, "healthy");
    assert.equal(gmail?.readOnlyProviderCalled, true);
    assert.equal(gmail?.readOnly, true);
    assert.equal(gmail?.liveExecutionAllowed, false);
    assert.equal(analytics?.unifiedStatus, "missing_credentials");
    assert.equal(analytics?.providerReadinessStatus, "missing");
    assert.equal(leadDatabase?.connected, true);
    assert.equal(leadDatabase?.readOnly, true);
    assert.ok(mission.dataGaps.some((gap) => gap.includes("Google Analytics")));
  });

  it("prioritizes DFD operating conductor work in the daily mission", () => {
    const dfdOperating = createDfdOperatingReportFromInputs({
      tenantId: "default",
      leads: [
        {
          id: "dfd-lead-1",
          timestamp: "2026-06-01T10:00:00.000Z",
          firstName: "Moses",
          lastName: "Seller",
          email: "",
          phone: "4055551212",
          propertyAddress: "456 ROI Ave",
          city: "Oklahoma City",
          state: "OK",
          zipCode: "73102",
          ownerName: "Moses Seller",
          mailingAddress: "PO Box 1, Oklahoma City, OK",
          county: "Oklahoma",
          parcelId: "parcel-1",
          situationDetails: "Vacant property with repairs",
          source: "d4d_manual",
          status: "new",
          notes: [],
          followUps: [],
          analyzer: { arv: "150000", estimatedRepairs: "25000", desiredProfit: "15000" },
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
          opportunityScore: "High",
          score: 86,
          priority: "High",
          scoreBreakdown: "High-priority DFD lead.",
          approvalStatus: "pending_review",
          doNotContact: false,
          requiresHumanApproval: true,
        },
      ],
      snapshots: [],
      generatedAt: "2026-07-06T12:00:00.000Z",
    });
    const mission = createDailyMissionFromInputs({ ...baseInputs, dfdOperating });

    assert.equal(mission.dfdOperating?.title, "DFD AI Operating Conductor");
    assert.ok(mission.revenuePriorities[0]?.id.startsWith("dfd-roi-priority"));
    assert.match(mission.revenuePriorities[0]?.title ?? "", /DFD|property|review|bottleneck|distress/i);
    assert.equal(mission.safetyFlags.scrapingBlocked, true);
    assert.equal(mission.dfdOperating?.liveExecutionAllowed, false);
  });
});
