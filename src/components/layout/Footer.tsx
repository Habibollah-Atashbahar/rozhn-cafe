import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-graphite-200/70 bg-ink-900 text-bone-100">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <Logo className="text-bone-50 [&_span:last-child]:text-graphite-400" />
            <p className="max-w-xs text-sm leading-6 text-graphite-400">
              illuminate your day at Rozhn
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm sm:flex sm:gap-16">
            <div className="space-y-2.5">
              <h3 className="font-semibold text-bone-50">دسترسی سریع</h3>
              <ul className="space-y-2 text-graphite-400">
                <li>
                  <Link href="/" className="hover:text-bone-100">
                    منو و سفارش
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-bone-100">
                    درباره ما
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-bone-100">
                    تماس با ما
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-2.5">
              <h3 className="font-semibold text-bone-50">ساعت کاری</h3>
              <ul className="space-y-2 text-graphite-400">
                <li>شنبه تا پنجشنبه: ۸:۰۰ تا ۲۳:۰۰</li>
                <li>جمعه: ۱۵:۰۰ تا ۲۳:۰۰</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-graphite-700/60 pt-6 text-xs text-graphite-500">
          © {new Date().getFullYear()} کافه رژن. تمامی حقوق محفوظ است.
        </div>
      </div>
    </footer>
  );
}
