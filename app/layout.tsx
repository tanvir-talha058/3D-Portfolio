import './globals.css';
import './sections.css';
import './motion.css';
/* Loaded last: the centred-alignment layer overrides the section styles. */
import './align.css';
import type { Metadata, Viewport } from 'next';
import { Cursor, HeroDepart, ScrollProgress, Specular } from './components/motion';
import BootMount from './components/BootMount';
import { site } from './data';
import { Bodoni_Moda, Schibsted_Grotesk, Azeret_Mono } from 'next/font/google';

/* Display: a didone. The page's whole idea is a dichroic ramp — light split
   into a spectrum by a thick pane of glass — and a didone is that split in
   letterform: hairline against stem, thin against thick. Its `opsz` axis is
   driven per heading size in globals.css so hairlines stay visible on the
   dark ground instead of thinning out of existence. Italic is loaded for the
   one payload word in the hero. */
const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  display: 'swap',
  style: ['normal', 'italic'],
  axes: ['opsz'],
  variable: '--font-bodoni',
  /* Google ships no metric override table for this family, so Next cannot
     size-adjust a fallback for it. Name the fallback explicitly rather than
     let the build warn on every compile. */
  adjustFontFallback: false,
  fallback: ['Georgia', 'ui-serif', 'serif'],
});

/* Reading + UI: a news grotesk with real aperture and a distinct lowercase,
   built to stay legible at caption sizes. It carries the body copy the
   display face is far too high-contrast to set. */
const grotesk = Schibsted_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-grotesk',
});

/* Utility: every label, metric, and stack chip. Wide and squared-off, so
   uppercase metadata reads as instrument panel rather than prose. */
const mono = Azeret_Mono({
  subsets: ['latin'],
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
    <html lang="en" className={`${bodoni.variable} ${grotesk.variable} ${mono.variable}`}>
      <body>
        <a href="#work" className="skip-link">
          Skip to work
        </a>
        <div className="aurora" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
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
