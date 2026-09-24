import { NextRequest, NextResponse } from "next/server";
import { getLeadByToken, updateLead } from "@/lib/redis";
import { sendCapiEvent } from "@/lib/meta";
import { generateEventId, normalizeAndHash, normalizePhoneForHash } from "@/lib/hash";

export async function POST(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params;
    const body = await req.json();
    const amount = Number(body.amount);
    const currency = (body.currency as string) || process.env.NEXT_PUBLIC_CURRENCY || "UZS";

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "To'g'ri summa kiriting" }, { status: 400 });
    }

    const lead = await getLeadByToken(token);
    if (!lead) {
      return NextResponse.json({ error: "Lid topilmadi" }, { status: 404 });
    }

    const purchaseEventId = generateEventId("purchase_evt");

    // Mijozning saytga birinchi tashrifidagi fbp/fbc/ip/ua bilan Purchase yuboramiz —
    // shu orqali Meta bu xaridni to'g'ri kampaniya/reklamaga bog'laydi va ROAS hisoblanadi.
    await sendCapiEvent({
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

    lead.status = "purchased";
    lead.purchaseAmount = amount;
    lead.purchaseCurrency = currency;
    lead.purchasedAt = Date.now();
    lead.purchaseEventId = purchaseEventId;
    await updateLead(lead);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Purchase xatosi:", err);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
