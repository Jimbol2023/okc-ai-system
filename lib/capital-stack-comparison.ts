import type { FundingRecommendation } from "@/types/capital-funding";
import type { CapitalStackMethod, CapitalStackScenario, FundingSensitivityResult } from "@/types/capital-stack";
import type { PortfolioDecision } from "@/types/portfolio";

type JsonRecord = Record<string, unknown>;

type CapitalStackInput = {
  fundingRecommendation?: FundingRecommendation | null;
  portfolioDecision?: PortfolioDecision | null;
  feasibilityResult?: unknown;
  deal?: unknown;
  lead?: unknown;
  purchasePrice?: number | null;
  askingPrice?: number | null;
  arv?: number | null;
  repairs?: number | null;
  estimatedRepairs?: number | null;
  estimatedProfit?: number | null;
  capitalRequired?: number | null;
  timelineDays?: number | null;
  riskScore?: number | null;
  uncertaintyScore?: number | null;
  reliabilityScore?: number | null;
  buyerDemandScore?: number | null;
  sellerTermsAvailable?: boolean | null;
  state?: string | null;
  market?: string | null;
};

const METHODS: CapitalStackMethod[] = [
  "cash",
  "private_money",
  "hard_money",
  "bridge_lending",
  "transactional_funding",
  "seller_finance",
  "subject_to",
  "partnership",
  "buyer_funded_double_close",
  "pass_or_wait",
];

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

function getMetrics(input: CapitalStackInput) {
  const purchasePrice = getNumber(input, ["purchasePrice", "askingPrice", "deal.purchasePrice", "deal.askingPrice", "lead.askingPrice"], 0);
  const arv = getNumber(input, ["arv", "deal.arv", "lead.arv"], 0);
  const repairs = getNumber(input, ["repairs", "estimatedRepairs", "deal.estimatedRepairs", "lead.estimatedRepairs"], 0);
  const timelineDays = input.portfolioDecision?.timelineDays ?? getNumber(input, ["timelineDays"], 30);
  const capitalRequired = input.portfolioDecision?.capitalRequired ?? getNumber(input, ["capitalRequired"], Math.round(purchasePrice * 0.2 + repairs));
  const estimatedProfit = input.portfolioDecision?.estimatedReturn?.profit ?? getNumber(input, ["estimatedProfit"], Math.max(0, arv - purchasePrice - repairs));
  const riskScore = getNumber(input, ["riskScore"], 50);
  const uncertaintyScore = getNumber(input, ["uncertaintyScore"], 50);
  const reliabilityScore = getNumber(input, ["reliabilityScore", "portfolioDecision.confidence"], input.portfolioDecision?.confidence ?? 50);
  const buyerDemandScore = getNumber(input, ["buyerDemandScore"], 50);
  const sellerTermsAvailable = getBoolean(input, ["sellerTermsAvailable"], false);
  const stateMarket = `${getString(input, ["state"], "")} ${getString(input, ["market"], "")}`.toLowerCase();

  return {
    purchasePrice,
    arv,
    repairs,
    timelineDays,
    capitalRequired,
    estimatedProfit,
    riskScore,
    uncertaintyScore,
    reliabilityScore,
    buyerDemandScore,
    sellerTermsAvailable,
    stateMarket,
    action: input.portfolioDecision?.action ?? "pass",
    primaryFunding: input.fundingRecommendation?.primaryMethod,
    feasibilityStatus: input.portfolioDecision?.feasibilityStatus ?? "medium",
  };
}

function getTerms(method: CapitalStackMethod) {
  const terms: Record<CapitalStackMethod, { rate: number; points: number; downPercent: number; speed: CapitalStackScenario["speedFit"]; preservation: CapitalStackScenario["cashPreservation"] }> = {
    cash: { rate: 0, points: 0, downPercent: 1, speed: "fast", preservation: "weak" },
    private_money: { rate: 10, points: 2, downPercent: 0.2, speed: "moderate", preservation: "moderate" },
    hard_money: { rate: 12, points: 3, downPercent: 0.15, speed: "fast", preservation: "moderate" },
    bridge_lending: { rate: 11, points: 2, downPercent: 0.2, speed: "moderate", preservation: "moderate" },
    transactional_funding: { rate: 0, points: 1.5, downPercent: 0.05, speed: "fast", preservation: "strong" },
    seller_finance: { rate: 6, points: 0, downPercent: 0.05, speed: "moderate", preservation: "strong" },
    subject_to: { rate: 5, points: 0, downPercent: 0.03, speed: "moderate", preservation: "strong" },
    partnership: { rate: 0, points: 0, downPercent: 0.05, speed: "slow", preservation: "strong" },
    buyer_funded_double_close: { rate: 0, points: 1, downPercent: 0.02, speed: "fast", preservation: "strong" },
    pass_or_wait: { rate: 0, points: 0, downPercent: 0, speed: "slow", preservation: "strong" },
  };

  return terms[method];
}

