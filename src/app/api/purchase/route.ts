import { NextRequest, NextResponse } from "next/server";
import { sendCapiEvent } from "@/lib/meta";
import { decodeLeadToken } from "@/lib/leadLink";
import { normalizeAndHash, normalizePhoneForHash } from "@/lib/hash";

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Noto'g'ri so'rov" }, { status: 400 });
  }

  const amount = Number(body.amount);
  const currency = process.env.NEXT_PUBLIC_CURRENCY || "UZS";

  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ error: "To'g'ri summa kiriting" }, { status: 400 });
  }

  const lead = typeof body.token === "string" ? decodeLeadToken(body.token) : null;
  if (!lead) {
    return NextResponse.json({ error: "Havola noto'g'ri yoki buzilgan" }, { status: 404 });
  }

  // Bir lid uchun event_id doim bir xil — tugma ikki marta bosilsa ham Meta takrorni hisoblamaydi.
  const purchaseEventId = `purchase_${lead.id}`;

  // Mijozning saytga tashrifidagi fbp/fbc/ip/ua bilan Purchase yuboramiz —
  // shu orqali Meta bu xaridni to'g'ri kampaniya/reklamaga bog'laydi va ROAS hisoblanadi.
  const sent = await sendCapiEvent({
    event_name: "Purchase",
    event_time: Math.floor(Date.now() / 1000),
    event_id: purchaseEventId,
    event_source_url: lead.eventSourceUrl,
    action_source: "website",
    user_data: {
      ph: [normalizePhoneForHash(lead.phone)],
      client_ip_address: lead.clientIp,
      client_user_agent: lead.clientUserAgent,
      fbp: lead.fbp,
      fbc: lead.fbc,
      external_id: [normalizeAndHash(lead.id)],
    },
    custom_data: {
      currency,
      value: amount,
      content_name: "AromaLux xaridi",
    },
  });

  if (!sent) {
    return NextResponse.json(
      { error: "Metaga yuborilmadi. Pixel ID va CAPI tokenni tekshiring." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
