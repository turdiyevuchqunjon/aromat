import type { Metadata } from "next";
import { decodeLeadToken } from "@/lib/leadLink";
import PurchaseForm from "./PurchaseForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Xaridni tasdiqlash — AromaLux",
  robots: { index: false, follow: false },
};

export default async function PurchasePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const lead = decodeLeadToken(token);

  if (!lead) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ink px-5">
        <div className="card max-w-sm text-center">
          <p className="text-white">Havola noto'g'ri</p>
          <p className="mt-2 text-sm text-white/50">
            Havola to'liq nusxalanmagan yoki buzilgan bo'lishi mumkin.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ink px-5 py-16">
      <div className="mx-auto max-w-md">
        <span className="section-label">Xaridni tasdiqlash</span>
        <h1 className="mt-3 font-display text-2xl text-white">{lead.name}</h1>

        <div className="card mt-6 space-y-2 text-sm text-white/70">
          <div>📞 {lead.phone}</div>
          <div className="text-white/40">
            📅 {new Date(lead.createdAt).toLocaleString("uz-UZ", { timeZone: "Asia/Tashkent" })}
          </div>
          <div className="text-white/40">
            Reklama ma'lumoti: {lead.fbc ? "✅ reklamadan kelgan" : lead.fbp ? "✅ Pixel cookie bor" : "— yo'q"}
          </div>
        </div>

        <PurchaseForm token={token} />
      </div>
    </main>
  );
}
