'use client';

import { HomeSection } from '@/components/admin/AdminDashboardSections';
import { useAdminDashboard } from '@/components/admin/AdminDashboardProvider';

export default function AdminDashboardHomePage() {
  const {
    homeForm,
    setHomeForm,
    homeSectionOptions,
    loadHomeSectionIntoForm,
    handleSaveHomeSection,
    token,
  } = useAdminDashboard();

  return (
    <HomeSection
      homeForm={homeForm}
      setHomeForm={setHomeForm}
      homeSectionOptions={homeSectionOptions}
      loadHomeSectionIntoForm={loadHomeSectionIntoForm}
      handleSaveHomeSection={handleSaveHomeSection}
      token={token}
    />
  );
}
