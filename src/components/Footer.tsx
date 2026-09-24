import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-ink py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 text-center md:flex-row md:text-left md:px-8">
        <div className="flex items-center gap-2">
          <Image src="/logo.jpg" alt="AromaLux" width={32} height={32} className="rounded-md" />
          <span className="text-sm text-white/50">
            © {new Date().getFullYear()} AromaLux — Aroma marketing. Barcha huquqlar himoyalangan.
          </span>
        </div>
        <div className="text-sm text-white/30">Samarqand • Toshkent</div>
      </div>
    </footer>
  );
}
