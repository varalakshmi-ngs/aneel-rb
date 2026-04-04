'use client';

import { PccSection } from '@/components/admin/AdminDashboardSections';
import { useAdminDashboard } from '@/components/admin/AdminDashboardProvider';

export default function AdminDashboardPccPage() {
  const { pccMembers, pccForm, setPccForm, handlePccSubmit, editPccMember, handleDeletePcc, token } = useAdminDashboard();

  return (
    <PccSection
      pccMembers={pccMembers}
      pccForm={pccForm}
      setPccForm={setPccForm}
      handlePccSubmit={handlePccSubmit}
      editPccMember={editPccMember}
      handleDeletePcc={handleDeletePcc}
      token={token}
    />
  );
}
