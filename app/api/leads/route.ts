import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { createDbLead, listDbLeads, parseLeadIntakePayload } from "@/lib/leads-db";
import { leadIntakeToStoredLead } from "@/lib/lead-record";
import { storedLeadArraySchema, storedLeadSchema } from "@/lib/validations/stored-lead";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function getSafeLeadRouteError(error: unknown) {
  if (typeof error !== "object" || error === null) {
    return {
      errorType: typeof error
    };
  }

  const safeError = error as {
    name?: unknown;
    code?: unknown;
    clientVersion?: unknown;
  };

  return {
    errorName: typeof safeError.name === "string" ? safeError.name : "UnknownError",
    prismaCode: typeof safeError.code === "string" ? safeError.code : null,
    prismaClientVersion: typeof safeError.clientVersion === "string" ? safeError.clientVersion : null
  };
}

function buildInitialAutomationFields() {
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
      console.warn("[leads-debug]", {
        method: "GET",
        authenticated: false,
        hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
        hasDirectUrl: Boolean(process.env.DIRECT_URL)
      });

      return getUnauthorizedApiResponse();
    }

    const leads = await listDbLeads();

    return NextResponse.json({
      ok: true,
      leads
    });
  } catch (error) {
    console.error("[leads-debug]", {
      method: "GET",
      authenticated,
      hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
      hasDirectUrl: Boolean(process.env.DIRECT_URL),
      ...getSafeLeadRouteError(error)
    });

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
            ...buildInitialAutomationFields()
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
      ...buildInitialAutomationFields()
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
