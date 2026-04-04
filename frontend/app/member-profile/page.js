import Link from 'next/link';
import { getApiBase } from '@/utils/apiBase';

export default async function MemberProfilePage({ searchParams }) {
  const passcode = typeof searchParams?.passcode === 'string' ? searchParams.passcode.trim() : '';
  let member = null;
  let errorMessage = null;

  if (passcode) {
    try {
      const API_BASE = getApiBase();
      const res = await fetch(
        `${API_BASE}/pcc-members/lookup?passcode=${encodeURIComponent(passcode)}`,
        { cache: 'no-store' }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Member not found');
      }
      member = await res.json();
    } catch (error) {
      errorMessage = error.message || 'Unable to load member profile.';
    }
  } else {
    errorMessage = 'Passcode is required to view the profile.';
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg p-8">
        {member && member.status && member.status !== 'active' ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-red-800">Account Pending</h1>
            <p className="mt-3 text-red-700 font-medium">Your passcode was not active, please reachout to admin.</p>
            <Link
              href="/member-lookup"
              className="inline-flex mt-6 rounded-md bg-red-600 px-6 py-3 text-base font-semibold text-white hover:bg-red-700"
            >
              Go Back
            </Link>
          </div>
        ) : member ? (
          <div className="space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-blue-600">Member Profile</p>
                <h1 className="text-4xl font-bold text-gray-900">Welcome Mr. {member.name}</h1>
                <p className="mt-2 text-gray-600">Your passcode is active and this is your profile page.</p>
              </div>
              {member.photo_url && (
                <img
                  src={member.photo_url}
                  alt={member.name}
                  className="h-40 w-40 rounded-3xl object-cover"
                />
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Contact</h2>
                <p className="text-sm text-gray-700">Email: {member.email || 'Not provided'}</p>
                <p className="text-sm text-gray-700 mt-2">Mobile: {member.mobile || 'Not provided'}</p>
                <p className="text-sm text-gray-700 mt-2">Passcode: {member.passcode}</p>
              </div>
              <div className="lg:col-span-2 rounded-3xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">About</h2>
                <p className="text-sm text-gray-700 whitespace-pre-line">{member.bio || 'No bio available.'}</p>

                {member.family_details?.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-md font-semibold text-gray-900 mb-2">Family Details</h3>
                    <ul className="space-y-2 text-sm text-gray-700 list-disc list-inside">
                      {member.family_details.map((detail, index) => (
                        <li key={index}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {member.social_links?.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-md font-semibold text-gray-900 mb-2">Social Links</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {member.social_links.map((link, index) => (
                        <li key={index}>
                          <a href={link.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                            {link.platform ? `${link.platform} profile` : link.url}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Member not found</h1>
            <p className="mt-3 text-gray-600">{errorMessage}</p>
            <Link
              href="/member-lookup"
              className="inline-flex mt-6 rounded-md bg-blue-600 px-6 py-3 text-base font-semibold text-white hover:bg-blue-700"
            >
              Try again
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
