import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { createMarketingDraft, listMarketingWorkflow } from "@/lib/marketing-workflow";
import { createMarketingDraftSchema } from "@/lib/validations/marketing-workflow";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function validationError(errors: unknown) {
  return NextResponse.json(
    {
      ok: false,
      errors,
    },
    { status: 400 },
  );
}

export async function GET(request: Request) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const workflow = await listMarketingWorkflow();

    return NextResponse.json({
      ok: true,
      ...workflow,
    });
  } catch (error) {
    console.error("GET /api/marketing/drafts failed:", error);

    return NextResponse.json({ ok: false, error: "Unable to load marketing workflow." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const payload = await request.json();
    const parsed = createMarketingDraftSchema.safeParse(payload);

    if (!parsed.success) {
      return validationError(parsed.error.flatten());
    }

    const draft = await createMarketingDraft(parsed.data);

    return NextResponse.json({
      ok: true,
      draft,
      providerCalled: false,
      published: false,
      sent: false,
    });
  } catch (error) {
    console.error("POST /api/marketing/drafts failed:", error);

    return NextResponse.json({ ok: false, error: "Unable to create marketing draft." }, { status: 500 });
  }
}