function getRiskLevel(score: number): CapitalStackScenario["riskLevel"] {
  if (score >= 70) return "high";
  if (score >= 45) return "medium";
  return "low";
}

function getFeasibility(score: number): CapitalStackScenario["feasibility"] {
  if (score >= 75) return "high";
  if (score >= 55) return "medium";
  return "low";
}

function buildScenario(method: CapitalStackMethod, input: CapitalStackInput): CapitalStackScenario {
  const metrics = getMetrics(input);
  const terms = getTerms(method);
  const baseCost = metrics.purchasePrice + metrics.repairs;
  const downPayment = method === "pass_or_wait" ? 0 : Math.round(baseCost * terms.downPercent);
  const loanAmount = method === "cash" || method === "pass_or_wait" ? 0 : Math.max(0, baseCost - downPayment);
  const monthlyInterest = Math.round((loanAmount * (terms.rate / 100)) / 12);
  const pointsCost = Math.round(loanAmount * (terms.points / 100));
  const holdingMonths = Math.max(1, Math.ceil(metrics.timelineDays / 30));
  const totalFinancingCost = method === "partnership"
    ? Math.round(metrics.estimatedProfit * 0.35)
    : pointsCost + monthlyInterest * holdingMonths;
  const estimatedProfit = method === "pass_or_wait" ? 0 : Math.round(metrics.estimatedProfit - totalFinancingCost);
  const cashRequired = method === "cash" ? baseCost : downPayment + pointsCost;
  const reasons: string[] = [];
  const risks: string[] = [];
  let score = 45 + metrics.reliabilityScore * 0.12 - metrics.uncertaintyScore * 0.12 - metrics.riskScore * 0.08;

  if (method === metrics.primaryFunding) {
    score += 12;
    reasons.push("Matches the current primary funding recommendation.");
  }

  if (method === "cash") {
    reasons.push("Lowest financing cost and highest control.");
    risks.push("Weak cash preservation due to high cash requirement.");
    score += cashRequired <= metrics.capitalRequired ? 8 : -6;
  }

  if (method === "private_money") {
    reasons.push("Flexible capital fit for flips or short holds.");
    if (metrics.estimatedProfit > 20000) score += 10;
  }

  if (method === "hard_money" || method === "bridge_lending") {
    reasons.push("Fast asset-backed short-term funding.");
    risks.push("Exit delays can increase short-term debt risk.");
    if (metrics.timelineDays <= 150) score += 8;
    if (metrics.timelineDays > 180) score -= 12;
  }

  if (method === "transactional_funding") {
    reasons.push("Best fit for very short double-close style transactions.");
    if (metrics.action === "wholesale" && metrics.timelineDays <= 21) score += 20;
    if (metrics.timelineDays > 30) score -= 20;
  }

  if (method === "seller_finance" || method === "subject_to") {
    reasons.push("Strong cash preservation when seller terms are real.");
    if (metrics.sellerTermsAvailable || metrics.action === "creative_finance") score += 20;
    else score -= 15;
    risks.push("Requires attorney/title review and verified seller consent.");
  }

  if (method === "partnership") {
    reasons.push("Preserves cash and can solve tight capital fit.");
    risks.push("Profit share reduces net upside.");
    if (metrics.capitalRequired > 50000) score += 10;
  }

  if (method === "buyer_funded_double_close") {
    reasons.push("Preserves cash when buyer demand and closing readiness are strong.");
    if (metrics.action === "wholesale" && metrics.buyerDemandScore >= 65) score += 22;
    else score -= 8;
  }

  if (method === "pass_or_wait") {
    reasons.push("Best when feasibility, data quality, or funding risk is too weak.");
    if (metrics.feasibilityStatus === "low" || metrics.reliabilityScore < 45) score += 25;
  }

  if (estimatedProfit < 0) {
    score -= 15;
    risks.push("Estimated profit turns negative after financing cost.");
  }

  return {
    method,
    score: clampScore(score),
    estimatedProfit,
    cashRequired,
    estimatedLoanAmount: loanAmount || undefined,
    estimatedDownPayment: downPayment || undefined,
    interestRate: terms.rate,
    points: terms.points,
    monthlyCarryingCost: monthlyInterest || undefined,
    totalFinancingCost,
    timelineDays: metrics.timelineDays,
    riskLevel: getRiskLevel(metrics.riskScore + (estimatedProfit < 0 ? 20 : 0)),
    speedFit: terms.speed,
    cashPreservation: terms.preservation,
    feasibility: getFeasibility(score),
    reasons: unique(reasons),
    risks: unique(risks),
  };
}

