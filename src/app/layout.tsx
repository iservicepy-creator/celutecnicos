import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'CGC Triple Frontera 2026 · celutecnicos.com',
  description:
    'Edición oficial Paraguay del Circuit Global Championship 2026. 4 y 5 de julio en el Hotel Gran Nobile, Ciudad del Este. Competencias de iPhone, Android y Glass + FIXCON Expo.',
  metadataBase: new URL('https://celutecnicos.com'),
  openGraph: {
    title: 'CGC Triple Frontera 2026',
    description:
      'El mundial de reparación de celulares llega a Paraguay. 4 y 5 de julio, Ciudad del Este.',
    type: 'website',
    locale: 'es_PY'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
