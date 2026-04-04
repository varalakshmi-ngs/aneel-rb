'use client';

import { LookupSection } from '@/components/admin/AdminDashboardSections';
import { useAdminDashboard } from '@/components/admin/AdminDashboardProvider';

export default function AdminDashboardLookupPage() {
  const {
    pccMembers,
    handlePccStatusChange,
    handleDeletePcc,
  } = useAdminDashboard();

  return (
    <LookupSection
      pccMembers={pccMembers}
      handlePccStatusChange={handlePccStatusChange}
      handleDeletePcc={handleDeletePcc}
    />
  );
}
