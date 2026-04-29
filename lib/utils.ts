import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


/**
 * Normalize phone numbers to last 10 digits.
 * This ensures:
 * +12148308467 (Twilio)
 * matches
 * 2148308467 (Database)
 */
export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "").slice(-10);
}