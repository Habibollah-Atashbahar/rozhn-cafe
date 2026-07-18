import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const persianDigits = [
  "۰",
  "۱",
  "۲",
  "۳",
  "۴",
  "۵",
  "۶",
  "۷",
  "۸",
  "۹",
] as const;

/** تبدیل اعداد لاتین به فارسی برای نمایش صحیح در UI */
export function toPersianDigits(value: string | number): string {
  return String(value).replace(/[0-9]/g, (d) => persianDigits[Number(d)] ?? d);
}

/** فرمت قیمت به تومان با جداکننده هزارگان و ارقام فارسی */
export function formatToman(amount: number): string {
  const formatted = new Intl.NumberFormat("en-US").format(Math.round(amount));
  return `${toPersianDigits(formatted)} تومان`;
}
