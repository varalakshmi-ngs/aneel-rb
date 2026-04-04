'use client';

import { UploadsSection } from '@/components/admin/AdminDashboardSections';
import { useAdminDashboard } from '@/components/admin/AdminDashboardProvider';

export default function AdminDashboardUploadsPage() {
  const { uploads, selectedFile, setSelectedFile, handleFileUpload } = useAdminDashboard();

  return (
    <UploadsSection uploads={uploads} selectedFile={selectedFile} setSelectedFile={setSelectedFile} handleFileUpload={handleFileUpload} />
  );
}
