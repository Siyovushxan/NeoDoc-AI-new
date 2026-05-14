import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NeoDoc AI - Professional Documents in 30 Seconds',
  description:
    'Create presentations, essays, and infographics with AI. Get professional documents instantly with NeoDoc AI.',
  keywords: 'AI documents, presentation generator, essay writer, academic documents',
  viewport: 'width=device-width, initial-scale=1.0',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-text-main">
        {children}
      </body>
    </html>
  );
}
