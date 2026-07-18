import type { Metadata } from "next";
import { Clock, Coffee, Leaf, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "درباره ما",
  description: "درباره کافه رژن؛ فلسفه، دان‌های قهوه انتخابی و فضای رژن.",
};

const values = [
  {
    icon: Coffee,
    title: "دان‌های منتخب",
    desc: "میکس اختصاصی ۱۰۰٪ عربیکا و ترکیب ۸۰/۲۰ ربوستا، برای طعمی متعادل و بی‌نظیر در هر فنجان.",
  },
  {
    icon: Leaf,
    title: "مواد اولیه تازه",
    desc: "میوه‌های فصلی، شربت‌های خانگی و مواد اولیه‌ی باکیفیت، پایه‌ی همه‌ی نوشیدنی‌های روژن است.",
  },
  {
    icon: Clock,
    title: "همیشه در دسترس",
    desc: "از صبح زود تا پاسی از شب، روژن فضایی برای کار، گفتگو و لحظات آرام شماست.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <p className="text-xs font-medium tracking-[0.3em] text-graphite-400">
        ABOUT ROZHN
      </p>
      <h1 className="mt-3 text-2xl font-bold text-ink-900 sm:text-3xl">
        درباره کافه رژن
      </h1>
      <p className="mt-5 text-sm leading-8 text-graphite-600 sm:text-[15px]">
        توضیحات درمورد رژن مثلا رضا خانزهی رژن را دوست دارد
      </p>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {values.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="rounded-card border border-graphite-200/70 bg-white/60 p-5"
          >
            <Icon size={20} className="text-ink-900" strokeWidth={1.6} />
            <h3 className="mt-3 text-sm font-semibold text-ink-900">{title}</h3>
            <p className="mt-1.5 text-xs leading-6 text-graphite-500">{desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex items-start gap-3 rounded-card border border-graphite-200/70 bg-bone-100 p-5 text-sm text-graphite-600">
        <MapPin size={18} className="mt-0.5 shrink-0 text-ink-900" />
        <p>
          برای سفارش حضوری، کافیست کد QR روی میز خود را اسکن کنید تا منوی کامل
          رژن باز شود و بدون نیاز به صف یا انتظار، سفارش خود را ثبت کنید.
        </p>
      </div>
    </div>
  );
}
