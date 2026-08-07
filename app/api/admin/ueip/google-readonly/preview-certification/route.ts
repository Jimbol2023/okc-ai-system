import { NextResponse } from "next/server";

import { getAuthenticatedRequestContext, getUnauthorizedApiResponse, isAdminRequest } from "@/lib/auth";
import { authorizeGoogleReadOnlyPreview, configureGoogleReadOnlyPreview, getGoogleReadOnlyPreviewReadiness, runGoogleReadOnlyPreview, setGoogleReadOnlyPreviewEnabled } from "@/lib/ueip-google-readonly-preview";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function actor(request: Request) {
  if (!(await isAdminRequest(request))) return null;
  const auth = await getAuthenticatedRequestContext(request);
  return auth ? { tenantId: auth.tenantId, actorId: auth.actorId } : null;
}

export async function GET(request: Request) {
  try {
    const authenticatedActor = await actor(request);
    if (!authenticatedActor) return getUnauthorizedApiResponse();
    return NextResponse.json(await getGoogleReadOnlyPreviewReadiness({ actor: authenticatedActor }));
  } catch {
    return NextResponse.json(failClosed(), { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authenticatedActor = await actor(request);
    if (!authenticatedActor) return getUnauthorizedApiResponse();
    const body = await request.json().catch(() => ({})) as { operation?: string; confirmation?: string; nonce?: string };
    if (body.operation === "configure") return NextResponse.json(await configureGoogleReadOnlyPreview({ actor: authenticatedActor, confirmation: body.confirmation ?? "" }));
    if (body.operation === "authorize") return NextResponse.json(await authorizeGoogleReadOnlyPreview({ actor: authenticatedActor, confirmation: body.confirmation ?? "" }));
    if (body.operation === "read") return NextResponse.json(await runGoogleReadOnlyPreview({ actor: authenticatedActor, confirmation: body.confirmation ?? "", nonce: body.nonce }));
    if (body.operation === "disable" || body.operation === "restore") return NextResponse.json(await setGoogleReadOnlyPreviewEnabled({ actor: authenticatedActor, confirmation: body.confirmation ?? "", action: body.operation }));
    return NextResponse.json({ status: "blocked", reasonCodes: ["operation_invalid"], providerCalled: false, liveExecutionAllowed: false }, { status: 400 });
  } catch {
    return NextResponse.json(failClosed(), { status: 500 });
  }
}

function failClosed() {
  return { status: "blocked", reasonCodes: ["preview_certification_unavailable"], providerCalled: false, providerWrite: false, sent: false, published: false, scraping: false, crmMutation: false, outreach: false, externalExecutionAllowed: false, liveExecutionAllowed: false };
}
