import type { Metadata } from "next";
import { Bebas_Neue, Work_Sans, Space_Mono } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  variable: "--font-display-raw",
  weight: "400",
  subsets: ["latin"],
});

const workSans = Work_Sans({
  variable: "--font-sans-raw",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-mono-raw",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WCAC PCAC — MICA's digital kiske paas hai?",
  description:
    "A hyperlocal campus utility platform for MICA: find, borrow, buy, sell or offer anything through the language MICA already speaks.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${workSans.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
