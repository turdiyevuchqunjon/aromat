import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";
import type { LeadRecord } from "./types";

/**
 * Lid ma'lumotlari (tel, _fbp/_fbc cookie, IP, User-Agent) bazasiz saqlanadi:
 * AES-256-GCM bilan shifrlanib, to'g'ridan-to'g'ri Purchase havolasi ichiga joylanadi.
 * Havolani faqat kalit egasi (server) o'qiy oladi, uni o'zgartirib bo'lmaydi.
 */

const IV_LENGTH = 12;
const TAG_LENGTH = 16;

function getKey(): Buffer {
  const secret = process.env.LEAD_LINK_SECRET || process.env.TELEGRAM_BOT_TOKEN;
  if (!secret) {
    throw new Error("LEAD_LINK_SECRET sozlanmagan. .env faylini tekshiring.");
  }
  return createHash("sha256").update(`aromalux-lead-link:${secret}`).digest();
}

// Havola qisqa bo'lishi uchun qisqa kalitlar ishlatiladi
interface PackedLead {
  i: string;
  t: number;
  n: string;
  p: string;
  b?: string;
  c?: string;
  a?: string;
  u?: string;
  s?: string;
}

export function encodeLeadToken(lead: LeadRecord): string {
  const packed: PackedLead = {
    i: lead.id,
    t: lead.createdAt,
    n: lead.name,
    p: lead.phone,
    b: lead.fbp,
    c: lead.fbc,
    a: lead.clientIp,
    u: lead.clientUserAgent,
    s: lead.eventSourceUrl,
  };

  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv("aes-256-gcm", getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(packed), "utf8"), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString("base64url");
}

/** Havola buzilgan yoki soxta bo'lsa null qaytaradi */
export function decodeLeadToken(token: string): LeadRecord | null {
  try {
    const raw = Buffer.from(token, "base64url");
    if (raw.length <= IV_LENGTH + TAG_LENGTH) return null;

    const iv = raw.subarray(0, IV_LENGTH);
    const tag = raw.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
    const data = raw.subarray(IV_LENGTH + TAG_LENGTH);

    const decipher = createDecipheriv("aes-256-gcm", getKey(), iv);
    decipher.setAuthTag(tag);
    const json = Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
    const p = JSON.parse(json) as PackedLead;

    return {
      id: p.i,
      createdAt: p.t,
      name: p.n,
      phone: p.p,
      fbp: p.b,
      fbc: p.c,
      clientIp: p.a,
      clientUserAgent: p.u,
      eventSourceUrl: p.s,
    };
  } catch {
    return null;
  }
}
