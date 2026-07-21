import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ZEVRO | Wear Your Edge — Luxury Athleisure & Streetwear',
  description: 'Shop ZEVRO luxury athleisure, engineered tracksuits, and street co-ords. Wear Your Edge.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
