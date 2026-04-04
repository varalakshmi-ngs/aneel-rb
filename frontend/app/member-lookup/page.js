'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MemberLookupPage() {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  function handleSubmit(event) {
    event.preventDefault();
    const cleaned = passcode.trim();
    if (!cleaned) {
      setError('Please enter a passcode.');
      return;
    }
    setError('');
    router.push(`/member-profile?passcode=${encodeURIComponent(cleaned)}`);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Member Lookup</h1>
        <p className="text-gray-600 mb-6">
          Enter the generated passcode to open the PCC member profile page.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="passcode" className="block text-sm font-medium text-gray-700">
              Passcode
            </label>
            <input
              id="passcode"
              type="text"
              value={passcode}
              onChange={(event) => setPasscode(event.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="ROBO-12345"
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>
          )}

          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            Lookup Member
          </button>
        </form>
      </div>
    </div>
  );
}
