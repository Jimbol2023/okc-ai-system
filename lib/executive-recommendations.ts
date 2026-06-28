import type { BusinessIntelligenceReport } from "@/lib/business-intelligence";

export const forbiddenExecutionLanguage = /send now|publish now|call provider|start outreach|trigger outreach|auto[- ]?send|activate provider/i;

export function sanitizeAdvisoryRecommendationText(recommendation: string) {
  return forbiddenExecutionLanguage.test(recommendation)
    ? "Review the flagged opportunity manually; automated execution remains disabled."
    : recommendation;
}

export function createExecutiveRecommendationsFromBi(report: BusinessIntelligenceReport) {
  const recommendations = [
    report.summary.followUpsDue > 0 ? `${report.summary.followUpsDue} lead(s) need manual follow-up review today; no outreach is sent from this dashboard.` : "",
    report.summary.topChannel && report.summary.topChannel.qualifiedShare >= 50
      ? `${report.summary.topChannel.source} generated ${report.summary.topChannel.qualifiedShare}% of currently qualified leads; review this channel before reallocating budget manually.`
      : "",
    report.summary.offerReadyCount > 0
      ? `${report.summary.offerReadyCount} opportunity/opportunities are offer-ready or near-contract; verify seller motivation and value assumptions manually.`
      : "",
    report.summary.marketingApprovalBacklog > 0
      ? `${report.summary.marketingApprovalBacklog} marketing draft(s) are awaiting manual approval; publishing remains outside the dashboard.`
      : "",
    report.summary.financeGapCount > 0 ? `${report.summary.financeGapCount} finance KPI gap(s) are limiting CPL, CPA, and profit visibility.` : "",
    report.summary.closingBlockedCount > 0 ? `${report.summary.closingBlockedCount} closing-related opportunity/opportunities have operations blockers to review manually.` : "",
  ].filter(Boolean);

  const safeRecommendations =
    recommendations.length > 0
      ? recommendations
      : ["Monitor lead quality, finance entries, and department health before changing operating priorities."];

  return safeRecommendations.map(sanitizeAdvisoryRecommendationText);
}

export function assertExecutiveRecommendationsAreAdvisory(recommendations: string[]) {
  if (recommendations.some((recommendation) => forbiddenExecutionLanguage.test(recommendation))) {
    throw new Error("Executive recommendations must remain advisory and must not include execution language.");
  }
}
