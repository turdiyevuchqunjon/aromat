import { createHash, randomBytes } from "crypto";

/**
 * Meta Conversions API PII normalizatsiya + SHA-256 hash qoidalari:
 * https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/customer-information-parameters
 */
export function normalizeAndHash(value: string): string {
  const normalized = value.trim().toLowerCase();
  return createHash("sha256").update(normalized).digest("hex");
}

export function normalizePhoneForHash(rawPhone: string): string {
  // Faqat raqamlar qoldiriladi, mamlakat kodi bilan (masalan 998901234567)
  const digitsOnly = rawPhone.replace(/[^\d]/g, "");
  const withCountryCode = digitsOnly.startsWith("998")
    ? digitsOnly
    : `998${digitsOnly.replace(/^0+/, "")}`;
  return normalizeAndHash(withCountryCode);
}

/** Har bir lid uchun taxminlanmaydigan, hech narsani oshkor qilmaydigan opaque token (link uchun) */
export function generateLeadToken(): string {
  return randomBytes(24).toString("base64url");
}

export function generateEventId(prefix: string): string {
  return `${prefix}_${randomBytes(12).toString("hex")}`;
}
