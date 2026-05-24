import { normalizeZ1LeadSource } from "./z1-lead-source-taxonomy";
import { normalizeZ2CrmStatus, z2CrmStatusTaxonomy, z2CrmWorkflowFlags, type Z2CrmStatus } from "./z2-crm-status-taxonomy";

export type Z2LifecycleHygieneLevel = "clear" | "watch" | "needs_review" | "blocked" | "terminal";

export type Z2LifecycleLeadInput = {
  id?: string;
  status?: string | null;
  source?: string | null;
  sourceDetail?: string | null;
  createdTimestamp?: string | Date | null;
  lastStatusUpdatedAt?: string | Date | null;
  propertyAddress?: string | null;
  contactName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  email?: string | null;
  sellerNotes?: string | null;
  situationDetails?: string | null;
  nextActionPlaceholder?: string | null;
  followUpPlaceholder?: string | null;
  nextFollowUpAt?: string | Date | null;
  duplicateReasons?: string[];
  duplicateReviewRequired?: boolean | null;
  incompleteReasons?: string[];
  doNotContact?: boolean | null;
  blocked?: boolean | null;
  active?: boolean | null;
  now?: string | Date;
};

export type Z2LifecycleHygieneResult = {
  hygieneLevel: Z2LifecycleHygieneLevel;
  status: Z2CrmStatus | null;
  issues: string[];
  warnings: string[];
  manualReviewRecommendation: string;
  safeExplanation: string;
  flags: typeof z2CrmWorkflowFlags;
};

function hasText(value: unknown) {
  return String(value ?? "").trim().length > 0;
}

function toTime(value: string | Date | null | undefined) {
  if (!value) return null;
  const time = value instanceof Date ? value.getTime() : Date.parse(value);
  return Number.isNaN(time) ? null : time;
}

function daysBetween(later: number, earlier: number) {
  return Math.floor((later - earlier) / 86_400_000);
}

function getContactName(input: Z2LifecycleLeadInput) {
  return [input.contactName, input.firstName, input.lastName].some(hasText);
}

function getNow(input: Z2LifecycleLeadInput) {
  const parsed = toTime(input.now);
  return parsed ?? Date.now();
}

export function reviewZ2LeadLifecycleHygiene(input: Z2LifecycleLeadInput): Z2LifecycleHygieneResult {
  const issues: string[] = [];
  const warnings: string[] = [];
  const status = normalizeZ2CrmStatus(input.status);
  const metadata = status ? z2CrmStatusTaxonomy[status] : null;
  const source = normalizeZ1LeadSource(input.source ?? undefined);

  if (!hasText(input.status)) issues.push("missing status");
  else if (!status) issues.push("invalid status");

  if (hasText(input.source) && !source) warnings.push("status/source mismatch");
  if (!hasText(input.source)) issues.push("missing source");
  if (!hasText(input.sourceDetail)) warnings.push("source detail missing");

  const intakeMissing = [
    ["property address", input.propertyAddress],
    ["contact info", input.phone || input.email],
    ["seller context", input.sellerNotes || input.situationDetails],
  ].filter(([, value]) => !hasText(value)).map(([label]) => label);

  if (!getContactName(input)) intakeMissing.push("seller name");
  if (intakeMissing.length > 0) issues.push(`incomplete intake data: ${intakeMissing.join(", ")}`);
  if (input.incompleteReasons && input.incompleteReasons.length > 0) issues.push(`incomplete intake data: ${input.incompleteReasons.join(", ")}`);

  if (input.duplicateReviewRequired || (input.duplicateReasons?.length ?? 0) > 0 || status === "duplicate_review") {
    issues.push("duplicate review required");
  }

  if (!hasText(input.nextActionPlaceholder)) issues.push("next action unclear");

  const followUpMissing = !hasText(input.followUpPlaceholder) && !hasText(input.nextFollowUpAt);
  if (followUpMissing && !metadata?.terminal && status !== "do_not_contact") {
    warnings.push("follow-up placeholder missing");
  }

  const now = getNow(input);
  const statusUpdatedAt = toTime(input.lastStatusUpdatedAt) ?? toTime(input.createdTimestamp);
  const staleAfterDays = status === "new" || status === "needs_review" ? 2 : 7;
  if (statusUpdatedAt && !metadata?.terminal && daysBetween(now, statusUpdatedAt) > staleAfterDays) {
    warnings.push("stale status");
  }

  if (input.doNotContact || input.blocked || status === "do_not_contact") {
    issues.push("DNC/blocked lead needing no contact");
  }

  if (metadata?.terminal && input.active === true) {
    issues.push("dead/closed terminal lead incorrectly marked active");
  }

  const hygieneLevel: Z2LifecycleHygieneLevel = metadata?.blocked || input.doNotContact || input.blocked
    ? "blocked"
    : metadata?.terminal
      ? "terminal"
      : issues.length > 0
        ? "needs_review"
        : warnings.length > 0
          ? "watch"
          : "clear";

  return {
    hygieneLevel,
    status,
    issues,
    warnings,
    manualReviewRecommendation: hygieneLevel === "clear" ? "Continue manual workflow review." : "Human operator should review lifecycle hygiene before advancing this lead.",
    safeExplanation: "Z2 lifecycle hygiene is advisory only. It does not change lead status, write storage, trigger providers, send messages, or authorize execution.",
    flags: z2CrmWorkflowFlags,
  };
}

export function createZ2LeadLifecycleHygieneReview() {
  return {
    phase: "Z2B" as const,
    flags: z2CrmWorkflowFlags,
    advisoryOnly: true,
    deterministic: true,
    checks: ["missing status", "invalid status", "stale status", "status/source mismatch", "duplicate review required", "incomplete intake data", "follow-up placeholder missing", "next action unclear", "DNC/blocked lead needing no contact", "dead/closed terminal lead incorrectly marked active"],
  };
}
