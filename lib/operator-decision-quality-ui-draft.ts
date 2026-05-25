export const operatorDecisionQualityUiDraftFlags = {
  readOnly: true,
  advisoryOnly: true,
  uiDraftOnly: true,
  implementationAuthorized: false,
  reviewSurfaceWritesEnabled: false,
  persistenceEnabled: false,
  storageEnabled: false,
  localStorageWriteEnabled: false,
  apiRouteCreated: false,
  apiWriteEnabled: false,
  apiLeadsPostEnabled: false,
  databaseWriteEnabled: false,
  prismaWriteEnabled: false,
  schemaCreated: false,
  zodSchemaCreated: false,
  mapperCreated: false,
  validationRuntimeEnabled: false,
  safeParseWired: false,
  scoringEnabled: false,
  hiddenScoringEnabled: false,
  autonomousPrioritizationEnabled: false,
  routingEnabled: false,
  assignmentEnabled: false,
  queueSystemEnabled: false,
  reminderSystemEnabled: false,
  runtimeJobsEnabled: false,
  leadCreationEnabled: false,
  crmMutationEnabled: false,
  providerActivated: false,
  outreachEnabled: false,
  emailSendingEnabled: false,
  outboundSmsEnabled: false,
  outboundEmailEnabled: false,
  callingEnabled: false,
  aiVoiceEnabled: false,
  domainActivated: false,
  customEmailActivated: false,
  phoneNumberActivated: false,
  smsNumberActivated: false,
  scrapingEnabled: false,
  publicRecordConnectorsEnabled: false,
  externalLookupEnabled: false,
  skipTracingEnabled: false,
  enrichmentEnabled: false,
  automationEnabled: false,
  approvalGrantsExecution: false,
  acquisitionExecutionAuthorized: false,
  spendIncreaseAuthorized: false,
  communicationVolumeIncreaseAuthorized: false,
  leadVolumeAutomationEnabled: false,
  propertyFactsInvented: false,
} as const;

export type OperatorDecisionQualityUiDraftStatus =
  | "ui_draft_only"
  | "needs_safety_review"
  | "blocked_until_usability_review";

export type OperatorDecisionQualityUiDraftDecision = "draft_only";
export type OperatorDecisionQualityPersistenceDecision = "not_authorized";
export type OperatorDecisionQualityCommunicationDecision = "not_authorized";

export type OperatorDecisionQualityUiDraftPanelKey =
  | "lead_worthiness"
  | "blocker_visibility"
  | "missing_data"
  | "source_provenance"
  | "review_readiness"
  | "safe_manual_next_action"
  | "ai_assist_explanation";

export type OperatorDecisionQualityUiDraftPanel = {
  panel: OperatorDecisionQualityUiDraftPanelKey;
  label: string;
  displayIntent: string;
  safetyRule: string;
};

export type OperatorDecisionQualityUiDraft = {
  phase: "A4.4 Operator Decision Quality UI Draft";
  operatorDecisionQualityUiDraftStatus: OperatorDecisionQualityUiDraftStatus;
  uiDraftDecision: OperatorDecisionQualityUiDraftDecision;
  persistenceDecision: OperatorDecisionQualityPersistenceDecision;
  communicationDecision: OperatorDecisionQualityCommunicationDecision;
  draftPanels: OperatorDecisionQualityUiDraftPanel[];
  uiDraftDoctrine: string[];
  forbiddenUiDraftDrift: string[];
  recommendedNextExactStep: "A4.5 Operator Decision Quality Safety And Usability Review";
  nextStageRecommendation: "A4.5 Operator Decision Quality Safety And Usability Review";
  readOnly: true;
  advisoryOnly: true;
  uiDraftOnly: true;
  flags: typeof operatorDecisionQualityUiDraftFlags;
};

export const operatorDecisionQualityUiDraftPanels: OperatorDecisionQualityUiDraftPanel[] = [
  {
    panel: "lead_worthiness",
    label: "Lead worthiness",
    displayIntent: "Explain why a lead may deserve manual attention now.",
    safetyRule: "Worthiness text is advisory and cannot become scoring, ranking, work movement, or execution.",
  },
  {
    panel: "blocker_visibility",
    label: "Blocker visibility",
    displayIntent: "Show DNC, opt-out, property-first, missing-contact, and governance blockers.",
    safetyRule: "Blockers must remain visible and cannot be bypassed by draft wording.",
  },
  {
    panel: "missing_data",
    label: "Missing data",
    displayIntent: "Show missing phone, email, address, owner, source, or provenance details.",
    safetyRule: "Missing-data labels cannot trigger enrichment, lookup, seller messaging, or automation.",
  },
  {
    panel: "source_provenance",
    label: "Source and provenance",
    displayIntent: "Keep source attribution and provenance context visible to the operator.",
    safetyRule: "Source context cannot invent property facts or activate public-record connectors.",
  },
  {
    panel: "review_readiness",
    label: "Review readiness",
    displayIntent: "Explain whether the lead looks ready for manual review or needs cleanup first.",
    safetyRule: "Readiness text cannot create leads, write storage, move CRM stages, or qualify execution.",
  },
  {
    panel: "safe_manual_next_action",
    label: "Safe manual next action",
    displayIntent: "Name the safest human review focus without creating work items.",
    safetyRule: "Next-action text cannot create queues, reminders, automatic work movement, or follow-up.",
  },
  {
    panel: "ai_assist_explanation",
    label: "AI assist explanation",
    displayIntent: "Show explainable AI-style reasoning as operator support only.",
    safetyRule: "AI assist cannot score, persuade, message sellers, approve action, or execute work.",
  },
];

