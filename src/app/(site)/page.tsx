import type { Metadata } from "next";
import MenuBrowser from "@/components/menu/MenuBrowser";

export const metadata: Metadata = {
  title: "منو و سفارش آنلاین",
  description:
    "منوی کامل کافه رژن؛ قهوه، دمنوش، ماکتل، شیک، فست‌فود و قلیان. انتخاب کنید و همین‌جا سفارش دهید.",
};

export default function HomePage() {
  return (
    <div className="pb-16">
      <div className="border-b border-graphite-200/70 bg-gradient-to-b from-bone-100 to-bone-50 py-10 text-center sm:py-14">
        <p className="text-xs font-medium tracking-[0.3em] text-graphite-400">
          ILLUMINATE YOUR DAY AT ROZHN
        </p>
        <h1 className="mt-3 text-2xl font-bold text-ink-900 sm:text-3xl">
          منوی کافه رژن
        </h1>
        <p className="mt-2 text-sm text-graphite-500">
          آیتم‌های مورد نظرتان را انتخاب و همین‌جا سفارش دهید
        </p>
      </div>
      <MenuBrowser />
    </div>
  );
}
