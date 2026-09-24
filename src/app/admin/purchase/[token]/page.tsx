import { getLeadByToken } from "@/lib/redis";
import PurchaseForm from "./PurchaseForm";

export const dynamic = "force-dynamic";

export default async function AdminPurchasePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const lead = await getLeadByToken(token);

  if (!lead) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ink px-5">
        <div className="card max-w-sm text-center">
          <p className="text-white">Lid topilmadi</p>
          <p className="mt-2 text-sm text-white/50">
            Havola noto'g'ri yoki muddati o'tgan bo'lishi mumkin.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ink px-5 py-16">
      <div className="mx-auto max-w-md">
        <span className="section-label">Admin — lid tafsilotlari</span>
        <h1 className="mt-3 font-display text-2xl text-white">{lead.name}</h1>

        <div className="card mt-6 space-y-2 text-sm text-white/70">
          <div>📞 {lead.phone}</div>
          {lead.message && <div>💬 {lead.message}</div>}
          <div className="text-white/40">
            📅 {new Date(lead.createdAt).toLocaleString("uz-UZ")}
          </div>
          <div className="text-white/40">
            Holati:{" "}
            <span className={lead.status === "purchased" ? "text-gold" : "text-white/60"}>
              {lead.status === "purchased" ? "Sotib olingan" : "Yangi"}
            </span>
          </div>
        </div>

        {lead.status === "purchased" ? (
          <div className="card mt-6 border-gold/40 text-center">
            <p className="text-white">✅ Bu lid allaqachon sotib olingan deb belgilangan</p>
            <p className="mt-1 text-sm text-white/50">
              {lead.purchaseAmount?.toLocaleString("uz-UZ")} {lead.purchaseCurrency} —{" "}
              {lead.purchasedAt && new Date(lead.purchasedAt).toLocaleString("uz-UZ")}
            </p>
          </div>
        ) : (
          <PurchaseForm token={token} />
        )}
      </div>
    </main>
  );
}
