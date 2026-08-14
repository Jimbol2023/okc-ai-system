import { NextResponse } from "next/server";

import { consumeInMemoryPublicRateLimit, getRequestIp, readBoundedJsonBody } from "@/lib/public-request-guards";
import { trackReferralEvent } from "@/lib/referrals";
import { securityLog } from "@/lib/security-log";
import { referralTrackSchema } from "@/lib/validations/referrals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_REFERRAL_TRACK_BODY_BYTES = 8 * 1024;

function minimalError(status: number, reason: string, tenantId: string) {
  securityLog(status >= 500 ? "error" : "warn", "referral_track.rejected", { tenantId, reason });

  return NextResponse.json(
    {
      ok: false,
      error: "Invalid referral tracking request.",
      providerCalled: false,
      outreachSent: false,
      published: false,
      liveExecutionAllowed: false,
    },
    { status },
  );
}

export async function POST(request: Request) {
  const tenantId = process.env.PUBLIC_TENANT_ID?.trim() || "default";
  const body = await readBoundedJsonBody(request, MAX_REFERRAL_TRACK_BODY_BYTES);

  if (!body.ok) {
    return minimalError(body.status, body.reason, tenantId);
  }

  const ipLimit = consumeInMemoryPublicRateLimit({
    tenantId,
    purpose: "referral_track_ip",
    identifier: getRequestIp(request),
    limit: 60,
    windowMs: 10 * 60 * 1000,
  });

  if (!ipLimit.allowed) {
    securityLog("warn", "referral_track.rate_limited", { tenantId, reason: "velocity" });
    return NextResponse.json(
      {
        ok: false,
        error: "Too many requests.",
        providerCalled: false,
        outreachSent: false,
        published: false,
        liveExecutionAllowed: false,
      },
      { status: 429, headers: { "Retry-After": String(ipLimit.retryAfterSeconds) } },
    );
  }

  const parsed = referralTrackSchema.safeParse(body.value);

  if (!parsed.success) {
    return minimalError(400, "schema_invalid", tenantId);
  }

  const result = await trackReferralEvent({
    ...parsed.data,
    eventType: "click",
  });

  return NextResponse.json({
    ok: result.ok,
    status: result.status,
    referralLinkFound: result.referralLinkFound,
    providerCalled: result.providerCalled,
    outreachSent: result.outreachSent,
    published: result.published,
    liveExecutionAllowed: result.liveExecutionAllowed,
  });
}
