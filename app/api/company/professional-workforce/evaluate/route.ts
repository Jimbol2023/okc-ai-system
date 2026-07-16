import { NextResponse } from "next/server";
import { z } from "zod";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { evaluateProfessionalPilot, scoreMarginalPropertySource } from "@/lib/enterprise-professional-workforce";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const disposition = z.enum(["research_next", "manager_review", "hold_missing_data", "not_actionable_with_current_evidence"]);
const pilotRecord = z.object({ cohort: z.enum(["calibration", "validation"]), briefId: z.string().min(1), baselineResearchMinutes: z.number().nonnegative(), assistedResearchMinutes: z.number().nonnegative(), usefulnessRating: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]), initialDecision: disposition, finalDecision: disposition, inventedFacts: z.number().int().nonnegative(), crossPropertyLeaks: z.number().int().nonnegative(), unauthorizedActions: z.number().int().nonnegative(), seededIssues: z.number().int().nonnegative(), detectedSeededIssues: z.number().int().nonnegative(), falseHighPriorityIncrease: z.boolean() }).strict();
const source = z.object({ id: z.string().min(1), decisionImpact: z.number().min(0).max(100), sectionCoverage: z.number().min(0).max(100), dataGapFrequency: z.number().min(0).max(100), authority: z.number().min(0).max(100), freshness: z.number().min(0).max(100), reuse: z.number().min(0).max(100), integrationCost: z.number().min(0).max(100), maintenanceCost: z.number().min(0).max(100), licensingRisk: z.number().min(0).max(100), privacyRisk: z.number().min(0).max(100) }).strict();
const schema = z.union([z.object({ mode: z.literal("pilot"), records: z.array(pilotRecord).max(100) }).strict(), z.object({ mode: z.literal("source"), source }).strict()]);

export async function POST(request: Request) {
  if (!(await isAuthenticatedRequest(request))) return getUnauthorizedApiResponse();
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Invalid evaluation request.", providerCalled: false, liveExecutionAllowed: false }, { status: 400 });
  const result = parsed.data.mode === "pilot" ? evaluateProfessionalPilot(parsed.data.records) : scoreMarginalPropertySource(parsed.data.source);
  return NextResponse.json({ ok: true, result, advisoryOnly: true, providerCalled: false, liveExecutionAllowed: false });
}
