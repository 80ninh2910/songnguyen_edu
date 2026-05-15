import type { Metadata } from "next";
import { Be_Vietnam_Pro, Geist_Mono } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import SiteNavbar from "@/components/SiteNavbar";
import PublicContactDock from "@/components/PublicContactDock";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "SONG NGUYEN EDU",
  description: "Cổng Gia Sư Cao Cấp",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", beVietnamPro.variable)}
    >
      <body className="bg-white text-black">
        <ThemeProvider defaultTheme="light" enableSystem={false} forcedTheme="light">
          <SiteNavbar />
          <PublicContactDock />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
