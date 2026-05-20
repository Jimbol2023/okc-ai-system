export type AnnotationCategoryId =
  | "acquisition_note"
  | "seller_conversation_note"
  | "disposition_note"
  | "buyer_interest_note"
  | "closing_title_note"
  | "manual_review_note"
  | "data_quality_note"
  | "blocker_note"
  | "internal_strategy_note"
  | "follow_up_context_note";

export type AnnotationWorkflowArea =
  | "acquisition"
  | "disposition"
  | "closing"
  | "manual_review"
  | "data_quality"
  | "operations";

export type AnnotationPersistenceScope = "safe_to_persist_later" | "future_optional" | "do_not_persist";

export type OperatorNoteCategory = {
  id: AnnotationCategoryId;
  label: string;
  workflowArea: AnnotationWorkflowArea;
  intendedUse: string;
  allowedInfluence: string[];
  forbiddenInfluence: string[];
  persistenceClassification: AnnotationPersistenceScope;
  safetyLabel: string;
};

export type AnnotationStrategySection = {
  title: string;
  summary: string;
  items: string[];
};

export type FutureNoteFieldClassification = {
  label: string;
  scope: AnnotationPersistenceScope;
  examples: string[];
  reason: string;
};

export type FutureAnnotationModelConcept = {
  concept: string;
  purpose: string;
  futureOnlyFields: string[];
  explicitNonGoals: string[];
};

export type OperatorAnnotationStrategy = {
  status: "planning_only";
  safetyLabels: string[];
  categories: OperatorNoteCategory[];
  safetyBoundaries: AnnotationStrategySection;
  structuredFreeTextStrategy: AnnotationStrategySection;
  noteInfluenceRules: {
    mayInfluence: string[];
    mustNotInfluence: string[];
  };
  futurePersistenceBoundaries: FutureNoteFieldClassification[];
  annotationUxPlan: AnnotationStrategySection;
  commandCenterReportingIntegration: AnnotationStrategySection;
  governanceAuditReadability: AnnotationStrategySection;
  futureModelConcepts: FutureAnnotationModelConcept[];
  nonGoals: string[];
};

const contextOnlyForbiddenInfluence = [
  "Send permission",
  "Outreach execution",
  "DNC override",
  "Approval override",
  "Document generation",
  "Autonomous workflow routing",
  "Provider calls",
];

const categories: OperatorNoteCategory[] = [
  {
    id: "acquisition_note",
    label: "Acquisition note",
    workflowArea: "acquisition",
    intendedUse: "Capture internal seller-side context, negotiation observations, and acquisition workflow notes.",
    allowedInfluence: ["Operator visibility", "Acquisition context", "Manual review context"],
    forbiddenInfluence: contextOnlyForbiddenInfluence,
    persistenceClassification: "safe_to_persist_later",
    safetyLabel: "Context only, not commands",
  },
  {
    id: "seller_conversation_note",
    label: "Seller conversation note",
    workflowArea: "acquisition",
    intendedUse: "Summarize seller conversation context without storing unnecessary sensitive detail.",
    allowedInfluence: ["Follow-up context", "Workflow explanation", "Operator review"],
    forbiddenInfluence: contextOnlyForbiddenInfluence,
    persistenceClassification: "future_optional",
    safetyLabel: "Does not trigger seller outreach",
  },
  {
    id: "disposition_note",
    label: "Disposition note",
    workflowArea: "disposition",
    intendedUse: "Record internal buyer/disposition context such as package gaps, match considerations, or assignment readiness notes.",
    allowedInfluence: ["Buyer package context", "Disposition blocker explanation", "Command-center display context"],
    forbiddenInfluence: contextOnlyForbiddenInfluence,
    persistenceClassification: "safe_to_persist_later",
    safetyLabel: "No buyer outreach",
  },
  {
    id: "buyer_interest_note",
    label: "Buyer interest note",
    workflowArea: "disposition",
    intendedUse: "Summarize internal buyer-interest observations without contacting buyers or storing provider payloads.",
    allowedInfluence: ["Disposition context", "Assignment readiness context", "Operator visibility"],
    forbiddenInfluence: contextOnlyForbiddenInfluence,
    persistenceClassification: "future_optional",
    safetyLabel: "Read-only buyer context",
  },
  {
    id: "closing_title_note",
    label: "Closing / title note",
    workflowArea: "closing",
    intendedUse: "Capture internal title, contract, earnest-money, or closing readiness context.",
    allowedInfluence: ["Closing blocker explanation", "Revenue realization context", "Manual review escalation context"],
    forbiddenInfluence: contextOnlyForbiddenInfluence,
    persistenceClassification: "safe_to_persist_later",
    safetyLabel: "No title-company contact",
  },
  {
    id: "manual_review_note",
    label: "Manual review note",
    workflowArea: "manual_review",
    intendedUse: "Explain why a lead or deal requires human review before operational next steps continue.",
    allowedInfluence: ["Manual review context", "Escalation display", "Reporting context"],
    forbiddenInfluence: contextOnlyForbiddenInfluence,
    persistenceClassification: "safe_to_persist_later",
    safetyLabel: "Cannot bypass approval gates",
  },
  {
    id: "data_quality_note",
    label: "Data-quality note",
    workflowArea: "data_quality",
    intendedUse: "Document missing, inconsistent, or assumption-based data that needs operator review.",
    allowedInfluence: ["Data-quality explanation", "Missing-field context", "Reporting context"],
    forbiddenInfluence: contextOnlyForbiddenInfluence,
    persistenceClassification: "safe_to_persist_later",
    safetyLabel: "Does not invent facts",
  },
  {
    id: "blocker_note",
    label: "Blocker note",
    workflowArea: "operations",
    intendedUse: "Explain operational blockers such as approval gaps, DNC state, missing buyer readiness, or title uncertainty.",
    allowedInfluence: ["Blocker explanation", "Command-center display context", "Reporting context"],
    forbiddenInfluence: contextOnlyForbiddenInfluence,
    persistenceClassification: "safe_to_persist_later",
    safetyLabel: "Cannot override blockers",
  },
  {
    id: "internal_strategy_note",
    label: "Internal strategy note",
    workflowArea: "operations",
    intendedUse: "Capture internal operator strategy without creating external communication or workflow commands.",
    allowedInfluence: ["Operator visibility", "Workflow explanation"],
    forbiddenInfluence: contextOnlyForbiddenInfluence,
    persistenceClassification: "future_optional",
    safetyLabel: "Internal only",
  },
  {
    id: "follow_up_context_note",
    label: "Follow-up context note",
    workflowArea: "acquisition",
    intendedUse: "Explain why a follow-up is relevant, overdue, waiting, or blocked.",
    allowedInfluence: ["Follow-up context", "Workflow rhythm explanation", "Operator visibility"],
    forbiddenInfluence: contextOnlyForbiddenInfluence,
    persistenceClassification: "safe_to_persist_later",
    safetyLabel: "No automated follow-up",
  },
];

