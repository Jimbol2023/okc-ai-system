export type SellerCallOutcomeId =
  | "no_answer"
  | "left_voicemail"
  | "wrong_number"
  | "disconnected"
  | "not_interested"
  | "call_back_requested"
  | "interested"
  | "wants_offer"
  | "appointment_set"
  | "already_sold"
  | "do_not_contact"
  | "needs_manual_review";

export type SellerCallSignalStrength = "not_captured" | "low" | "medium" | "high" | "needs_review";

export type SellerCallSafetyFlag =
  | "dnc_requested"
  | "wrong_number"
  | "disconnected_number"
  | "sensitive_content"
  | "manual_review_required"
  | "approval_gate_review"
  | "no_execution";

export type SellerCallCaptureFieldScope = "structured_safe" | "bounded_free_text" | "future_optional" | "never_capture";

export type SellerCallPersistenceScope =
  | "safe_to_persist"
  | "bounded_free_text"
  | "derived_visibility_only"
  | "never_persist";

export type SellerCallOutcomeDefinition = {
  id: SellerCallOutcomeId;
  label: string;
  revenueMeaning: string;
  manualNextStep: string;
  reviewRequired: boolean;
  safetyFlags: SellerCallSafetyFlag[];
  forbiddenTriggers: string[];
};

export type SellerCallCaptureField = {
  field: string;
  scope: SellerCallCaptureFieldScope;
  intendedUse: string;
  validationConcept: string;
  executionBoundary: string;
};

export type SellerCallPersistenceClassification = {
  field: string;
  scope: SellerCallPersistenceScope;
  futureStorageDirection: string;
  validationRequirement: string;
  executionBoundary: string;
};

export type SellerCallValidationRule = {
  label: string;
  appliesTo: string;
  plannedRule: string;
  failureBehavior: string;
};

export type SellerCallAppendOnlyModelGuidance = {
  direction: string;
  preferredShape: string[];
  forbiddenShape: string[];
  executionReaderRule: string;
};

export type SellerCallOutcomePlanSection = {
  title: string;
  summary: string;
  items: string[];
};

export type SellerCallFutureApiBoundary = {
  routeConcept: string;
  allowedResponsibilities: string[];
  forbiddenResponsibilities: string[];
  requiredIsolation: string[];
};

export type SellerCallOutcomePlan = {
  status: "planning_only";
  safetyLabels: string[];
  outcomeDefinitions: SellerCallOutcomeDefinition[];
  captureFields: SellerCallCaptureField[];
  manualOnlyCaptureRules: SellerCallOutcomePlanSection;
  freeTextSafetyBoundaries: SellerCallOutcomePlanSection;
  dncEscalationVisibility: SellerCallOutcomePlanSection;
  approvalGatePreservation: SellerCallOutcomePlanSection;
  noAutomationTriggerGuarantee: SellerCallOutcomePlanSection;
  controlledPersistenceDesign: SellerCallOutcomePlanSection;
  validationAndSanitizationVisibility: SellerCallOutcomePlanSection;
  dncPersistenceSafety: SellerCallOutcomePlanSection;
  appendOnlyPersistenceDirection: SellerCallOutcomePlanSection;
  rollbackAndSafetyVisibility: SellerCallOutcomePlanSection;
  revenueWorkflowContext: SellerCallOutcomePlanSection;
  futureLearningReadiness: SellerCallOutcomePlanSection;
  futureApiBoundary: SellerCallFutureApiBoundary;
  persistenceClassifications: SellerCallPersistenceClassification[];
  validationRules: SellerCallValidationRule[];
  appendOnlyModelGuidance: SellerCallAppendOnlyModelGuidance;
  neverCapture: string[];
  neverTrigger: string[];
};

const forbiddenTriggers = [
  "No SMS/email sending",
  "No provider calls",
  "No automation trigger",
  "No scheduled follow-up",
  "No approval bypass",
  "No DNC override",
];

