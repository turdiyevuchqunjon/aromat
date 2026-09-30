"use client";

import { useEffect, useState } from "react";

const TELEGRAM_USERNAME = process.env.NEXT_PUBLIC_TELEGRAM_REDIRECT_USERNAME || "aromaluxdiffuzer";
const REDIRECT_SECONDS = 10;

export default function RahmatRedirect() {
  const [seconds, setSeconds] = useState(REDIRECT_SECONDS);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);

    const timeout = setTimeout(() => {
      window.location.href = `https://t.me/${TELEGRAM_USERNAME}`;
    }, REDIRECT_SECONDS * 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="mt-10 flex flex-col items-center gap-3">
      <p className="text-sm text-white/40">
        {seconds} soniyadan so'ng Telegram'ga yo'naltirilasiz...
      </p>
      <a
        href={`https://t.me/${TELEGRAM_USERNAME}`}
        className="btn-gold text-sm"
      >
        Hozir Telegram'ga o'tish
      </a>
    </div>
  );
}
