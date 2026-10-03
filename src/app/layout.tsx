import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";
import MetaPixel from "@/components/MetaPixel";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-display" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aromat-three.vercel.app/";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "AromaLux — Aroma marketing | Professional xona xushbo'ylash tizimlari",
  description:
    "AromaLux — mehmonxona, restoran, do'kon va ofislar uchun professional aroma marketing xizmati. Diffuzor qurilmalari, 25+ premium hidlar, bepul konsultatsiya.",
  icons: {
    icon: "/favicon.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "AromaLux — Aroma marketing",
    description:
      "Biznesingiz uchun professional xona xushbo'ylash tizimi. Mijozlar sonini va o'rtacha chekni oshiring.",
    images: ["/logo.jpg"],
    locale: "uz_UZ",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" className={`${manrope.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        <MetaPixel />
        {children}
      </body>
    </html>
  );
}
