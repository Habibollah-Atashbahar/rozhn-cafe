import { cn } from "@/lib/utils";

export default function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <svg
        viewBox="0 0 48 48"
        className="h-8 w-8 shrink-0"
        aria-hidden="true"
        fill="none"
      >
        <circle cx="24" cy="24" r="3" fill="currentColor" />
        <path
          d="M40 24a16 16 0 1 1-5.2-11.8"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <circle cx="8.5" cy="24" r="1.6" fill="currentColor" />
        <circle cx="10.5" cy="15.5" r="1.6" fill="currentColor" />
        <circle cx="16.5" cy="10" r="1.6" fill="currentColor" />
      </svg>
      <span className="flex flex-col leading-tight">
        <span className="font-semibold tracking-[0.2em] text-ink-900">
          ROZHN
        </span>
        <span className="text-[10px] tracking-wide text-graphite-500">رژن</span>
      </span>
    </div>
  );
}
