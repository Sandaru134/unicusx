'use client';
import React from 'react';
import { useSession } from 'next-auth/react';
import InstitutePage from './components/institute';

const AdminDashboard = async () => {
    const { data: session, status } = useSession();
    return <InstitutePage />;
};

export default AdminDashboard;
