import Image from "next/image";
import LeadForm from "./LeadForm";

export default function Hero() {
  return (
    <section id="boglanish" className="relative overflow-hidden bg-ink">
      <Image
        src="/hero-bg.jpg"
        alt=""
        fill
        priority
        className="object-cover object-center opacity-30"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/90 to-ink" />
      <div className="absolute inset-0 bg-gold-radial" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 px-5 py-20 md:grid-cols-2 md:items-center md:px-8 md:py-28">
        <div>
          <span className="section-label mb-5 inline-block">Aroma marketing agentligi</span>
          <h1 className="font-display text-4xl leading-tight text-white md:text-5xl">
            Biznesingizga xos <span className="text-gold">hidni</span> ishlab chiqamiz
          </h1>
          <p className="mt-6 max-w-lg text-lg text-white/60">
            Mehmonxona, restoran, do&apos;kon va ofislar uchun professional xona xushbo&apos;ylash
            tizimlari — mijozlar xotirasida qoladigan atmosfera yaratamiz.
          </p>

          <div className="mt-10 grid max-w-md grid-cols-3 gap-4">
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

        <div className="rounded-2xl border border-ink-line bg-ink-soft/80 p-6 shadow-2xl backdrop-blur-md md:p-8">
          <h2 className="font-display text-xl text-white">Bepul konsultatsiya oling</h2>
          <p className="mt-2 text-sm text-white/50">
            Formani to&apos;ldiring — mutaxassisimiz 15 daqiqa ichida siz bilan bog&apos;lanadi.
          </p>
          <div className="mt-6">
            <LeadForm />
          </div>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/5 pt-5 text-xs text-white/40">
            <span>📞 +998 90 000 00 00</span>
            <span>✈️ Telegram: @aromalux_admin</span>
          </div>
        </div>
      </div>
    </section>
  );
}
