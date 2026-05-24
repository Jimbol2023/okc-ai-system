import { createZ3FollowUpVelocityPolicyReview, z3FollowUpVelocityFlags, z3ManualCadenceBands, z3ManualCadencePolicy } from "./z3-follow-up-velocity-policy";

describe("Z3A follow-up velocity policy", () => {
  it("defines deterministic advisory cadence bands", () => {
    expect(z3ManualCadenceBands).toEqual([
      "same_day_manual_review",
      "within_24_hours",
      "within_48_hours",
      "within_72_hours",
      "low_frequency_nurture",
      "pause_follow_up",
      "no_follow_up",
    ]);

    for (const band of z3ManualCadenceBands) {
      expect(z3ManualCadencePolicy[band].label).toBeTruthy();
      expect(z3ManualCadencePolicy[band].description).toBeTruthy();
      expect(z3ManualCadencePolicy[band].safeManualMeaning).toMatch(/only|no|does not/i);
      expect(z3ManualCadencePolicy[band].advisoryOnly).toBe(true);
    }
  });

  it("preserves all Z3 lockdown flags", () => {
    const result = createZ3FollowUpVelocityPolicyReview();
    expect(result.flags).toBe(z3FollowUpVelocityFlags);
    expect(result.flags.providerCalled).toBe(false);
    expect(result.flags.sent).toBe(false);
    expect(result.flags.runtimeActivationAllowed).toBe(false);
    expect(result.flags.providerActivationAllowed).toBe(false);
    expect(result.flags.auditWritingAllowed).toBe(false);
    expect(result.flags.schemaChangesAuthorized).toBe(false);
    expect(result.flags.migrationsAuthorized).toBe(false);
    expect(result.flags.storageAuthorized).toBe(false);
    expect(result.flags.crmMutationAllowed).toBe(false);
    expect(result.flags.outboundCommunicationAllowed).toBe(false);
    expect(result.flags.followUpTaskCreated).toBe(false);
    expect(result.flags.scheduleWritten).toBe(false);
    expect(result.flags.queueCreated).toBe(false);
    expect(result.flags.reminderCreated).toBe(false);
    expect(result.flags.messageDraftPersisted).toBe(false);
    expect(result.flags.automationTriggered).toBe(false);
  });
});
