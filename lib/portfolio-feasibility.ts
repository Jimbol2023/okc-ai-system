import type { PortfolioAction, PortfolioDecision } from "@/types/portfolio";

type JsonRecord = Record<string, unknown>;

export type PortfolioFeasibilityResult = {
  feasibilityStatus: "high" | "medium" | "low";
  issues: string[];
  blockers: string[];
  capitalFit: "good" | "tight" | "insufficient";
  timelineRisk: "low" | "medium" | "high";
};

function asRecord(value: unknown): JsonRecord {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as JsonRecord) : {};
}

function getPath(source: unknown, paths: string[]) {
  for (const path of paths) {
    const value = path.split(".").reduce<unknown>((current, key) => asRecord(current)[key], source);

    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return null;
}

function getNumber(source: unknown, paths: string[], fallback = 0) {
  const value = getPath(source, paths);
  const parsed = typeof value === "number" ? value : typeof value === "string" && value.trim() !== "" ? Number(value) : NaN;

  return Number.isFinite(parsed) ? parsed : fallback;
}

function getString(source: unknown, paths: string[], fallback = "") {
  const value = getPath(source, paths);

  return typeof value === "string" ? value : fallback;
}

function getArray(source: unknown, paths: string[]) {
  const value = getPath(source, paths);

  return Array.isArray(value) ? value : [];
}

function unique(items: string[]) {
  return [...new Set(items.map((item) => item.trim()).filter(Boolean))];
}

function getCapitalFit(decision: PortfolioDecision, input: unknown): PortfolioFeasibilityResult["capitalFit"] {
  const availableCapital = getNumber(input, ["availableCapital", "portfolioContext.availableCapital"], 0);
  const capitalRequired = decision.capitalRequired ?? 0;

  if (capitalRequired <= 0) return "tight";
  if (availableCapital > 0 && capitalRequired > availableCapital) return "insufficient";
  if (availableCapital > 0 && capitalRequired > availableCapital * 0.8) return "tight";
  if (capitalRequired > 75000 && decision.confidence !== undefined && decision.confidence < 65) return "tight";

  return "good";
}

function getExpectedTimeline(action: PortfolioAction) {
  const expected: Record<PortfolioAction, number> = {
    wholesale: 21,
    flip: 150,
    hold: 365,
    creative_finance: 60,
    package_portfolio: 45,
    pass: 0,
  };

  return expected[action];
}

function getTimelineRisk(decision: PortfolioDecision): PortfolioFeasibilityResult["timelineRisk"] {
  const timeline = decision.timelineDays ?? 0;
  const expected = getExpectedTimeline(decision.action);

  if (decision.action === "pass") return "low";
  if (timeline <= 0) return "medium";
  if (timeline > expected * 1.5) return "high";
  if (timeline > expected) return "medium";

  return "low";
}

function isAggressiveAction(action: PortfolioAction) {
  return action === "flip" || action === "creative_finance" || action === "package_portfolio";
}

export function evaluateFeasibility(decision: PortfolioDecision, input: unknown = {}): PortfolioFeasibilityResult {
  const issues: string[] = [];
  const blockers: string[] = [];
  const capitalFit = getCapitalFit(decision, input);
  const timelineRisk = getTimelineRisk(decision);
  const confidence = decision.confidence ?? 0;
  const roi = decision.estimatedReturn?.roi ?? 0;
  const profit = decision.estimatedReturn?.profit ?? 0;
  const dataTrustScore = getNumber(input, ["executionDecisionSupport.dataTrustScore", "executionDecisionSupport.reliability.dataTrustScore"], 50);
  const riskScore = getNumber(input, ["executionDecisionSupport.selectedOption.riskScore", "executionDecisionSupport.modelRiskScore"], 50);
  const uncertaintyLevel = getString(input, ["executionDecisionSupport.uncertaintyLevel", "executionDecisionSupport.reliability.uncertaintyLevel"], "moderate");
  const missingData = getArray(input, ["executionDecisionSupport.confidence.missingData"])
    .filter((item): item is string => typeof item === "string");
  const apiBlockers = getArray(input, ["executionDecisionSupport.blockReasons"])
    .filter((item): item is string => typeof item === "string");

  if (capitalFit === "insufficient") {
    blockers.push("Capital required exceeds available capital.");
  } else if (capitalFit === "tight") {
    issues.push("Capital fit is tight for the selected portfolio action.");
  }

  if (timelineRisk === "high") {
    issues.push("Timeline risk is high for the selected strategy.");
  } else if (timelineRisk === "medium") {
    issues.push("Timeline may be longer than ideal for this action.");
  }

  if ((decision.capitalRequired ?? 0) > 50000 && confidence < 65) {
    issues.push("High capital requirement combined with weak confidence reduces feasibility.");
  }

  if (uncertaintyLevel === "high" || uncertaintyLevel === "extreme") {
    issues.push(`Uncertainty is ${uncertaintyLevel}, which weakens execution feasibility.`);
    if (isAggressiveAction(decision.action)) {
      blockers.push(`Aggressive action ${decision.action} is not feasible with ${uncertaintyLevel} uncertainty.`);
    }
  }

  if (missingData.length > 0) {
    issues.push(`Missing critical data: ${missingData.slice(0, 3).join(", ")}.`);
  }

  if (missingData.length >= 4 || dataTrustScore < 45) {
    blockers.push("Data quality is too low for this portfolio action.");
  }

  if (riskScore >= 75 && (roi < 15 || profit < 10000) && decision.action !== "pass") {
    blockers.push("Risk outweighs expected return under current assumptions.");
  }

  if (decision.action === "flip" && missingData.some((field) => field.toLowerCase().includes("repair"))) {
    issues.push("Flip feasibility is weak without verified repair data.");
  }

  if (decision.action === "wholesale" && (decision.timelineDays ?? 0) > 30) {
    issues.push("Wholesale depends on speed, but projected timeline is long.");
  }

  if (apiBlockers.length > 0) {
    blockers.push(...apiBlockers.slice(0, 4));
  }

  const uniqueIssues = unique(issues);
  const uniqueBlockers = unique(blockers);
  const feasibilityStatus = uniqueBlockers.length > 0 || capitalFit === "insufficient"
    ? "low"
    : uniqueIssues.length >= 3 || timelineRisk === "high" || capitalFit === "tight"
      ? "medium"
      : "high";

  return {
    feasibilityStatus,
    issues: uniqueIssues,
    blockers: uniqueBlockers,
    capitalFit,
    timelineRisk,
  };
}
