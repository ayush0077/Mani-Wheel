import type { Metadata } from "next";
import {
  Inter,
  JetBrains_Mono,
  Geist_Mono,
  Bodoni_Moda,
  Great_Vibes,
} from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  style: "italic",
  weight: ["500", "600"],
  display: "swap",
});

const greatVibes = Great_Vibes({
  variable: "--font-cursive",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ayush Tamrakar — Creative Developer & Systems Engineer",
  description:
    "High-end scrollytelling portfolio and interactive terminal experience by Ayush Tamrakar. Specializing in high-performance web experiences, scroll-driven narratives, and computational design.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${geistMono.variable} ${bodoniModa.variable} ${greatVibes.variable} min-h-full`}
    >
      <body className="min-h-full antialiased bg-[#0d0f14] text-[#cdd6f4]">
        {children}
      </body>
    </html>
  );
}
