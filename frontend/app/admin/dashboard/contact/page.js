'use client';

import { ContactSection } from '@/components/admin/AdminDashboardSections';
import { useAdminDashboard } from '@/components/admin/AdminDashboardProvider';

export default function AdminDashboardContactPage() {
  const { contacts } = useAdminDashboard();

  return <ContactSection contacts={contacts} />;
}
