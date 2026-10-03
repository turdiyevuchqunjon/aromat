"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const IMAGES = [
  { src: "/01.jpg", alt: "Smart 100 aroma diffuzer" },
  { src: "/02.jpg", alt: "AromaLux qora aroma diffuzer" },
  { src: "/03.jpg", alt: "Pro 200 aroma diffuzer — qisqa yo'riqnoma" },
  { src: "/04.jpg", alt: "AromaLux biznes uchun aroma diffuzer" },
  { src: "/05.jpg", alt: "AromaLux avtomobil uchun aroma diffuzer" },
  { src: "/06.jpg", alt: "AromaLux diffuzerlar uchun aroma moy" },
  { src: "/07.jpg", alt: "AromaLux kumushrang aroma diffuzer" },
];

const AUTOPLAY_MS = 4000;
const SWIPE_THRESHOLD_PX = 40;

export default function ProductCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const goTo = useCallback((index: number) => {
    setActive((index + IMAGES.length) % IMAGES.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => setActive((i) => (i + 1) % IMAGES.length), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [paused, active]);

  useEffect(() => {
    const thumb = thumbRefs.current[active];
    const strip = thumb?.parentElement;
    if (!thumb || !strip) return;
    strip.scrollTo({
      left: thumb.offsetLeft - strip.clientWidth / 2 + thumb.clientWidth / 2,
      behavior: "smooth",
    });
  }, [active]);

  return (
    <div
      className="mx-auto w-full max-w-xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-ink-line bg-ink-soft shadow-2xl"
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const delta = e.changedTouches[0].clientX - touchStartX.current;
          touchStartX.current = null;
          if (Math.abs(delta) > SWIPE_THRESHOLD_PX) goTo(active + (delta < 0 ? 1 : -1));
        }}
      >
        {IMAGES.map((image, index) => (
          <Image
            key={image.src}
            src={image.src}
            alt={image.alt}
            fill
            priority={index === 0}
            sizes="(min-width: 640px) 576px, 100vw"
            className={`object-contain transition-opacity duration-700 ${
              index === active ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        <button
          type="button"
          aria-label="Oldingi rasm"
          onClick={() => goTo(active - 1)}
          className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-ink/70 text-xl text-white backdrop-blur transition hover:bg-gold hover:text-ink"
        >
          ‹
        </button>
        <button
          type="button"
          aria-label="Keyingi rasm"
          onClick={() => goTo(active + 1)}
          className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-ink/70 text-xl text-white backdrop-blur transition hover:bg-gold hover:text-ink"
        >
          ›
        </button>
      </div>

      <div className="relative mt-4 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none]">
        {IMAGES.map((image, index) => (
          <button
            key={image.src}
            ref={(el) => {
              thumbRefs.current[index] = el;
            }}
            type="button"
            aria-label={`${index + 1}-rasm`}
            aria-current={index === active}
            onClick={() => goTo(index)}
            className={`relative aspect-square w-20 shrink-0 overflow-hidden rounded-xl border-2 transition md:w-24 ${
              index === active ? "border-gold" : "border-transparent opacity-50 hover:opacity-100"
            }`}
          >
            <Image src={image.src} alt="" fill sizes="96px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
