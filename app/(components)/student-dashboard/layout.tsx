'use client';
import ContentAnimation from '@/components/layouts/content-animation';
import Footer from '@/components/layouts/footer';
import Header from '@/components/layouts/header';
import MainContainer from '@/components/layouts/main-container';
import Overlay from '@/components/layouts/overlay';
import ScrollToTop from '@/components/layouts/scroll-to-top';
import Portals from '@/components/portals';
import Sidebar from './components/sidebar';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    if (status === 'authenticated') {
        return (
            <>
                {/* BEGIN MAIN CONTAINER */}
                <div className="relative">
                    <Overlay />

                    <ScrollToTop />

                    {/* BEGIN APP SETTING LAUNCHER */}
                    {/* END APP SETTING LAUNCHER */}

                    <MainContainer>
                        {/* BEGIN SIDEBAR */}
                        <Sidebar />
                        {/* END SIDEBAR */}
                        <div className="main-content flex min-h-screen flex-col p-2">
                            {/* BEGIN TOP NAVBAR */}
                            <Header />
                            {/* END TOP NAVBAR */}
                            <ContentAnimation>{children}</ContentAnimation>

                            {/* BEGIN FOOTER */}
                            <Footer />
                            {/* END FOOTER */}
                            <Portals />
                        </div>
                    </MainContainer>
                </div>
            </>
        );
    }
    return router.push('/login');
}
