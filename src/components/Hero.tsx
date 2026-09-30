import Image from "next/image";
import LeadForm from "./LeadForm";
import { PHONES, TELEGRAM } from "@/lib/contacts";

const PRODUCT_IMAGES = [
  { src: "/01.jpeg", alt: "Pro 200 aroma diffuzer — qisqa yo'riqnoma", width: 1024, height: 1280 },
  { src: "/02.jpeg", alt: "AromaLux biznes uchun aroma diffuzer", width: 1254, height: 1254 },
  { src: "/03.jpeg", alt: "AromaLux avtomobil uchun aroma diffuzer", width: 1254, height: 1254 },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink">
      <Image
        src="/hero-bg.jpg"
        alt=""
        fill
        priority
        className="object-cover object-center opacity-30"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/90 to-ink" />
      <div className="absolute inset-0 bg-gold-radial" />

      <div className="relative mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="section-label mb-5 inline-block">Aroma marketing agentligi</span>
          <h1 className="font-display text-4xl leading-tight text-white md:text-5xl">
            Biznesingizga xos <span className="text-gold">hidni</span> ishlab chiqamiz
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/60">
            Mehmonxona, restoran, do&apos;kon va ofislar uchun professional xona xushbo&apos;ylash
            tizimlari — mijozlar xotirasida qoladigan atmosfera yaratamiz.
          </p>

          <div className="mx-auto mt-10 grid max-w-md grid-cols-3 gap-4">
            {[
              { value: "5+ yil", label: "Tajriba" },
              { value: "1000+", label: "Mamnun mijoz" },
              { value: "25+", label: "Premium hid" },
            ].map((item) => (
              <div key={item.label}>
                <div className="font-display text-2xl text-gold">{item.value}</div>
                <div className="mt-1 text-xs text-white/50">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 items-start gap-6 md:grid-cols-3">
          {PRODUCT_IMAGES.map((image, index) => (
            <Image
              key={image.src}
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              priority={index === 0}
              sizes="(min-width: 768px) 33vw, 100vw"
              className="h-auto w-full rounded-2xl border border-ink-line shadow-2xl"
            />
          ))}
        </div>

        <div
          id="boglanish"
          className="mx-auto mt-14 max-w-xl scroll-mt-24 rounded-2xl border border-ink-line bg-ink-soft/80 p-6 shadow-2xl backdrop-blur-md md:p-8"
        >
          <h2 className="font-display text-xl text-white">Bepul konsultatsiya oling</h2>
          <p className="mt-2 text-sm text-white/50">
            Formani to&apos;ldiring — mutaxassisimiz 15 daqiqa ichida siz bilan bog&apos;lanadi.
          </p>
          <div className="mt-6">
            <LeadForm />
          </div>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/5 pt-5 text-xs text-white/40">
            {PHONES.map((phone) => (
              <a key={phone.href} href={phone.href} className="transition hover:text-gold">
                📞 {phone.label}
              </a>
            ))}
            <a href={TELEGRAM.href} target="_blank" rel="noopener noreferrer" className="transition hover:text-gold">
              ✈️ Telegram
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
