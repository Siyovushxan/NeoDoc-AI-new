import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'NeoDoc AI - Professional Documents in 30 Seconds',
  description:
    'Create presentations, essays, and infographics with AI. Get professional documents instantly with NeoDoc AI.',
  keywords: 'AI documents, presentation generator, essay writer, academic documents',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" data-scroll-behavior="smooth">
      <body className="min-h-screen bg-background text-text-main">
        {children}
      </body>
    </html>
  );
}
