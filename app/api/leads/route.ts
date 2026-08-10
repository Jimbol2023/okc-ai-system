import { NextResponse } from "next/server";

import { getAuthenticatedRequestContext, getUnauthorizedApiResponse } from "@/lib/auth";
import { createDbLead, listDbLeads, parseLeadIntakePayload } from "@/lib/leads-db";
import { leadIntakeToStoredLead } from "@/lib/lead-record";
import {
  buildPublicLeadInternalFields,
  createPublicLeadIntakeAuditMetadata
} from "@/lib/public-lead-intake";
import { attachReferralAttributionToLead } from "@/lib/referrals";
import { logRevenueAuditEvent } from "@/lib/revenue-spine";
import { getRequestIp, readBoundedJsonBody } from "@/lib/request-security";
import { consumeSecurityRateLimit } from "@/lib/security-controls";
import { securityLog } from "@/lib/security-log";
import { storedLeadArraySchema, storedLeadSchema } from "@/lib/validations/stored-lead";
import { resolvePublicIntakeTenant } from "@/lib/tenant-context";
import { classifyPublicIntakeSpam, normalizePublicIntakeSource } from "@/lib/governed-lead-intake";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function buildInitialAutomationFields(lead?: { doNotContact?: boolean | null; approvalStatus?: string | null }) {
  if (lead?.doNotContact || lead?.approvalStatus === "needs_human_review") {
    return {
      status: "new" as const,
      nextFollowUpAt: null,
      automationStatus: "idle",
      followUpCount: 0
    };
  }

  return {
    status: "new" as const,
    nextFollowUpAt: new Date(Date.now() + 5 * 60 * 1000),
    automationStatus: "scheduled",
    followUpCount: 0
  };
}

export async function GET(request: Request) {
  let authenticated = false;

  try {
    const actor = await getAuthenticatedRequestContext(request);
    authenticated = Boolean(actor);

    if (!authenticated) {
      return getUnauthorizedApiResponse();
    }

    const leads = await listDbLeads({ tenantId: actor!.tenantId });

    return NextResponse.json({
      ok: true,
      leads
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Unable to load leads right now."
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await readBoundedJsonBody(request, 32 * 1024);
    if (!body.ok) return NextResponse.json({ ok: false, error: "Invalid request." }, { status: body.status });
    const payload = body.value;

    // Public intake should be allowed without auth
    const parsedIntakeLead = parseLeadIntakePayload(payload);

    if (parsedIntakeLead.success) {
      const tenantId = resolvePublicIntakeTenant();
      const ipLimit = await consumeSecurityRateLimit({
        tenantId,
        purpose: "public_lead_ip",
        identifier: getRequestIp(request),
        limit: 5,
        windowMs: 10 * 60 * 1000,
      });
      const duplicateLimit = await consumeSecurityRateLimit({
        tenantId,
        purpose: "public_lead_duplicate",
        identifier: `${parsedIntakeLead.data.phone}:${parsedIntakeLead.data.propertyAddress}`,
        limit: 3,
        windowMs: 24 * 60 * 60 * 1000,
      });
      if (!ipLimit.allowed || !duplicateLimit.allowed) {
        securityLog("warn", "public_lead.rate_limited", { tenantId, reason: ipLimit.allowed ? "duplicate" : "velocity" });
        return NextResponse.json(
          { ok: false, error: "Too many submissions. Please try again later." },
          { status: 429, headers: { "Retry-After": String(Math.max(ipLimit.retryAfterSeconds, duplicateLimit.retryAfterSeconds)) } },
        );
      }
      const spam = classifyPublicIntakeSpam({ honeypot: parsedIntakeLead.data.website, text: JSON.stringify(parsedIntakeLead.data) });
      if (!spam.accepted) return NextResponse.json({ ok: false, error: "Submission could not be accepted." }, { status: 400 });
      const serverSource = normalizePublicIntakeSource(parsedIntakeLead.data);
      const storedLead = leadIntakeToStoredLead({ ...parsedIntakeLead.data, source: serverSource });

      const result = await createDbLead({ tenantId }, {
        ...storedLead,
        ...buildPublicLeadInternalFields()
      });
      await attachReferralAttributionToLead({
        tenantId,
        lead: result.lead,
        created: result.created,
        referral: {
          referralCode: parsedIntakeLead.data.referralCode,
          referralCampaign: parsedIntakeLead.data.referralCampaign,
          referralSource: parsedIntakeLead.data.referralSource,
          referralLandingPage: parsedIntakeLead.data.referralLandingPage
        }
      });
      await logRevenueAuditEvent({
        tenantId,
        action: result.created ? "public_intake_internal_lead_created" : "public_intake_internal_lead_deduped",
        targetType: "lead",
        targetId: result.lead.id,
        source: "public_website_intake",
        metadata: createPublicLeadIntakeAuditMetadata({
          payload: payload as Record<string, unknown>,
          intake: parsedIntakeLead.data,
          lead: result.lead,
          created: result.created,
          referer: request.headers.get("referer")
        })
      });

      return NextResponse.json({
        ok: true,
        leadId: result.lead.id,
        created: result.created
      });
    }

    // Everything else below this line is protected
    const actor = await getAuthenticatedRequestContext(request);
    if (!actor) {
      return getUnauthorizedApiResponse();
    }

    if (Array.isArray(payload)) {
      const parsedLeads = storedLeadArraySchema.safeParse(payload);

      if (!parsedLeads.success) {
        return NextResponse.json(
          {
            ok: false,
            errors: parsedLeads.error.flatten()
          },
          { status: 400 }
        );
      }

      const results = await Promise.all(
        parsedLeads.data.map((lead) =>
          createDbLead({ tenantId: actor.tenantId }, {
            ...lead,
            ...buildInitialAutomationFields(lead)
          })
        )
      );
      await Promise.all(
        results.map((result, index) =>
          attachReferralAttributionToLead({
            tenantId: actor.tenantId,
            lead: result.lead,
            created: result.created,
            referral: {
              referralCode: parsedLeads.data[index]?.referralCode,
              referralCampaign: parsedLeads.data[index]?.referralCampaign,
              referralSource: parsedLeads.data[index]?.referralSource,
              referralLandingPage: parsedLeads.data[index]?.referralLandingPage
            }
          })
        )
      );

      return NextResponse.json({
        ok: true,
        leads: results.map((result) => result.lead),
        addedLeads: results.filter((result) => result.created).map((result) => result.lead),
        addedCount: results.filter((result) => result.created).length,
        skippedCount: results.filter((result) => !result.created).length
      });
    }

    const parsedLead = storedLeadSchema.safeParse(payload);

    if (!parsedLead.success) {
      return NextResponse.json(
        {
          ok: false,
          errors: parsedLead.error.flatten()
        },
        { status: 400 }
      );
    }

    const result = await createDbLead({ tenantId: actor.tenantId }, {
      ...parsedLead.data,
      ...buildInitialAutomationFields(parsedLead.data)
    });
    await attachReferralAttributionToLead({
      tenantId: actor.tenantId,
      lead: result.lead,
      created: result.created,
      referral: {
        referralCode: parsedLead.data.referralCode,
        referralCampaign: parsedLead.data.referralCampaign,
        referralSource: parsedLead.data.referralSource,
        referralLandingPage: parsedLead.data.referralLandingPage
      }
    });

    return NextResponse.json({
      ok: true,
      lead: result.lead,
      leadId: result.lead.id,
      created: result.created
    });
  } catch (error) {
    securityLog("error", "public_lead.processing_failed", { error });

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to save leads right now."
      },
      { status: 500 }
    );
  }
}
