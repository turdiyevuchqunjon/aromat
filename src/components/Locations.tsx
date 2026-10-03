import { ADDRESSES } from "@/lib/contacts";

function googleMapsUrl(lat: number, lon: number) {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
}

// Yandex Go ilovasi o'rnatilgan bo'lsa ochiladi, aks holda ilova sahifasiga olib boradi
function yandexTaxiUrl(lat: number, lon: number) {
  return `https://3.redirect.appmetrica.yandex.com/route?end-lat=${lat}&end-lon=${lon}&ref=aromalux&appmetrica_tracking_id=1178268795219780156`;
}

export default function Locations() {
  return (
    <section id="manzillar" className="scroll-mt-20 border-t border-white/5 bg-ink py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="text-center">
          <span className="section-label">Manzillar</span>
          <h2 className="mt-3 font-display text-2xl text-white md:text-3xl">
            Bizning manzillarimiz
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {ADDRESSES.map((location, index) => (
            <div key={location.city} className="overflow-hidden rounded-2xl border border-ink-line bg-ink-soft">
              <iframe
                src={location.embedUrl}
                title={`${location.city} — xaritada joylashuv`}
                className="h-72 w-full border-0 md:h-80"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold font-display text-ink">
                    {index + 1}
                  </span>
                  <h3 className="font-display text-xl text-white">{location.city}</h3>
                </div>
                <p className="mt-3 text-sm text-white/60">{location.address}</p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={googleMapsUrl(location.lat, location.lon)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center rounded-lg border border-ink-line px-4 py-3 text-sm text-white transition hover:border-gold hover:text-gold"
                  >
                    📍 Xaritada ochish
                  </a>
                  <a
                    href={yandexTaxiUrl(location.lat, location.lon)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold flex-1 justify-center text-sm"
                  >
                    🚕 Yandex taksi chaqirish
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
