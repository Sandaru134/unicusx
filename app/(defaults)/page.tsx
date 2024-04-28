'use client';
import React, { useEffect } from 'react';
import Loading from '@/components/layouts/loading';
import { useRouter } from 'next/navigation';

const Sales = () => {
    const router = useRouter();
    useEffect(() => {
        router.push('/login');
    }, [router]);
    return (
        <div>
            <Loading />
        </div>
    );
};

export default Sales;
