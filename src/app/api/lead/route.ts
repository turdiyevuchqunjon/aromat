import { NextRequest, NextResponse } from "next/server";
import { sendCapiEvent, getClientIp, buildLeadUserData } from "@/lib/meta";
import { sendTelegramMessage, buildLeadTelegramMessage } from "@/lib/telegram";
import { encodeLeadToken } from "@/lib/leadLink";
import { generateEventId } from "@/lib/hash";
import type { LeadRecord } from "@/lib/types";

const MAX_NAME_LENGTH = 100;
const MAX_MESSAGE_LENGTH = 1000;

function optionalString(value: unknown, maxLength = 500): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, maxLength) : undefined;
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Noto'g'ri so'rov" }, { status: 400 });
  }

  const name = optionalString(body.name, MAX_NAME_LENGTH);
  const phone = optionalString(body.phone, 30);
  const message = optionalString(body.message, MAX_MESSAGE_LENGTH);
  const fbp = optionalString(body.fbp);
  const fbc = optionalString(body.fbc);
  const eventId = optionalString(body.eventId, 100);
  const pageUrl = optionalString(body.pageUrl, 2000);

  if (!name) {
    return NextResponse.json({ error: "Iltimos, ismingizni kiriting" }, { status: 400 });
  }
  const phoneDigits = phone?.replace(/\D/g, "") ?? "";
  if (!/^998\d{9}$/.test(phoneDigits)) {
    return NextResponse.json({ error: "Telefon raqam noto'g'ri formatda" }, { status: 400 });
  }

  const id = generateEventId("lead");
  const leadEventId = eventId || generateEventId("lead_evt");
  const clientIp = getClientIp(req.headers);
  const clientUserAgent = req.headers.get("user-agent") || undefined;

  // Havola qisqa bo'lishi uchun URL'ning query qismi olib tashlanadi (fbclid allaqachon fbc ichida)
  let eventSourceUrl = pageUrl;
  try {
    if (pageUrl) {
      const u = new URL(pageUrl);
      eventSourceUrl = `${u.origin}${u.pathname}`;
    }
  } catch {
    eventSourceUrl = undefined;
  }

  const lead: LeadRecord = {
    id,
    createdAt: Date.now(),
    name,
    phone: phone!,
    fbp,
    fbc,
    clientIp,
    clientUserAgent,
    eventSourceUrl,
  };

  // Barcha lid ma'lumotlari shifrlanib havolaning o'ziga joylanadi — baza kerak emas
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin).replace(/\/$/, "");
  const purchaseLink = `${siteUrl}/xarid/${encodeLeadToken(lead)}`;

  const telegramSent = await sendTelegramMessage({
    text: buildLeadTelegramMessage({ name, phone: phone!, message, purchaseLink }),
  });

  // Lid Telegramga yetib bormasa, u yo'qoladi — mijozga xato ko'rsatamiz va Metaga Lead yubormaymiz
  // (aks holda mijoz qayta urinsa Metada takroriy lidlar paydo bo'ladi).
  if (!telegramSent) {
    console.error("Lid Telegramga yetib bormadi:", { name, phone });
    return NextResponse.json(
      { error: "So'rovni qabul qilib bo'lmadi. Iltimos, telefon orqali bog'laning." },
      { status: 503 }
    );
  }

  // Xato tashlamaydi — CAPI ishlamasa ham lid Telegramda saqlangan.
  await sendCapiEvent({
    event_name: "Lead",
    event_time: Math.floor(Date.now() / 1000),
    event_id: leadEventId,
    event_source_url: eventSourceUrl,
    action_source: "website",
    user_data: buildLeadUserData(lead),
    custom_data: {
      content_name: "AromaLux konsultatsiya so'rovi",
    },
  });

  return NextResponse.json({ ok: true });
}
