"use client";

import { useEffect, useRef, useState } from "react";
import { useMenu } from "@/lib/hooks/useMenu";
import CategoryNav from "./CategoryNav";
import MenuSection from "./MenuSection";

export default function MenuBrowser() {
  const { categories, menuItems, isLoading, isError } = useMenu();
  const [activeId, setActiveId] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (categories.length === 0) return;

    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-140px 0px -70% 0px", threshold: 0 }
    );

    categories.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) observerRef.current!.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [categories]);

  function scrollToCategory(id: string) {
    setActiveId(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center text-sm text-graphite-500 sm:px-6 lg:px-8">
        امکان دریافت منو وجود ندارد. لطفاً از روشن بودن سرویس بک‌اند مطمئن شوید و صفحه را دوباره بارگذاری کنید.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-card bg-graphite-100" />
          ))}
        </div>
      </div>
    );
  }

  const displayActiveId = activeId ?? categories[0]?.id ?? null;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <CategoryNav categories={categories} activeId={displayActiveId} onSelect={scrollToCategory} />
      <div>
        {categories.map((category) => (
          <MenuSection
            key={category.id}
            category={category}
            items={menuItems.filter((i) => i.categoryId === category.id)}
          />
        ))}
      </div>
    </div>
  );
}
