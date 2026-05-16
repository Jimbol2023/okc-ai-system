import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { classifyAsset } from "@/lib/asset-classification";
import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const optionalTextSchema = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? value : null));

const optionalNumberSchema = z
  .union([z.coerce.number(), z.literal(""), z.null(), z.undefined()])
  .transform((value) => {
    if (value === "" || value === null || value === undefined) {
      return null;
    }

    return value;
  })
  .refine((value) => value === null || Number.isFinite(value), "Must be a valid number.");

const assetClassificationSchema = z.object({
  propertyType: optionalTextSchema,
  zip: optionalTextSchema,
  units: optionalNumberSchema.refine((value) => value === null || value >= 0, "Units cannot be negative."),
  bedrooms: optionalNumberSchema.refine((value) => value === null || value >= 0, "Bedrooms cannot be negative."),
  bathrooms: optionalNumberSchema.refine((value) => value === null || value >= 0, "Bathrooms cannot be negative."),
  squareFeet: optionalNumberSchema.refine((value) => value === null || value >= 0, "Square feet cannot be negative."),
  lotSizeSqft: optionalNumberSchema.refine((value) => value === null || value >= 0, "Lot size cannot be negative."),
  yearBuilt: optionalNumberSchema.refine((value) => value === null || (value >= 1800 && value <= new Date().getFullYear() + 1), "Year built looks invalid."),
  occupancy: optionalTextSchema,
  condition: optionalTextSchema,
  askingPrice: optionalNumberSchema.refine((value) => value === null || value >= 0, "Asking price cannot be negative."),
  arv: optionalNumberSchema.refine((value) => value === null || value >= 0, "ARV cannot be negative."),
  estimatedRepairs: optionalNumberSchema.refine((value) => value === null || value >= 0, "Estimated repairs cannot be negative."),
  notes: optionalTextSchema,
});

export async function POST(request: NextRequest) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const payload = await request.json();
    const parsedInput = assetClassificationSchema.safeParse(payload);

    if (!parsedInput.success) {
      return NextResponse.json(
        {
          success: false,
          errors: parsedInput.error.flatten(),
        },
        { status: 400 },
      );
    }

    const classification = classifyAsset(parsedInput.data);

    return NextResponse.json({
      success: true,
      classification,
      confidence: classification.confidenceScore,
      riskFlags: classification.riskFlags,
      strategyFit: classification.strategyFit,
      assetStrategyReadiness: classification.assetStrategyReadiness,
      canProceedToStrategySelection: classification.canProceedToStrategySelection,
    });
  } catch (error) {
    console.error("POST /api/asset-classification failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to classify asset.",
      },
      { status: 500 },
    );
  }
}
