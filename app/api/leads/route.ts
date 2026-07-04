import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { createDbLead, listDbLeads, parseLeadIntakePayload } from "@/lib/leads-db";
import { leadIntakeToStoredLead } from "@/lib/lead-record";
import { attachReferralAttributionToLead } from "@/lib/referrals";
import { storedLeadArraySchema, storedLeadSchema } from "@/lib/validations/stored-lead";

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
    authenticated = await isAuthenticatedRequest(request);

    if (!authenticated) {
      return getUnauthorizedApiResponse();
    }

    const leads = await listDbLeads();

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
    const payload = await request.json();

    // Public intake should be allowed without auth
    const parsedIntakeLead = parseLeadIntakePayload(payload);

    if (parsedIntakeLead.success) {
      const storedLead = leadIntakeToStoredLead(parsedIntakeLead.data);

      const result = await createDbLead({
        ...storedLead,
        ...buildInitialAutomationFields()
      });
      await attachReferralAttributionToLead({
        lead: result.lead,
        created: result.created,
        referral: {
          referralCode: parsedIntakeLead.data.referralCode,
          referralCampaign: parsedIntakeLead.data.referralCampaign,
          referralSource: parsedIntakeLead.data.referralSource,
          referralLandingPage: parsedIntakeLead.data.referralLandingPage
        }
      });

      return NextResponse.json({
        ok: true,
        lead: result.lead,
        leadId: result.lead.id,
        created: result.created
      });
    }

    // Everything else below this line is protected
    if (!(await isAuthenticatedRequest(request))) {
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
          createDbLead({
            ...lead,
            ...buildInitialAutomationFields(lead)
          })
        )
      );
      await Promise.all(
        results.map((result, index) =>
          attachReferralAttributionToLead({
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

    const result = await createDbLead({
      ...parsedLead.data,
      ...buildInitialAutomationFields(parsedLead.data)
    });
    await attachReferralAttributionToLead({
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
    console.error("Lead POST error:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to save leads right now."
      },
      { status: 500 }
    );
  }
}
