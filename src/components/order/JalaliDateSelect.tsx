"use client";

import { JALALI_MONTHS, daysInJalaliMonth } from "@/lib/jalali";
import { toPersianDigits } from "@/lib/utils";

type Props = {
  value: { year: number | null; month: number | null; day: number | null };
  onChange: (value: { year: number | null; month: number | null; day: number | null }) => void;
};

const CURRENT_JALALI_YEAR = 1404;
const YEARS = Array.from({ length: 90 }, (_, i) => CURRENT_JALALI_YEAR - i);

export default function JalaliDateSelect({ value, onChange }: Props) {
  const dayCount = value.year && value.month ? daysInJalaliMonth(value.year, value.month) : 31;
  const days = Array.from({ length: dayCount }, (_, i) => i + 1);

  const selectClass =
    "w-full rounded-lg border border-graphite-200 bg-white px-3 py-2.5 text-sm text-ink-900 focus:border-ink-900 focus:outline-none";

  return (
    <div className="grid grid-cols-3 gap-2">
      <select
        className={selectClass}
        value={value.day ?? ""}
        onChange={(e) => onChange({ ...value, day: e.target.value ? Number(e.target.value) : null })}
      >
        <option value="">روز</option>
        {days.map((d) => (
          <option key={d} value={d}>
            {toPersianDigits(d)}
          </option>
        ))}
      </select>

      <select
        className={selectClass}
        value={value.month ?? ""}
        onChange={(e) => onChange({ ...value, month: e.target.value ? Number(e.target.value) : null })}
      >
        <option value="">ماه</option>
        {JALALI_MONTHS.map((m, i) => (
          <option key={m} value={i + 1}>
            {m}
          </option>
        ))}
      </select>

      <select
        className={selectClass}
        value={value.year ?? ""}
        onChange={(e) => onChange({ ...value, year: e.target.value ? Number(e.target.value) : null })}
      >
        <option value="">سال</option>
        {YEARS.map((y) => (
          <option key={y} value={y}>
            {toPersianDigits(y)}
          </option>
        ))}
      </select>
    </div>
  );
}
