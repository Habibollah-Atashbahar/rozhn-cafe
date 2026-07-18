import type { Metadata, Viewport } from "next";
import "@/app/globals.css";
import StoreHydration from "@/components/StoreHydration";

export const metadata: Metadata = {
  metadataBase: new URL("https://rozhn-cafe.example.com"),
  title: {
    default: "رژن | Rozhn Cafe",
    template: "%s | رژن",
  },
  description:
    "کافه رژن — illuminate your day at Rozhn. منوی قهوه، دمنوش، ماکتل، شیک، فست‌فود و بیشتر. سفارش آنلاین سر میز با اسکن QR کد.",
  applicationName: "رژن",
  icons: {
    icon: "/images/favicon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#17140f",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="flex min-h-dvh flex-col antialiased">
        <StoreHydration />
        {children}
      </body>
    </html>
  );
}
