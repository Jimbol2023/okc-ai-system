import { NextResponse, type NextRequest } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { buyerCreateSchema, createBuyer } from "@/lib/buyer-intake";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const payload = await request.json();

    if (!Array.isArray(payload)) {
      return NextResponse.json(
        {
          success: false,
          errors: [{ index: null, error: "Expected an array of buyers." }],
        },
        { status: 400 },
      );
    }

    let created = 0;
    let skippedDuplicates = 0;
    const errors: Array<{ index: number; error: unknown }> = [];

    for (const [index, item] of payload.entries()) {
      const parsedBuyer = buyerCreateSchema.safeParse(item);

      if (!parsedBuyer.success) {
        errors.push({
          index,
          error: parsedBuyer.error.flatten(),
        });
        continue;
      }

      const result = await createBuyer(parsedBuyer.data);

      if (result.created) {
        created += 1;
      } else {
        skippedDuplicates += 1;
      }
    }

    return NextResponse.json({
      success: true,
      created,
      skippedDuplicates,
      errors,
    });
  } catch (error) {
    console.error("POST /api/buyers/import failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to import buyers.",
      },
      { status: 500 },
    );
  }
}
