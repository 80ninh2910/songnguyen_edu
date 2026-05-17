import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";

import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-body",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin", "vietnamese"],
  variable: "--font-headline",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bảng quản trị SNE v2.0",
  description: "Bảng điều hành vận hành trung tâm Song Nguyen Education",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.variable} ${manrope.variable}`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
