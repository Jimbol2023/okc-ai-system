import { NextResponse } from "next/server";
import { z } from "zod";

import { createCreativeStudioPlatformReport, reviewCreativeStudioRequest } from "@/lib/ai-creative-growth-studio";
import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const creativeReviewSchema = z.object({
  requestType: z.enum([
    "brand_system",
    "website_experience",
    "content_factory",
    "ecommerce_growth",
    "viral_content_intelligence",
    "video_production",
    "design_automation",
    "sales_enablement",
    "growth_intelligence",
  ]),
  businessModule: z.string().trim().min(2).max(80).optional(),
  brandKey: z.string().trim().min(2).max(80).optional(),
  targetChannel: z.string().trim().min(2).max(80).optional(),
  desiredAssetType: z.string().trim().min(2).max(120).optional(),
  sourceLabels: z.array(z.string().trim().min(2).max(120)).min(1).max(20),
  connectorKeys: z.array(z.string().trim().min(2).max(120)).max(20).optional(),
  externalActionIntent: z.string().trim().min(2).max(120).optional(),
  complianceSensitivity: z.enum(["standard", "regulated", "high_reputation_risk"]).optional(),
});

export async function GET(request: Request) {
  if (!(await isAuthenticatedRequest(request))) {
    return getUnauthorizedApiResponse();
  }

  return NextResponse.json({
    ok: true,
    report: createCreativeStudioPlatformReport(),
    providerCalled: false,
    liveExecutionAllowed: false,
  });
}

export async function POST(request: Request) {
  if (!(await isAuthenticatedRequest(request))) {
    return getUnauthorizedApiResponse();
  }

  const payload = await request.json().catch(() => null);
  const parsed = creativeReviewSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Invalid creative studio review request.",
        providerCalled: false,
        liveExecutionAllowed: false,
      },
      { status: 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    review: reviewCreativeStudioRequest(parsed.data),
    providerCalled: false,
    liveExecutionAllowed: false,
  });
}
