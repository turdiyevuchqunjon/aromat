"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { generateUuid, resolveFbc, resolveFbp, getFbclidFromUrl } from "@/lib/clientTracking";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

function formatUzPhone(digits: string) {
  const parts = [];
  if (digits.length > 0) parts.push(digits.slice(0, 2));
  if (digits.length > 2) parts.push(digits.slice(2, 5));
  if (digits.length > 5) parts.push(digits.slice(5, 7));
  if (digits.length > 7) parts.push(digits.slice(7, 9));
  return parts.join(" ");
}

export default function LeadForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phoneDigits, setPhoneDigits] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formattedPhone = formatUzPhone(phoneDigits);

  function handlePhoneChange(e: ChangeEvent<HTMLInputElement>) {
    setPhoneDigits(e.target.value.replace(/\D/g, "").slice(0, 9));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Iltimos, ismingizni kiriting");
      return;
    }
    if (phoneDigits.length !== 9) {
      setError("Iltimos, telefon raqamingizni to'liq kiriting");
      return;
    }

    const phone = `+998 ${formattedPhone}`;

    setLoading(true);

    const eventId = generateUuid();
    const fbp = resolveFbp();
    const fbc = resolveFbc();
    const fbclid = getFbclidFromUrl();
    const pageUrl = typeof window !== "undefined" ? window.location.href : undefined;

    try {
      // Pixel orqali (client-side) Lead — bir xil event_id bilan CAPI dedup ishlaydi
      if (typeof window !== "undefined" && window.fbq) {
        window.fbq("track", "Lead", {}, { eventID: eventId });
      }

      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          message: message.trim() || undefined,
          fbp,
          fbc,
          fbclid,
          eventId,
          pageUrl,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(
          data?.error ||
            "Xatolik yuz berdi, iltimos qaytadan urinib ko'ring yoki telefon orqali bog'laning."
        );
        setLoading(false);
        return;
      }

      router.push("/rahmat");
    } catch (err) {
      console.error("Lead yuborishda tarmoq xatosi:", err);
      setError("Internet aloqasini tekshirib, qaytadan urinib ko'ring.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm text-white/70">
          Ismingiz
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ismingiz"
          className="w-full rounded-lg border border-ink-line bg-ink-soft px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-gold"
          required
        />
      </div>
      <div>
        <label htmlFor="phone" className="mb-1.5 block text-sm text-white/70">
          Telefon raqam
        </label>
        <div className="flex items-center gap-3 rounded-lg border border-ink-line bg-ink-soft px-4 py-3 transition focus-within:border-gold">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            className="shrink-0 text-white/40"
            aria-hidden="true"
          >
            <path
              d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.4 0 .8-.3 1.1L6.6 10.8Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="shrink-0 border-r border-white/10 pr-3 text-white/60">+998</span>
          <input
            id="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            value={formattedPhone}
            onChange={handlePhoneChange}
            placeholder="90 123 45 67"
            className="w-full bg-transparent text-white placeholder:text-white/30 outline-none"
            required
          />
        </div>
      </div>
      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm text-white/70">
          Izoh (ixtiyoriy)
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Biznesingiz turi, xohlagan hidingiz va h.k."
          rows={3}
          className="w-full resize-none rounded-lg border border-ink-line bg-ink-soft px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-gold"
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-gold px-6 py-3.5 font-semibold text-ink transition hover:bg-gold-light disabled:opacity-60"
      >
        {loading ? "Yuborilmoqda..." : "Bepul konsultatsiya olish"}
      </button>
      <p className="text-center text-xs text-white/40">
        Yuborish orqali siz operatorimiz siz bilan bog'lanishiga rozilik bildirasiz.
      </p>
    </form>
  );
}
