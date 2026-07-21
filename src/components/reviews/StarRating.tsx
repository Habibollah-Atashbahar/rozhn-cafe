"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StarRating({
  value,
  onChange,
  size = 16,
}: {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
}) {
  const interactive = Boolean(onChange);

  return (
    <div className="flex items-center gap-0.5" dir="ltr">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(n)}
          className={cn(!interactive && "cursor-default")}
          aria-label={`امتیاز ${n} از ۵`}
        >
          <Star
            size={size}
            className={n <= value ? "fill-amber-400 text-amber-400" : "text-graphite-300"}
          />
        </button>
      ))}
    </div>
  );
}
