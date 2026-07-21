"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, ListOrdered, LogOut, MessageSquareText, UtensilsCrossed } from "lucide-react";
import Logo from "@/components/layout/Logo";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "داشبورد", icon: LayoutDashboard },
  { href: "/admin/orders", label: "سفارش‌ها", icon: ListOrdered },
  { href: "/admin/menu", label: "محصولات", icon: UtensilsCrossed },
  { href: "/admin/reviews", label: "نظرات", icon: MessageSquareText },
];

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-dvh bg-bone-100">
      <header className="sticky top-0 z-30 border-b border-graphite-200 bg-bone-50">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <nav className="flex items-center gap-1 rounded-full border border-graphite-200 p-1">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium text-graphite-600 transition-colors",
                  pathname === n.href && "bg-ink-900 text-bone-50"
                )}
              >
                <n.icon size={14} />
                {n.label}
              </Link>
            ))}
          </nav>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-full border border-graphite-200 px-3.5 py-1.5 text-xs font-medium text-graphite-600 hover:border-red-300 hover:text-red-600"
          >
            <LogOut size={14} />
            خروج
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
