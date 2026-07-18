import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export default function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone = "default",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "positive" | "negative";
}) {
  return (
    <div className="rounded-card border border-graphite-200/70 bg-white/70 p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-graphite-500">{label}</span>
        <Icon size={16} className="text-graphite-400" />
      </div>
      <p
        className={cn(
          "mt-3 text-2xl font-bold",
          tone === "positive" && "text-emerald-700",
          tone === "negative" && "text-red-600",
          tone === "default" && "text-ink-900"
        )}
      >
        {value}
      </p>
      {hint && <p className="mt-1 text-[11px] text-graphite-400">{hint}</p>}
    </div>
  );
}
