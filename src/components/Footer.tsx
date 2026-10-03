import Image from "next/image";
import { ADDRESSES, INSTAGRAM, PHONES, TELEGRAM } from "@/lib/contacts";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-ink py-12">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid grid-cols-1 gap-8 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="section-label">Telefonlar</div>
            <ul className="mt-3 space-y-2">
              {PHONES.map((phone) => (
                <li key={phone.href}>
                  <a href={phone.href} className="text-white/70 transition hover:text-gold">
                    {phone.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="section-label">Telegram</div>
            <a
              href={TELEGRAM.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-white/70 transition hover:text-gold"
            >
              {TELEGRAM.label}
            </a>
          </div>
          <div>
            <div className="section-label">Instagram</div>
            <a
              href={INSTAGRAM.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-white/70 transition hover:text-gold"
            >
              {INSTAGRAM.label}
            </a>
          </div>
          <div>
            <div className="section-label">Manzillar</div>
            <ul className="mt-3 space-y-2 text-white/70">
              {ADDRESSES.map((location) => (
                <li key={location.city}>
                  <a href="#manzillar" className="transition hover:text-gold">
                    {location.address}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 border-t border-white/5 pt-6 text-center md:flex-row md:text-left">
          <Image src="/logo-text.webp" alt="AromaLux" width={1400} height={188} className="h-6 w-auto" />
          <span className="text-sm text-white/50">
            © {new Date().getFullYear()} AromaLux — Aroma marketing. Barcha huquqlar himoyalangan.
          </span>
        </div>
      </div>
    </footer>
  );
}
