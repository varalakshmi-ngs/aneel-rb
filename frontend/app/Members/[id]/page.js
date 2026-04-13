'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getApiBase } from '@/utils/apiBase';
import Link from 'next/link';
import { formatDate } from '@/utils/formatDate';
import { FiMail, FiPhone, FiCalendar, FiUser, FiHome, FiHeart, FiUsers, FiAward } from 'react-icons/fi';

export default function MemberProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const API_BASE = getApiBase();
        const res = await fetch(`${API_BASE}/members/${params.id}`);
        if (!res.ok) throw new Error('Member not found');
        const data = await res.json();
        setMember(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchMember();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Oops!</h1>
        <p className="text-gray-600 mb-8">{error || 'Something went wrong'}</p>
        <Link href="/" className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-bold shadow-lg">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Profile Header */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="h-48 bg-gradient-to-r from-emerald-500 to-teal-400 relative">
             <div className="absolute -bottom-16 left-8 sm:left-12">
                <div className="p-1.5 bg-white rounded-[2rem] shadow-2xl">
                    <div className="w-32 h-32 sm:w-40 sm:h-40 bg-neutral-100 rounded-[1.8rem] overflow-hidden">
                        {member.photo_url ? (
                            <img src={member.photo_url} alt={member.first_name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-neutral-400">
                                {member.first_name.charAt(0)}
                            </div>
                        )}
                    </div>
                </div>
             </div>
          </div>
          
          <div className="pt-20 pb-8 px-8 sm:px-12">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">
                            {member.first_name} {member.surname}
                        </h1>
                        <span className={`px-4 py-1 text-xs font-black uppercase tracking-widest rounded-full ${member.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {member.status}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-4 text-gray-600 font-medium">
                        <div className="flex items-center gap-2">
                            <FiUser className="text-emerald-500" />
                            <span>{member.gender}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FiHeart className="text-emerald-500" />
                            <span>{member.marital_status}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FiPhone className="text-emerald-500" />
                            <span>{member.mobile_number}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Link href={`/Members/${params.id}/edit`} className="px-6 py-2.5 bg-neutral-900 text-white rounded-xl font-bold shadow-lg hover:shadow-neutral-400/30 transition-all flex items-center gap-2">
                        Edit Profile
                    </Link>
                </div>

             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Personal Info & Church Records */}
            <div className="lg:col-span-1 space-y-8">
                {/* Church Records Card */}
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                    <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-3">
                        <FiAward className="text-emerald-500 w-6 h-6" />
                        Church Records
                    </h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Baptism Date</p>
                            <p className="text-gray-900 font-bold">{formatDate(member.church_records?.baptism_date)}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Confirmation Date</p>
                            <p className="text-gray-900 font-bold">{formatDate(member.church_records?.confirmation_date)}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Joining Date</p>
                            <p className="text-gray-900 font-bold">{formatDate(member.church_records?.joining_date)}</p>
                        </div>

                    </div>
                </div>

                {/* Account Info */}
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                    <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-3">
                        <FiCalendar className="text-emerald-500 w-6 h-6" />
                        Account Details
                    </h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between py-2 border-b border-gray-50">
                            <span className="text-gray-500">Date of Birth</span>
                            <span className="font-bold text-gray-900">{formatDate(member.dob)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-50">
                            <span className="text-gray-500">Registered On</span>
                            <span className="font-bold text-gray-900">{formatDate(member.created_at)}</span>
                        </div>
                    </div>

                </div>
            </div>

            {/* Right Column: Family Details */}
            <div className="lg:col-span-2 space-y-8">
                {/* Spouse Info */}
                {member.marital_status === 'Married' && member.spouse && (
                    <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                        <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                            <FiUsers className="text-emerald-500 w-7 h-7" />
                            Spouse Information
                        </h3>
                        <div className="flex flex-col sm:flex-row items-center gap-8">
                            <div className="w-32 h-32 bg-gray-100 rounded-3xl overflow-hidden shadow-inner flex-shrink-0">
                                {member.spouse.photo_url ? (
                                    <img src={member.spouse.photo_url} alt={member.spouse.first_name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-gray-300">
                                        {member.spouse.first_name.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                                        <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Full Name</p>
                                        <p className="text-gray-900 font-black text-lg">{member.spouse.first_name} {member.spouse.surname}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Marriage Date</p>
                                        <p className="text-gray-900 font-bold">{formatDate(member.spouse.marriage_date)}</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Date of Birth</p>
                                    <p className="text-gray-900 font-bold">{formatDate(member.spouse.dob)}</p>
                                </div>

                            </div>
                        </div>
                    </div>
                )}

                {/* Children Details */}
                {member.children && member.children.length > 0 && (
                    <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                        <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                            <FiUsers className="text-emerald-500 w-7 h-7" />
                            Children ({member.children.length})
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {member.children.map((child, idx) => (
                                <div key={idx} className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:border-emerald-200 transition-all hover:bg-white hover:shadow-md group">
                                    <div className="w-16 h-16 bg-white rounded-2xl overflow-hidden shadow-sm flex-shrink-0">
                                        {child.photo_url ? (
                                            <img src={child.photo_url} alt={child.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-300">
                                                {child.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-black text-gray-900 group-hover:text-emerald-600 transition-colors">{child.name}</h4>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-0.5">{child.gender} • {formatDate(child.dob)}</p>
                                    </div>

                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State if no family */}
                {(!member.children || member.children.length === 0) && (member.marital_status === 'Single') && (
                    <div className="bg-gray-100 rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
                        <p className="text-gray-400 font-medium italic">No additional family members registered.</p>
                    </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
}
