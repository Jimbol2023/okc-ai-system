import { normalizeZ2CrmStatus, z2CrmStatusTaxonomy, type Z2CrmStatus } from "./z2-crm-status-taxonomy";
import { z3FollowUpVelocityFlags } from "./z3-follow-up-velocity-policy";

export type Z3FollowUpVelocityRiskLevel = "clear" | "due_soon" | "overdue" | "stale" | "fatigue" | "suppressed" | "terminal" | "needs_timing";

export type Z3FollowUpLeadInput = {
  id?: string;
  status?: string | null;
  source?: string | null;
  createdTimestamp?: string | Date | null;
  timestamp?: string | Date | null;
  lastContactedAt?: string | Date | null;
  lastStatusUpdatedAt?: string | Date | null;
  nextFollowUpAt?: string | Date | null;
  followUpPlaceholder?: string | null;
  followUpCount?: number | null;
  sellerResponse?: string | null;
  sellerMotivation?: string | null;
  sellerTimeline?: string | null;
  priority?: string | null;
  score?: number | null;
  isHot?: boolean | null;
  doNotContact?: boolean | null;
  blocked?: boolean | null;
  approvalStatus?: string | null;
  nextAction?: string | null;
  nextActionPlaceholder?: string | null;
  now?: string | Date;
};

export type Z3FollowUpStalenessRiskResult = {
  velocityRiskLevel: Z3FollowUpVelocityRiskLevel;
  status: Z2CrmStatus | null;
  stalenessSignals: string[];
  warnings: string[];
  manualReviewRecommendation: string;
  safeExplanation: string;
  flags: typeof z3FollowUpVelocityFlags;
};

function toTime(value: string | Date | null | undefined) {
  if (!value) return null;
  const time = value instanceof Date ? value.getTime() : Date.parse(value);
  return Number.isNaN(time) ? null : time;
}

function hoursBetween(later: number, earlier: number) {
  return (later - earlier) / 3_600_000;
}

function getNow(input: Z3FollowUpLeadInput) {
  return toTime(input.now) ?? Date.now();
}

function textIncludes(input: Z3FollowUpLeadInput, terms: string[]) {
  const text = `${input.sellerResponse ?? ""} ${input.sellerMotivation ?? ""} ${input.sellerTimeline ?? ""}`.toLowerCase();
  return terms.some((term) => text.includes(term));
}

export function reviewZ3FollowUpStalenessRisk(input: Z3FollowUpLeadInput): Z3FollowUpStalenessRiskResult {
  const status = normalizeZ2CrmStatus(input.status);
  const metadata = status ? z2CrmStatusTaxonomy[status] : null;
  const now = getNow(input);
  const nextFollowUp = toTime(input.nextFollowUpAt);
  const lastContacted = toTime(input.lastContactedAt);
  const created = toTime(input.createdTimestamp) ?? toTime(input.timestamp);
  const stalenessSignals: string[] = [];
  const warnings: string[] = [];

  if (input.doNotContact || input.blocked || status === "do_not_contact") stalenessSignals.push("DNC/no-contact suppression");
  if (metadata?.terminal) stalenessSignals.push("terminal status");

  if (nextFollowUp) {
    const hoursUntil = hoursBetween(nextFollowUp, now);
    if (hoursUntil <= 0) stalenessSignals.push("overdue follow-up");
    else if (hoursUntil <= 24) stalenessSignals.push("due soon");
  } else if (!metadata?.terminal && status !== "do_not_contact") {
    warnings.push("missing follow-up timing");
  }

  if (lastContacted) {
    const hoursSinceContact = hoursBetween(now, lastContacted);
    if ((status === "contacted" || status === "negotiating" || status === "follow_up_needed") && hoursSinceContact >= 48) {
      stalenessSignals.push(`stale ${status} lead`);
    }
  }

  if (created && status === "new" && hoursBetween(now, created) >= 72) stalenessSignals.push("aged new lead");
  if ((input.followUpCount ?? 0) >= 5) stalenessSignals.push("repeated follow-up fatigue");
  if (textIncludes(input, ["stop", "unsubscribe", "leave me alone", "no thanks", "not interested"])) stalenessSignals.push("seller rejection or stop language");

  const velocityRiskLevel: Z3FollowUpVelocityRiskLevel = stalenessSignals.includes("DNC/no-contact suppression") || stalenessSignals.includes("seller rejection or stop language")
    ? "suppressed"
    : stalenessSignals.includes("terminal status")
      ? "terminal"
      : stalenessSignals.includes("overdue follow-up")
        ? "overdue"
        : stalenessSignals.some((signal) => signal.startsWith("stale") || signal === "aged new lead")
          ? "stale"
          : stalenessSignals.includes("repeated follow-up fatigue")
            ? "fatigue"
            : stalenessSignals.includes("due soon")
              ? "due_soon"
              : warnings.includes("missing follow-up timing")
                ? "needs_timing"
                : "clear";

  return {
    velocityRiskLevel,
    status,
    stalenessSignals,
    warnings,
    manualReviewRecommendation: velocityRiskLevel === "clear" ? "Monitor current manual follow-up cadence." : "Human operator should review follow-up velocity before any real-world action.",
    safeExplanation: "Z3 follow-up staleness risk is advisory only. It does not send messages, create tasks, write schedules, create queues, trigger automation, or mutate CRM data.",
    flags: z3FollowUpVelocityFlags,
  };
}

export function createZ3FollowUpStalenessRiskReview() {
  return {
    phase: "Z3B" as const,
    flags: z3FollowUpVelocityFlags,
    advisoryOnly: true,
    deterministic: true,
    checks: ["overdue follow-up", "due soon", "stale contacted lead", "stale negotiating lead", "aged new lead", "repeated follow-up fatigue", "DNC/no-contact suppression", "terminal status", "missing follow-up timing"],
  };
}
