'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerPccMember } from '@/utils/adminApi';
import ImageUploadInput from '@/components/admin/ImageUploadInput';
import Link from 'next/link';

export default function PccRegistrationPage() {
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl shadow-lg text-center">
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
            onClick={() => router.push('/')}
            className="mt-8 w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-lg p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 text-center">PCC Member Registration</h1>
          <p className="mt-2 text-center text-gray-600">Apply to become a PCC member.</p>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <input
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. Community Leader"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
              <input
                type="tel"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="+1 234 567 890"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea
              rows={4}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl">
            <ImageUploadInput
              label="Profile Photo"
              value={form.photo_url}
              onChange={(url) => setForm({ ...form, photo_url: url })}
              isPublic={true}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Family Details</label>
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
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. Spouse: Jane Doe"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const nextFamily = form.family_details.filter((_, i) => i !== index);
                      setForm({ ...form, family_details: nextFamily.length ? nextFamily : [''] });
                    }}
                    className="px-4 py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setForm({ ...form, family_details: [...form.family_details, ''] })}
              className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center"
            >
              + Add Another Family Detail
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Social Links</label>
            {form.social_links.map((link, index) => (
              <div key={index} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-3">
                <select
                  value={link.platform || ''}
                  onChange={(e) => {
                    const newLinks = [...form.social_links];
                    newLinks[index] = { ...newLinks[index], platform: e.target.value };
                    setForm({ ...form, social_links: newLinks });
                  }}
                  className="px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 sm:w-1/3"
                >
                  <option value="">Select Platform</option>
                  <option value="facebook">Facebook</option>
                  <option value="twitter">Twitter</option>
                  <option value="instagram">Instagram</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="youtube">YouTube</option>
                </select>
                <input
                  type="url"
                  placeholder="Profile URL"
                  value={link.url || ''}
                  onChange={(e) => {
                    const newLinks = [...form.social_links];
                    newLinks[index] = { ...newLinks[index], url: e.target.value };
                    setForm({ ...form, social_links: newLinks });
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newLinks = form.social_links.filter((_, i) => i !== index);
                    setForm({ ...form, social_links: newLinks });
                  }}
                  className="px-4 py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setForm({
                  ...form,
                  social_links: [...form.social_links, { platform: '', url: '' }],
                });
              }}
              className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center"
            >
              + Add Social Link
            </button>
          </div>

          <div className="pt-6 border-t border-gray-200 flex items-center justify-between">
            <Link href="/" className="text-gray-500 hover:text-gray-900 font-medium text-sm">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center rounded-xl bg-blue-600 px-8 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Register as PCC Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
