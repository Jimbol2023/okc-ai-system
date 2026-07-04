import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { createReferralPartner, listReferralPartners, referralSafetyFlags } from "@/lib/referrals";
import { referralPartnerSchema } from "@/lib/validations/referrals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!(await isAuthenticatedRequest(request))) {
    return getUnauthorizedApiResponse();
  }

  const partners = await listReferralPartners();

  return NextResponse.json({
    ok: true,
    partners,
    ...referralSafetyFlags,
  });
}

export async function POST(request: Request) {
  if (!(await isAuthenticatedRequest(request))) {
    return getUnauthorizedApiResponse();
  }

  const payload = await request.json();
  const parsed = referralPartnerSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: parsed.error.flatten() }, { status: 400 });
  }

  const partner = await createReferralPartner(parsed.data);

  return NextResponse.json({
    ok: true,
    partner,
    ...referralSafetyFlags,
  });
}
