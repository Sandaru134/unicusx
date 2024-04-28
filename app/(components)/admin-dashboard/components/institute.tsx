'use client';
import React from 'react';
import InstituteRegistration from './instituteRegistration';
import StatisticsPage from './statistics';

const InstitutePage = () => {
    return (
        <div className="py-2.5">
            <StatisticsPage />
            <div className="pt-6">
                <InstituteRegistration />
            </div>
        </div>
    );
};

export default InstitutePage;
