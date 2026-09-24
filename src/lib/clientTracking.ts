"use client";

/** Brauzerdagi _fbp va _fbc cookie qiymatlarini o'qiydi (Meta Pixel avtomatik qo'yadi) */
export function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

/**
 * Agar _fbc cookie hali yaratilmagan bo'lsa-yu, URL'da fbclid bo'lsa,
 * Meta formatiga mos holda o'zimiz hosil qilamiz: fb.1.<timestamp>.<fbclid>
 */
export function resolveFbc(): string | undefined {
  const existing = readCookie("_fbc");
  if (existing) return existing;

  if (typeof window === "undefined") return undefined;
  const params = new URLSearchParams(window.location.search);
  const fbclid = params.get("fbclid");
  if (!fbclid) return undefined;

  return `fb.1.${Date.now()}.${fbclid}`;
}

export function resolveFbp(): string | undefined {
  return readCookie("_fbp");
}

export function getFbclidFromUrl(): string | undefined {
  if (typeof window === "undefined") return undefined;
  const params = new URLSearchParams(window.location.search);
  return params.get("fbclid") ?? undefined;
}

export function generateUuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