const outcomeDefinitions: SellerCallOutcomeDefinition[] = [
  {
    id: "no_answer",
    label: "No answer",
    revenueMeaning: "Manual seller attempt did not connect; lead may need operator review for timing.",
    manualNextStep: "Operator decides whether a manual follow-up attempt is appropriate.",
    reviewRequired: false,
    safetyFlags: ["no_execution"],
    forbiddenTriggers,
  },
  {
    id: "left_voicemail",
    label: "Left voicemail",
    revenueMeaning: "Operator manually left a voicemail outside the system; next step remains human-controlled.",
    manualNextStep: "Operator reviews whether to monitor or manually follow up later.",
    reviewRequired: false,
    safetyFlags: ["no_execution"],
    forbiddenTriggers,
  },
  {
    id: "wrong_number",
    label: "Wrong number",
    revenueMeaning: "Contact data quality issue blocks reliable seller workflow.",
    manualNextStep: "Verify contact information before any future manual outreach.",
    reviewRequired: true,
    safetyFlags: ["wrong_number", "manual_review_required", "approval_gate_review", "no_execution"],
    forbiddenTriggers,
  },
  {
    id: "disconnected",
    label: "Disconnected",
    revenueMeaning: "Phone appears unusable and should be treated as a data-quality blocker.",
    manualNextStep: "Review contact data and avoid outreach until a valid contact path is verified.",
    reviewRequired: true,
    safetyFlags: ["disconnected_number", "manual_review_required", "no_execution"],
    forbiddenTriggers,
  },
  {
    id: "not_interested",
    label: "Not interested",
    revenueMeaning: "Seller is not currently motivated; lead should not be pushed by automation.",
    manualNextStep: "Operator reviews whether to close, nurture manually, or mark no further action.",
    reviewRequired: true,
    safetyFlags: ["manual_review_required", "no_execution"],
    forbiddenTriggers,
  },
  {
    id: "call_back_requested",
    label: "Call back requested",
    revenueMeaning: "Seller requested a future manual touchpoint; this does not schedule system outreach.",
    manualNextStep: "Operator manually decides the next review date outside R18.",
    reviewRequired: true,
    safetyFlags: ["manual_review_required", "no_execution"],
    forbiddenTriggers,
  },
  {
    id: "interested",
    label: "Interested",
    revenueMeaning: "Seller may be open to discussing a deal; operator should review motivation and numbers.",
    manualNextStep: "Review motivation, timeline, condition, price expectations, and offer readiness manually.",
    reviewRequired: true,
    safetyFlags: ["manual_review_required", "no_execution"],
    forbiddenTriggers,
  },
  {
    id: "wants_offer",
    label: "Wants offer",
    revenueMeaning: "Seller wants pricing discussion; valuation and approval context must still be reviewed.",
    manualNextStep: "Operator reviews ARV, repairs, price expectation, and offer packet readiness.",
    reviewRequired: true,
    safetyFlags: ["manual_review_required", "approval_gate_review", "no_execution"],
    forbiddenTriggers,
  },
  {
    id: "appointment_set",
    label: "Appointment set",
    revenueMeaning: "Manual appointment context may move the deal forward if operator confirms details.",
    manualNextStep: "Operator manually confirms appointment details and required property information.",
    reviewRequired: true,
    safetyFlags: ["manual_review_required", "no_execution"],
    forbiddenTriggers,
  },
  {
    id: "already_sold",
    label: "Already sold",
    revenueMeaning: "Deal may no longer be actionable and should be reviewed for status cleanup.",
    manualNextStep: "Operator reviews status and decides whether to close out the opportunity.",
    reviewRequired: true,
    safetyFlags: ["manual_review_required", "no_execution"],
    forbiddenTriggers,
  },
  {
    id: "do_not_contact",
    label: "Do not contact",
    revenueMeaning: "Seller asked not to be contacted; DNC protection should remain prominent.",
    manualNextStep: "Escalate to DNC/manual review. Do not contact from the system.",
    reviewRequired: true,
    safetyFlags: ["dnc_requested", "manual_review_required", "approval_gate_review", "no_execution"],
    forbiddenTriggers,
  },
  {
    id: "needs_manual_review",
    label: "Needs manual review",
    revenueMeaning: "Call result is ambiguous or sensitive and requires human judgment.",
    manualNextStep: "Operator reviews context before any future workflow action.",
    reviewRequired: true,
    safetyFlags: ["manual_review_required", "sensitive_content", "no_execution"],
    forbiddenTriggers,
  },
];