function needsComplianceWarning(input: CapitalStackInput, scenarios: CapitalStackScenario[]) {
  const metrics = getMetrics(input);
  const methodText = scenarios.map((scenario) => scenario.method).join(" ");

  return (
    metrics.stateMarket.includes("ok") ||
    metrics.stateMarket.includes("oklahoma") ||
    metrics.action === "wholesale" ||
    metrics.action === "creative_finance" ||
    methodText.includes("transactional_funding") ||
    methodText.includes("buyer_funded_double_close") ||
    methodText.includes("seller_finance") ||
    methodText.includes("subject_to")
  );
}

export function compareCapitalStacks(input: CapitalStackInput): FundingSensitivityResult {
  const scenarios = METHODS.map((method) => buildScenario(method, input)).sort((a, b) => b.score - a.score);
  const best = scenarios[0] ?? buildScenario("pass_or_wait", input);
  const metrics = getMetrics(input);
  const interestRateImpact = scenarios
    .filter((scenario) => (scenario.estimatedLoanAmount ?? 0) > 0)
    .map((scenario) => Math.round(((scenario.estimatedLoanAmount ?? 0) * 0.02 / 12) * Math.max(1, Math.ceil((scenario.timelineDays ?? 30) / 30))));
  const maxRateImpact = Math.max(0, ...interestRateImpact);
  const repairIncrease = Math.round(metrics.repairs * 0.15);
  const delayCost = Math.max(...scenarios.map((scenario) => scenario.monthlyCarryingCost ?? 0), 0);
  const exitDrop = Math.round((metrics.arv || metrics.purchasePrice) * 0.05);
  const sensitivityAlerts: string[] = [];
  const avoidMethods = scenarios
    .filter((scenario) => scenario.score < 35 || scenario.feasibility === "low" || (scenario.estimatedProfit ?? 0) < 0)
    .slice(0, 4)
    .map((scenario) => ({
      method: scenario.method,
      reason: scenario.estimatedProfit && scenario.estimatedProfit < 0
        ? "Estimated profit is negative after financing cost."
        : "Low score or weak feasibility under current assumptions.",
    }));
  const complianceWarnings = needsComplianceWarning(input, scenarios)
    ? [
        "Review Oklahoma wholesaling, disclosure, licensing, assignment, double-close, seller-finance, subject-to, and closing requirements with a qualified real estate attorney/title company before execution.",
      ]
    : [];

  if (maxRateImpact > 2500) sensitivityAlerts.push(`A +2% interest rate move could reduce profit by up to about ${maxRateImpact}.`);
  if (repairIncrease > 5000) sensitivityAlerts.push(`A 15% repair increase adds about ${repairIncrease} of cost.`);
  if (delayCost > 0) sensitivityAlerts.push(`A 30-day delay may add about ${delayCost} in carrying cost on debt-funded options.`);
  if (exitDrop > 5000) sensitivityAlerts.push(`A 5% lower exit price could reduce proceeds by about ${exitDrop}.`);
  if (best.method === "pass_or_wait") sensitivityAlerts.push("Best current capital stack is to wait because funding risk is too high or data is weak.");

  return {
    bestMethod: best.method,
    bestReason: `${best.method} ranks highest with ${best.score}/100 based on profit impact, cash required, speed, risk, and feasibility.`,
    scenarios,
    sensitivityAlerts,
    stressTests: {
      interestRateIncrease: maxRateImpact > 0 ? `+2% rate impact: approximately ${maxRateImpact} additional financing cost.` : "No meaningful rate exposure detected for top cash/light-capital options.",
      repairCostIncrease: repairIncrease > 0 ? `+15% repairs: approximately ${repairIncrease} additional cost.` : "Repair estimate unavailable; stress test uses zero repair increase.",
      timelineDelay: delayCost > 0 ? `+30 days: approximately ${delayCost} additional carrying cost on the highest carrying-cost option.` : "No meaningful monthly carrying cost detected.",
      lowerExitPrice: exitDrop > 0 ? `-5% exit price: approximately ${exitDrop} lower proceeds.` : "Exit price unavailable; lower-exit stress test is limited.",
    },
    avoidMethods,
    complianceWarnings,
    recommendedNextStep: "Review the top capital stack and stress tests with a qualified human operator before any funding or execution step.",
  };
}
