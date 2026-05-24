export const z2CrmWorkflowFlags = {
  providerCalled: false,
  sent: false,
  runtimeActivationAllowed: false,
  providerActivationAllowed: false,
  approvalGrantsExecution: false,
  auditWritingAllowed: false,
  schemaChangesAuthorized: false,
  migrationsAuthorized: false,
  storageAuthorized: false,
  crmMutationAllowed: false,
  autonomousStatusChangeAllowed: false,
  outboundCommunicationAllowed: false,
} as const;

export const z2CrmStatuses = [
  "new",
  "needs_review",
  "validated",
  "incomplete",
  "duplicate_review",
  "manual_contact_needed",
  "contacted",
  "follow_up_needed",
  "appointment_needed",
  "appointment_set",
  "offer_review_needed",
  "offer_made",
  "negotiating",
  "contract_review_needed",
  "under_contract",
  "buyer_disposition_needed",
  "closing_coordination_needed",
  "closed",
  "dead",
  "do_not_contact",
] as const;

export type Z2CrmStatus = (typeof z2CrmStatuses)[number];

export type Z2CrmStatusMetadata = {
  label: string;
  description: string;
  allowedManualMeaning: string;
  revenuePurpose: string;
  needsHumanReview: boolean;
  terminal: boolean;
  blocked: boolean;
  safeNextManualActionHints: string[];
};

