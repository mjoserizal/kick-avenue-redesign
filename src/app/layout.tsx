import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SubNav } from "@/components/layout/sub-nav";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kick Avenue Redesign",
  description:
    "Kick Avenue - Buy & Sell 100% Authentic Sneakers, Apparel, Luxury & Collectibles",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <SubNav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}