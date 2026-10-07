import type { Metadata } from "next";
import { Geist, Playfair_Display } from "next/font/google";
import "./globals.css";

/**
 * Root layout (SPEC 3장 project structure).
 *
 * Deliberately minimal — only fonts, global CSS and the `<html>`/`<body>`
 * shell live here. The Public Website header/footer are added one level
 * down, in `src/app/(public)/layout.tsx`, so they never leak into
 * `src/app/admin/*` (which keeps its own unauthenticated/dashboard shells).
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "tmentor",
    template: "%s | tmentor",
  },
  description:
    "tmentor는 한섬, LF 등 국내 브랜드 의류를 소싱하여 매장·사업자에 합리적으로 공급하는 B2B 패션 유통 파트너입니다.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
