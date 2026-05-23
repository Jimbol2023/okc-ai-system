import { y2ReviewFlags } from "./y2-manual-workflow-efficiency-review";

export const y2ManualRevenueRoiAreas = ["decision quality improvement", "faster deal review", "revenue generation support", "throughput visibility usefulness", "near-close focus improvement", "buyer/seller coordination visibility", "manual operations before activation"] as const;

export type Y2ManualRevenueRoiInput = Partial<Record<"decisionQualityReviewed" | "fasterDealReviewReviewed" | "revenueGenerationReviewed" | "throughputReviewed" | "nearCloseReviewed" | "coordinationReviewed" | "manualBeforeActivationReviewed", boolean>> & Partial<Record<"activationRequested" | "providerRequested" | "executionRequested", boolean>>;
export type Y2ManualRevenueRoiStatus = "roi_review_blocked" | "operator_review_required" | "roi_review_clear";

const requiredRoiAreas: Array<[keyof Y2ManualRevenueRoiInput, string]> = [["decisionQualityReviewed", "decision quality improvement"], ["fasterDealReviewReviewed", "faster deal review"], ["revenueGenerationReviewed", "revenue generation support"], ["throughputReviewed", "throughput visibility usefulness"], ["nearCloseReviewed", "near-close focus improvement"], ["coordinationReviewed", "buyer/seller coordination visibility"], ["manualBeforeActivationReviewed", "manual operations before activation"]];
const blockedRequests: Array<[keyof Y2ManualRevenueRoiInput, string]> = [["activationRequested", "activation remains unauthorized"], ["providerRequested", "provider activation remains blocked"], ["executionRequested", "execution remains blocked"]];

export function createY2ManualRevenueRoiEffectivenessReview(input: Y2ManualRevenueRoiInput = {}) {
  const missingRoiAreas = requiredRoiAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const blockedReasons = blockedRequests.filter(([key]) => input[key]).map(([, label]) => label);
  const status: Y2ManualRevenueRoiStatus = blockedReasons.length > 0 ? "roi_review_blocked" : missingRoiAreas.length > 0 ? "operator_review_required" : "roi_review_clear";
  return { phase: "Y2D" as const, status, flags: y2ReviewFlags, roiAreas: y2ManualRevenueRoiAreas, roiReviewOnly: true, activationNotAuthorized: true, manualOperationsRemainPrimary: true, missingRoiAreas, blockedReasons };
}
