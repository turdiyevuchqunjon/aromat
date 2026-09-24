import Image from "next/image";
import Link from "next/link";

const NAV_ITEMS = [
  { href: "#mahsulot", label: "Mahsulot" },
  { href: "#boglanish", label: "Bog'lanish" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-ink/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.jpg" alt="AromaLux" width={44} height={44} className="rounded-md" />
          <span className="hidden font-display text-lg tracking-wide text-white sm:block">
            AROMA<span className="text-gold">LUX</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-white/70 transition hover:text-gold"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a href="#boglanish" className="btn-gold hidden text-sm md:inline-flex">
          Bepul konsultatsiya
        </a>
        <a
          href="#boglanish"
          className="btn-gold text-sm md:hidden"
        >
          Bog'lanish
        </a>
      </div>
    </header>
  );
}
