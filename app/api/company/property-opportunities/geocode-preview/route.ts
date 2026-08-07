import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { getAuthenticatedRequestContext, getUnauthorizedApiResponse } from "@/lib/auth";
import {
  assertPreviewOnlyGeocodeCertificationSafety,
  previewOnlyGeocodeRequestSchema,
  runPreviewOnlyGeocodeCertification,
} from "@/lib/property-geocode-preview-certification";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const context = await getAuthenticatedRequestContext(request);
    if (!context) return getUnauthorizedApiResponse();

    const payload = await request.json();
    const parsed = previewOnlyGeocodeRequestSchema.parse(payload);
    const result = await runPreviewOnlyGeocodeCertification({ request: parsed });
    assertPreviewOnlyGeocodeCertificationSafety(result);

    return NextResponse.json(
      {
        ok: result.ok,
        result,
        persisted: false,
        tenantId: context.tenantId,
        actorId: context.actorId,
        providerWrite: false,
        sent: false,
        published: false,
        scraping: false,
        skipTracing: false,
        directMail: false,
        outreach: false,
        crmMutated: false,
        externalExecutionAllowed: false,
        liveExecutionAllowed: false,
      },
      { status: result.ok ? 200 : 403, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid Preview-only geocode certification payload.",
          issues: error.flatten(),
          providerCalled: false,
          providerWrite: false,
          sent: false,
          published: false,
          scraping: false,
          skipTracing: false,
          directMail: false,
          outreach: false,
          crmMutated: false,
          externalExecutionAllowed: false,
          liveExecutionAllowed: false,
        },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    console.error("POST /api/company/property-opportunities/geocode-preview failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to run Preview-only geocode certification.",
        providerCalled: false,
        providerWrite: false,
        sent: false,
        published: false,
        scraping: false,
        skipTracing: false,
        directMail: false,
        outreach: false,
        crmMutated: false,
        externalExecutionAllowed: false,
        liveExecutionAllowed: false,
      },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
