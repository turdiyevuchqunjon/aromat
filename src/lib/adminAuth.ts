export const ADMIN_COOKIE_NAME = "aromalux_admin_session";

/**
 * Web Crypto API (globalThis.crypto.subtle) ishlatiladi — bu Node.js runtime'da ham,
 * Edge Runtime'da ham (middleware shu yerda ishlaydi) ishlaydi.
 */
async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function expectedAdminSessionValue(): Promise<string> {
  const secret = process.env.ADMIN_SECRET || "";
  return sha256Hex(`aromalux-admin:${secret}`);
}

export function isValidAdminPassword(password: string): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  return password === secret;
}
