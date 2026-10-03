import type { CapiEventPayload, CapiUserData, LeadRecord } from "./types";
import { normalizeAndHash, normalizePhoneForHash } from "./hash";

const GRAPH_VERSION = "v21.0";

/**
 * Meta Conversions API'ga event yuboradi.
 * Xujjat: https://developers.facebook.com/docs/marketing-api/conversions-api
 */
/** Meta qabul qilsa true qaytaradi. Hech qachon xato tashlamaydi. */
export async function sendCapiEvent(payload: CapiEventPayload): Promise<boolean> {
  const pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID || "1849543222869522";
  const accessToken = process.env.FB_CAPI_ACCESS_TOKEN;

  if (!pixelId || !accessToken) {
    console.error(
      "NEXT_PUBLIC_FB_PIXEL_ID / FB_CAPI_ACCESS_TOKEN sozlanmagan — CAPI event yuborilmadi:",
      payload.event_name
    );
    return false;
  }

  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events`;

  const body: Record<string, unknown> = {
    data: [payload],
    access_token: accessToken,
  };

  const testCode = process.env.FB_TEST_EVENT_CODE;
  if (testCode) {
    body.test_event_code = testCode;
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8000),
    });

    const json = await res.json().catch(() => null);

    if (!res.ok) {
      console.error("Meta CAPI xatosi:", res.status, JSON.stringify(json));
      return false;
    }
    console.log(`Meta CAPI: ${payload.event_name} yuborildi (event_id=${payload.event_id})`, JSON.stringify(json));
    return true;
  } catch (err) {
    console.error("Meta CAPI so'rovi bajarilmadi:", payload.event_name, err);
    return false;
  }
}

/** Next.js request headerlaridan mijozning haqiqiy IP manzilini olish (Vercel uchun) */
export function getClientIp(headers: Headers): string | undefined {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp;
  return undefined;
}

/**
 * Lid ma'lumotlaridan CAPI user_data yig'adi (Lead va Purchase uchun bir xil).
 * Ism va mamlakat qo'shilishi Event Match Quality'ni oshiradi.
 */
export function buildLeadUserData(lead: LeadRecord): CapiUserData {
  const firstName = lead.name.trim().split(/\s+/)[0];
  return {
    ph: [normalizePhoneForHash(lead.phone)],
    fn: firstName ? [normalizeAndHash(firstName)] : undefined,
    country: [normalizeAndHash("uz")],
    client_ip_address: lead.clientIp,
    client_user_agent: lead.clientUserAgent,
    fbp: lead.fbp,
    fbc: lead.fbc,
    external_id: [normalizeAndHash(lead.id)],
  };
}
