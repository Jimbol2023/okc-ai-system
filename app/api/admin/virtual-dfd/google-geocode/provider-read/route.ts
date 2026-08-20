import { NextResponse } from "next/server";

import { getAuthenticatedRequestContext, getUnauthorizedApiResponse, isAdminRequest } from "@/lib/auth";
import { runGoogleGeocodeProviderRead } from "@/lib/google-geocoding-live-read";
import { createPrismaGoogleGeocodingRuntimeDb } from "@/lib/google-geocoding-live-read-db";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function errorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "google_geocode_provider_read_failed";
  const status = message.includes("tenant_override_denied") ? 400 : 422;

  return NextResponse.json(
    {
      ok: false,
      error: message,
      providerCalled: false,
      providerWrite: false,
      sent: false,
      published: false,
      outreach: false,
      liveExecutionAllowed: false,
    },
    { status },
  );
}

function assertNoTenantOverride(body: unknown) {
  if (body && typeof body === "object" && "tenantId" in body) {
    throw new Error("tenant_override_denied");
  }
}

export async function POST(request: Request) {
  try {
    const auth = await getAuthenticatedRequestContext(request);
    if (!auth || !(await isAdminRequest(request))) return getUnauthorizedApiResponse();

    const body = await request.json();
    assertNoTenantOverride(body);

    const result = await runGoogleGeocodeProviderRead({
      actor: {
        tenantId: auth.tenantId,
        actorId: auth.actorId,
        requestingModule: "Virtual DFD",
      },
      request: body,
      db: createPrismaGoogleGeocodingRuntimeDb(prisma),
      fetchImpl: fetch,
    });

    return NextResponse.json(result);
  } catch (error) {
    return errorResponse(error);
  }
}
