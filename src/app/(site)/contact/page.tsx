import type { Metadata } from "next";
import { AtSign, MapPin, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "تماس با ما",
  description: "راه‌های ارتباطی، آدرس و ساعت کاری کافه رژن.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <p className="text-xs font-medium tracking-[0.3em] text-graphite-400">
        CONTACT ROZHN
      </p>
      <h1 className="mt-3 text-2xl font-bold text-ink-900 sm:text-3xl">
        تماس با ما
      </h1>
      <p className="mt-4 text-sm leading-7 text-graphite-600">
        خوشحال می‌شویم نظرات، پیشنهادها و انتقادهای شما را بشنویم. از راه‌های
        زیر با رژن در ارتباط باشید.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex items-start gap-3 rounded-card border border-graphite-200/70 bg-white/60 p-5">
          <Phone size={18} className="mt-0.5 text-ink-900" />
          <div>
            <h3 className="text-sm font-semibold text-ink-900">تماس تلفنی</h3>
            <a
              href="tel:+989909630096"
              dir="ltr"
              className="mt-1 text-left text-sm text-graphite-500"
            >
              0990 963 0096
            </a>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-card border border-graphite-200/70 bg-white/60 p-5">
          <AtSign size={18} className="mt-0.5 text-ink-900" />
          <div>
            <h3 className="text-sm font-semibold text-ink-900">اینستاگرام</h3>
            <a
              href="https://instagram.com/rozhn.cafe"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 text-sm text-graphite-500"
            >
              rozhn.cafe@
            </a>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-card border border-graphite-200/70 bg-white/60 p-5 sm:col-span-2">
          <MapPin size={18} className="mt-0.5 shrink-0 text-ink-900" />
          <div>
            <h3 className="text-sm font-semibold text-ink-900">آدرس</h3>
            <a
              href="https://www.google.com/maps?q=26.22642601075952,60.2202155606977"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 text-sm leading-6 text-graphite-500"
            >
              نیک‌شهر، محله رئیسان، پارک شهرداری
            </a>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-card border border-graphite-200/70 bg-bone-100 p-5 text-sm text-graphite-600">
        <h3 className="mb-2 font-semibold text-ink-900">ساعت کاری</h3>
        <p>شنبه تا پنجشنبه: ۸:۰۰ تا ۲۳:۰۰</p>
        <p>جمعه: ۱۵:۰۰ تا ۲۳:۰۰</p>
      </div>
    </div>
  );
}
