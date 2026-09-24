"use client";

import { useState, FormEvent } from "react";

const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY || "UZS";

export default function PurchaseForm({ token }: { token: string }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const value = Number(amount);
    if (!value || value <= 0) {
      setError("To'g'ri summa kiriting");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, amount: value }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Xatolik yuz berdi");
      }

      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="card mt-6 border-gold/40 text-center">
        <p className="text-white">✅ Purchase eventi Metaga yuborildi</p>
        <p className="mt-1 text-sm text-white/50">
          {amount} {CURRENCY}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card mt-6 space-y-4">
      <div>
        <label htmlFor="amount" className="mb-1.5 block text-sm text-white/70">
          To'lov summasi ({CURRENCY})
        </label>
        <input
          id="amount"
          type="number"
          inputMode="numeric"
          min={1}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Masalan: 1500000"
          className="w-full rounded-lg border border-ink-line bg-ink px-4 py-3 text-white outline-none focus:border-gold"
          required
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button type="submit" disabled={loading} className="btn-gold w-full">
        {loading ? "Yuborilmoqda..." : "To'lovni tasdiqlash va Metaga yuborish"}
      </button>
      <p className="text-xs text-white/40">
        Tasdiqlaganingizdan so'ng Meta Conversions API orqali Purchase eventi yuboriladi va bu
        mijoz ROAS hisobotida to'g'ri kampaniyaga bog'lanadi.
      </p>
    </form>
  );
}
