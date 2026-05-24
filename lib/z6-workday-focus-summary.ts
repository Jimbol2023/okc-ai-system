import { classifyZ6ManualWorkdayFocus } from "./z6-manual-workday-focus-classifier";
import { z6ManualRevenueWorkdayFlags } from "./z6-manual-revenue-workday-policy";
import { reviewZ6WorkdayFocusSignals, type Z6WorkdayFocusInput } from "./z6-workday-focus-signal-review";

export type Z6WorkdayFocusSummaryState =
  | "stop_before_work"
  | "cleanup_before_work"
  | "focus_now"
  | "focus_today"
  | "focus_this_week"
  | "monitor_only"
  | "defer"
  | "no_work"
  | "not_ready";

export type Z6WorkdayFocusSummary = {
  summaryState: Z6WorkdayFocusSummaryState;
  dailyFocus: string;
  safetyPosture: string;
  revenueUsefulness: string;
  followUpPressure: string;
  nearClosePressure: string;
  buyerDispositionPressure: string;
  dataCleanup: string;
  operatorFocusRecommendation: string;
  safeNextManualReview: string;
  signals: ReturnType<typeof reviewZ6WorkdayFocusSignals>;
  focus: ReturnType<typeof classifyZ6ManualWorkdayFocus>;
  flags: typeof z6ManualRevenueWorkdayFlags;
  advisoryOnly: true;
};

function getSummaryState(signals: ReturnType<typeof reviewZ6WorkdayFocusSignals>, focus: ReturnType<typeof classifyZ6ManualWorkdayFocus>): Z6WorkdayFocusSummaryState {
  if (signals.missingData.includes("Z5 priority lane, summary level, or advisory score")) return "not_ready";
  if (focus.workdayLane === "stop_first") return "stop_before_work";
  if (focus.workdayLane === "cleanup_first") return "cleanup_before_work";
  if (focus.workdayLane === "no_work_terminal") return "no_work";
  if (focus.focusTier === "now") return "focus_now";
  if (focus.focusTier === "today") return "focus_today";
  if (focus.focusTier === "week") return "focus_this_week";
  if (focus.focusTier === "defer") return "defer";
  return "monitor_only";
}

export function createZ6WorkdayFocusSummary(input: Z6WorkdayFocusInput): Z6WorkdayFocusSummary {
  const signals = reviewZ6WorkdayFocusSignals(input);
  const focus = classifyZ6ManualWorkdayFocus(input);
  const summaryState = getSummaryState(signals, focus);

  return {
    summaryState,
    dailyFocus: focus.workdayLane,
    safetyPosture: signals.blockers.length > 0 ? `Stop signals present: ${signals.blockers.join(", ")}.` : "No stop signal detected from advisory input.",
    revenueUsefulness: focus.advisoryFocusScore >= 65 ? "Useful for today's manual revenue focus." : "Useful mainly for monitoring or later review.",
    followUpPressure: signals.readySignals.includes("follow-up-today") ? "Follow-up pressure is visible." : "No follow-up pressure detected.",
    nearClosePressure: signals.readySignals.includes("near-close-today") ? "Near-close pressure is visible." : "No near-close pressure detected.",
    buyerDispositionPressure: signals.readySignals.includes("buyer-review-today") ? "Buyer/disposition pressure is visible." : "No buyer/disposition pressure detected.",
    dataCleanup: signals.missingData.length > 0 ? `Missing data: ${signals.missingData.join(", ")}.` : "No missing focus data detected.",
    operatorFocusRecommendation: summaryState === "stop_before_work" ? "Resolve stop signals before any workday focus." : "Use this as advisory human workday focus only.",
    safeNextManualReview: focus.reason,
    signals,
    focus,
    flags: z6ManualRevenueWorkdayFlags,
    advisoryOnly: true,
  };
}

export function createZ6WorkdayFocusList(inputs: Z6WorkdayFocusInput[]) {
  const summaries = inputs.map((input, index) => ({
    inputIndex: index,
    inputId: input.id ?? "",
    inputLabel: input.label ?? "",
    summary: createZ6WorkdayFocusSummary(input),
  }));
  const ranked = [...summaries].sort((a, b) =>
    b.summary.focus.advisoryFocusScore - a.summary.focus.advisoryFocusScore ||
    a.summary.dailyFocus.localeCompare(b.summary.dailyFocus) ||
    a.inputId.localeCompare(b.inputId) ||
    a.inputLabel.localeCompare(b.inputLabel) ||
    a.inputIndex - b.inputIndex,
  );

  return {
    phase: "Z6D" as const,
    flags: z6ManualRevenueWorkdayFlags,
    advisoryOnly: true,
    ranked,
    countsBySummaryState: ranked.reduce<Record<Z6WorkdayFocusSummaryState, number>>((counts, item) => {
      counts[item.summary.summaryState] += 1;
      return counts;
    }, {
      stop_before_work: 0,
      cleanup_before_work: 0,
      focus_now: 0,
      focus_today: 0,
      focus_this_week: 0,
      monitor_only: 0,
      defer: 0,
      no_work: 0,
      not_ready: 0,
    }),
  };
}

export function createZ6WorkdayFocusSummaryReview() {
  return {
    phase: "Z6D" as const,
    flags: z6ManualRevenueWorkdayFlags,
    advisoryOnly: true,
    deterministic: true,
    summaryStates: ["stop_before_work", "cleanup_before_work", "focus_now", "focus_today", "focus_this_week", "monitor_only", "defer", "no_work", "not_ready"] as const,
  };
}
