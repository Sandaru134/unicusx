import ComponentsDashboardAnalytics from '@/components/dashboard/components-dashboard-analytics';
import { Metadata } from 'next';
import React from 'react';
import CoverLogin from '../(auth)/login/page';

export const metadata: Metadata = {
    title: 'Sales Admin',
};

const Sales = () => {
    return (
        <div>
            <CoverLogin />
        </div>
    );
};

export default Sales;
