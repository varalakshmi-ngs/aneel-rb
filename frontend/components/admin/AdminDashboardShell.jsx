'use client';

import { usePathname, useRouter } from 'next/navigation';
import AdminDashboardNav from '@/components/admin/AdminDashboardNav';
import AdminDashboardStats from '@/components/admin/AdminDashboardStats';
import { AdminDashboardProvider, useAdminDashboard } from '@/components/admin/AdminDashboardProvider';

const tabs = [
  { key: 'home', label: 'Home Content' },
  { key: 'aboutus', label: 'About Us Page' },
  { key: 'events', label: 'Events' },
  { key: 'gallery', label: 'Gallery' },
  { key: 'pastors', label: 'Pastors' },
  { key: 'lookup', label: 'Manage PCC Registrations' },
  { key: 'members', label: 'Members' },
  { key: 'contact', label: 'Contact Messages' },
  
  // { key: 'uploads', label: 'Uploads' },
];

function AdminDashboardShellContent({ children }) {
  const { gallery, events, contacts, pccMembers, statusMessage, loading } = useAdminDashboard();
  const pathname = usePathname();
  const router = useRouter();

  const activeTab = pathname?.split('/').pop() || 'home';

  const handleTabSwitch = (key) => {
    router.push(`/admin/dashboard/${key}`);
  };

  const sectionTitle = tabs.find((t) => t.key === activeTab)?.label || 'Admin';

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminDashboardNav tabs={tabs} activeTab={activeTab} onTabSwitch={handleTabSwitch} />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Welcome back, Admin</h2>
          <p className="text-gray-600">Here&apos;s what&apos;s happening with your church.</p>
        </div>

        <AdminDashboardStats galleryCount={gallery.length} eventsCount={events.length} contactsCount={contacts.length} pccCount={pccMembers?.length || 0} />

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{sectionTitle}</h3>
                <p className="mt-1 text-sm text-gray-500">Manage the selected content section.</p>
              </div>
              <div className="text-sm text-gray-500">{loading ? 'Loading...' : 'Ready'}</div>
            </div>

            {statusMessage && (
              <div className="mb-5 rounded-md bg-blue-50 p-4">
                <div className="text-sm text-blue-700">{statusMessage}</div>
              </div>
            )}

            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AdminDashboardShell({ children }) {
  return (
    <AdminDashboardProvider>
      <AdminDashboardShellContent>{children}</AdminDashboardShellContent>
    </AdminDashboardProvider>
  );
}
