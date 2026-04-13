'use client';

import { MembersSection } from '@/components/admin/AdminDashboardSections';
import { useAdminDashboard } from '@/components/admin/AdminDashboardProvider';

export default function AdminDashboardMembersPage() {
  const {
    registeredMembers,
    handleUpdateRegisteredMemberStatus,
    handleDeleteRegisteredMember,
  } = useAdminDashboard();

  return (
    <MembersSection
      registeredMembers={registeredMembers}
      handleUpdateRegisteredMemberStatus={handleUpdateRegisteredMemberStatus}
      handleDeleteRegisteredMember={handleDeleteRegisteredMember}
    />
  );
}
