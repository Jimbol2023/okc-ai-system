import { NextResponse } from "next/server";
import { z } from "zod";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { classifyFeatureArchitecture } from "@/lib/modular-architecture-standard";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const extensionPointSchema = z.enum([
  "capability",
  "workflow",
  "permission",
  "ui_surface",
  "connector",
  "audit_event",
  "schema",
  "analytics",
  "document",
  "notification",
]);

const architectureReviewSchema = z.object({
  featureName: z.string().trim().min(2).max(120),
  description: z.string().trim().min(10).max(2000),
  businessDomain: z.string().trim().min(2).max(80).optional(),
  reusableAcrossIndustries: z.boolean().optional(),
  requiresBusinessSpecificSchema: z.boolean().optional(),
  industrySpecificTerms: z.array(z.string().trim().min(1).max(80)).max(24).optional(),
  requestedExternalActions: z.array(z.string().trim().min(2).max(120)).max(24).optional(),
  connectorKeys: z.array(z.string().trim().min(2).max(120)).max(24).optional(),
  leadLikeRecordCreated: z.boolean().optional(),
  sourceTrackingPlanned: z.boolean().optional(),
  extensionPoints: z.array(extensionPointSchema).max(12).optional(),
});

export async function POST(request: Request) {
  if (!(await isAuthenticatedRequest(request))) {
    return getUnauthorizedApiResponse();
  }

  const payload = await request.json().catch(() => null);
  const parsed = architectureReviewSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Invalid architecture review request.",
        providerCalled: false,
        liveExecutionAllowed: false,
      },
      { status: 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    review: classifyFeatureArchitecture(parsed.data),
    providerCalled: false,
    liveExecutionAllowed: false,
  });
}
