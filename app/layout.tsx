"use client"
import ProviderComponent from '@/components/layouts/provider-component';
import 'react-perfect-scrollbar/dist/css/styles.css';
import '../styles/tailwind.css';
import { Nunito } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';

const nunito = Nunito({
    weight: ['400', '500', '600', '700', '800'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-nunito',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <html lang="en">
                <body className={nunito.variable}>
                    <ProviderComponent>{children}</ProviderComponent>
                </body>
            </html>
        </SessionProvider>
    );
}