const captureFields: SellerCallCaptureField[] = [
  {
    field: "outcome",
    scope: "structured_safe",
    intendedUse: "Controlled seller call outcome taxonomy.",
    validationConcept: "Require one approved outcome value.",
    executionBoundary: "Outcome updates visibility only; it cannot trigger outreach or automation.",
  },
  {
    field: "callCompletedAt",
    scope: "structured_safe",
    intendedUse: "Timestamp for when the operator manually completed the call outside the system.",
    validationConcept: "Require a valid timestamp if future persistence is approved.",
    executionBoundary: "Timestamp does not schedule follow-up or start a worker.",
  },
  {
    field: "operatorSummary",
    scope: "bounded_free_text",
    intendedUse: "Short internal-only summary of the manual call outcome.",
    validationConcept: "Bound length, trim content, and reject restricted commands, credentials, provider data, or DNC override language.",
    executionBoundary: "Free text is never automation input and cannot authorize execution.",
  },
  {
    field: "sellerMotivationSignal",
    scope: "structured_safe",
    intendedUse: "Structured motivation signal for revenue context.",
    validationConcept: "Use controlled signal values such as not captured, low, medium, high, or needs review.",
    executionBoundary: "Signal may inform visibility only; no autonomous scoring mutation in R18.",
  },
  {
    field: "sellerTimelineSignal",
    scope: "structured_safe",
    intendedUse: "Structured seller timeline signal for manual workflow prioritization.",
    validationConcept: "Use controlled signal values and label uncertainty.",
    executionBoundary: "Does not schedule outreach or reminders.",
  },
  {
    field: "propertyConditionSignal",
    scope: "structured_safe",
    intendedUse: "Structured condition signal from operator summary.",
    validationConcept: "Use controlled signal values and avoid invented repair facts.",
    executionBoundary: "Does not update analyzer values automatically.",
  },
  {
    field: "priceExpectationSignal",
    scope: "structured_safe",
    intendedUse: "Structured seller pricing expectation signal.",
    validationConcept: "Use controlled signal values; do not treat as verified pricing.",
    executionBoundary: "Does not generate offers or contracts.",
  },
  {
    field: "followUpNeeded",
    scope: "structured_safe",
    intendedUse: "Flags that the operator should review whether a future manual follow-up is needed.",
    validationConcept: "Boolean only with explicit operator-review-only label.",
    executionBoundary: "Does not create, schedule, send, or queue follow-up.",
  },
  {
    field: "manualNextStep",
    scope: "structured_safe",
    intendedUse: "Controlled manual next-step guidance.",
    validationConcept: "Use approved manual-only next-step values.",
    executionBoundary: "Does not execute the step.",
  },
  {
    field: "reviewRequired",
    scope: "structured_safe",
    intendedUse: "Human review visibility marker.",
    validationConcept: "Boolean only; true for DNC, wrong number, sensitive, or ambiguous outcomes.",
    executionBoundary: "Does not approve or reject lead state automatically.",
  },
  {
    field: "safetyFlags",
    scope: "structured_safe",
    intendedUse: "Controlled safety markers for DNC, wrong number, disconnected, sensitive, or no-execution states.",
    validationConcept: "Use approved safety flag values.",
    executionBoundary: "Safety flags never loosen gates; they only add caution.",
  },
];

