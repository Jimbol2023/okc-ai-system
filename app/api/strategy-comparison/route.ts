import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { compareStrategies } from "@/lib/strategy-comparison";

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

const strategyComparisonSchema = z.object({
  leadId: z.string().trim().optional(),
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
  availableCapital: optionalNumberSchema.refine((value) => value === null || value >= 0, "Available capital cannot be negative."),
  monthlyRent: optionalNumberSchema.refine((value) => value === null || value >= 0, "Monthly rent cannot be negative."),
  mortgageBalance: optionalNumberSchema.refine((value) => value === null || value >= 0, "Mortgage balance cannot be negative."),
  sellerMotivation: optionalTextSchema,
  notes: optionalTextSchema,
  flexibleTerms: z.coerce.boolean().optional().nullable(),
  knownBuyerDemand: z.coerce.boolean().optional().nullable(),
});

export async function POST(request: NextRequest) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const payload = await request.json();
    const parsedInput = strategyComparisonSchema.safeParse(payload);

    if (!parsedInput.success) {
      return NextResponse.json(
        {
          success: false,
          errors: parsedInput.error.flatten(),
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      strategyComparison: compareStrategies(parsedInput.data),
    });
  } catch (error) {
    console.error("POST /api/strategy-comparison failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to compare strategies.",
      },
      { status: 500 },
    );
  }
}
