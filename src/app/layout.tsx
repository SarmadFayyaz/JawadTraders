import type { Metadata } from "next";
import { Noto_Nastaliq_Urdu, Inter } from "next/font/google";
import { LanguageProvider } from "@/lib/language-context";
import { ToastProvider } from "@/lib/toast-context";
import "./globals.css";

const notoNastaliq = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-nastaliq",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "جواد ٹریڈرز - Jawad Traders",
  description: "Jawad Traders - Khata Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ur" dir="rtl" className={`${notoNastaliq.variable} ${inter.variable}`}>
      <body className="antialiased">
        <LanguageProvider><ToastProvider>{children}</ToastProvider></LanguageProvider>
      </body>
    </html>
  );
}
