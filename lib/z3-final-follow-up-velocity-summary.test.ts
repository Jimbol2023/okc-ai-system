import { createZ3FinalFollowUpVelocitySummary } from "./z3-final-follow-up-velocity-summary";

describe("Z3F final follow-up velocity summary", () => {
  it("summarizes Z3 readiness and recommends Z4 next", () => {
    const result = createZ3FinalFollowUpVelocitySummary();
    expect(result.phase).toBe("Z3F");
    expect(result.policyReadiness.phase).toBe("Z3A");
    expect(result.stalenessReadiness.phase).toBe("Z3B");
    expect(result.priorityReadiness.phase).toBe("Z3C");
    expect(result.followUpReadiness.phase).toBe("Z3D");
    expect(result.recommendedNextExactPhase).toBe("Z4 - Manual Conversion Pipeline Readiness");
    expect(result.z3Complete).toBe(true);
  });

  it("keeps all execution, persistence, communication, and artifact creation blocked", () => {
    const result = createZ3FinalFollowUpVelocitySummary();
    expect(result.flags.providerCalled).toBe(false);
    expect(result.flags.sent).toBe(false);
    expect(result.flags.runtimeActivationAllowed).toBe(false);
    expect(result.flags.storageAuthorized).toBe(false);
    expect(result.flags.auditWritingAllowed).toBe(false);
    expect(result.flags.crmMutationAllowed).toBe(false);
    expect(result.flags.outboundCommunicationAllowed).toBe(false);
    expect(result.flags.followUpTaskCreated).toBe(false);
    expect(result.flags.scheduleWritten).toBe(false);
    expect(result.flags.queueCreated).toBe(false);
    expect(result.flags.reminderCreated).toBe(false);
    expect(result.flags.messageDraftPersisted).toBe(false);
    expect(result.flags.automationTriggered).toBe(false);
    expect(result.unresolvedBlockers.join(" ")).toMatch(/no task\/schedule\/queue creation/);
  });
});
