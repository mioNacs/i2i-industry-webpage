import type { Metadata } from "next";
import { Poppins, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import WhatsAppButton from "@/components/layout/whatsapp-button";
import BackToTop from "@/components/ui/back-to-top";
import { Toaster } from "react-hot-toast";
import { GoogleAnalytics } from "@next/third-parties/google";

const poppins = Poppins({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "i2i Industry",
  description:
    "i2i Provides best coaching and career placement services for people looking to excel in their careers",
  keywords: "i2i, i2i Academy, i2i industry, i2i industries",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en" data-theme="appTheme">
      <body
        className={`${poppins.variable} ${geistMono.variable} font-sans antialiased bg-white text-base-content`}
      >
        <Toaster position="top-center" reverseOrder={false} />
        <NavBar />
        {/* Offset for fixed navbar: top bar (~40px) + nav bar (80px) */}
        <main className="pt-[120px]">{children}</main>
        <Footer />
        <WhatsAppButton />
        <BackToTop />
      </body>
      {gaId && <GoogleAnalytics gaId={gaId} />}
    </html>
  );
}
