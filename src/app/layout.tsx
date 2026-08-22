import type { Metadata } from "next";
import { Fraunces, Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-display-family",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const geistSans = Geist({
  variable: "--font-body-family",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-family",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Tanvir Ahmed — AI/ML Engineer",
  description:
    "Tanvir Ahmed is an AI/ML engineer building intelligent systems across RAG, computer vision, NLP, fraud detection, and automation — from data to deployment.",
};

// Runs before first paint so the page never flashes the wrong theme: reads
// the user's stored choice (falling back to OS preference) and sets the
// data-theme attribute the CSS in globals.css keys off of. Must stay inline
// and synchronous — a deferred/external script would run after paint.
const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('pf:theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${geistSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-full bg-ink font-sans text-paper">{children}</body>
    </html>
  );
}
