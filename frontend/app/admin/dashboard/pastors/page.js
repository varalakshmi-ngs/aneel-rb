'use client';

import { ChurchPastorsSection } from '@/components/admin/AdminDashboardSections';
import { useAdminDashboard } from '@/components/admin/AdminDashboardProvider';

export default function AdminDashboardPastorsPage() {
  const { churchPastors, churchPastorForm, setChurchPastorForm, handleChurchPastorSubmit, editChurchPastor, handleDeleteChurchPastor, token } = useAdminDashboard();

  return (
    <ChurchPastorsSection
      churchPastors={churchPastors}
      churchPastorForm={churchPastorForm}
      setChurchPastorForm={setChurchPastorForm}
      handleChurchPastorSubmit={handleChurchPastorSubmit}
      editChurchPastor={editChurchPastor}
      handleDeleteChurchPastor={handleDeleteChurchPastor}
      token={token}
    />
  );
}
