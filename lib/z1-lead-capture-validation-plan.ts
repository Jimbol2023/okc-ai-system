import { normalizeZ1LeadSource, z1RevenueOpsFlags, type Z1LeadSourceLabel } from "./z1-lead-source-taxonomy";

export type Z1LeadCaptureInput = {
  name?: string;
  phone?: string;
  email?: string;
  propertyAddress?: string;
  zip?: string;
  situationDetails?: string;
  source?: string;
  timestamp?: string;
};

export type Z1LeadCaptureValidationIssue = {
  field: keyof Z1LeadCaptureInput;
  message: string;
};

export type Z1LeadCaptureValidationResult = {
  valid: boolean;
  issues: Z1LeadCaptureValidationIssue[];
  normalized: {
    name: string;
    phone: string;
    email: string;
    propertyAddress: string;
    zip: string;
    situationDetails: string;
    source: Z1LeadSourceLabel | null;
    timestamp: string;
  };
};

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isIsoLikeTimestamp(value: string) {
  return value.trim().length > 0 && !Number.isNaN(Date.parse(value));
}

export function validateZ1LeadCapture(input: Z1LeadCaptureInput): Z1LeadCaptureValidationResult {
  const normalized = {
    name: input.name?.trim() ?? "",
    phone: onlyDigits(input.phone ?? ""),
    email: input.email?.trim().toLowerCase() ?? "",
    propertyAddress: input.propertyAddress?.trim() ?? "",
    zip: input.zip?.trim() ?? "",
    situationDetails: input.situationDetails?.trim() ?? "",
    source: normalizeZ1LeadSource(input.source),
    timestamp: input.timestamp?.trim() ?? "",
  };
  const issues: Z1LeadCaptureValidationIssue[] = [];

  if (normalized.name.length < 2) issues.push({ field: "name", message: "Name is required." });
  if (normalized.phone.length < 10 || normalized.phone.length > 15) issues.push({ field: "phone", message: "Enter a valid phone number." });
  if (!isEmail(normalized.email)) issues.push({ field: "email", message: "Enter a valid email address." });
  if (normalized.propertyAddress.length < 5) issues.push({ field: "propertyAddress", message: "Property address is required." });
  if (!/^\d{5}$/.test(normalized.zip)) issues.push({ field: "zip", message: "Use a valid 5-digit ZIP code." });
  if (normalized.situationDetails.length < 10) issues.push({ field: "situationDetails", message: "Add a short note about the seller situation." });
  if (!normalized.source) issues.push({ field: "source", message: "Lead source is required." });
  if (!isIsoLikeTimestamp(normalized.timestamp)) issues.push({ field: "timestamp", message: "Timestamp is required." });

  return {
    valid: issues.length === 0,
    issues,
    normalized,
  };
}

export function createZ1LeadCaptureValidationPlan() {
  return {
    phase: "Z1B" as const,
    flags: z1RevenueOpsFlags,
    planningOnly: true,
    validationFields: ["name", "phone", "email", "property address", "ZIP", "situation details", "source", "timestamp"],
    deterministic: true,
    userFriendlyErrors: true,
  };
}
