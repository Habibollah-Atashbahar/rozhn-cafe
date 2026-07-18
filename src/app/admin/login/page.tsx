"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import Logo from "@/components/layout/Logo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message ?? "ورود ناموفق بود");
        return;
      }
      router.push("/admin");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-ink-900 px-4">
      <div className="w-full max-w-sm rounded-3xl bg-bone-50 p-8 shadow-2xl">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <h1 className="mb-1 text-center text-lg font-bold text-ink-900">
          ورود به پنل مدیریت
        </h1>
        <p className="mb-6 text-center text-xs text-graphite-500">
          فقط برای مدیریت کافه روژن
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="relative">
            <Lock
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-graphite-400"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="رمز عبور"
              className="w-full rounded-lg border border-graphite-200 bg-white py-2.5 pr-9 pl-3 text-sm focus:border-ink-900 focus:outline-none"
              autoFocus
            />
          </div>
          {error && <p className="text-center text-xs text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-full bg-ink-900 py-2.5 text-sm font-semibold text-bone-50 disabled:opacity-60"
          >
            {loading ? "در حال بررسی..." : "ورود"}
          </button>
        </form>
      </div>
    </div>
  );
}