const persistenceClassifications: SellerCallPersistenceClassification[] = [
  {
    field: "outcome",
    scope: "safe_to_persist",
    futureStorageDirection: "Store one controlled taxonomy value on a future append-only outcome record.",
    validationRequirement: "Require an approved SellerCallOutcomeId value and reject unknown values.",
    executionBoundary: "Outcome is visibility context only and cannot route, send, schedule, approve, or bypass controls.",
  },
  {
    field: "callCompletedAt",
    scope: "safe_to_persist",
    futureStorageDirection: "Store the operator-entered timestamp for a call manually completed outside the system.",
    validationRequirement: "Require a valid ISO timestamp that is not used as a scheduler input.",
    executionBoundary: "Timestamp cannot mutate nextFollowUpAt, automationStatus, or any job queue.",
  },
  {
    field: "operatorSummary",
    scope: "bounded_free_text",
    futureStorageDirection: "Store a short sanitized internal summary only after future persistence approval.",
    validationRequirement: "Trim, bound length, reject credentials, provider payloads, command-style text, DNC override language, and execution language.",
    executionBoundary: "Summary is never automation input and cannot authorize outreach, contracts, provider calls, or approval changes.",
  },
  {
    field: "sellerMotivationSignal",
    scope: "safe_to_persist",
    futureStorageDirection: "Store a controlled signal value for human review and reporting context.",
    validationRequirement: "Require one SellerCallSignalStrength value.",
    executionBoundary: "Signal may improve display context only; it cannot change score, priority, or execution permission.",
  },
  {
    field: "sellerTimelineSignal",
    scope: "safe_to_persist",
    futureStorageDirection: "Store a controlled signal value for human understanding of seller timing.",
    validationRequirement: "Require one SellerCallSignalStrength value and preserve uncertainty as needs_review.",
    executionBoundary: "Signal cannot schedule reminders, follow-ups, outreach, workers, or provider activity.",
  },
  {
    field: "propertyConditionSignal",
    scope: "safe_to_persist",
    futureStorageDirection: "Store a controlled condition signal without inventing property facts.",
    validationRequirement: "Require one SellerCallSignalStrength value and keep property facts operator-verified.",
    executionBoundary: "Signal cannot update analyzer numbers, repair estimates, ARV, offers, or contract data.",
  },
  {
    field: "priceExpectationSignal",
    scope: "safe_to_persist",
    futureStorageDirection: "Store a controlled pricing-expectation signal for review context.",
    validationRequirement: "Require one SellerCallSignalStrength value and label it as unverified seller context.",
    executionBoundary: "Signal cannot generate offers, price terms, documents, contracts, or buyer outreach.",
  },
  {
    field: "followUpNeeded",
    scope: "derived_visibility_only",
    futureStorageDirection: "Display as operator-review-only visibility, not as a scheduling instruction.",
    validationRequirement: "Boolean only, with copy stating that true does not create or queue follow-up.",
    executionBoundary: "Must never mutate nextFollowUpAt, automationStatus, followUpCount, send queues, or jobs.",
  },
  {
    field: "manualNextStep",
    scope: "safe_to_persist",
    futureStorageDirection: "Store an approved manual-only next-step label for audit readability.",
    validationRequirement: "Require a controlled manual-only next-step value derived from the outcome taxonomy.",
    executionBoundary: "Next step is descriptive only and cannot execute, queue, approve, or contact anyone.",
  },
  {
    field: "reviewRequired",
    scope: "derived_visibility_only",
    futureStorageDirection: "Display human-review visibility on the lead and outcome history.",
    validationRequirement: "Boolean only; true for DNC, wrong number, disconnected, sensitive, or ambiguous outcomes.",
    executionBoundary: "Cannot approve, reject, reopen, or change approvalStatus by itself.",
  },
  {
    field: "safetyFlags",
    scope: "safe_to_persist",
    futureStorageDirection: "Store controlled caution flags on the future append-only record.",
    validationRequirement: "Require approved SellerCallSafetyFlag values and reject any flag that loosens safety.",
    executionBoundary: "Flags can only add caution; they cannot bypass DNC, approval gates, or preflight checks.",
  },
];

const validationRules: SellerCallValidationRule[] = [
  {
    label: "Enum validation",
    appliesTo: "outcome, seller signals, manualNextStep, safetyFlags",
    plannedRule: "Require controlled values from the planning taxonomy before any future write.",
    failureBehavior: "Reject the future persistence request with no side effects.",
  },
  {
    label: "Bounded summary length",
    appliesTo: "operatorSummary",
    plannedRule: "Trim whitespace and enforce a short internal summary limit before saving.",
    failureBehavior: "Reject empty, whitespace-only, or overlong summaries instead of truncating silently.",
  },
  {
    label: "Restricted-content rejection",
    appliesTo: "operatorSummary",
    plannedRule: "Reject credentials, secrets, provider payloads, raw webhook content, unnecessary sensitive details, and legal-document substitute language.",
    failureBehavior: "Return a manual safety review reason and persist nothing.",
  },
  {
    label: "Command-style content rejection",
    appliesTo: "operatorSummary and manualNextStep",
    plannedRule: "Reject language that instructs the system to send, call, schedule, approve, override, generate, import, or execute.",
    failureBehavior: "Reject the future write because call outcomes are not a command channel.",
  },
  {
    label: "DNC and approval separation",
    appliesTo: "outcome, reviewRequired, safetyFlags",
    plannedRule: "DNC outcomes and review flags may increase visibility only and must not mutate doNotContact or approvalStatus automatically.",
    failureBehavior: "Persist no state mutation outside the future append-only outcome record.",
  },
];

