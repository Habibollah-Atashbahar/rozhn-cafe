"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import type { MenuCategory } from "@/types";

export default function CategoryNav({
  categories,
  activeId,
  onSelect,
}: {
  categories: MenuCategory[];
  activeId: string | null;
  onSelect: (id: string) => void;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, startX: 0, startScroll: 0, moved: false });

  function handleMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    const el = scrollerRef.current;
    if (!el) return;
    drag.current = {
      down: true,
      startX: e.clientX,
      startScroll: el.scrollLeft,
      moved: false,
    };

    function onMove(ev: MouseEvent) {
      if (!drag.current.down || !el) return;
      const dx = ev.clientX - drag.current.startX;
      if (Math.abs(dx) > 4) drag.current.moved = true;
      el.scrollLeft = drag.current.startScroll - dx;
    }
    function onUp() {
      drag.current.down = false;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  function handleSelect(id: string) {
    if (drag.current.moved) return;
    onSelect(id);
  }

  return (
    <div className="sticky top-16 z-30 -mx-4 border-b border-graphite-200/70 bg-bone-50/90 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div
        ref={scrollerRef}
        onMouseDown={handleMouseDown}
        className="no-scrollbar flex cursor-grab gap-2 overflow-x-auto overscroll-x-contain select-none active:cursor-grabbing"
        style={{ touchAction: "pan-x" }}
      >
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => handleSelect(c.id)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              activeId === c.id
                ? "border-ink-900 bg-ink-900 text-bone-50"
                : "border-graphite-200 text-graphite-600 hover:border-graphite-400"
            )}
          >
            {c.title}
          </button>
        ))}
      </div>
    </div>
  );
}
