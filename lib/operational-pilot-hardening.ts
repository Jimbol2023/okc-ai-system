export const operationalPilotHardeningFlags = {
  providerCalled: false,
  sent: false,
  runtimeActivationAllowed: false,
  storageAuthorized: false,
  auditWritingAllowed: false,
  queueCreated: false,
  routingCreated: false,
  assignmentCreated: false,
  reminderCreated: false,
  calendarItemCreated: false,
  automationTriggered: false,
  outreachCreated: false,
  revenueActionExecuted: false,
  crmMutationExpanded: false,
} as const;

export type OperationalPilotSurface =
  | "dashboard_signal_brief"
  | "manual_work_queue"
  | "leads_workspace"
  | "lead_detail_manual_review"
  | "seller_call_capture"
  | "buyer_disposition_review"
  | "safety_boundaries";

export type OperationalPilotHardeningSummary = {
  phase: "Operational Pilot Hardening";
  pilotHardeningReady: true;
  surfacesCovered: OperationalPilotSurface[];
  operatorValue: string[];
  unresolvedPilotBlockers: string[];
  recommendedNextExactStep: "Stop And Measure";
  advisoryOnly: true;
  readOnly: true;
  flags: typeof operationalPilotHardeningFlags;
};

export function createOperationalPilotHardeningSummary(): OperationalPilotHardeningSummary {
  return {
    phase: "Operational Pilot Hardening",
    pilotHardeningReady: true,
    surfacesCovered: [
      "dashboard_signal_brief",
      "manual_work_queue",
      "leads_workspace",
      "lead_detail_manual_review",
      "seller_call_capture",
      "buyer_disposition_review",
      "safety_boundaries",
    ],
    operatorValue: [
      "Dashboard starts with blocked, cleanup, follow-up, and revenue-review signals.",
      "Manual work queue provides a read-only inspection order from existing lead records.",
      "Leads workspace keeps source, missing data, follow-up, and manual decision context visible.",
      "Lead detail keeps Manual Review Brief as the controlling summary before supporting panels.",
    ],
    unresolvedPilotBlockers: [
      "No live outreach, provider execution, assignment, reminder, calendar, or automation authorization exists.",
      "No schema, storage, audit, queue, routing, or CRM mutation expansion is authorized.",
      "Pilot should be measured with real operator use before adding any new advisory layer.",
    ],
    recommendedNextExactStep: "Stop And Measure",
    advisoryOnly: true,
    readOnly: true,
    flags: operationalPilotHardeningFlags,
  };
}
