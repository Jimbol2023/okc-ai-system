import { z6ManualRevenueWorkdayFlags } from "./z6-manual-revenue-workday-policy";

export type Z6WorkdayFocusSignalLevel =
  | "governance_stop"
  | "blocked"
  | "terminal"
  | "cleanup"
  | "review_now"
  | "work_today"
  | "follow_up_today"
  | "near_close_today"
  | "buyer_review_today"
  | "monitor"
  | "defer_low_priority";

export type Z6WorkdayFocusInput = {
  id?: string;
  label?: string;
  priorityLane?: string | null;
  summaryLevel?: string | null;
  advisoryScore?: number | null;
  blockers?: string[];
  warnings?: string[];
  missingData?: string[];
  dueFollowUp?: boolean | null;
  overdueFollowUp?: boolean | null;
  nearCloseCount?: number | null;
  nearCloseSignal?: boolean | null;
  buyerReviewSignal?: boolean | null;
  humanReviewSignal?: boolean | null;
  doNotContact?: boolean | null;
  blocked?: boolean | null;
  governanceStop?: boolean | null;
  terminal?: boolean | null;
  estimatedRevenue?: number | null;
  now?: string | Date;
};

export type Z6WorkdayFocusSignalReviewResult = {
  focusSignalLevel: Z6WorkdayFocusSignalLevel;
  readySignals: string[];
  blockers: string[];
  warnings: string[];
  missingData: string[];
  manualReviewRecommendation: string;
  safeExplanation: string;
  flags: typeof z6ManualRevenueWorkdayFlags;
};

export function reviewZ6WorkdayFocusSignals(input: Z6WorkdayFocusInput): Z6WorkdayFocusSignalReviewResult {
  const readySignals: string[] = [];
  const blockers = [...(input.blockers ?? [])];
  const warnings = [...(input.warnings ?? [])];
  const missingData = [...(input.missingData ?? [])];

  if (input.governanceStop || input.priorityLane === "governance_stop") blockers.push("governance stop");
  if (input.doNotContact || input.blocked || input.priorityLane === "blocked_cleanup") blockers.push("DNC/blocked");
  if (input.terminal || input.priorityLane === "low_priority" && input.summaryLevel === "no_work") readySignals.push("terminal/no-work");
  if (input.summaryLevel === "cleanup_before_work" || input.priorityLane === "data_quality_priority" || missingData.length > 0) readySignals.push("cleanup required");
  if (input.summaryLevel === "review_now" || input.humanReviewSignal || (input.advisoryScore ?? 0) >= 85) readySignals.push("review-now");
  if (input.summaryLevel === "work_today" || input.priorityLane === "work_first" || (input.estimatedRevenue ?? 0) >= 15000) readySignals.push("work-today");
  if (input.dueFollowUp || input.overdueFollowUp || input.priorityLane === "follow_up_priority") readySignals.push("follow-up-today");
  if ((input.nearCloseCount ?? 0) > 0 || input.nearCloseSignal || input.priorityLane === "near_close_revenue") readySignals.push("near-close-today");
  if (input.buyerReviewSignal || input.priorityLane === "buyer_disposition_priority") readySignals.push("buyer-review-today");
  if (input.priorityLane === "nurture_monitor" || input.summaryLevel === "monitor_only") readySignals.push("monitor");
  if (input.priorityLane === "low_priority" || input.summaryLevel === "low_priority") readySignals.push("defer-low-priority");
  if (!input.priorityLane && !input.summaryLevel && (input.advisoryScore ?? null) === null) missingData.push("Z5 priority lane, summary level, or advisory score");

  const focusSignalLevel: Z6WorkdayFocusSignalLevel = blockers.includes("governance stop")
    ? "governance_stop"
    : blockers.length > 0
      ? "blocked"
      : readySignals.includes("terminal/no-work")
        ? "terminal"
        : readySignals.includes("cleanup required")
          ? "cleanup"
          : readySignals.includes("review-now")
            ? "review_now"
            : readySignals.includes("near-close-today")
              ? "near_close_today"
              : readySignals.includes("buyer-review-today")
                ? "buyer_review_today"
                : readySignals.includes("follow-up-today")
                  ? "follow_up_today"
                  : readySignals.includes("work-today")
                    ? "work_today"
                    : readySignals.includes("defer-low-priority")
                      ? "defer_low_priority"
                      : "monitor";

  return {
    focusSignalLevel,
    readySignals,
    blockers: [...new Set(blockers)],
    warnings,
    missingData: [...new Set(missingData)],
    manualReviewRecommendation: focusSignalLevel === "blocked" || focusSignalLevel === "governance_stop" ? "Resolve stop signals before using workday focus." : "Use workday focus as manual advisory guidance only.",
    safeExplanation: "Z6 workday focus signals do not create assignments, tasks, queues, reminders, calendar items, notifications, routes, storage writes, audit writes, CRM mutations, outreach, or revenue execution.",
    flags: z6ManualRevenueWorkdayFlags,
  };
}

export function createZ6WorkdayFocusSignalReview() {
  return {
    phase: "Z6B" as const,
    flags: z6ManualRevenueWorkdayFlags,
    advisoryOnly: true,
    deterministic: true,
    checks: ["governance stop", "DNC/blocked", "terminal/no-work", "cleanup required", "review-now", "work-today", "follow-up-today", "near-close-today", "buyer-review-today", "monitor", "defer-low-priority"],
  };
}
