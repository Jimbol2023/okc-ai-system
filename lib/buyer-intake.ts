import { z } from "zod";

import { refreshBuyerQuality } from "@/lib/buyer-quality";
import { prisma } from "@/lib/prisma";

const jsonPreferenceSchema = z
  .unknown()
  .optional()
  .refine(
    (value) =>
      value === undefined ||
      value === null ||
      Array.isArray(value) ||
      (typeof value === "object" && value !== null),
    "Must be an array or JSON object.",
  );

const optionalStringSchema = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().trim().optional(),
);

const optionalNumberSchema = z.preprocess(
  (value) => (value === "" || value === null ? undefined : value),
  z.coerce.number().int().nonnegative().optional(),
);

export const buyerCreateSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required."),
    phone: optionalStringSchema,
    email: optionalStringSchema.pipe(z.string().email().optional()),
    preferredLocations: jsonPreferenceSchema,
    priceRangeMin: optionalNumberSchema,
    priceRangeMax: optionalNumberSchema,
    propertyTypes: jsonPreferenceSchema,
    financingType: optionalStringSchema,
    preferredDealSize: optionalNumberSchema,
    preferredCondition: optionalStringSchema,
    source: optionalStringSchema,
    tags: jsonPreferenceSchema,
  })
  .superRefine((buyer, context) => {
    if (!buyer.phone && !buyer.email) {
      context.addIssue({
        code: "custom",
        message: "At least one contact method is required.",
        path: ["phone"],
      });
    }

    if (
      buyer.priceRangeMin !== undefined &&
      buyer.priceRangeMax !== undefined &&
      buyer.priceRangeMin >= buyer.priceRangeMax
    ) {
      context.addIssue({
        code: "custom",
        message: "Minimum price must be less than maximum price.",
        path: ["priceRangeMin"],
      });
    }
  });

export type BuyerCreateInput = z.infer<typeof buyerCreateSchema>;

export async function findDuplicateBuyer(input: Pick<BuyerCreateInput, "email" | "phone">) {
  const duplicateChecks = [
    input.email ? { email: input.email } : null,
    input.phone ? { phone: input.phone } : null,
  ].filter(Boolean) as Array<{ email: string } | { phone: string }>;

  if (duplicateChecks.length === 0) {
    return null;
  }

  return prisma.buyer.findFirst({
    where: {
      OR: duplicateChecks,
    },
    select: {
      id: true,
      email: true,
      phone: true,
    },
  });
}

export async function createBuyer(input: BuyerCreateInput) {
  const duplicateBuyer = await findDuplicateBuyer(input);

  if (duplicateBuyer) {
    return {
      created: false as const,
      duplicateBuyer,
      buyer: null,
    };
  }

  const createdBuyer = await prisma.buyer.create({
    data: {
      name: input.name,
      phone: input.phone,
      email: input.email,
      preferredLocations: input.preferredLocations ?? undefined,
      priceRangeMin: input.priceRangeMin,
      priceRangeMax: input.priceRangeMax,
      propertyTypes: input.propertyTypes ?? undefined,
      financingType: input.financingType,
      preferredDealSize: input.preferredDealSize,
      preferredCondition: input.preferredCondition,
      source: input.source,
      tags: input.tags ?? undefined,
    },
  });
  const quality = await refreshBuyerQuality(createdBuyer.id);
  const buyer = await prisma.buyer.findUniqueOrThrow({
    where: { id: createdBuyer.id },
  });

  return {
    created: true as const,
    duplicateBuyer: null,
    buyer,
    quality,
  };
}