const futurePersistenceBoundaries: FutureNoteFieldClassification[] = [
  {
    label: "Category and workflow metadata",
    scope: "safe_to_persist_later",
    examples: ["category", "workflowArea", "visibilityLevel", "blockerContextMarker"],
    reason: "Controlled metadata keeps future notes searchable without becoming execution instructions.",
  },
  {
    label: "Timing and review markers",
    scope: "safe_to_persist_later",
    examples: ["timestamp", "manualReviewFlag", "noteStatus"],
    reason: "Review and timing fields support audit readability without enabling automation.",
  },
  {
    label: "Safe summaries",
    scope: "safe_to_persist_later",
    examples: ["safeSummary", "sanitizedBlockerSummary", "workflowExplanation"],
    reason: "Short summaries can support operator context when they avoid sensitive detail and execution commands.",
  },
  {
    label: "Operator ownership placeholder",
    scope: "future_optional",
    examples: ["operatorId", "ownerPlaceholder", "relatedWorkflowItemId"],
    reason: "Ownership may help later, but it should wait until the system has an explicit operator model.",
  },
  {
    label: "Bounded note body",
    scope: "future_optional",
    examples: ["sanitizedNoteBody", "internalOnlyNoteBody"],
    reason: "Free text should be bounded, sanitized, and never used as direct automation input.",
  },
  {
    label: "Credentials and secrets",
    scope: "do_not_persist",
    examples: ["API keys", "provider tokens", "database URLs", "private credentials"],
    reason: "Notes must never become a place to store operational secrets.",
  },
  {
    label: "Provider payloads",
    scope: "do_not_persist",
    examples: ["Twilio payloads", "email provider responses", "webhook bodies"],
    reason: "Annotation storage must stay separate from provider execution and delivery records.",
  },
  {
    label: "Raw execution commands",
    scope: "do_not_persist",
    examples: ["send this now", "bypass approval", "override DNC", "generate contract"],
    reason: "Notes are context, not commands, and cannot authorize execution.",
  },
  {
    label: "Unnecessary sensitive details",
    scope: "do_not_persist",
    examples: ["private personal details", "legally risky claims without review", "hidden automation instructions"],
    reason: "Future notes should be useful and bounded without overcollection or unsafe claims.",
  },
];

