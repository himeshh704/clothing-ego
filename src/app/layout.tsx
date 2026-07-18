import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VALOR & VEIL | Luxury Athleisure & Engineered Streetwear',
  description: 'Shop luxury athleisure, engineered tracksuits, and street co-ords. High-converting modular store architecture.',
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
