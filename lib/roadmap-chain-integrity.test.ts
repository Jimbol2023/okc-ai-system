import { getPhase1EliteBusinessFoundationPlanning } from "./phase1-elite-business-foundation-planning";
import { getPhase2LeadIntakeFinalLockdown } from "./phase-2-lead-intake-final-lockdown";
import { getPhase3LeadPrioritizationFinalLockdown } from "./phase-3-lead-prioritization-final-lockdown";
import { getPhase4SellerReviewFinalLockdown } from "./phase-4-seller-review-final-lockdown";
import { getPhase5FollowUpFinalLockdown } from "./phase-5-follow-up-final-lockdown";
import { getPhase6CommandCenterFinalLockdown } from "./phase-6-command-center-final-lockdown";
import { getPhase7KpiRevenueFinalLockdown } from "./phase-7-kpi-revenue-final-lockdown";
import { getPhase8DealQualityFinalLockdown } from "./phase-8-deal-quality-final-lockdown";
import { getPhase9LeadDiscoveryFinalLockdown } from "./phase-9-lead-discovery-final-lockdown";
import { getPhase10VirtualD4dFinalLockdown } from "./phase-10-virtual-d4d-final-lockdown";
import { getPhase11SeoLocalAuthorityFinalLockdown } from "./phase-11-seo-local-authority-final-lockdown";
import { getPhase12ConversionFinalLockdown } from "./phase-12-conversion-final-lockdown";
import { getPhase13SafetyComplianceFinalLockdown } from "./phase-13-safety-compliance-final-lockdown";
import { getPhase14SocialAcquisitionFinalLockdown } from "./phase-14-social-acquisition-final-lockdown";
import { getPhase15DesignCreativeFinalLockdown } from "./phase-15-design-creative-final-lockdown";
import { getPhase16BuyerFitFinalLockdown } from "./phase-16-buyer-fit-final-lockdown";
import { getPhase17SecurityFinalLockdown } from "./phase-17-security-final-lockdown";
import {
  getRoadmapFinalLockdownHumanGoNoGoReview,
  roadmapFinalLockdownPhaseNames,
} from "./roadmap-final-lockdown-human-go-no-go-review";

function normalizeStep(value: string) {
  return value.replace(/â€”/g, "—");
}

describe("roadmap chain integrity", () => {
  it("keeps Phase 1 present as the foundation planning artifact", () => {
    const phase1 = getPhase1EliteBusinessFoundationPlanning();

    expect(phase1.phase).toBe("phase1_elite_business_foundation_trust_infrastructure_planning");
    expect(phase1.businessName).toBe("Cornerstone Property Group");
    expect(phase1.market).toBe("Oklahoma City, Oklahoma");
    expect(phase1.primaryMetric).toBe("acquisition_roi_per_operator_hour");
    expect(phase1.readOnly).toBe(true);
    expect(phase1.advisoryOnly).toBe(true);
    expect(phase1.planningOnly).toBe(true);
  });

  it("keeps Phase 2F through Phase 17F final lockdown handoffs ordered", () => {
    const phase2 = getPhase2LeadIntakeFinalLockdown();
    const phase3 = getPhase3LeadPrioritizationFinalLockdown();
    const phase4 = getPhase4SellerReviewFinalLockdown();
    const phase5 = getPhase5FollowUpFinalLockdown();
    const phase6 = getPhase6CommandCenterFinalLockdown();
    const phase7 = getPhase7KpiRevenueFinalLockdown();
    const phase8 = getPhase8DealQualityFinalLockdown();
    const phase9 = getPhase9LeadDiscoveryFinalLockdown();
    const phase10 = getPhase10VirtualD4dFinalLockdown();
    const phase11 = getPhase11SeoLocalAuthorityFinalLockdown();
    const phase12 = getPhase12ConversionFinalLockdown();
    const phase13 = getPhase13SafetyComplianceFinalLockdown();
    const phase14 = getPhase14SocialAcquisitionFinalLockdown();
    const phase15 = getPhase15DesignCreativeFinalLockdown();
    const phase16 = getPhase16BuyerFitFinalLockdown();
    const phase17 = getPhase17SecurityFinalLockdown();
    const finalLockdown = getRoadmapFinalLockdownHumanGoNoGoReview();

    expect(normalizeStep(phase2.recommendedNextExactStep)).toBe("Phase 3 — Lead Prioritization Engine");
    expect(normalizeStep(phase3.recommendedNextExactStep)).toBe("Phase 4 — Seller Review & Call Prep");
    expect(normalizeStep(phase4.recommendedNextExactStep)).toBe("Phase 5 — Follow-Up Organization System");
    expect(normalizeStep(phase5.recommendedNextExactStep)).toBe("Phase 6 — Daily Acquisition Command Center");
    expect(normalizeStep(phase6.recommendedNextExactStep)).toBe("Phase 7 — KPI & Revenue Intelligence");
    expect(normalizeStep(phase7.recommendedNextExactStep)).toBe("Phase 8 — Deal Quality Intelligence");
    expect(normalizeStep(phase8.recommendedNextExactStep)).toBe("Phase 9 — AI-Assisted Lead Discovery");
    expect(normalizeStep(phase9.recommendedNextExactStep)).toBe("Phase 10 — Virtual Driving for Dollars Intelligence Engine");
    expect(normalizeStep(phase10.recommendedNextExactStep)).toBe("Phase 11 — SEO & Local Authority Engine");
    expect(normalizeStep(phase11.recommendedNextExactStep)).toBe("Phase 12 — Conversion Optimization Engine");
    expect(normalizeStep(phase12.recommendedNextExactStep)).toBe("Phase 13 — Safety & Compliance Engine");
    expect(normalizeStep(phase13.recommendedNextExactStep)).toBe("Phase 14 — Facebook & TikTok Acquisition Engine");
    expect(normalizeStep(phase14.recommendedNextExactStep)).toBe("Phase 15 — Design & Creative AI Agent");
    expect(normalizeStep(phase15.recommendedNextExactStep)).toBe("Phase 16 — Buyer Fit Intelligence");
    expect(normalizeStep(phase16.recommendedNextExactStep)).toBe("Phase 17 — Pentest & Security Engine");
    expect(normalizeStep(phase17.recommendedNextExactStep)).toBe(normalizeStep(finalLockdown.phase));
  });

  it("keeps the final roadmap lockdown connected to Phase 17F with no further phase", () => {
    const phase17 = getPhase17SecurityFinalLockdown();
    const finalLockdown = getRoadmapFinalLockdownHumanGoNoGoReview();

    expect(normalizeStep(phase17.recommendedNextExactStep)).toBe("Roadmap Final Lockdown — Human Go/No-Go Review");
    expect(normalizeStep(finalLockdown.previousStep)).toBe("Phase 17F — Security Final Lockdown");
    expect(normalizeStep(finalLockdown.recommendedNextExactStep)).toBe("No further roadmap phase — human-owned final decision required");
    expect(normalizeStep(finalLockdown.nextStageRecommendation)).toBe("No further roadmap phase — human-owned final decision required");
    expect(finalLockdown.phaseRecords.map((record) => record.phaseName)).toEqual(roadmapFinalLockdownPhaseNames);
  });
});
