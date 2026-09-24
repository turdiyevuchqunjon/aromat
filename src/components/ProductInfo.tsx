const HIGHLIGHTS = [
  { value: "60–1000 m²", label: "Har qanday xona o'lchami uchun qurilma" },
  { value: "≤42 dB", label: "Deyarli sezilmaydigan sokin ishlash" },
  { value: "25+", label: "Tanlov uchun premium hidlar" },
];

export default function ProductInfo() {
  return (
    <section id="mahsulot" className="border-t border-white/5 bg-ink py-20">
      <div className="mx-auto max-w-5xl px-5 text-center md:px-8">
        <span className="section-label">Mahsulot haqida</span>
        <h2 className="mt-3 font-display text-2xl text-white md:text-3xl">
          Har qanday xona o&apos;lchami uchun diffuzor va sizga mos hid
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-white/60">
          Kichik ofisdan mehmonxona lobbisigacha — xonangiz hajmi va maqsadingizga mos qurilma
          va hidni tanlab beramiz, o&apos;rnatib beramiz va texnik xizmat ko&apos;rsatamiz.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {HIGHLIGHTS.map((item) => (
            <div key={item.label} className="card">
              <div className="font-display text-2xl text-gold">{item.value}</div>
              <div className="mt-2 text-sm text-white/50">{item.label}</div>
            </div>
          ))}
        </div>

        <a href="#boglanish" className="btn-gold mt-10 inline-flex">
          Bepul konsultatsiya olish
        </a>
      </div>
    </section>
  );
}
