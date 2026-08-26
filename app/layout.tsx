import './globals.css';
import './sections.css';
import './motion.css';
/* Loaded last: the centred-alignment layer overrides the section styles. */
import './align.css';
import type { Metadata, Viewport } from 'next';
import { Cursor, ScrollProgress, Specular } from './components/motion';
import BootMount from './components/BootMount';
import { Fraunces, Archivo, JetBrains_Mono } from 'next/font/google';

/* Display: Fraunces, with its SOFT and WONK axes exposed so headlines can
   carry real personality instead of reading as a default serif. */
const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  axes: ['SOFT', 'WONK'],
  variable: '--font-fraunces',
});

/* UI + body: sturdy grotesque, deliberately not Inter. */
const archivo = Archivo({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-archivo',
});

/* Utility: every label, metric, and stack chip. Mono for metadata is honest
   for this subject, not decorative. */
const mono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://tanvir.dev'),
  title: 'Tanvir Ahmed — AI/ML Engineer',
  description:
    'AI/ML engineer building retrieval, risk, vision and language systems that turn data into decisions. Currently at upay (UCB Fintech).',
  openGraph: {
    title: 'Tanvir Ahmed — AI/ML Engineer',
    description:
      'AI/ML engineer building retrieval, risk, vision and language systems that turn data into decisions.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#05060d',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${archivo.variable} ${mono.variable}`}>
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
        <Cursor />
        <Specular />
        {children}
      </body>
    </html>
  );
}
