'use client';
import ContentAnimation from '@/components/layouts/content-animation';
import Footer from '@/components/layouts/footer';
import Header from '@/components/layouts/header';
import MainContainer from '@/components/layouts/main-container';
import Overlay from '@/components/layouts/overlay';
import ScrollToTop from '@/components/layouts/scroll-to-top';
import Portals from '@/components/portals';
import Sidebar from './components/sidebar';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Popover } from 'antd';
import Image from 'next/image';

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);

    const hide = () => {
        setOpen(false);
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
    };

    const { data: session } = useSession();
    const router = useRouter();

    const { status } = useSession({
        required: true,
        onUnauthenticated() {
            router.push('/login');
        },
    });

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
                        <div className="main-content flex min-h-screen flex-col p-3">
                            {/* BEGIN TOP NAVBAR */}
                            <Header />
                            {/* END TOP NAVBAR */}
                            <ContentAnimation>
                                {children}
                                <div className="fixed bottom-14 right-0 pr-8">
                                    <Popover
                                        content={
                                            <div className="flex flex-col gap-2 p-2">
                                                <a href="http://t.me/unicusx">
                                                    <Image src="/assets/images/telegram.png" className="hover:cursor-pointer" alt="Telegram" width={40} height={20} />
                                                </a>
                                                <a href="https://wa.me/message/CBV4XZVJWDETO1">
                                                    <Image src="/assets/images/whatsapp.png" className="hover:cursor-pointer" alt="WhatsApp" width={43} height={20} />
                                                </a>
                                            </div>
                                        }
                                        trigger="click"
                                        placement="topRight"
                                        open={open}
                                        onOpenChange={handleOpenChange}
                                    >
                                        {/* Chat icon */}
                                        <Image src="/assets/images/chat.png" className="hover:cursor-pointer" alt="Chat" width={50} height={20} />
                                    </Popover>
                                </div>
                            </ContentAnimation>

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
    return null;
}
