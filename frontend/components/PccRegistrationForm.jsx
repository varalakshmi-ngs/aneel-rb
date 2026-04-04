'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerPccMember } from '@/utils/adminApi';
import ImageUploadInput from '@/components/admin/ImageUploadInput';
import Link from 'next/link';

export default function PccRegistrationForm({ onReturn }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    role: '',
    bio: '',
    photo_url: '',
    mobile: '',
    email: '',
    family_details: [''],
    social_links: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [passcode, setPasscode] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const data = await registerPccMember(form);
      setPasscode(data.passcode);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-lg text-center animate-fade-in mx-auto">
        <h2 className="mt-6 text-3xl font-extrabold text-blue-900">Registration Successful</h2>
        <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-6 my-6">
          <p className="text-sm font-medium mb-2">Your unique passcode is:</p>
          <p className="text-3xl font-bold tracking-wider">{passcode}</p>
        </div>
        <p className="text-gray-600 font-medium">
          Please save this passcode. It cannot be directly accessed yet.
        </p>
        <p className="text-gray-500 text-sm mt-3">
          After approving your registration by the admin, the passcode will be activated.
        </p>
        <button
          onClick={onReturn}
          className="mt-8 w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition"
        >
          Return to Login
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl bg-white rounded-3xl shadow-lg p-4 animate-fade-in mx-auto">
      <div className="mb-8 border-b border-gray-100 pb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center">PCC Member Registration</h1>
        <p className="mt-3 text-center text-gray-500">Apply to become a PCC member. Your application will be reviewed by administrators.</p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-700 font-medium border border-red-100 flex items-center">
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name <span className="text-red-500">*</span></label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl shadow-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
              placeholder="Enter the full name of the member"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
            <input
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl shadow-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="e.g. Community Leader"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl shadow-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Enter your email address"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
            <input
              type="tel"
              value={form.mobile}
              onChange={(e) => setForm({ ...form, mobile: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl shadow-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Enter your mobile number"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
          <textarea
            rows={4}
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl shadow-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="Tell us about yourself..."
          />
        </div>

        <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-2xl">
          <ImageUploadInput
            label="Profile Photo"
            value={form.photo_url}
            onChange={(url) => setForm({ ...form, photo_url: url })}
            isPublic={true}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Family Details</label>
          <div className="space-y-3">
            {form.family_details.map((detail, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={detail}
                  onChange={(e) => {
                    const nextFamily = [...form.family_details];
                    nextFamily[index] = e.target.value;
                    setForm({ ...form, family_details: nextFamily });
                  }}
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl shadow-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="e.g. Spouse: Jane Doe"
                />
                <button
                  type="button"
                  onClick={() => {
                    const nextFamily = form.family_details.filter((_, i) => i !== index);
                    setForm({ ...form, family_details: nextFamily.length ? nextFamily : [''] });
                  }}
                  className="px-4 py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-sm font-bold transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setForm({ ...form, family_details: [...form.family_details, ''] })}
            className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-bold inline-flex items-center transition"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
            Add Another Detail
          </button>
        </div>

        {/* Social Links Form ... simplified for aesthetic */}

        <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
          <button type="button" onClick={onReturn} className="text-gray-500 hover:text-gray-900 font-semibold text-sm transition">
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-8 py-3.5 text-base font-bold text-white shadow-md hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 transition transform hover:-translate-y-0.5"
          >
            {loading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : null}
            {loading ? 'Submitting...' : 'Register as PCC Member'}
          </button>
        </div>
      </form>
    </div>
  );
}
