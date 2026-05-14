import type { Metadata, Viewport } from "next";
import {
  Cormorant_Garamond,
  Inter,
  Noto_Sans_TC,
  Playfair_Display,
  Space_Mono,
} from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

const notoTc = Noto_Sans_TC({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "700"],
  variable: "--font-noto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Grainly — 膠卷記憶 × 共享時光",
  description: "每個快門，都是一段共同記憶。復古膠卷風格的共享相機空間。",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Grainly" },
};

export const viewport: Viewport = {
  themeColor: "#4A3227",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body
        className={`${playfair.variable} ${cormorant.variable} ${inter.variable} ${spaceMono.variable} ${notoTc.variable} min-h-dvh`}
      >
        {children}
      </body>
    </html>
  );
}
