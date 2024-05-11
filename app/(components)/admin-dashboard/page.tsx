'use client';
import React from 'react';
import { useSession } from 'next-auth/react';
import InstitutePage from './components/institute';

const AdminDashboard = async () => {
    return <InstitutePage />;
};

export default AdminDashboard;
