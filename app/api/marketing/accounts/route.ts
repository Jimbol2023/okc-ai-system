import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { listMarketingWorkflow, upsertMarketingAccountConnection } from "@/lib/marketing-workflow";
import { marketingAccountConnectionSchema } from "@/lib/validations/marketing-workflow";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const workflow = await listMarketingWorkflow();

    return NextResponse.json({
      ok: true,
      accounts: workflow.accounts,
    });
  } catch (error) {
    console.error("GET /api/marketing/accounts failed:", error);

    return NextResponse.json({ ok: false, error: "Unable to load marketing account connections." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const payload = await request.json();
    const parsed = marketingAccountConnectionSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json({ ok: false, errors: parsed.error.flatten() }, { status: 400 });
    }

    const account = await upsertMarketingAccountConnection(parsed.data);

    return NextResponse.json({
      ok: true,
      account,
      providerCalled: false,
      oauthStarted: false,
    });
  } catch (error) {
    console.error("POST /api/marketing/accounts failed:", error);

    return NextResponse.json({ ok: false, error: "Unable to save marketing account connection." }, { status: 500 });
  }
}
