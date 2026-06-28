import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { createMarketingCanvaAssetAssist } from "@/lib/marketing-workflow";
import { canvaAssetAssistSchema } from "@/lib/validations/marketing-workflow";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request, context: RouteContext) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const { id } = await context.params;
    const payload = await request.json().catch(() => ({}));
    const parsed = canvaAssetAssistSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json({ ok: false, errors: parsed.error.flatten() }, { status: 400 });
    }

    const result = await createMarketingCanvaAssetAssist(id, parsed.data);

    return NextResponse.json({
      ok: true,
      ...result,
    });
  } catch (error) {
    console.error("POST /api/marketing/drafts/[id]/canva-asset-assist failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unable to prepare Canva asset assist.",
      },
      { status: 400 },
    );
  }
}
