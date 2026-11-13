import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-inter",
  display: "swap",
});

/**
 * Applies the persisted theme before first paint so the app never flashes the
 * wrong colour scheme. Mirrors the logic used by the theme toggle.
 */
const themeInitScript = `(function(){try{var s=localStorage.getItem("kcc-theme");var d=s?s==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;var e=document.documentElement;e.classList.toggle("dark",d);e.style.colorScheme=d?"dark":"light";}catch(e){}})();`;

export const metadata: Metadata = {
  title: "KCC Chat — Student Social Network",
  description:
    "KCC Chat is a social media platform for KCC students to connect, share, and communicate.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="bg-surface text-ink antialiased">{children}</body>
    </html>
  );
}
