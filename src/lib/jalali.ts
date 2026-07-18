/**
 * تبدیل ساده و سبک تاریخ شمسی <-> میلادی، بدون وابستگی خارجی.
 * الگوریتم بر پایه محاسبات استاندارد تقویم جلالی (بدون نیاز به کتابخانه سنگین)،
 * برای فرم تاریخ تولد کافی و دقیق است.
 */
export function jalaliToGregorian(jy: number, jm: number, jd: number): Date {
  let gy: number;
  const jy1 = jy - 979;
  const jm1 = jm - 1;
  const jd1 = jd - 1;

  let jDayNo =
    365 * jy1 + Math.floor(jy1 / 33) * 8 + Math.floor(((jy1 % 33) + 3) / 4);
  for (let i = 0; i < jm1; ++i) jDayNo += i < 6 ? 31 : 30;
  jDayNo += jd1;

  let gDayNo = jDayNo + 79;

  gy = 1600 + 400 * Math.floor(gDayNo / 146097);
  gDayNo %= 146097;

  let leap = true;
  if (gDayNo >= 36525) {
    gDayNo--;
    gy += 100 * Math.floor(gDayNo / 36524);
    gDayNo %= 36524;
    if (gDayNo >= 365) gDayNo++;
    else leap = false;
  }

  gy += 4 * Math.floor(gDayNo / 1461);
  gDayNo %= 1461;

  if (gDayNo >= 366) {
    leap = false;
    gDayNo--;
    gy += Math.floor(gDayNo / 365);
    gDayNo %= 365;
  }

  const gDaysInMonth = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let gm = 0;
  while (gm < 12 && gDayNo >= gDaysInMonth[gm]!) {
    gDayNo -= gDaysInMonth[gm]!;
    gm++;
  }

  return new Date(gy, gm, gDayNo + 1);
}

export const JALALI_MONTHS = [
  "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند",
];

export function isJalaliLeapYear(jy: number): boolean {
  const remainders = [1, 5, 9, 13, 17, 22, 26, 30];
  return remainders.includes(((jy - 979) % 33 + 33) % 33);
}

export function daysInJalaliMonth(jy: number, jm: number): number {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  return isJalaliLeapYear(jy) ? 30 : 29;
}
