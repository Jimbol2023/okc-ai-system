import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import type { StoredLead } from "@/lib/leads-storage";
import {
  createExecutiveAutonomyLevel1IdempotencyKey,
  runExecutiveDailyStartup,
  setExecutiveAutonomyLevel1DepsForTest,
  type ExecutiveAutonomyLevel1RunResult,
} from "@/lib/executive-autonomy-level-1";

const restores: Array<() => void> = [];

afterEach(() => {
  while (restores.length > 0) {
    restores.pop()?.();
  }
});

function lead(overrides: Partial<StoredLead> = {}): StoredLead {
  return {
    id: "lead-1",
    timestamp: "2026-08-02T09:00:00.000Z",
    firstName: "Moses",
    lastName: "Seller",
    email: "seller@example.com",
    phone: "4055550101",
    propertyAddress: "123 Main St",
    city: "Oklahoma City",
    state: "OK",
    zipCode: "73102",
    ownerName: "Moses Seller",
    mailingAddress: "",
    county: "Oklahoma",
    parcelId: "R123",
    situationDetails: "Wants to sell quickly.",
    source: "website",
    status: "new",
    notes: [],
    followUps: [],
    analyzer: {
      arv: "180000",
      estimatedRepairs: "25000",
      desiredProfit: "20000",
    },
    distressFlags: [],
    opportunityScore: "High",
    score: 82,
    priority: "High",
    scoreBreakdown: "High motivation and complete contact info.",
    ...overrides,
  };
}

function createFakeDb(now: Date) {
  const memory = new Map<string, Record<string, unknown>>();
  const approvals: Array<Record<string, unknown>> = [];

  return {
    memory,
    approvals,
    db: {
      aiDepartmentMemoryEvent: {
        async findFirst(args: unknown) {
          const key = (args as { where?: { memoryKey?: string } }).where?.memoryKey;
          return key ? (memory.get(key) as never) ?? null : null;
        },
        async create(args: unknown) {
          const data = (args as { data: Record<string, unknown> }).data;
          const record = {
            id: `memory-${memory.size + 1}`,
            createdAt: now,
            ...data,
          };
          memory.set(String(data.memoryKey), record);
          return record as never;
        },
        async update(args: unknown) {
          const id = (args as { where: { id: string }; data: Record<string, unknown> }).where.id;
          const current = [...memory.values()].find((item) => item.id === id);
          assert.ok(current, "memory record must exist before update");
          const updated = {
            ...current,
            ...(args as { data: Record<string, unknown> }).data,
          };
          memory.set(String(updated.memoryKey), updated);
          return updated as never;
        },
      },
      unifiedApprovalItem: {
        async findFirst(args: unknown) {
          const where = (args as { where?: { sourceId?: string; status?: string } }).where ?? {};
          return (approvals.find((item) => item.sourceId === where.sourceId && item.status === where.status) as never) ?? null;
        },
        async create(args: unknown) {
          const data = (args as { data: Record<string, unknown> }).data;
          const record = {
            id: `approval-${approvals.length + 1}`,
            ...data,
          };
          approvals.push(record);
          return record as never;
        },
      },
    },
  };
}

