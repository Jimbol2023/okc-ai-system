export type PersistenceScope =
  | "safe_to_persist"
  | "advisory_ephemeral"
  | "future_optional"
  | "do_not_persist";

export type SnapshotCadence = "daily" | "weekly" | "manual_review";

export type FutureSnapshotConcept =
  | "OperationalSnapshot"
  | "OperationalTrendBaseline"
  | "ReportingArchive"
  | "WorkflowHealthSnapshot"
  | "BottleneckSnapshot";

export type PersistenceClassification = {
  label: string;
  scope: PersistenceScope;
  examples: string[];
  reason: string;
};

export type ReportingStrategySection = {
  title: string;
  summary: string;
  items: string[];
};

export type SnapshotStrategy = {
  label: string;
  cadence: SnapshotCadence;
  purpose: string;
  futureFields: string[];
  sourceOfTruth: string;
  persistenceBoundary: string;
};

export type FutureSnapshotShape = {
  concept: FutureSnapshotConcept;
  purpose: string;
  futureOnlyFields: string[];
  explicitNonGoals: string[];
};

export type ReportingPersistencePlan = {
  status: "planning_only";
  safetyLabels: string[];
  snapshotStrategies: SnapshotStrategy[];
  trendBaselineStrategy: ReportingStrategySection;
  historicalReportingBoundaries: ReportingStrategySection;
  persistenceClassifications: PersistenceClassification[];
  futureSnapshotShapes: FutureSnapshotShape[];
  lightweightSnapshotArchitecture: ReportingStrategySection;
  reportingSafetyPrivacyBoundaries: ReportingStrategySection;
  r13IntegrationStrategy: ReportingStrategySection;
  nonGoals: string[];
};

const safetyLabels = [
  "Planning only",
  "No scheduled reports",
  "No persistence worker",
  "No provider payloads",
  "No outreach or document execution",
  "Aggregate reporting strategy only",
];

const snapshotStrategies: SnapshotStrategy[] = [
  {
    label: "Daily operational snapshot",
    cadence: "daily",
    purpose: "Future aggregate view of workload pressure, urgent items, blocked items, and follow-up backlog.",
    futureFields: ["snapshotDate", "totalWorkItems", "urgentCount", "blockedCount", "followUpBacklogCount", "workloadPressure"],
    sourceOfTruth: "R13 operator reporting summary derived from R8-R12 helpers.",
    persistenceBoundary: "Aggregate counts only; no raw seller/buyer communication content or provider payloads.",
  },
  {
    label: "Weekly workflow health snapshot",
    cadence: "weekly",
    purpose: "Future baseline for workflow health direction across aging, escalation, stage distribution, and repeated bottlenecks.",
    futureFields: ["weekStart", "agingDistribution", "escalationDistribution", "stageDistribution", "topBottlenecks"],
    sourceOfTruth: "R13 reporting summary and R12 rhythm distribution.",
    persistenceBoundary: "Store normalized aggregate summaries, not duplicated lead records.",
  },
  {
    label: "Escalation snapshot",
    cadence: "manual_review",
    purpose: "Future review point for urgent and executive-attention operational pressure.",
    futureFields: ["capturedAt", "urgentCount", "executiveAttentionCount", "manualReviewCount", "topEscalationReasons"],
    sourceOfTruth: "R12 escalation tiers surfaced through R13 reporting.",
    persistenceBoundary: "Reason categories only; avoid full note bodies or communication transcripts.",
  },
  {
    label: "Bottleneck snapshot",
    cadence: "weekly",
    purpose: "Future recurring blocker visibility for missing ARV, missing repairs, title blockers, assignment delays, and stale follow-ups.",
    futureFields: ["capturedAt", "bottleneckCategory", "frequencyEstimate", "severity", "affectedWorkflowArea"],
    sourceOfTruth: "R13 repeated bottleneck aggregation.",
    persistenceBoundary: "Aggregate category counts only; no unnecessary operational surveillance details.",
  },
  {
    label: "Revenue-at-risk snapshot",
    cadence: "daily",
    purpose: "Future aggregate view of blocked or high-risk revenue items without creating execution coupling.",
    futureFields: ["capturedAt", "revenueAtRiskCount", "closingRiskCount", "blockedCount", "trendHint"],
    sourceOfTruth: "R13 revenue-at-risk and closing-risk summaries.",
    persistenceBoundary: "Assumption-based operational risk only; no guaranteed revenue claims.",
  },
];

const persistenceClassifications: PersistenceClassification[] = [
  {
    label: "Aggregate counts",
    scope: "safe_to_persist",
    examples: ["urgentCount", "blockedCount", "stalledDealCount", "followUpBacklogCount"],
    reason: "Aggregate counts support trend baselines without storing sensitive operational detail.",
  },
  {
    label: "Workflow distributions",
    scope: "safe_to_persist",
    examples: ["agingDistribution", "escalationDistribution", "workflowStageDistribution", "ownerLoadDistribution"],
    reason: "Distributions preserve operational health while avoiding duplicate lead snapshots.",
  },
  {
    label: "Trend summaries",
    scope: "safe_to_persist",
    examples: ["trendState", "confidence", "uncertainty", "topOperationalConcern"],
    reason: "Trend summaries are explainable and compact when generated from the single R13 reporting source.",
  },
  {
    label: "Operational health scores",
    scope: "future_optional",
    examples: ["workloadPressure", "reportingHealthScore", "workflowHealthIndex"],
    reason: "Useful later, but should wait until operators validate which health scoring is meaningful.",
  },
  {
    label: "Derived recommendations",
    scope: "advisory_ephemeral",
    examples: ["operationalRecommendation", "nextExpectedMilestone", "escalationSuggestion"],
    reason: "Recommendations can change as logic improves, so they should be regenerated unless a future audit need is proven.",
  },
  {
    label: "Provider payloads",
    scope: "do_not_persist",
    examples: ["Twilio response body", "provider request payload", "delivery webhook payload"],
    reason: "Reporting must not become provider execution storage or leak execution-sensitive payloads.",
  },
  {
    label: "Communication content",
    scope: "do_not_persist",
    examples: ["raw seller SMS body", "raw buyer message", "email body", "call transcript"],
    reason: "Operational reporting should avoid unnecessary communication-content retention.",
  },
  {
    label: "Execution-sensitive metadata",
    scope: "do_not_persist",
    examples: ["provider credentials", "send authorization tokens", "runtime execution permissions", "live-send preflight secrets"],
    reason: "Reporting persistence must stay separate from execution permissioning and secrets.",
  },
];