export const operatorDecisionQualityUiDraftDoctrine = [
  "A4.4 creates a UI draft only.",
  "UI draft decision is draft_only.",
  "Persistence remains not_authorized.",
  "Communication remains not_authorized.",
  "The draft must use static or read-only display data only.",
  "The draft may show worthiness, blockers, missing data, source/provenance, review readiness, safe manual next action, and AI assist explanation.",
  "The draft must say manual review only, no scoring, no automatic work movement, no lead creation, no provider activation, and no seller messaging.",
  "No storage, API write, database write, schema, mapper, lead creation, CRM mutation, provider activation, outbound communication, runtime job, automation, spend increase, or property fact invention is authorized.",
  "A4.5 must review safety, accessibility, wording, and usability before any broader implementation gate.",
];

export const forbiddenOperatorDecisionQualityUiDraftDrift = [
  "implementation authorization",
  "review surface writes",
  "persistence",
  "storage",
  "localStorage writes",
  "API route creation",
  "/api/leads writes",
  "database writes",
  "Prisma writes",
  "schema creation",
  "Zod schema creation",
  "mapper creation",
  "runtime validation",
  "safeParse wiring",
  "scoring",
  "hidden scoring",
  "autonomous prioritization",
  "routing",
  "assignments",
  "queues",
  "reminders",
  "runtime jobs",
  "lead creation",
  "CRM mutation",
  "provider activation",
  "outreach",
  "email sending",
  "SMS sending",
  "calling",
  "AI voice",
  "domain activation",
  "custom email activation",
  "phone number activation",
  "scraping",
  "public-record connector activation",
  "external lookup",
  "skip tracing",
  "enrichment",
  "automation",
  "approval-as-execution",
  "acquisition execution",
  "spend increase",
  "communication volume increase",
  "lead-volume automation",
  "property fact invention",
];

export function getOperatorDecisionQualityUiDraft(): OperatorDecisionQualityUiDraft {
  const result: OperatorDecisionQualityUiDraft = {
    phase: "A4.4 Operator Decision Quality UI Draft",
    operatorDecisionQualityUiDraftStatus: "ui_draft_only",
    uiDraftDecision: "draft_only",
    persistenceDecision: "not_authorized",
    communicationDecision: "not_authorized",
    draftPanels: operatorDecisionQualityUiDraftPanels,
    uiDraftDoctrine: operatorDecisionQualityUiDraftDoctrine,
    forbiddenUiDraftDrift: forbiddenOperatorDecisionQualityUiDraftDrift,
    recommendedNextExactStep: "A4.5 Operator Decision Quality Safety And Usability Review",
    nextStageRecommendation: "A4.5 Operator Decision Quality Safety And Usability Review",
    readOnly: true,
    advisoryOnly: true,
    uiDraftOnly: true,
    flags: operatorDecisionQualityUiDraftFlags,
  };

  assertOperatorDecisionQualityUiDraftSafe(result);

  return result;
}

export function assertOperatorDecisionQualityUiDraftSafe(result: OperatorDecisionQualityUiDraft) {
  const allowedTrueFlags = new Set(["readOnly", "advisoryOnly", "uiDraftOnly"]);
  const unsafeTrueFlags = Object.entries(result.flags).filter(([key, value]) => !allowedTrueFlags.has(key) && value === true);

  if (!result.readOnly || !result.advisoryOnly || !result.uiDraftOnly) {
    throw new Error("A4.4 operator decision quality UI draft must remain read-only, advisory-only, and UI-draft-only.");
  }

  if (result.operatorDecisionQualityUiDraftStatus !== "ui_draft_only") {
    throw new Error("A4.4 operator decision quality UI draft cannot become implementation-ready, write-ready, communication-ready, or execution-ready.");
  }

  if (result.uiDraftDecision !== "draft_only") {
    throw new Error("A4.4 UI draft decision must remain draft_only.");
  }

  if (result.persistenceDecision !== "not_authorized") {
    throw new Error("A4.4 persistence decision must remain not_authorized.");
  }

  if (result.communicationDecision !== "not_authorized") {
    throw new Error("A4.4 communication decision must remain not_authorized.");
  }

  if (unsafeTrueFlags.length > 0) {
    throw new Error("A4.4 operator decision quality UI draft cannot authorize writes, leads, scoring, routing, providers, communication, domain activation, runtime work, automation, spend increases, approval-as-execution, or property fact drift.");
  }

  if (result.recommendedNextExactStep !== "A4.5 Operator Decision Quality Safety And Usability Review") {
    throw new Error("A4.4 operator decision quality UI draft must recommend A4.5 Operator Decision Quality Safety And Usability Review next.");
  }

  if (result.nextStageRecommendation !== "A4.5 Operator Decision Quality Safety And Usability Review") {
    throw new Error("A4.4 operator decision quality UI draft must include the next stage recommendation.");
  }
}

export function summarizeOperatorDecisionQualityUiDraft(result: OperatorDecisionQualityUiDraft) {
  assertOperatorDecisionQualityUiDraftSafe(result);

  return `${result.phase}: ${result.operatorDecisionQualityUiDraftStatus}. UI draft decision is ${result.uiDraftDecision}; persistence decision is ${result.persistenceDecision}; communication decision is ${result.communicationDecision}. The draft shows worthiness, blockers, missing data, source/provenance, review readiness, safe manual next action, and AI assist explanation as read-only operator support. No storage, API write, database write, schema, mapper, scoring, automatic work movement, lead creation, CRM mutation, provider activation, email, SMS, calling, domain activation, runtime job, automation, spend increase, approval-as-execution, acquisition execution, or property fact invention is authorized. Next stage: ${result.nextStageRecommendation}.`;
}
