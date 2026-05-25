import {
  assertManualBusinessEntityCommunicationIdentitySetupSafe,
  getManualBusinessEntityCommunicationIdentitySetup,
  manualBusinessEntityCommunicationIdentitySetupFlags,
  summarizeManualBusinessEntityCommunicationIdentitySetup,
} from "./manual-business-entity-communication-identity-setup";

describe("manual business entity and communication identity setup", () => {
  it("pins identity status metric and next-step fields", () => {
    const result = getManualBusinessEntityCommunicationIdentitySetup();

    expect(result.phase).toBe("manual_business_entity_and_communication_identity_setup");
    expect(result.businessName).toBe("Cornerstone Property Group");
    expect(result.market).toBe("Oklahoma City, Oklahoma");
    expect(result.systemMode).toBe("small_high_clarity_acquisition_operating_system");
    expect(result.primaryMetric).toBe("acquisition_roi_per_operator_hour");
    expect(result.setupStatus).toBe("manual_setup_required");
    expect(result.providerStatus).toBe("not_activated");
    expect(result.communicationStatus).toBe("not_authorized");
    expect(result.automationStatus).toBe("blocked");
    expect(result.recommendedNextExactStep).toBe("Complete Manual Entity Formation And Identity Evidence Checklist");
    expect(result.nextStageRecommendation).toBe("Activation Evidence Gap Resolution Planning");
  });

  it("keeps setup read-only advisory-only and planning-only", () => {
    const result = getManualBusinessEntityCommunicationIdentitySetup();

    expect(result.readOnly).toBe(true);
    expect(result.advisoryOnly).toBe(true);
    expect(result.planningOnly).toBe(true);
    expect(result.flags.readOnly).toBe(true);
    expect(result.flags.advisoryOnly).toBe(true);
    expect(result.flags.planningOnly).toBe(true);
  });

  it("includes the required manual setup checklist items", () => {
    const checklistText = getManualBusinessEntityCommunicationIdentitySetup().manualSetupChecklist.join(" ");

    expect(checklistText).toMatch(/confirm entity naming and ownership intent/i);
    expect(checklistText).toMatch(/qualified professional support/i);
    expect(checklistText).toMatch(/J Capital Trust/i);
    expect(checklistText).toMatch(/J Capital Holdings LLC/i);
    expect(checklistText).toMatch(/Cornerstone Property Group LLC/i);
    expect(checklistText).toMatch(/EIN/i);
    expect(checklistText).toMatch(/business banking/i);
    expect(checklistText).toMatch(/domain/i);
    expect(checklistText).toMatch(/Google Workspace role inboxes/i);
    expect(checklistText).toMatch(/professional email/i);
    expect(checklistText).toMatch(/branded signatures/i);
    expect(checklistText).toMatch(/sender identity/i);
    expect(checklistText).toMatch(/SPF\/DKIM\/DMARC readiness notes/i);
    expect(checklistText).toMatch(/without DNS mutation/i);
    expect(checklistText).toMatch(/Twilio readiness only/i);
    expect(checklistText).toMatch(/A2P\/10DLC readiness only/i);
    expect(checklistText).toMatch(/DNC\/STOP governance/i);
    expect(checklistText).toMatch(/communication governance/i);
  });

  it("defines professional email roles and branded signature standards without authorizing mailbox creation", () => {
    const result = getManualBusinessEntityCommunicationIdentitySetup();
    const emailText = result.professionalEmailRoleMap.join(" ");
    const signatureText = result.signatureStandards.join(" ");

    expect(emailText).toMatch(/acquisitions@/i);
    expect(emailText).toMatch(/offers@/i);
    expect(emailText).toMatch(/support@/i);
    expect(emailText).toMatch(/operations@/i);
    expect(emailText).toMatch(/review@/i);
    expect(signatureText).toMatch(/Cornerstone Property Group/i);
    expect(signatureText).toMatch(/human operator name and role/i);
    expect(signatureText).toMatch(/Oklahoma City/i);
    expect(signatureText).toMatch(/manual approval required/i);
    expect(result.flags.mailboxCreated).toBe(false);
  });

  it("defines readiness evidence requirements for entity EIN banking domain email DNS signature Twilio and DNC STOP governance", () => {
    const result = getManualBusinessEntityCommunicationIdentitySetup();
    const evidenceAreas = result.readinessEvidenceRequirements.map((requirement) => requirement.evidenceArea);
    const evidenceText = result.readinessEvidenceRequirements
      .flatMap((requirement) => [requirement.evidenceArea, ...requirement.requiredEvidence, requirement.acceptanceRule])
      .join(" ");

    expect(evidenceAreas).toEqual(
      expect.arrayContaining([
        "entity proof",
        "EIN",
        "banking readiness",
        "domain ownership",
        "email identity plan",
        "DNS readiness notes",
        "signature plan",
        "Twilio readiness notes",
        "DNC/STOP governance",
      ]),
    );
    expect(evidenceText).toMatch(/Entity proof/i);
    expect(evidenceText).toMatch(/EIN confirmation evidence/i);
    expect(evidenceText).toMatch(/business banking readiness notes/i);
    expect(evidenceText).toMatch(/domain purchase evidence/i);
    expect(evidenceText).toMatch(/Google Workspace role inbox plan/i);
    expect(evidenceText).toMatch(/SPF readiness notes/i);
    expect(evidenceText).toMatch(/DKIM readiness notes/i);
    expect(evidenceText).toMatch(/DMARC readiness notes/i);
    expect(evidenceText).toMatch(/branded signature standard/i);
    expect(evidenceText).toMatch(/Twilio readiness notes/i);
    expect(evidenceText).toMatch(/A2P\/10DLC readiness notes/i);
    expect(evidenceText).toMatch(/DNC handling notes/i);
    expect(evidenceText).toMatch(/STOP handling notes/i);
  });

  it("keeps doctrine manual planning-only and blocks legal tax provider communication and autonomous drift", () => {
    const doctrineText = getManualBusinessEntityCommunicationIdentitySetup().doctrine.join(" ");

    expect(doctrineText).toMatch(/manual real-world setup planning only/i);
    expect(doctrineText).toMatch(/not legal advice/i);
    expect(doctrineText).toMatch(/not tax advice/i);
    expect(doctrineText).toMatch(/not banking advice/i);
    expect(doctrineText).toMatch(/does not authorize provider activation/i);
    expect(doctrineText).toMatch(/does not authorize DNS mutation/i);
    expect(doctrineText).toMatch(/does not authorize Google Workspace mailbox creation/i);
    expect(doctrineText).toMatch(/does not authorize Twilio activation/i);
    expect(doctrineText).toMatch(/does not authorize outreach/i);
    expect(doctrineText).toMatch(/does not authorize live communication/i);
    expect(doctrineText).toMatch(/does not authorize automation/i);
    expect(doctrineText).toMatch(/not autonomous wholesaling/i);
    expect(doctrineText).toMatch(/operator leverage only/i);
  });

  it("keeps provider DNS Vercel Google Workspace Twilio outbound automation runtime CRM autonomous and go-live flags false", () => {
    const flags = getManualBusinessEntityCommunicationIdentitySetup().flags;

    expect(flags.providerActivated).toBe(false);
    expect(flags.twilioActivated).toBe(false);
    expect(flags.googleWorkspaceActivated).toBe(false);
    expect(flags.domainActivated).toBe(false);
    expect(flags.dnsMutationEnabled).toBe(false);
    expect(flags.vercelMutationEnabled).toBe(false);
    expect(flags.mailboxCreated).toBe(false);
    expect(flags.outboundSmsEnabled).toBe(false);
    expect(flags.outboundEmailEnabled).toBe(false);
    expect(flags.callingEnabled).toBe(false);
    expect(flags.aiVoiceEnabled).toBe(false);
    expect(flags.autonomousOutreachEnabled).toBe(false);
    expect(flags.autonomousNegotiationEnabled).toBe(false);
    expect(flags.autonomousTextingEnabled).toBe(false);
    expect(flags.autonomousCallingEnabled).toBe(false);
    expect(flags.autonomousCampaignsEnabled).toBe(false);
    expect(flags.autonomousSellerHandlingEnabled).toBe(false);
    expect(flags.autonomousBuyerHandlingEnabled).toBe(false);
    expect(flags.autonomousApprovalAuthorityEnabled).toBe(false);
    expect(flags.campaignEnabled).toBe(false);
    expect(flags.runtimeJobsEnabled).toBe(false);
    expect(flags.pollingEnabled).toBe(false);
    expect(flags.crmMutationEnabled).toBe(false);
    expect(flags.automationEnabled).toBe(false);
    expect(flags.goLiveAuthorized).toBe(false);
    expect(flags.approvalGrantsExecution).toBe(false);
  });

  it("fails invariant checks if a blocked flag drifts true", () => {
    const blockedFlags = [
      "providerActivated",
      "twilioActivated",
      "googleWorkspaceActivated",
      "domainActivated",
      "dnsMutationEnabled",
      "vercelMutationEnabled",
      "mailboxCreated",
      "outboundSmsEnabled",
      "outboundEmailEnabled",
      "callingEnabled",
      "aiVoiceEnabled",
      "autonomousOutreachEnabled",
      "autonomousNegotiationEnabled",
      "autonomousTextingEnabled",
      "autonomousCallingEnabled",
      "autonomousCampaignsEnabled",
      "autonomousSellerHandlingEnabled",
      "autonomousBuyerHandlingEnabled",
      "autonomousApprovalAuthorityEnabled",
      "campaignEnabled",
      "runtimeJobsEnabled",
      "pollingEnabled",
      "crmMutationEnabled",
      "automationEnabled",
      "goLiveAuthorized",
      "approvalGrantsExecution",
    ] as const;

    for (const blockedFlag of blockedFlags) {
      const unsafeResult = {
        ...getManualBusinessEntityCommunicationIdentitySetup(),
        flags: {
          ...manualBusinessEntityCommunicationIdentitySetupFlags,
          [blockedFlag]: true,
        },
      };

      expect(() => assertManualBusinessEntityCommunicationIdentitySetupSafe(unsafeResult)).toThrow(/cannot authorize/i);
    }
  });

  it("fails invariant checks if pinned statuses or next steps drift", () => {
    const setupUnsafe = {
      ...getManualBusinessEntityCommunicationIdentitySetup(),
      setupStatus: "complete" as "manual_setup_required",
    };
    const providerUnsafe = {
      ...getManualBusinessEntityCommunicationIdentitySetup(),
      providerStatus: "activated" as "not_activated",
    };
    const communicationUnsafe = {
      ...getManualBusinessEntityCommunicationIdentitySetup(),
      communicationStatus: "authorized" as "not_authorized",
    };
    const nextUnsafe = {
      ...getManualBusinessEntityCommunicationIdentitySetup(),
      nextStageRecommendation: "Provider Activation" as "Activation Evidence Gap Resolution Planning",
    };

    expect(() => assertManualBusinessEntityCommunicationIdentitySetupSafe(setupUnsafe)).toThrow(/manual_setup_required/i);
    expect(() => assertManualBusinessEntityCommunicationIdentitySetupSafe(providerUnsafe)).toThrow(/provider status/i);
    expect(() => assertManualBusinessEntityCommunicationIdentitySetupSafe(communicationUnsafe)).toThrow(/communication status/i);
    expect(() => assertManualBusinessEntityCommunicationIdentitySetupSafe(nextUnsafe)).toThrow(/Activation Evidence Gap Resolution Planning/i);
  });

  it("summarizes manual setup planning boundaries and next stage", () => {
    const result = getManualBusinessEntityCommunicationIdentitySetup();
    const summary = summarizeManualBusinessEntityCommunicationIdentitySetup(result);

    expect(summary).toMatch(/manual setup planning only/i);
    expect(summary).toMatch(/not legal advice/i);
    expect(summary).toMatch(/not tax advice/i);
    expect(summary).toMatch(/provider activation/i);
    expect(summary).toMatch(/outreach/i);
    expect(summary).toMatch(/not autonomous wholesaling/i);
    expect(summary).toMatch(/AI remains operator leverage only/i);
    expect(summary).toMatch(/humans retain setup, communication, approval, and execution authority/i);
    expect(summary).toMatch(/Complete Manual Entity Formation And Identity Evidence Checklist/i);
    expect(summary).toMatch(/Activation Evidence Gap Resolution Planning/i);
  });
});