const appendOnlyModelGuidance: SellerCallAppendOnlyModelGuidance = {
  direction: "Future persistence should prefer a separate append-only seller call outcome history after explicit schema approval.",
  preferredShape: [
    "One immutable record per human-entered call outcome.",
    "Lead ID, controlled outcome, callCompletedAt, sanitized summary, structured signals, manual review visibility, safety flags, and createdAt.",
    "Readable audit history that explains human context without replacing lead execution state.",
    "Visibility-only consumers that render history and caution badges.",
  ],
  forbiddenShape: [
    "No mutation-driven execution fields.",
    "No provider payload storage.",
    "No scheduler, send queue, contract, buyer outreach, title outreach, or seller outreach fields.",
    "No hidden commands in free text.",
    "No automatic writes to approvalStatus, doNotContact, nextFollowUpAt, automationStatus, or followUpCount.",
  ],
  executionReaderRule: "Execution systems must never treat seller call outcomes as commands or as authorization to contact anyone.",
};

export function getSellerCallOutcomePlan(): SellerCallOutcomePlan {
  return {
    status: "planning_only",
    safetyLabels: [
      "Planning only",
      "No call outcome persistence",
      "No write API",
      "No outreach sent",
      "No automation triggered",
      "No provider called",
      "Follow-up needed means operator review only",
      "DNC remains enforced",
      "R19 read-only persistence design",
      "No schema changes",
      "No DB writes",
    ],
    outcomeDefinitions,
    captureFields,
    manualOnlyCaptureRules: {
      title: "Manual-only capture rules",
      summary: "R18 only plans how to capture outcomes after a human manually completes a seller call outside the system.",
      items: [
        "The system does not dial, text, email, notify, schedule, or contact anyone.",
        "Call outcome capture is future-safe context only until persistence is explicitly approved.",
        "Follow-up needed means operator review only, not a scheduled task or outbound action.",
        "Any real-world next step remains manual and human-controlled.",
      ],
    },
    freeTextSafetyBoundaries: {
      title: "Free-text safety boundaries",
      summary: "Operator summary text must remain internal context, not an automation or execution channel.",
      items: [
        "Free text is internal-only.",
        "Free text is not automation input.",
        "Free text cannot trigger outreach, authorize execution, override DNC, approve outreach, or schedule follow-ups.",
        "Future validation should bound summaries, sanitize content, reject credentials/secrets, and reject command-style instructions.",
      ],
    },
    dncEscalationVisibility: {
      title: "DNC escalation visibility",
      summary: "Stop-contact and bad-number outcomes should make safety more visible, never less.",
      items: [
        "do_not_contact must surface DNC/manual-review visibility.",
        "wrong_number and disconnected should surface data-quality/manual-review visibility.",
        "Stop-contact requests should never trigger follow-up.",
        "DNC remains enforced and operator review is required.",
      ],
    },
    approvalGatePreservation: {
      title: "Approval-gate preservation",
      summary: "Call outcomes may explain context but cannot authorize execution.",
      items: [
        "Approval is not execution.",
        "A positive call outcome does not approve outreach.",
        "Follow-up needed does not schedule outreach.",
        "No SMS/email is sent, no provider is called, and no automation is triggered.",
      ],
    },
    noAutomationTriggerGuarantee: {
      title: "No automation trigger guarantee",
      summary: "R18 outcomes must never become hidden automation commands.",
      items: [
        "No scheduled jobs.",
        "No automation execution.",
        "No provider calls.",
        "No send queues.",
        "No document or contract generation.",
      ],
    },
    controlledPersistenceDesign: {
      title: "Controlled persistence design",
      summary: "R19 defines a future-safe persistence contract for human-entered seller call outcomes without adding persistence.",
      items: [
        "Safe future persistence means validated, append-only, human-entered context only.",
        "Forbidden execution responsibilities remain outside the seller call outcome boundary.",
        "Persistence design is read-only in R19: no API, no schema, no migration, no database write, and no provider import.",
        "Any future persistence response must explicitly report no outreach sent, no automation triggered, and no provider called.",
      ],
    },
    validationAndSanitizationVisibility: {
      title: "Validation and sanitization visibility",
      summary: "Future writes must validate structure first and treat free text as internal context only.",
      items: [
        "Enums must reject unknown outcomes, signals, manual next steps, and safety flags.",
        "operatorSummary must be trimmed, length-bounded, sanitized, and internal-only.",
        "Summaries are not automation inputs and cannot trigger outreach or authorize execution.",
        "Credentials, secrets, provider payloads, command-style text, DNC override language, and approval bypass language must be rejected.",
      ],
    },
    dncPersistenceSafety: {
      title: "DNC persistence safety",
      summary: "DNC-related call outcomes can increase caution and visibility only.",
      items: [
        "do_not_contact outcomes require human review and visible DNC escalation context.",
        "DNC outcomes do not automatically mutate doNotContact, approvalStatus, automationStatus, or nextFollowUpAt.",
        "DNC outcomes do not trigger outreach changes, provider calls, follow-up scheduling, or approval bypass.",
        "DNC protection remains enforced by existing gates until a separate authorized human workflow changes it.",
      ],
    },
    appendOnlyPersistenceDirection: {
      title: "Future append-only direction",
      summary: "If persistence is later approved, seller call outcomes should become immutable audit history, not execution state.",
      items: [
        "Prefer one append-only record per human-entered call outcome.",
        "Keep outcome history readable for audit, review, and operator context.",
        "Do not let persisted outcomes become scheduler input, provider payloads, send instructions, or approval decisions.",
        appendOnlyModelGuidance.executionReaderRule,
      ],
    },
    rollbackAndSafetyVisibility: {
      title: "Rollback and safety visibility",
      summary: "R19 is a planning-only surface, so rollback should remove display/design data without operational impact.",
      items: [
        "No schema, API, provider, automation, or database changes are introduced.",
        "Future unsafe outcome records should be ignored by execution systems because execution systems cannot read outcomes as commands.",
        "Rollback should remove the planning panel/data only, leaving lead, DNC, approval, and mock outreach behavior unchanged.",
        "All future persistence must fail closed before writing if validation or isolation checks fail.",
      ],
    },
    revenueWorkflowContext: {
      title: "Revenue workflow context",
      summary: "Structured outcomes can help humans understand seller motivation without creating execution risk.",
      items: [
        "Motivation, timeline, condition, and price signals may improve operator visibility.",
        "Interested, wants-offer, and appointment-set outcomes can highlight manual review priority.",
        "Wrong-number, disconnected, already-sold, and DNC outcomes can reduce wasted operator effort.",
        "No outcome guarantees revenue or changes execution permission.",
      ],
    },
    futureLearningReadiness: {
      title: "Future learning readiness",
      summary: "Future learning may use aggregate structured signals only after explicit approval.",
      items: [
        "Aggregate motivation patterns.",
        "Aggregate timeline patterns.",
        "Aggregate condition patterns.",
        "Aggregate price expectation patterns.",
        "No autonomous execution, no self-learning runtime, no auto-contact behavior, and no unsupervised decision-making.",
      ],
    },
    futureApiBoundary: {
      routeConcept: "Future isolated write boundary, such as POST /api/leads/[leadId]/seller-call-outcomes, only after explicit approval.",
      allowedResponsibilities: [
        "Validate structured outcome fields.",
        "Sanitize bounded operator summary.",
        "Persist capture-only context after future schema approval.",
        "Return no-execution status in the response.",
      ],
      forbiddenResponsibilities: [
        "Calling providers.",
        "Sending SMS/email.",
        "Scheduling follow-ups.",
        "Triggering automation.",
        "Importing Twilio, provider, send-route, automation, scheduler, contract, title, buyer outreach, or seller outreach modules.",
        "Mutating approvalStatus, doNotContact, nextFollowUpAt, automationStatus, or followUpCount.",
        "Changing approval or DNC gates automatically.",
        "Generating contracts/documents.",
      ],
      requiredIsolation: [
        "No provider imports.",
        "No automation imports.",
        "No send-route imports.",
        "No document/title/buyer/seller outreach imports.",
        "Strict validation before any future persistence.",
        "Append-only future model direction.",
        "Execution systems must not read outcomes as commands.",
      ],
    },
    persistenceClassifications,
    validationRules,
    appendOnlyModelGuidance,
    neverCapture: [
      "Credentials or secrets.",
      "Provider payloads.",
      "Raw call recordings without explicit future policy.",
      "Unnecessary sensitive personal details.",
      "Legally risky claims without review.",
      "Hidden automation instructions.",
      "Command-style content such as send this now.",
    ],
    neverTrigger: [
      "SMS/email sending.",
      "Twilio activation.",
      "Provider calls.",
      "Automation execution.",
      "Scheduled jobs.",
      "Follow-up queues.",
      "DNC override.",
      "Approval bypass.",
      "Contract/document generation.",
      "Buyer, seller, or title-company outreach.",
    ],
  };
}
