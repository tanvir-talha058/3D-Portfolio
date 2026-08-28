import './globals.css';
import './sections.css';
import './motion.css';
import type { Metadata, Viewport } from 'next';
import { Cursor, HeroDepart, ScrollProgress, Specular } from './components/motion';
import BootMount from './components/BootMount';
import WorldMount from './components/world/WorldMount';
import { site } from './data';
import { Archivo, IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';

/* Display: a grotesk cut for headlines, not a text face scaled up. Archivo
   carries two axes — weight and width — and the page drives both: every
   heading tier picks a width, so optical correction happens in the letterform
   rather than in tracking. Set heavy and slightly condensed, it reads as
   signage and instrument panel, which is the register an engineering
   portfolio wants. Italic is a separate drawing, used on the one payload
   word in the hero. */
const display = Archivo({
  subsets: ['latin'],
  display: 'swap',
  style: ['normal', 'italic'],
  axes: ['wdth'],
  variable: '--font-display',
});

/* Reading + UI: IBM Plex Sans. A humanist grotesk drawn for a technology
   company, so it sits beside the mono as one designed system rather than two
   borrowed families. Large apertures and a distinct lowercase keep it legible
   at caption sizes on a dark ground. */
const text = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-text',
});

/* Utility: every label, metric, and stack chip. Plex Mono is the sans's own
   monospaced sibling — same skeleton, same terminals — so uppercase metadata
   reads as instrumentation without changing voice. */
const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-mono',
});

const TITLE = 'Tanvir Ahmed — AI/ML Engineer';
const DESCRIPTION =
  'AI/ML engineer building retrieval, risk, vision and language systems that turn data into decisions. Currently at upay (UCB Fintech).';

/* The icon and the social card come from app/icon.svg and
   app/opengraph-image.tsx by file convention — Next wires them up, so there
   are no `icons` or `openGraph.images` entries here to fall out of sync. */
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: '/',
    siteName: site.name,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: '#05060d',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${text.variable} ${mono.variable}`}>
      <body>
        <a href="#work" className="skip-link">
          Skip to work
        </a>
        <div className="aurora" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <WorldMount />
        <BootMount />
        <ScrollProgress />
        <HeroDepart />
        <Cursor />
        <Specular />
        {children}
      </body>
    </html>
  );
}
