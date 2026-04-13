'use client';

import { useState, useEffect } from 'react';
import { useAdminDashboard } from '@/components/admin/AdminDashboardProvider';

/**
 * A specialized delete button that requires two clicks to confirm.
 */
function DeleteConfirmButton({ onDelete }) {
  const [confirmStep, setConfirmStep] = useState(0);

  useEffect(() => {
    if (confirmStep > 0) {
      const timer = setTimeout(() => setConfirmStep(0), 4000);
      return () => clearTimeout(timer);
    }
  }, [confirmStep]);

  if (confirmStep === 0) {
    return (
      <button
        type="button"
        onClick={() => setConfirmStep(1)}
        className="px-4 py-2 border border-red-200 text-red-600 rounded font-medium hover:bg-red-50 transition-all"
        title="Delete Record"
      >
        Delete
      </button>
    );
  }

  if (confirmStep === 1) {
    return (
      <button
        type="button"
        onClick={() => setConfirmStep(2)}
        className="px-4 py-2 bg-red-100 text-red-700 rounded font-bold hover:bg-red-200 transition-all"
      >
        Are you sure?
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onDelete}
      className="px-4 py-2 bg-red-600 text-white rounded font-bold hover:bg-red-700 transition-all animate-pulse"
    >
      Yes, DELETE!
    </button>
  );
}

export default function ApprovalsPage() {
  const {
    registeredMembers,
    handleUpdateRegisteredMemberStatus,
    handleDeleteRegisteredMember,
    loading,
  } = useAdminDashboard();

  const [actionLoading, setActionLoading] = useState(null);

  const handleUpdateStatus = async (id, newStatus) => {
    setActionLoading(id);
    await handleUpdateRegisteredMemberStatus(id, newStatus);
    setActionLoading(null);
  };

  const handleDelete = async (id) => {
    setActionLoading(id);
    await handleDeleteRegisteredMember(id);
    setActionLoading(null);
  };

  if (loading && registeredMembers.length === 0) {
    return <div className="p-4 text-gray-500">Loading members list...</div>;
  }

  const pendingMembers = registeredMembers.filter(m => m.status === 'Pending');
  const processedMembers = registeredMembers.filter(m => m.status !== 'Pending');

  const renderMemberCard = (m) => (
    <div key={m.id} className="bg-white border rounded-xl p-5 shadow-sm mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:shadow-md">
      <div>
        <div className="flex items-center gap-3">
            <h4 className="text-lg font-bold text-gray-900">{m.first_name} {m.surname}</h4>
            <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${m.marital_status === 'Single' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                {m.marital_status}
            </span>
        </div>
        <div className="text-sm text-gray-600 mt-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
          <p><strong>Mobile:</strong> {m.mobile_number}</p>
          <p><strong>Gender:</strong> {m.gender}</p>
          <p><strong>DOB:</strong> {new Date(m.dob).toLocaleDateString()}</p>
          <p><strong>Applied:</strong> {new Date(m.created_at).toLocaleString()}</p>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto mt-4 md:mt-0">
        {(m.status === 'Pending') && (
            <>
                <button 
                    disabled={actionLoading === m.id}
                    onClick={() => handleUpdateStatus(m.id, 'Approved')}
                    className="w-full md:w-auto px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-bold disabled:opacity-50 transition-colors shadow-sm"
                >
                    {actionLoading === m.id ? 'Updating...' : 'Approve'}
                </button>
                <button 
                    disabled={actionLoading === m.id}
                    onClick={() => handleUpdateStatus(m.id, 'Rejected')}
                    className="w-full md:w-auto px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-bold disabled:opacity-50 transition-colors shadow-sm"
                >
                    {actionLoading === m.id ? 'Updating...' : 'Reject'}
                </button>
            </>
        )}
        
        {(m.status !== 'Pending') && (
            <div className="flex flex-col items-center md:items-end gap-2 w-full md:w-auto">
                <span className={`px-4 py-1.5 text-xs font-black rounded-full shadow-sm border ${m.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                    {m.status.toUpperCase()}
                </span>
                <button
                    onClick={() => handleUpdateStatus(m.id, 'Pending')}
                    className="text-xs text-blue-500 hover:text-blue-700 font-medium underline"
                >
                    Move back to Pending
                </button>
            </div>
        )}

        <div className="hidden md:block w-px h-8 bg-gray-200 mx-2"></div>
        <DeleteConfirmButton onDelete={() => handleDelete(m.id)} />
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section>
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-gray-800 flex items-center gap-3">
                <span className="w-2 h-8 bg-yellow-400 rounded-full"></span>
                Review Pending Approvals
            </h3>
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold">
                {pendingMembers.length} Request(s)
            </span>
        </div>
        
        {pendingMembers.length === 0 ? (
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-12 text-center">
            <p className="text-gray-400 font-medium italic">No pending member registrations to review.</p>
          </div>
        ) : (
          <div className="space-y-4">
             {pendingMembers.map(renderMemberCard)}
          </div>
        )}
      </section>

      <div className="border-t border-dashed border-gray-200 py-4"></div>

      <section>
        <h3 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-3 opacity-60">
            <span className="w-2 h-8 bg-gray-300 rounded-full"></span>
            Recently Processed
        </h3>
        {processedMembers.length === 0 ? (
          <p className="text-gray-400 italic px-5">No recently processed registrations.</p>
        ) : (
          <div className="space-y-4">
            {processedMembers.map(renderMemberCard)}
          </div>
        )}
      </section>
    </div>
  );
}
