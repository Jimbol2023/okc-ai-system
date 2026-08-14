import { NextResponse } from "next/server";

import { getAuthenticatedRequestContext, getUnauthorizedApiResponse, isAdminRequest } from "@/lib/auth";
import { runRuntimePreflightCertification } from "@/lib/runtime-preflight";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function noStore(response: NextResponse) {
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function GET(request: Request) {
  if (!(await isAdminRequest(request))) {
    return noStore(getUnauthorizedApiResponse());
  }

  const actor = await getAuthenticatedRequestContext(request);
  const report = await runRuntimePreflightCertification({
    requirePreview: true,
    actor: {
      tenantId: actor?.tenantId ?? "default",
      actorId: actor?.actorId ?? actor?.email ?? "admin",
    },
  });
  const status = process.env.VERCEL_ENV === "preview" ? 200 : 403;

  return noStore(NextResponse.json(report, { status }));
}
