import { NextRequest, NextResponse } from "next/server";
import { saveLead } from "@/lib/redis";
import { sendCapiEvent, getClientIp } from "@/lib/meta";
import { sendTelegramMessage, buildLeadTelegramMessage } from "@/lib/telegram";
import { generateLeadToken, generateEventId, normalizeAndHash, normalizePhoneForHash } from "@/lib/hash";
import type { LeadRecord } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, message, fbp, fbc, fbclid, eventId, pageUrl } = body as {
      name?: string;
      phone?: string;
      message?: string;
      fbp?: string;
      fbc?: string;
      fbclid?: string;
      eventId?: string;
      pageUrl?: string;
    };

    if (!name || !phone) {
      return NextResponse.json({ error: "Ism va telefon raqami kerak" }, { status: 400 });
    }

    const id = generateEventId("lead");
    const token = generateLeadToken();
    const leadEventId = eventId || generateEventId("lead_evt");
    const clientIp = getClientIp(req.headers);
    const clientUserAgent = req.headers.get("user-agent") || undefined;

    const lead: LeadRecord = {
      id,
      token,
      createdAt: Date.now(),
      name,
      phone,
      message,
      fbp,
      fbc,
      fbclid,
      clientIp,
      clientUserAgent,
      eventSourceUrl: pageUrl,
      leadEventId,
      status: "new",
    };

    await saveLead(lead);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
    const purchaseLink = `${siteUrl}/admin/purchase/${token}`;

    // Telegramga yuborish (kutmasdan davom etadi, lekin xatoni logga yozadi)
    await sendTelegramMessage({
      text: buildLeadTelegramMessage({ name, phone, message, purchaseLink }),
    });

    // Meta CAPI — Lead eventi (Pixel'dagi bilan bir xil event_id, dedup uchun)
    await sendCapiEvent({
      event_name: "Lead",
      event_time: Math.floor(Date.now() / 1000),
      event_id: leadEventId,
      event_source_url: pageUrl,
      action_source: "website",
      user_data: {
        ph: [normalizePhoneForHash(phone)],
        client_ip_address: clientIp,
        client_user_agent: clientUserAgent,
        fbp,
        fbc,
        external_id: [normalizeAndHash(id)],
      },
      custom_data: {
        content_name: "AromaLux konsultatsiya so'rovi",
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Lead saqlashda xato:", err);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
