'use client';

import { MembersSection } from '@/components/admin/AdminDashboardSections';
import { useAdminDashboard } from '@/components/admin/AdminDashboardProvider';

export default function AdminDashboardMembersPage() {
  const { members, memberForm, setMemberForm, handleMemberSubmit, editMember, handleDeleteMember, token } = useAdminDashboard();

  return (
    <MembersSection
      members={members}
      memberForm={memberForm}
      setMemberForm={setMemberForm}
      handleMemberSubmit={handleMemberSubmit}
      editMember={editMember}
      handleDeleteMember={handleDeleteMember}
      token={token}
    />
  );
}
