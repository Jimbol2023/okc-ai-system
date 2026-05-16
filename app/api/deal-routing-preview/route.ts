import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { routeDealToBestBuyers } from "@/lib/smart-deal-routing";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const dealRoutingSchema = z.object({
  zip: z.string().trim().min(5, "ZIP is required.").max(10),
  price: z.coerce.number().positive("Price must be greater than 0."),
  propertyType: z.string().trim().min(1, "Property type is required."),
  financingType: z.string().trim().optional(),
});

export async function POST(request: NextRequest) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const payload = await request.json();
    const parsedDeal = dealRoutingSchema.safeParse(payload);

    if (!parsedDeal.success) {
      return NextResponse.json(
        {
          success: false,
          errors: parsedDeal.error.flatten(),
        },
        { status: 400 },
      );
    }

    const routingPreview = await routeDealToBestBuyers(parsedDeal.data);

    return NextResponse.json({
      success: true,
      routingPreview,
    });
  } catch (error) {
    console.error("POST /api/deal-routing-preview failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to preview deal routing.",
      },
      { status: 500 },
    );
  }
}
