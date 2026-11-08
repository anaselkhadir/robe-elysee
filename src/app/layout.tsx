import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { Header } from '@/components/chrome/Header';
import { Footer } from '@/components/chrome/Footer';
import { StickyCta } from '@/components/chrome/StickyCta';
import { Motion } from '@/components/motion/Motion';
import { SITE } from '@/lib/site';
import '@/styles/base.css';
import '@/styles/chrome.css';
import '@/styles/home.css';
import '@/styles/pages.css';

// Polices auto-hébergées (fichiers Google Fonts, sous-ensemble latin) : aucun appel réseau au build ni chez la visiteuse.
const display = localFont({
  src: [
    { path: '../fonts/eb-garamond-normal.woff2', weight: '400 800', style: 'normal' },
    { path: '../fonts/eb-garamond-italic.woff2', weight: '400 800', style: 'italic' },
  ],
  variable: '--font-display',
  display: 'swap',
});
const sans = localFont({
  src: [{ path: '../fonts/jost-variable.woff2', weight: '100 900', style: 'normal' }],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  applicationName: SITE.siteName,
  formatDetection: { telephone: false },
  icons: { icon: '/favicon.svg', apple: '/brand/mark.png' },
};

export const viewport: Viewport = {
  themeColor: '#fdfcfa',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr-FR" className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        {/* Active les états « avant révélation » uniquement quand le JS est présent : aucun contenu masqué sans JS. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a href="#contenu" className="skip-link">
          Aller au contenu
        </a>
        <Header />
        <main id="contenu">{children}</main>
        <Footer />
        <StickyCta />
        <Motion />
      </body>
    </html>
  );
}