export const z2CrmStatusTaxonomy: Record<Z2CrmStatus, Z2CrmStatusMetadata> = {
  new: {
    label: "New",
    description: "Lead has entered the CRM and has not been reviewed by a human operator.",
    allowedManualMeaning: "Use only for unreviewed leads awaiting initial human triage.",
    revenuePurpose: "Starts the manual revenue workflow without implying contact or qualification.",
    needsHumanReview: true,
    terminal: false,
    blocked: false,
    safeNextManualActionHints: ["Review source, intake completeness, duplicate risk, and seller context."],
  },
  needs_review: {
    label: "Needs Review",
    description: "Lead needs operator review before any next workflow decision.",
    allowedManualMeaning: "Use when status, source, contactability, or revenue context is unclear.",
    revenuePurpose: "Prevents confused leads from bypassing manual triage.",
    needsHumanReview: true,
    terminal: false,
    blocked: false,
    safeNextManualActionHints: ["Resolve unclear workflow details and choose a manual next action."],
  },
  validated: {
    label: "Validated",
    description: "Required intake and attribution are present enough for manual revenue review.",
    allowedManualMeaning: "Use after a human confirms the lead has usable contact, property, source, and context data.",
    revenuePurpose: "Separates usable leads from cleanup work.",
    needsHumanReview: false,
    terminal: false,
    blocked: false,
    safeNextManualActionHints: ["Decide whether manual contact, appointment, or property review is next."],
  },
  incomplete: {
    label: "Incomplete",
    description: "Lead is missing required intake or workflow data.",
    allowedManualMeaning: "Use when missing data prevents confident revenue action.",
    revenuePurpose: "Reduces wasted follow-up on unclear or unusable records.",
    needsHumanReview: true,
    terminal: false,
    blocked: false,
    safeNextManualActionHints: ["Complete missing seller, contact, property, source, or follow-up fields."],
  },
  duplicate_review: {
    label: "Duplicate Review",
    description: "Lead may duplicate an existing CRM record and needs human review.",
    allowedManualMeaning: "Use when phone, email, address, or operator signal suggests duplicate risk.",
    revenuePurpose: "Avoids duplicate work and conflicting seller handling.",
    needsHumanReview: true,
    terminal: false,
    blocked: false,
    safeNextManualActionHints: ["Compare matching records manually before merging, ignoring, or advancing."],
  },
  manual_contact_needed: {
    label: "Manual Contact Needed",
    description: "Lead appears ready for human-controlled seller contact.",
    allowedManualMeaning: "Use only as a reminder for an operator to decide contact manually.",
    revenuePurpose: "Moves qualified leads toward seller conversation without activating outreach.",
    needsHumanReview: true,
    terminal: false,
    blocked: false,
    safeNextManualActionHints: ["Call manually or prepare a message only after human approval."],
  },
  contacted: {
    label: "Contacted",
    description: "A human operator has already contacted or attempted to contact the seller.",
    allowedManualMeaning: "Use after a real human contact attempt has occurred outside this helper.",
    revenuePurpose: "Makes follow-up state visible for manual pipeline control.",
    needsHumanReview: false,
    terminal: false,
    blocked: false,
    safeNextManualActionHints: ["Record outcome manually and decide follow-up, appointment, or dead review."],
  },
  follow_up_needed: {
    label: "Follow-Up Needed",
    description: "Lead needs a human-managed follow-up step.",
    allowedManualMeaning: "Use when the operator owes the seller a future manual touchpoint.",
    revenuePurpose: "Reduces stale lead leakage.",
    needsHumanReview: true,
    terminal: false,
    blocked: false,
    safeNextManualActionHints: ["Set or review a manual follow-up placeholder and timing."],
  },
  appointment_needed: {
    label: "Appointment Needed",
    description: "Lead needs a human-scheduled appointment or property review time.",
    allowedManualMeaning: "Use when seller conversation or property context indicates scheduling is next.",
    revenuePurpose: "Moves interested sellers toward a concrete acquisition step.",
    needsHumanReview: true,
    terminal: false,
    blocked: false,
    safeNextManualActionHints: ["Coordinate appointment manually and confirm details with the seller."],
  },
  appointment_set: {
    label: "Appointment Set",
    description: "Appointment has been set by a human-controlled workflow.",
    allowedManualMeaning: "Use after the operator confirms a specific appointment exists.",
    revenuePurpose: "Keeps appointment-driven revenue work visible.",
    needsHumanReview: false,
    terminal: false,
    blocked: false,
    safeNextManualActionHints: ["Review property details and prepare conservative deal assumptions."],
  },
  offer_review_needed: {
    label: "Offer Review Needed",
    description: "Lead needs manual property and offer review before any offer is made.",
    allowedManualMeaning: "Use when available data suggests offer analysis, not execution.",
    revenuePurpose: "Supports disciplined offer prep without inventing property facts.",
    needsHumanReview: true,
    terminal: false,
    blocked: false,
    safeNextManualActionHints: ["Verify property details and prepare a conservative offer for human review."],
  },
  offer_made: {
    label: "Offer Made",
    description: "A human-controlled offer has been made outside this helper.",
    allowedManualMeaning: "Use only after an operator confirms an offer was actually made.",
    revenuePurpose: "Tracks seller decision stage after offer delivery.",
    needsHumanReview: false,
    terminal: false,
    blocked: false,
    safeNextManualActionHints: ["Review seller response and decide negotiation or follow-up manually."],
  },
  negotiating: {
    label: "Negotiating",
    description: "Lead is in human-led negotiation.",
    allowedManualMeaning: "Use when terms are being discussed manually.",
    revenuePurpose: "Keeps active revenue opportunities visible.",
    needsHumanReview: true,
    terminal: false,
    blocked: false,
    safeNextManualActionHints: ["Review negotiation notes, seller motivation, and conservative deal limits."],
  },
  contract_review_needed: {
    label: "Contract Review Needed",
    description: "Lead needs human/legal/business review before contract activity.",
    allowedManualMeaning: "Use when negotiation appears ready for contract preparation review.",
    revenuePurpose: "Prevents premature contract movement without review.",
    needsHumanReview: true,
    terminal: false,
    blocked: false,
    safeNextManualActionHints: ["Prepare contract review manually with appropriate professional review as needed."],
  },
  under_contract: {
    label: "Under Contract",
    description: "Lead is under contract through a human-controlled process.",
    allowedManualMeaning: "Use only after a valid contract state is confirmed outside this helper.",
    revenuePurpose: "Identifies deals ready for disposition and closing coordination.",
    needsHumanReview: false,
    terminal: false,
    blocked: false,
    safeNextManualActionHints: ["Prepare buyer disposition review and closing coordination manually."],
  },
  buyer_disposition_needed: {
    label: "Buyer Disposition Needed",
    description: "Contracted deal needs manual buyer disposition work.",
    allowedManualMeaning: "Use when the operator needs to review buyer matching or assignment next.",
    revenuePurpose: "Moves contracted deals toward exit strategy without contacting buyers automatically.",
    needsHumanReview: true,
    terminal: false,
    blocked: false,
    safeNextManualActionHints: ["Review buyer disposition manually; do not trigger buyer outreach."],
  },
  closing_coordination_needed: {
    label: "Closing Coordination Needed",
    description: "Deal needs manual title, buyer, seller, or closing coordination.",
    allowedManualMeaning: "Use when closing tasks need human coordination.",
    revenuePurpose: "Protects near-closing revenue from operational drift.",
    needsHumanReview: true,
    terminal: false,
    blocked: false,
    safeNextManualActionHints: ["Coordinate closing manually with title and relevant parties."],
  },
  closed: {
    label: "Closed",
    description: "Deal has closed and needs no active revenue workflow.",
    allowedManualMeaning: "Use only when the operator confirms closing is complete.",
    revenuePurpose: "Separates completed revenue from active pipeline.",
    needsHumanReview: false,
    terminal: true,
    blocked: false,
    safeNextManualActionHints: ["No active CRM action; preserve final state manually."],
  },
  dead: {
    label: "Dead",
    description: "Lead is no longer an active opportunity after review.",
    allowedManualMeaning: "Use after human review determines the lead should not continue.",
    revenuePurpose: "Prevents low-fit leads from consuming follow-up capacity.",
    needsHumanReview: false,
    terminal: true,
    blocked: false,
    safeNextManualActionHints: ["No active CRM action unless a human reopens after review."],
  },
  do_not_contact: {
    label: "Do Not Contact",
    description: "Lead is blocked from contact.",
    allowedManualMeaning: "Use when DNC, opt-out, legal, or governance concerns block contact.",
    revenuePurpose: "Protects the operation from unsafe or unauthorized outreach.",
    needsHumanReview: false,
    terminal: true,
    blocked: true,
    safeNextManualActionHints: ["Do not contact; review only for compliance-safe record handling."],
  },
};

export function normalizeZ2CrmStatus(value: string | null | undefined): Z2CrmStatus | null {
  const normalized = value?.trim().toLowerCase().replace(/[\s-]+/g, "_") ?? "";
  return z2CrmStatuses.includes(normalized as Z2CrmStatus) ? (normalized as Z2CrmStatus) : null;
}

export function isZ2CrmStatus(value: string | null | undefined): value is Z2CrmStatus {
  return normalizeZ2CrmStatus(value) !== null;
}

export function createZ2CrmStatusTaxonomyReview() {
  return {
    phase: "Z2A" as const,
    flags: z2CrmWorkflowFlags,
    advisoryOnly: true,
    deterministic: true,
    manualOperationsRemainPrimary: true,
    schemaChangesAuthorized: false,
    crmMutationAllowed: false,
    statuses: z2CrmStatuses,
    taxonomy: z2CrmStatusTaxonomy,
  };
}
