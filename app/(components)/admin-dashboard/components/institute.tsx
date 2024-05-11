'use client';
import React, { useState } from 'react';
import InstituteRegistration from './instituteRegistration';
import StatisticsPage from './statistics';
import { Popover } from 'antd';
import Image from 'next/image';

// Assuming this is your InstitutePage component
const InstitutePage = () => {
    const [open, setOpen] = useState(false);

    const hide = () => {
        setOpen(false);
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
    };

    return (
        <div className="relative py-2.5">
            <StatisticsPage />
            <div className="pt-6">
                <InstituteRegistration />
            </div>
            {/* Fixed position container */}
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
                    className="shadow-2xl"
                    open={open}
                    onOpenChange={handleOpenChange}
                >
                    {/* Chat icon */}
                    <Image src="/assets/images/chat.png" className="hover:cursor-pointer" alt="Chat" width={50} height={20} />
                </Popover>
            </div>
        </div>
    );
};

export default InstitutePage;
