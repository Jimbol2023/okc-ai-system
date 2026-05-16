import type { FundingMethod, FundingRecommendation } from "@/types/capital-funding";
import type { PortfolioAction, PortfolioDecision } from "@/types/portfolio";

type JsonRecord = Record<string, unknown>;

type CapitalFundingInput = {
  portfolioDecision?: PortfolioDecision | null;
  feasibilityResult?: unknown;
  strategyDecision?: unknown;
  deal?: unknown;
  lead?: unknown;
  purchasePrice?: number | null;
  askingPrice?: number | null;
  arv?: number | null;
  repairs?: number | null;
  estimatedRepairs?: number | null;
  estimatedProfit?: number | null;
  timelineDays?: number | null;
  capitalRequired?: number | null;
  riskScore?: number | null;
  uncertaintyScore?: number | null;
  reliabilityScore?: number | null;
  sellerTermsAvailable?: boolean | null;
  buyerDemandScore?: number | null;
  state?: string | null;
  market?: string | null;
};

function asRecord(value: unknown): JsonRecord {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as JsonRecord) : {};
}

function getPath(source: unknown, paths: string[]) {
  for (const path of paths) {
    const value = path.split(".").reduce<unknown>((current, key) => asRecord(current)[key], source);

    if (value !== undefined && value !== null && value !== "") return value;
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

  return typeof value === "string" ? value.trim() : fallback;
}

function getBoolean(source: unknown, paths: string[], fallback = false) {
  const value = getPath(source, paths);

  return typeof value === "boolean" ? value : fallback;
}

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function unique(items: string[]) {
  return [...new Set(items.map((item) => item.trim()).filter(Boolean))];
}

function getAction(input: CapitalFundingInput): PortfolioAction {
  return input.portfolioDecision?.action ?? "pass";
}

function getDealMetrics(input: CapitalFundingInput) {
  const purchasePrice = getNumber(input, ["purchasePrice", "askingPrice", "deal.purchasePrice", "deal.askingPrice", "lead.askingPrice"], 0);
  const arv = getNumber(input, ["arv", "deal.arv", "lead.arv"], 0);
  const repairs = getNumber(input, ["repairs", "estimatedRepairs", "deal.estimatedRepairs", "lead.estimatedRepairs"], 0);
  const capitalRequired = input.portfolioDecision?.capitalRequired ?? getNumber(input, ["capitalRequired"], 0);
  const timelineDays = input.portfolioDecision?.timelineDays ?? getNumber(input, ["timelineDays"], 0);
  const estimatedProfit = input.portfolioDecision?.estimatedReturn?.profit ?? getNumber(input, ["estimatedProfit"], Math.max(0, arv - purchasePrice - repairs));
  const reliabilityScore = getNumber(input, ["reliabilityScore", "portfolioDecision.confidence"], input.portfolioDecision?.confidence ?? 50);
  const riskScore = getNumber(input, ["riskScore", "portfolioDecision.riskScore"], 50);
  const uncertaintyScore = getNumber(input, ["uncertaintyScore"], 50);
  const buyerDemandScore = getNumber(input, ["buyerDemandScore", "buyerIntelligence.demandScore", "marketContext.buyerDemandScore"], 50);
  const state = getString(input, ["state", "market.state", "deal.state", "lead.state"], "");
  const market = getString(input, ["market", "deal.market", "lead.market"], "");
  const sellerTermsAvailable = getBoolean(input, ["sellerTermsAvailable", "flexibleTerms", "deal.flexibleTerms", "lead.flexibleTerms"], false);

  return {
    purchasePrice,
    arv,
    repairs,
    capitalRequired,
    timelineDays,
    estimatedProfit,
    reliabilityScore,
    riskScore,
    uncertaintyScore,
    buyerDemandScore,
    state,
    market,
    sellerTermsAvailable,
  };
}

function getFit(score: number): "strong" | "moderate" | "weak" {
  if (score >= 75) return "strong";
  if (score >= 55) return "moderate";
  return "weak";
}

function getSpeedFit(method: FundingMethod): "fast" | "moderate" | "slow" {
  if (method === "cash" || method === "transactional_funding" || method === "buyer_funded_double_close") return "fast";
  if (method === "private_money" || method === "hard_money" || method === "seller_finance" || method === "subject_to") return "moderate";
  return "slow";
}

function needsOklahomaWarning(action: PortfolioAction, input: CapitalFundingInput, method: FundingMethod) {
  const metrics = getDealMetrics(input);
  const stateMarket = `${metrics.state} ${metrics.market}`.toLowerCase();

  return (
    stateMarket.includes("ok") ||
    stateMarket.includes("oklahoma") ||
    action === "wholesale" ||
    method === "transactional_funding" ||
    method === "buyer_funded_double_close"
  );
}

function scoreMethods(input: CapitalFundingInput) {
  const action = getAction(input);
  const metrics = getDealMetrics(input);
  const feasibility = input.portfolioDecision?.feasibilityStatus ?? "medium";
  const lowFeasibilityPenalty = feasibility === "low" ? 25 : feasibility === "medium" ? 8 : 0;
  const highRiskPenalty = metrics.riskScore >= 70 ? 12 : 0;
  const weakReliabilityPenalty = metrics.reliabilityScore < 55 ? 14 : 0;
  const highRepairsPenalty = metrics.repairs > metrics.arv * 0.2 && metrics.arv > 0 ? 10 : 0;
  const capitalLight = metrics.capitalRequired > 0 && metrics.capitalRequired <= 10000;

  const scores: Record<FundingMethod, number> = {
    cash: 45 + (capitalLight ? 22 : 0) - lowFeasibilityPenalty * 0.5,
    private_money: 45 + (action === "flip" || action === "hold" || action === "package_portfolio" ? 20 : 0) - weakReliabilityPenalty,
    hard_money: 40 + (action === "flip" ? 24 : 0) - highRepairsPenalty - weakReliabilityPenalty,
    bridge_lending: 38 + (action === "flip" || action === "hold" || action === "package_portfolio" ? 18 : 0) - highRiskPenalty,
    transactional_funding: 35 + (action === "wholesale" ? 28 : 0) + (metrics.buyerDemandScore >= 65 ? 8 : 0) - lowFeasibilityPenalty,
    seller_finance: 30 + (action === "creative_finance" && metrics.sellerTermsAvailable ? 35 : 0) - highRiskPenalty,
    subject_to: 28 + (action === "creative_finance" && metrics.sellerTermsAvailable ? 32 : 0) - highRiskPenalty,
    partnership: 35 + (action === "hold" || action === "package_portfolio" ? 22 : 0) + (metrics.capitalRequired > 75000 ? 8 : 0),
    buyer_funded_double_close: 34 + (action === "wholesale" ? 30 : 0) + (metrics.buyerDemandScore >= 65 ? 10 : 0) - lowFeasibilityPenalty,
    pass_or_wait: 20 + (action === "pass" ? 45 : 0) + (feasibility === "low" ? 20 : 0) + (metrics.reliabilityScore < 45 ? 10 : 0),
  };

  if (metrics.uncertaintyScore >= 70) {
    scores.hard_money -= 8;
    scores.bridge_lending -= 8;
    scores.pass_or_wait += 12;
  }

  return Object.entries(scores)
    .map(([method, score]) => ({ method: method as FundingMethod, score: clampScore(score) }))
    .sort((a, b) => b.score - a.score);
}

export function recommendFundingPath(input: CapitalFundingInput): FundingRecommendation {
  const action = getAction(input);
  const metrics = getDealMetrics(input);
  const ranked = scoreMethods(input);
  const primary = ranked[0] ?? { method: "pass_or_wait" as FundingMethod, score: 0 };
  const reasons: string[] = [];
  const risks: string[] = [];
  const blockers: string[] = [];
  const complianceWarnings: string[] = [];
  const estimatedDownPayment = primary.method === "cash" || primary.method === "transactional_funding" || primary.method === "buyer_funded_double_close"
    ? metrics.capitalRequired
    : Math.round((metrics.purchasePrice || metrics.capitalRequired) * 0.2);
  const estimatedLoanAmount = primary.method === "cash" || primary.method === "seller_finance" || primary.method === "subject_to"
    ? undefined
    : Math.max(0, Math.round((metrics.purchasePrice || metrics.capitalRequired) - estimatedDownPayment));

  if (action === "wholesale") reasons.push("Wholesale usually benefits from fast, low-capital funding paths.");
  if (action === "flip") reasons.push("Flip strategy usually fits private money, hard money, or bridge lending.");
  if (action === "hold") reasons.push("Hold strategy needs capital that can support acquisition and stabilization.");
  if (action === "creative_finance") reasons.push("Creative finance is strongest when seller terms are real and documented.");
  if (action === "package_portfolio") reasons.push("Package portfolio strategy often needs partnership or private capital capacity.");
  if (action === "pass") reasons.push("Pass or wait is favored when feasibility, data quality, or capital fit is weak.");
  reasons.push(`${primary.method} is the top-ranked funding method at ${primary.score}/100 fit.`);

  if (metrics.repairs > 0 && metrics.reliabilityScore < 60) risks.push("Repair exposure with limited reliability may reduce funding appetite.");
  if (metrics.timelineDays > 120 && (primary.method === "hard_money" || primary.method === "bridge_lending")) risks.push("Long timeline may pressure short-term debt.");
  if (metrics.capitalRequired > 75000) risks.push("Capital-heavy deal may require stronger reserves or partners.");
  if (metrics.uncertaintyScore >= 70) risks.push("High uncertainty weakens aggressive funding paths.");
  if (action === "creative_finance") risks.push("Creative finance requires attorney/title review before execution.");
  if (action === "hold" && metrics.estimatedProfit === 0) blockers.push("Cashflow or income data is insufficient for hold funding confidence.");
  if ((input.portfolioDecision?.executionBlockers?.length ?? 0) > 0) blockers.push(...(input.portfolioDecision?.executionBlockers ?? []).slice(0, 4));
  if (input.portfolioDecision?.feasibilityStatus === "low") blockers.push("Portfolio feasibility is low; funding should wait until blockers improve.");

  if (needsOklahomaWarning(action, input, primary.method)) {
    complianceWarnings.push(
      "Review Oklahoma wholesaling, disclosure, licensing, assignment, and closing requirements with a qualified real estate attorney/title company before execution.",
    );
  }

  if (action === "creative_finance" || primary.method === "seller_finance" || primary.method === "subject_to") {
    complianceWarnings.push("Attorney/title review required for creative finance structures. This is not legal advice and compliance is not guaranteed.");
  }

  return {
    primaryMethod: primary.method,
    confidence: primary.score,
    capitalRequired: metrics.capitalRequired || undefined,
    estimatedDownPayment: estimatedDownPayment || undefined,
    estimatedLoanAmount,
    fundingFit: getFit(primary.score),
    speedFit: getSpeedFit(primary.method),
    strategyFit: getFit(Math.round((primary.score + (input.portfolioDecision?.confidence ?? 50)) / 2)),
    reasons: unique(reasons).slice(0, 5),
    risks: unique(risks).slice(0, 6),
    blockers: unique(blockers).slice(0, 6),
    backupMethods: ranked.slice(1, 4).map((item) => ({
      method: item.method,
      score: item.score,
      reason: `${item.method} is a backup option with ${item.score}/100 fit.`,
    })),
    complianceWarnings: unique(complianceWarnings),
    recommendedNextStep: primary.method === "pass_or_wait"
      ? "Improve feasibility, data quality, or capital conditions before pursuing funding."
      : "Review this funding path with a qualified human operator, attorney/title company, and funding professional before any execution.",
  };
}
