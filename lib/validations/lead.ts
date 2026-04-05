import { z } from "zod";

export const leadIntakeSchema = z.object({
  firstName: z.string().trim().min(2, "First name is required."),
  lastName: z.string().trim().min(2, "Last name is required."),
  email: z.email("Enter a valid email address."),
  phone: z
    .string()
    .trim()
    .min(10, "Phone number is required.")
    .max(25, "Phone number is too long."),
  propertyAddress: z.string().trim().min(5, "Property address is required."),
  city: z.string().trim().min(2, "City is required."),
  state: z.string().trim().length(2, "Use a two-letter state abbreviation."),
  zipCode: z
    .string()
    .trim()
    .regex(/^\d{5}$/, "Use a valid 5-digit ZIP code."),
  message: z
    .string()
    .trim()
    .max(1000, "Keep notes under 1,000 characters.")
    .optional()
    .or(z.literal("")),
  source: z.string().trim().min(2, "Lead source is required.")
});

export type LeadIntakeInput = z.infer<typeof leadIntakeSchema>;
