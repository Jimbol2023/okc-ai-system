import { normalizeZ1LeadSource } from "./z1-lead-source-taxonomy";
import { reviewZ2LeadLifecycleHygiene, type Z2LifecycleLeadInput } from "./z2-lead-lifecycle-hygiene";
import { classifyZ2ManualNextAction } from "./z2-manual-next-action-classifier";
import { z2CrmStatusTaxonomy, z2CrmWorkflowFlags } from "./z2-crm-status-taxonomy";

export type Z2WorkflowReadinessLevel =
  | "ready_for_manual_review"
  | "needs_data_cleanup"
  | "needs_duplicate_review"
  | "needs_human_next_action"
  | "blocked_do_not_contact"
  | "terminal_no_action"
  | "not_ready";

export type Z2CrmWorkflowReadinessResult = {
  readinessLevel: Z2WorkflowReadinessLevel;
  crmStatusClarity: string;
  lifecycleHygiene: string;
  sourceAttributionClarity: string;
  intakeCompleteness: string;
  nextActionClarity: string;
  followUpReadiness: string;
  duplicateIncompleteRisk: string;
  manualOperatorReadiness: string;
  revenueWorkflowReadiness: string;
  hygiene: ReturnType<typeof reviewZ2LeadLifecycleHygiene>;
  nextAction: ReturnType<typeof classifyZ2ManualNextAction>;
  flags: typeof z2CrmWorkflowFlags;
  advisoryOnly: true;
};

function hasText(value: unknown) {
  return String(value ?? "").trim().length > 0;
}

function getReadinessLevel(input: Z2LifecycleLeadInput, hygiene: ReturnType<typeof reviewZ2LeadLifecycleHygiene>): Z2WorkflowReadinessLevel {
  const status = hygiene.status;
  const metadata = status ? z2CrmStatusTaxonomy[status] : null;

  if (input.doNotContact || input.blocked || status === "do_not_contact") return "blocked_do_not_contact";
  if (metadata?.terminal) return "terminal_no_action";
  if (!status) return "not_ready";
  if (!metadata) return "not_ready";
  if (hygiene.issues.includes("duplicate review required")) return "needs_duplicate_review";
  if (hygiene.issues.some((issue) => issue.includes("incomplete intake data") || issue.includes("missing status") || issue.includes("invalid status"))) return "needs_data_cleanup";
  if (hygiene.issues.includes("next action unclear")) return "needs_human_next_action";
  if (metadata.needsHumanReview || hygiene.warnings.length > 0) return "needs_human_next_action";
  return "ready_for_manual_review";
}

export function createZ2CrmWorkflowReadiness(input: Z2LifecycleLeadInput): Z2CrmWorkflowReadinessResult {
  const hygiene = reviewZ2LeadLifecycleHygiene(input);
  const nextAction = classifyZ2ManualNextAction(input);
  const readinessLevel = getReadinessLevel(input, hygiene);
  const sourceValid = Boolean(normalizeZ1LeadSource(input.source ?? undefined));
  const intakeMissing = hygiene.issues.filter((issue) => issue.includes("incomplete intake data"));

  return {
    readinessLevel,
    crmStatusClarity: hygiene.status ? `Status is recognized as ${hygiene.status}.` : "Status is missing or invalid.",
    lifecycleHygiene: `Lifecycle hygiene is ${hygiene.hygieneLevel}.`,
    sourceAttributionClarity: sourceValid && hasText(input.sourceDetail) ? "Source and source detail are clear." : "Source or source detail needs cleanup.",
    intakeCompleteness: intakeMissing.length === 0 ? "Required intake signals are present for advisory review." : intakeMissing.join("; "),
    nextActionClarity: hygiene.issues.includes("next action unclear") ? "Manual next action placeholder is unclear." : `Next action recommendation is ${nextAction.action}.`,
    followUpReadiness: hasText(input.followUpPlaceholder) || hasText(input.nextFollowUpAt) ? "Follow-up placeholder is present." : "Follow-up placeholder is missing or not needed for terminal/blocked state.",
    duplicateIncompleteRisk: hygiene.issues.includes("duplicate review required") ? "Duplicate review risk is present." : intakeMissing.length > 0 ? "Incomplete intake risk is present." : "No duplicate or incomplete risk detected from advisory input.",
    manualOperatorReadiness: readinessLevel === "ready_for_manual_review" ? "Operator has enough clarity for manual review." : "Operator should resolve advisory blockers before advancing.",
    revenueWorkflowReadiness: "Revenue workflow remains manual-first, advisory-only, and non-mutating.",
    hygiene,
    nextAction,
    flags: z2CrmWorkflowFlags,
    advisoryOnly: true,
  };
}

export function createZ2CrmWorkflowReadinessList(inputs: Z2LifecycleLeadInput[]) {
  const leads = inputs.map(createZ2CrmWorkflowReadiness);
  return {
    phase: "Z2D" as const,
    flags: z2CrmWorkflowFlags,
    advisoryOnly: true,
    leads,
    countsByReadinessLevel: leads.reduce<Record<Z2WorkflowReadinessLevel, number>>((counts, lead) => {
      counts[lead.readinessLevel] += 1;
      return counts;
    }, {
      ready_for_manual_review: 0,
      needs_data_cleanup: 0,
      needs_duplicate_review: 0,
      needs_human_next_action: 0,
      blocked_do_not_contact: 0,
      terminal_no_action: 0,
      not_ready: 0,
    }),
  };
}

export function createZ2CrmWorkflowReadinessReview() {
  return {
    phase: "Z2D" as const,
    flags: z2CrmWorkflowFlags,
    advisoryOnly: true,
    deterministic: true,
    readinessLevels: ["ready_for_manual_review", "needs_data_cleanup", "needs_duplicate_review", "needs_human_next_action", "blocked_do_not_contact", "terminal_no_action", "not_ready"] as const,
  };
}
