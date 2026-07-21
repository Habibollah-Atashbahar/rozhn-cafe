"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import Logo from "./Logo";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cartStore";
import { toPersianDigits } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "منو و سفارش" },
  { href: "/reviews", label: "نظرات مشتریان" },
  { href: "/about", label: "درباره ما" },
  { href: "/contact", label: "تماس با ما" },
  { href: "/developers", label: "تیم توسعه" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);
  const toggleCart = useCartStore((s) => s.toggleCart);
  const totalCount = useCartStore((s) => s.totalCount());

  // بستن منوی موبایل هنگام تغییر مسیر — طبق الگوی رسمی ری‌اکت برای
  // "adjusting state when a prop changes"، مستقیم در حین رندر انجام می‌شود
  // نه داخل افکت، تا رندرهای زنجیره‌ای اضافه ایجاد نشود.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMobileOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isHome = pathname === "/";

  return (
    <header className="sticky top-0 z-40 border-b border-graphite-200/70 bg-bone-50/85 backdrop-blur supports-[backdrop-filter]:bg-bone-50/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="صفحه اصلی رژن">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium text-graphite-600 transition-colors hover:text-ink-900",
                pathname === link.href && "text-ink-900"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isHome && (
            <button
              onClick={toggleCart}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-graphite-200 text-ink-900 transition-colors hover:bg-ink-900 hover:text-bone-50"
              aria-label="سبد سفارش"
            >
              <ShoppingBag size={18} strokeWidth={1.75} />
              {totalCount > 0 && (
                <span className="absolute -top-1.5 -left-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink-900 px-1 text-[11px] font-bold text-bone-50">
                  {toPersianDigits(totalCount)}
                </span>
              )}
            </button>
          )}

          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-graphite-200 text-ink-900 md:hidden"
            aria-label={mobileOpen ? "بستن منو" : "باز کردن منو"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "grid overflow-hidden border-t border-graphite-200/70 bg-bone-50 transition-[grid-template-rows] duration-300 ease-out md:hidden",
          mobileOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <nav className="flex flex-col px-4 py-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "border-b border-graphite-100 py-3.5 text-[15px] font-medium text-graphite-700 last:border-none",
                  pathname === link.href && "text-ink-900"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
