"use client"
import ProviderComponent from '@/components/layouts/provider-component';
import 'react-perfect-scrollbar/dist/css/styles.css';
import '../styles/tailwind.css';
import { Lexend, K2D } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';

const lexend = Lexend({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lexend',
});

const k2d = K2D({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-k2d',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <html lang="en" className={`${lexend.variable} ${k2d.variable}`}>
        <body>
          <ProviderComponent>{children}</ProviderComponent>
        </body>
      </html>
    </SessionProvider>
  );
}