'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * The Lookup section has been consolidated into the main Members management tab.
 * This page now redirects to the main dashboard.
 */
export default function AdminDashboardLookupPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the main dashboard where all member management now resides
    router.replace('/admin/dashboard');
  }, [router]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
      <div className="animate-pulse mb-4">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-11v-4h11m0 0l4 4m-4-4l4-4" />
          </svg>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Redirecting...</h2>
      <p className="text-gray-500 max-w-md">
        The lookup functionality has been moved to the main <strong>Members</strong> tab in the dashboard for a better experience.
      </p>
    </div>
  );
}
