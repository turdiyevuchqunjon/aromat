"use client";

import { Suspense, useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin";

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push(next);
      router.refresh();
    } else {
      setError("Parol noto'g'ri");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm card">
      <h1 className="font-display text-2xl text-white">Admin panel</h1>
      <p className="mt-2 text-sm text-white/50">Kirish uchun parolni kiriting</p>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Parol"
        autoFocus
        className="mt-6 w-full rounded-lg border border-ink-line bg-ink px-4 py-3 text-white outline-none focus:border-gold"
      />
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      <button type="submit" disabled={loading} className="btn-gold mt-4 w-full">
        {loading ? "Tekshirilmoqda..." : "Kirish"}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-5">
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
