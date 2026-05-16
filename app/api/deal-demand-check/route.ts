import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { evaluateDealDemand } from "@/lib/deal-demand-gate";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const dealDemandSchema = z.object({
  zip: z.string().trim().min(5, "ZIP is required.").max(10),
  price: z.coerce.number().positive("Price must be greater than 0."),
  propertyType: z.string().trim().min(1, "Property type is required."),
});

export async function POST(request: NextRequest) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const payload = await request.json();
    const parsedDeal = dealDemandSchema.safeParse(payload);

    if (!parsedDeal.success) {
      return NextResponse.json(
        {
          success: false,
          errors: parsedDeal.error.flatten(),
        },
        { status: 400 },
      );
    }

    const evaluation = await evaluateDealDemand(parsedDeal.data);

    return NextResponse.json({
      success: true,
      evaluation,
    });
  } catch (error) {
    console.error("POST /api/deal-demand-check failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to evaluate deal demand.",
      },
      { status: 500 },
    );
  }
}
