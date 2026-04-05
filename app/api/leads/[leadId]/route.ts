import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { deleteDbLead, getDbLeadById, updateDbLead } from "@/lib/leads-db";
import { storedLeadSchema } from "@/lib/validations/stored-lead";

type RouteContext = {
  params: Promise<{
    leadId: string;
  }>;
};

export const runtime = "nodejs";

export async function GET(_request: Request, context: RouteContext) {
  try {
    if (!(await isAuthenticatedRequest(_request))) {
      return getUnauthorizedApiResponse();
    }

    const { leadId } = await context.params;
    const lead = await getDbLeadById(leadId);

    if (!lead) {
      return NextResponse.json(
        {
          ok: false,
          error: "Lead not found."
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        lead
      }
    );
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Unable to load the lead right now."
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const { leadId } = await context.params;
    const payload = await request.json();
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

    if (parsedLead.data.id !== leadId) {
      return NextResponse.json(
        {
          ok: false,
          error: "Lead ID mismatch."
        },
        { status: 400 }
      );
    }

    const updatedLead = await updateDbLead(parsedLead.data);

    return NextResponse.json({
      ok: true,
      lead: updatedLead
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Unable to update the lead right now."
      },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    if (!(await isAuthenticatedRequest(_request))) {
      return getUnauthorizedApiResponse();
    }

    const { leadId } = await context.params;
    const leads = await deleteDbLead(leadId);

    return NextResponse.json({
      ok: true,
      leads
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Unable to delete the lead right now."
      },
      { status: 500 }
    );
  }
}