export function getOperatorAnnotationStrategy(): OperatorAnnotationStrategy {
  return {
    status: "planning_only",
    safetyLabels: [
      "Planning only",
      "No note persistence",
      "No write API",
      "Notes do not trigger automation",
      "Cannot override DNC or approval gates",
      "Context only, not commands",
    ],
    categories,
    safetyBoundaries: {
      title: "Annotation safety boundaries",
      summary: "Operator notes are future context only. They cannot mutate execution permissions or trigger external action.",
      items: [
        "Notes cannot trigger seller, buyer, title, SMS, email, provider, document, or automation execution.",
        "Notes cannot override DNC, rejected, approval, preflight, or live-send safety controls.",
        "Notes cannot authorize sends, generate documents, schedule automation, or contact external parties.",
        "Notes must remain human-readable context for operator review.",
      ],
    },
    structuredFreeTextStrategy: {
      title: "Structured vs free-text strategy",
      summary: "Future notes should start with controlled structure and treat free text as bounded context.",
      items: [
        "Require category and workflow area.",
        "Use controlled tags for blocker, manual review, data quality, follow-up context, and internal-only visibility.",
        "Allow optional bounded free text only as a safe summary or sanitized note body.",
        "Never feed free text directly into send permissioning, automation routing, document generation, or provider calls.",
      ],
    },
    noteInfluenceRules: {
      mayInfluence: [
        "Operator visibility",
        "Manual review context",
        "Blocker explanation",
        "Reporting context",
        "Command-center display context",
        "Workflow explanation",
      ],
      mustNotInfluence: [
        "Send permission",
        "Outreach execution",
        "DNC override",
        "Approval override",
        "Document generation",
        "Autonomous workflow routing",
        "Provider calls",
      ],
    },
    futurePersistenceBoundaries,
    annotationUxPlan: {
      title: "Annotation UX planning",
      summary: "Future note entry should make safety boundaries visible before any persistence exists.",
      items: [
        "Show a required category selector and workflow area selector.",
        "Label notes as internal only and context only.",
        "Show a clear does-not-trigger-automation safety label.",
        "Support manual review and blocker/context markers.",
        "Display compact note history only after explicit future persistence approval.",
      ],
    },
    commandCenterReportingIntegration: {
      title: "Command-center and reporting integration",
      summary: "Future annotations may enrich R11-R14 context without changing scoring, permissioning, or reporting truth sources.",
      items: [
        "R11 may show annotation context near workqueue items.",
        "R12 may use annotation labels as display context for rhythm and escalation explanations.",
        "R13 may summarize annotation categories only when future persistence is approved.",
        "R14 persistence rules should classify notes before any future archive includes them.",
        "Annotations must not mutate deterministic monetization, disposition, closing, preflight, or permission helpers.",
      ],
    },
    governanceAuditReadability: {
      title: "Governance / audit readability",
      summary: "Future notes should be understandable by humans and avoid hidden operational instructions.",
      items: [
        "Require clear category, timestamp, workflow area, and human-readable reason.",
        "Avoid ambiguous execution language such as instructions to send, bypass, override, or auto-generate.",
        "Avoid legal-document substitute language and unsafe claims.",
        "Keep manual review reasons explicit and visible.",
      ],
    },
    futureModelConcepts: [
      {
        concept: "OperatorNote",
        purpose: "Future bounded note record for internal operator context.",
        futureOnlyFields: ["id", "leadId", "category", "workflowArea", "safeSummary", "createdAt", "visibilityLevel"],
        explicitNonGoals: ["No send authorization", "No automation trigger", "No provider payload storage"],
      },
      {
        concept: "WorkflowAnnotation",
        purpose: "Future annotation attached to an acquisition, disposition, closing, or reporting workflow area.",
        futureOnlyFields: ["id", "workflowArea", "relatedWorkflowItemId", "category", "contextMarker"],
        explicitNonGoals: ["No task scheduler", "No execution route", "No scoring override"],
      },
      {
        concept: "DealContextNote",
        purpose: "Future compact context summary for deal-level review.",
        futureOnlyFields: ["id", "leadId", "safeSummary", "blockerContextMarker", "manualReviewFlag"],
        explicitNonGoals: ["No invented property facts", "No legal document substitute", "No external communication"],
      },
      {
        concept: "ManualReviewAnnotation",
        purpose: "Future visible marker explaining why human review is needed.",
        futureOnlyFields: ["id", "leadId", "reviewReason", "workflowArea", "createdAt"],
        explicitNonGoals: ["No approval bypass", "No DNC override", "No live-send authorization"],
      },
      {
        concept: "BlockerAnnotation",
        purpose: "Future context marker for operational blockers.",
        futureOnlyFields: ["id", "leadId", "blockerType", "safeSummary", "workflowArea"],
        explicitNonGoals: ["No blocker override", "No automated resolution", "No provider call"],
      },
    ],
    nonGoals: [
      "No note persistence.",
      "No write API.",
      "No Prisma models.",
      "No migrations.",
      "No scheduled jobs.",
      "No persistence workers.",
      "No outreach, provider, document, title-company, or automation execution.",
      "No DNC or approval bypass.",
    ],
  };
}