const futureSnapshotShapes: FutureSnapshotShape[] = [
  {
    concept: "OperationalSnapshot",
    purpose: "Append-only aggregate summary of daily operating pressure.",
    futureOnlyFields: ["id", "capturedAt", "cadence", "totalItems", "urgentCount", "blockedCount", "workloadPressure"],
    explicitNonGoals: ["No lead mutation", "No outreach execution", "No provider payload storage"],
  },
  {
    concept: "OperationalTrendBaseline",
    purpose: "Minimal baseline for comparing current reporting against prior aggregate reporting.",
    futureOnlyFields: ["baselinePeriod", "metricKey", "previousValue", "currentValue", "trendState", "uncertainty"],
    explicitNonGoals: ["No machine-learning analytics engine", "No hidden scoring fork", "No workflow automation"],
  },
  {
    concept: "ReportingArchive",
    purpose: "Future bounded archive of aggregate operational reports.",
    futureOnlyFields: ["archiveDate", "snapshotIds", "summary", "retentionCategory"],
    explicitNonGoals: ["No raw communications", "No provider data", "No execution logs"],
  },
  {
    concept: "WorkflowHealthSnapshot",
    purpose: "Future compact distribution view for aging, escalation, and stage health.",
    futureOnlyFields: ["capturedAt", "agingDistribution", "escalationDistribution", "stageDistribution"],
    explicitNonGoals: ["No task assignment persistence", "No durable worker queue", "No scheduler"],
  },
  {
    concept: "BottleneckSnapshot",
    purpose: "Future repeated bottleneck frequency tracking.",
    futureOnlyFields: ["capturedAt", "category", "frequencyEstimate", "severity", "affectedWorkflowArea"],
    explicitNonGoals: ["No full lead snapshots", "No sensitive communication content", "No execution-triggering workflow"],
  },
];

export function getReportingPersistencePlan(): ReportingPersistencePlan {
  return {
    status: "planning_only",
    safetyLabels,
    snapshotStrategies,
    trendBaselineStrategy: {
      title: "Trend baseline strategy",
      summary: "Future trends should compare current R13 aggregate reporting against prior aggregate snapshots only.",
      items: [
        "Use R13 reporting as the single aggregate truth source.",
        "Compare compact metric keys such as blockedCount, urgentCount, staleCount, closingRiskCount, and followUpBacklogCount.",
        "Keep uncertainty labels when historical depth is thin.",
        "Avoid heavy analytics engines until operators validate the reports that matter.",
      ],
    },
    historicalReportingBoundaries: {
      title: "Historical reporting boundaries",
      summary: "Historical reporting should preserve aggregate operational health, not unnecessary communication or execution details.",
      items: [
        "Persist aggregate operational counts and distributions only when future persistence is approved.",
        "Keep derived recommendations ephemeral unless an explicit audit use case appears.",
        "Do not store raw provider payloads, credentials, or live-send permission data.",
        "Do not store unnecessary seller or buyer communication content in reporting archives.",
      ],
    },
    persistenceClassifications,
    futureSnapshotShapes,
    lightweightSnapshotArchitecture: {
      title: "Lightweight snapshot architecture",
      summary: "Future persistence should be append-only aggregate snapshots derived from R13 reporting.",
      items: [
        "R8-R12 generate operational intelligence.",
        "R13 creates the reporting summary.",
        "A future serializer converts R13 into a compact aggregate snapshot.",
        "A future archive compares snapshots for durable trends.",
        "No cron, scheduler, worker, or durable write path is implemented in R14.",
      ],
    },
    reportingSafetyPrivacyBoundaries: {
      title: "Reporting safety / privacy boundaries",
      summary: "Reporting should avoid overcollection and remain separate from outreach, provider, document, and automation execution.",
      items: [
        "No provider payloads.",
        "No raw communication transcripts.",
        "No hidden operator surveillance.",
        "No execution permission secrets.",
        "No scheduled persistence without explicit future approval.",
      ],
    },
    r13IntegrationStrategy: {
      title: "R13 integration strategy",
      summary: "R14 treats R13 reporting as the future single aggregate source for snapshot persistence.",
      items: [
        "Do not fork R8-R13 business logic.",
        "Do not recompute separate reporting engines.",
        "Use R13 reporting outputs for future snapshot serialization.",
        "Keep trend labels explainable and uncertainty-aware.",
      ],
    },
    nonGoals: [
      "No Prisma models.",
      "No migrations.",
      "No database writes.",
      "No scheduled reports.",
      "No persistence worker.",
      "No cron jobs.",
      "No exports.",
      "No outreach, document, title-company, or automation execution.",
    ],
  };
}
