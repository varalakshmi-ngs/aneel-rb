'use client';

import { AboutUsSection } from '@/components/admin/AdminDashboardSections';
import { useAdminDashboard } from '@/components/admin/AdminDashboardProvider';

export default function AdminDashboardAboutUsPage() {
  const {
    homeForm,
    setHomeForm,
    homeSectionOptions,
    loadHomeSectionIntoForm,
    handleSaveHomeSection,
    token,
  } = useAdminDashboard();

  return (
    <AboutUsSection
      homeForm={homeForm}
      setHomeForm={setHomeForm}
      homeSectionOptions={homeSectionOptions}
      loadHomeSectionIntoForm={loadHomeSectionIntoForm}
      handleSaveHomeSection={handleSaveHomeSection}
      token={token}
    />
  );
}