function createCommandCenter(testLead: StoredLead) {
  return {
    ok: true,
    providerCalled: false,
    outreachSent: false,
    summary: {
      totalLeads: 1,
      qualifiedLeads: 1,
      openTasks: 0,
      followUpDue: 0,
      duplicateWarnings: 0,
      missingDataRecords: 1,
      inactiveConnectors: 0,
    },
    inbox: [
      {
        lead: testLead,
        latestScore: {
          score: 82,
          confidence: 63,
          priority: "High",
          explanation: "High motivation, advisory confidence.",
          recommendedNextAction: "Prepare CEO-reviewed seller acquisition recommendation.",
          missingData: ["Search Console evidence incomplete"],
          scoreBreakdown: { motivation: 30 },
          assumptions: ["Stored lead data is accurate."],
          dataUsed: ["Stored lead"],
        },
        duplicateWarnings: [],
        followUpFlags: [],
        recommendedAction: "Prepare CEO-reviewed seller acquisition recommendation.",
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
      title: "Revenue briefing",
      summary: "Lead is ready for internal advisory review.",
      risks: [],
      recommendedActions: [],
    },
  };
}

describe("Executive Autonomy Level 1", () => {
  it("runs safely, creates high-impact lead approvals, and returns the same daily result idempotently", async () => {
    const now = new Date("2026-08-02T13:05:00.000Z");
    const fakeDb = createFakeDb(now);
    const testLead = lead();
    let syncCount = 0;
    let auditCount = 0;
    const controlledOperationTenants: string[] = [];

    restores.push(
      setExecutiveAutonomyLevel1DepsForTest({
        db: fakeDb.db,
        now: () => now,
        loadLeads: async () => [testLead],
        syncLead: async () => {
          syncCount += 1;
        },
        createRevenueCommandCenter: async () => createCommandCenter(testLead) as never,
        createDailyRevenueOperatingLoop: async () => ({ ok: true }) as never,
        runControlledInternalOperation: async (_action, tenantId) => {
          controlledOperationTenants.push(tenantId ?? "default");
          return ({
            ok: true,
            action: "refresh_internal_intelligence",
            createdRecordType: "AiDepartmentIntelligenceSnapshot",
            createdRecordId: "snapshot-1",
            recordsCreated: 1,
            recordsUpdated: 0,
            stateTransition: "internal_operational",
            auditEntryCreated: true,
            providerCalled: false,
            sent: false,
            published: false,
            crmMutation: false,
            outreach: false,
            scraping: false,
            externalExecutionAllowed: false,
            liveExecutionAllowed: false,
          }) as never;
        },
        runInternalCompanyWork: async () =>
          ({
            ok: true,
            ranAt: now.toISOString(),
            assignmentsAdvanced: 3,
            draftQueueItemsAdvanced: 2,
            directivesAdvanced: 1,
            completedInternalCount: 5,
            queue: { totals: { completedInternal: 5 } },
            approvalRequired: true,
            providerCalled: false,
            sent: false,
            published: false,
            scheduled: false,
            liveExecutionAllowed: false,
            safetyFlags: {},
          }) as never,
        loadDashboard: async () =>
          ({
            ok: true,
            widgets: [],
            dataGaps: ["GA4 summary missing"],
            connectorActivation: {
              dataGaps: ["Search Console coverage missing"],
              totals: {
                connectors: 3,
                connected: 1,
                internalReady: 1,
                credentialsMissing: 1,
                dataGaps: 1,
                registryOnly: 0,
              },
            },
            morningBrief: {
              summary: "Internal startup complete with advisory confidence.",
            },
          }) as never,
        logAudit: async () => {
          auditCount += 1;
          return { id: `audit-${auditCount}` } as never;
        },
      }),
    );

    const first = await runExecutiveDailyStartup({ tenantId: "tenant-okc", triggeredBy: "cron", date: now });
    const second = await runExecutiveDailyStartup({ tenantId: "tenant-okc", triggeredBy: "cron", date: now });

    assert.equal(first.state, "completed_with_exceptions");
    assert.equal(first.safety.providerCalled, false);
    assert.equal(first.safety.sent, false);
    assert.equal(first.safety.published, false);
    assert.equal(first.safety.crmMutation, false);
    assert.equal(first.safety.outreach, false);
    assert.equal(first.safety.scraping, false);
    assert.equal(first.safety.externalExecutionAllowed, false);
    assert.equal(first.safety.liveExecutionAllowed, false);
    assert.equal(first.dataQuality.status, "advisory");
    assert.ok(first.dataQuality.confidence < 100);
    assert.equal(first.leadPipeline.approvalsCreated, 1);
    assert.equal(first.leadPipeline.recommendations[0]?.status, "advisory");
    assert.equal(fakeDb.approvals.length, 1);
    assert.equal(fakeDb.approvals[0]?.tenantId, "tenant-okc");
    assert.deepEqual(controlledOperationTenants, ["tenant-okc", "tenant-okc"]);
    assert.equal(syncCount, 1);
    assert.equal(second.state, "already_completed");
    assert.equal(fakeDb.approvals.length, 1);
    assert.equal(syncCount, 1);
  });

  it("exits without advancing work when today's startup is already running", async () => {
    const now = new Date("2026-08-02T13:05:00.000Z");
    const fakeDb = createFakeDb(now);
    const memoryKey = createExecutiveAutonomyLevel1IdempotencyKey("default", "2026-08-02");
    fakeDb.memory.set(memoryKey, {
      id: "memory-running",
      tenantId: "default",
      memoryKey,
      eventType: "executive_autonomy_l1_daily_startup_started",
      summary: "Startup is running.",
      recommendation: "Wait for the active run.",
      metrics: {},
      confidence: 100,
      outcome: "executive_autonomy_l1_started",
      createdAt: now,
    });
    let workStarted = false;

    restores.push(
      setExecutiveAutonomyLevel1DepsForTest({
        db: fakeDb.db,
        now: () => now,
        loadLeads: async () => {
          workStarted = true;
          return [];
        },
      }),
    );

    const result = await runExecutiveDailyStartup({ date: now });

    assert.equal(result.state, "already_running");
    assert.equal(result.completedAt, null);
    assert.equal(workStarted, false);
    assert.equal(fakeDb.approvals.length, 0);
  });

  it("keeps connector gaps advisory instead of failing department autonomy", async () => {
    const now = new Date("2026-08-02T13:10:00.000Z");
    const fakeDb = createFakeDb(now);

    restores.push(
      setExecutiveAutonomyLevel1DepsForTest({
        db: fakeDb.db,
        now: () => now,
        loadLeads: async () => [],
        syncLead: async () => undefined,
        createRevenueCommandCenter: async () => ({ ...createCommandCenter(lead()), inbox: [] }) as never,
        createDailyRevenueOperatingLoop: async () => ({ ok: true }) as never,
        runControlledInternalOperation: async () =>
          ({
            ok: true,
            action: "refresh_internal_intelligence",
            createdRecordType: "AiDepartmentIntelligenceSnapshot",
            createdRecordId: null,
            recordsCreated: 0,
            recordsUpdated: 0,
            stateTransition: "degraded_but_usable",
            auditEntryCreated: true,
            providerCalled: false,
            sent: false,
            published: false,
            crmMutation: false,
            outreach: false,
            scraping: false,
            externalExecutionAllowed: false,
            liveExecutionAllowed: false,
          }) as never,
        runInternalCompanyWork: async () =>
          ({
            ok: true,
            ranAt: now.toISOString(),
            assignmentsAdvanced: 1,
            draftQueueItemsAdvanced: 1,
            directivesAdvanced: 0,
            completedInternalCount: 2,
            queue: { totals: { completedInternal: 2 } },
            approvalRequired: true,
            providerCalled: false,
            sent: false,
            published: false,
            scheduled: false,
            liveExecutionAllowed: false,
            safetyFlags: {},
          }) as never,
        loadDashboard: async () =>
          ({
            ok: true,
            widgets: [],
            dataGaps: ["Buyer evidence incomplete"],
            connectorActivation: {
              dataGaps: ["GSC data gap"],
              totals: {
                connectors: 2,
                connected: 0,
                internalReady: 1,
                credentialsMissing: 0,
                dataGaps: 2,
                registryOnly: 0,
              },
            },
            morningBrief: {
              summary: "Morning Brief prepared with confidence limits.",
            },
          }) as never,
        logAudit: async () => ({ id: "audit-1" }) as never,
      }),
    );

    const result: ExecutiveAutonomyLevel1RunResult = await runExecutiveDailyStartup({ triggeredBy: "manual", date: now });
    const departmentPhase = result.phases.find((item) => item.id === "department_autonomy");
    const evidencePhase = result.phases.find((item) => item.id === "evidence_refresh");

    assert.equal(departmentPhase?.status, "completed");
    assert.equal(evidencePhase?.status, "advisory");
    assert.equal(result.dataQuality.status, "advisory");
    assert.match(result.morningBrief.confidenceLevels.map((item) => item.status).join(" "), /advisory/);
  });
});
