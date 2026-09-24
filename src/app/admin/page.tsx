"use client";

import { useRouter } from "next/navigation";

export default function AdminHomePage() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin-logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ink px-5 text-center">
      <h1 className="font-display text-2xl text-white">Admin panel</h1>
      <p className="mt-3 max-w-sm text-sm text-white/50">
        Yangi lidlar Telegram botga tushadi. Har bir lid xabaridagi havolani bosib, sotuvni
        tasdiqlang — u yerda Metaga Purchase eventi avtomatik yuboriladi.
      </p>
      <button onClick={handleLogout} className="btn-outline mt-8 text-sm">
        Chiqish
      </button>
    </main>
  );
}
