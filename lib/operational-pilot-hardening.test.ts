import {
  createOperationalPilotHardeningSummary,
  operationalPilotHardeningFlags,
} from "./operational-pilot-hardening";

describe("operational pilot hardening", () => {
  it("reports all real workflow surfaces as covered", () => {
    const result = createOperationalPilotHardeningSummary();

    expect(result.pilotHardeningReady).toBe(true);
    expect(result.surfacesCovered).toEqual(
      expect.arrayContaining([
        "dashboard_signal_brief",
        "manual_work_queue",
        "leads_workspace",
        "lead_detail_manual_review",
        "seller_call_capture",
        "buyer_disposition_review",
        "safety_boundaries",
      ]),
    );
    expect(result.operatorValue.join(" ")).toMatch(/Dashboard|Manual work queue|Leads workspace|Lead detail/);
  });

  it("recommends stopping to measure after the pilot hardening pass", () => {
    const result = createOperationalPilotHardeningSummary();

    expect(result.recommendedNextExactStep).toBe("Stop And Measure");
    expect(result.unresolvedPilotBlockers.join(" ")).toMatch(/measured with real operator use/i);
  });

  it("keeps provider, sending, runtime, storage, audit, queue, routing, assignment, reminder, calendar, automation, outreach, revenue, and CRM mutation flags blocked", () => {
    expect(operationalPilotHardeningFlags.providerCalled).toBe(false);
    expect(operationalPilotHardeningFlags.sent).toBe(false);
    expect(operationalPilotHardeningFlags.runtimeActivationAllowed).toBe(false);
    expect(operationalPilotHardeningFlags.storageAuthorized).toBe(false);
    expect(operationalPilotHardeningFlags.auditWritingAllowed).toBe(false);
    expect(operationalPilotHardeningFlags.queueCreated).toBe(false);
    expect(operationalPilotHardeningFlags.routingCreated).toBe(false);
    expect(operationalPilotHardeningFlags.assignmentCreated).toBe(false);
    expect(operationalPilotHardeningFlags.reminderCreated).toBe(false);
    expect(operationalPilotHardeningFlags.calendarItemCreated).toBe(false);
    expect(operationalPilotHardeningFlags.automationTriggered).toBe(false);
    expect(operationalPilotHardeningFlags.outreachCreated).toBe(false);
    expect(operationalPilotHardeningFlags.revenueActionExecuted).toBe(false);
    expect(operationalPilotHardeningFlags.crmMutationExpanded).toBe(false);
  });
});
