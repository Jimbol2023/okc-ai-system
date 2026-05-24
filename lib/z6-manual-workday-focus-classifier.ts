import { reviewZ6WorkdayFocusSignals, type Z6WorkdayFocusInput } from "./z6-workday-focus-signal-review";
import { z6ManualRevenueWorkdayFlags, type Z6WorkdayFocusLane } from "./z6-manual-revenue-workday-policy";

export type Z6WorkdayFocusTier = "stop" | "now" | "today" | "week" | "monitor" | "defer" | "none";
export type Z6WorkdayFocusConfidence = "high" | "medium" | "low";

export type Z6ManualWorkdayFocusResult = {
  workdayLane: Z6WorkdayFocusLane;
  focusTier: Z6WorkdayFocusTier;
  advisoryFocusScore: number;
  reason: string;
  confidence: Z6WorkdayFocusConfidence;
  triggeredBy: string[];
  missingData: string[];
  requiredHumanReview: true;
  blockedExecutionFlags: typeof z6ManualRevenueWorkdayFlags;
  flags: typeof z6ManualRevenueWorkdayFlags;
};

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function makeResult(workdayLane: Z6WorkdayFocusLane, focusTier: Z6WorkdayFocusTier, score: number, reason: string, confidence: Z6WorkdayFocusConfidence, triggeredBy: string[], missingData: string[]): Z6ManualWorkdayFocusResult {
  return {
    workdayLane,
    focusTier,
    advisoryFocusScore: clampScore(score),
    reason,
    confidence,
    triggeredBy,
    missingData,
    requiredHumanReview: true,
    blockedExecutionFlags: z6ManualRevenueWorkdayFlags,
    flags: z6ManualRevenueWorkdayFlags,
  };
}

export function classifyZ6ManualWorkdayFocus(input: Z6WorkdayFocusInput): Z6ManualWorkdayFocusResult {
  const signals = reviewZ6WorkdayFocusSignals(input);
  const triggeredBy = [...signals.readySignals, ...signals.blockers, ...signals.warnings];
  const missingData = signals.missingData;
  const baseScore = (input.advisoryScore ?? 0) + Math.min(25, (input.estimatedRevenue ?? 0) / 1000);

  if (signals.focusSignalLevel === "governance_stop" || signals.focusSignalLevel === "blocked") {
    return makeResult("stop_first", "stop", 100, "Stop signals must be reviewed before any workday focus.", "high", triggeredBy, missingData);
  }
  if (signals.focusSignalLevel === "terminal") {
    return makeResult("no_work_terminal", "none", 5, "Terminal records should not enter active workday focus.", "high", triggeredBy, missingData);
  }
  if (signals.focusSignalLevel === "cleanup") {
    return makeResult("cleanup_first", "today", 82, "Cleanup is required before revenue workday focus is reliable.", "medium", triggeredBy, missingData);
  }
  if (signals.focusSignalLevel === "review_now") {
    return makeResult("review_now", "now", baseScore + 20, "Critical or review-now signal deserves immediate human attention.", "high", triggeredBy, missingData);
  }
  if (signals.focusSignalLevel === "near_close_today") {
    return makeResult("near_close_today", "today", baseScore + 18, "Near-close revenue pressure should be reviewed today.", "high", triggeredBy, missingData);
  }
  if (signals.focusSignalLevel === "buyer_review_today") {
    return makeResult("buyer_review_today", "today", baseScore + 14, "Buyer/disposition pressure should be reviewed today.", "medium", triggeredBy, missingData);
  }
  if (signals.focusSignalLevel === "follow_up_today") {
    return makeResult("follow_up_today", "today", baseScore + 12, "Due or overdue follow-up should stay visible today.", "medium", triggeredBy, missingData);
  }
  if (signals.focusSignalLevel === "work_today") {
    return makeResult("work_today", "today", baseScore + 10, "High-value or work-today signal belongs in manual focus.", "medium", triggeredBy, missingData);
  }
  if (signals.focusSignalLevel === "defer_low_priority") {
    return makeResult("defer_low_priority", "defer", baseScore, "Low-priority work should defer behind stronger signals.", "medium", triggeredBy, missingData);
  }
  return makeResult("monitor_today", "monitor", baseScore + 5, "Monitor this item without creating workday execution.", missingData.length > 0 ? "low" : "medium", triggeredBy, missingData);
}

export function createZ6ManualWorkdayFocusClassifierReview() {
  return {
    phase: "Z6C" as const,
    flags: z6ManualRevenueWorkdayFlags,
    advisoryOnly: true,
    deterministic: true,
    requiredHumanReview: true,
  };
}
