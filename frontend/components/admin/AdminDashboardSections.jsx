import { useEffect, useState } from 'react';
import ImageUploadInput from '@/components/admin/ImageUploadInput';

export function HomeSection({
  homeForm,
  setHomeForm,
  homeSectionOptions,
  loadHomeSectionIntoForm,
  handleSaveHomeSection,
  token,
}) {
  return (
    <form onSubmit={handleSaveHomeSection} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            {homeForm.sectionKey === 'hero'
              ? 'Hero Content'
              : homeForm.sectionKey === 'pastors'
              ? 'Pastors Content'
              : 'Basic Fields'}
          </h4>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Section key</label>
              <select
                value={homeForm.sectionKey}
                onChange={(e) => loadHomeSectionIntoForm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {homeSectionOptions.map((key) => (
                  <option key={key} value={key}>
                    {key === 'hero'
                      ? 'Hero (basic hero content)'
                      : key === 'pastors'
                      ? 'Pastors (10 pastors list)'
                      : key}
                  </option>
                ))}
              </select>
            </div>

            {homeForm.sectionKey === 'hero' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={homeForm.title || ''}
                    onChange={(e) => setHomeForm({ ...homeForm, title: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">Subtitle</label>
                  <input
                    type="text"
                    name="subtitle"
                    id="subtitle"
                    value={homeForm.subtitle || ''}
                    onChange={(e) => setHomeForm({ ...homeForm, subtitle: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter subtitle"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">Description</label>
                  <textarea
                    name="description"
                    id="description"
                    rows={4}
                    value={homeForm.description || ''}
                    onChange={(e) => setHomeForm({ ...homeForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter description"
                  />
                </div>
                <ImageUploadInput
                  label="Image"
                  value={homeForm.image_url}
                  onChange={(url) => setHomeForm({ ...homeForm, image_url: url })}
                  token={token}
                />

                <div className="mt-4">
                  <h4 className="text-md font-medium text-gray-900 mb-2">Hero Pastor Settings</h4>
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">Hero Pastor Name</label>
                    <input
                      type="text"
                      name="heroPastorName"
                      id="heroPastorName"
                      value={homeForm.heroPastorName || ''}
                      onChange={(e) => setHomeForm({ ...homeForm, heroPastorName: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter hero pastor name"
                    />
                  </div>
                  <div className="mt-3">
                    <ImageUploadInput
                      label="Hero Pastor Image"
                      value={homeForm.heroPastorImage}
                      onChange={(url) => setHomeForm({ ...homeForm, heroPastorImage: url })}
                      token={token}
                    />
                  </div>
                </div>
              </>
            )}

            {homeForm.sectionKey === 'pastors' && (
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <p className="text-sm text-gray-600 mb-2">Configure pastors using the same editor below.</p>
              </div>
            )}
          </div>
        </div>

        {homeForm.sectionKey === 'pastors' && (
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Pastors (10 entries)</h4>
            <p className="text-sm text-gray-600 mb-4">Configure the 10 pastors list with names and images.</p>

            <div className="grid grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, idx) => {
                const current = homeForm.pastors[idx] && typeof homeForm.pastors[idx] === 'object' ? homeForm.pastors[idx] : {};
                const currentName = typeof current.name === 'string' ? current.name : '';
                const currentImageUrl = typeof current.image_url === 'string' ? current.image_url : '';
                return (
                  <div key={idx} className="bg-white p-3 rounded-md border">
                    <h5 className="text-xs font-medium text-gray-900 mb-2">Pastor {idx + 1}</h5>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs font-medium text-slate-900 mb-1">Name</label>
                        <input
                          value={currentName}
                          onChange={(e) => {
                            const nextPastors = [...homeForm.pastors];
                            const nextCurrent = nextPastors[idx] && typeof nextPastors[idx] === 'object' ? { ...nextPastors[idx] } : {};
                            nextCurrent.name = e.target.value;
                            nextPastors[idx] = nextCurrent;
                            setHomeForm({ ...homeForm, pastors: nextPastors });
                          }}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-xs text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder={`Pastor ${idx + 1}`}
                        />
                      </div>
                      <ImageUploadInput
                        label="Image"
                        value={currentImageUrl}
                        onChange={(url) => {
                          const nextPastors = [...homeForm.pastors];
                          const nextCurrent = nextPastors[idx] && typeof nextPastors[idx] === 'object' ? { ...nextPastors[idx] } : {};
                          nextCurrent.image_url = url;
                          nextPastors[idx] = nextCurrent;
                          setHomeForm({ ...homeForm, pastors: nextPastors });
                        }}
                        token={token}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="bg-gray-50 rounded-lg p-6">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save Home Section
          </button>
        </div>
      </div>
    </form>
  );
}

export function EventsSection({
  events,
  eventForm,
  setEventForm,
  handleEventSubmit,
  editEvent,
  handleDeleteEvent,
  token,
}) {
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <form onSubmit={handleEventSubmit} className="bg-gray-50 rounded-lg p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              {eventForm.id ? 'Edit Event' : 'Add New Event'}
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Title</label>
                <input
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Event Date</label>
                <input
                  type="date"
                  value={eventForm.event_date}
                  onChange={(e) => setEventForm({ ...eventForm, event_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Location</label>
                <input
                  value={eventForm.location}
                  onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Description</label>
                <textarea
                  rows={4}
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <ImageUploadInput
                label="Image"
                value={eventForm.image_url}
                onChange={(url) => setEventForm({ ...eventForm, image_url: url })}
                token={token}
              />
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={eventForm.is_active}
                  onChange={(e) => setEventForm({ ...eventForm, is_active: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">Active</label>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {eventForm.id ? 'Update Event' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow">
            <div className="px-4 py-5 sm:p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Existing Events</h4>
              <div className="space-y-3">
                {events.length === 0 ? (
                  <p className="text-sm text-gray-500">No events created yet.</p>
                ) : (
                  events.map((event) => (
                    <div key={event.id} className="border border-gray-200 rounded-md p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h5 className="text-sm font-medium text-gray-900">{event.title}</h5>
                          <p className="text-sm text-gray-500 mt-1">
                            {event.event_date && new Date(event.event_date).toLocaleDateString()}
                            {event.location && ` • ${event.location}`}
                          </p>
                          {event.description && (
                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{event.description}</p>
                          )}
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            type="button"
                            onClick={() => editEvent(event)}
                            className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteEvent(event)}
                            className="text-red-600 hover:text-red-900 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function GallerySection({
  gallery,
  galleryForm,
  setGalleryForm,
  handleGallerySubmit,
  editGalleryItem,
  handleDeleteGallery,
  token,
}) {
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <form onSubmit={handleGallerySubmit} className="bg-gray-50 rounded-lg p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              {galleryForm.id ? 'Edit Gallery Image' : 'Upload Gallery Image'}
            </h4>
            <div className="space-y-4">
              <ImageUploadInput
                label="Gallery Image"
                value={galleryForm.image_url}
                onChange={(url) => setGalleryForm({ ...galleryForm, image_url: url })}
                token={token}
              />
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {galleryForm.id ? 'Update Gallery Item' : 'Create Gallery Item'}
              </button>
            </div>
          </form>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow">
            <div className="px-4 py-5 sm:p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Gallery Items</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {gallery.length === 0 ? (
                  <p className="text-sm text-gray-500 col-span-full">No gallery items created yet.</p>
                ) : (
                  gallery.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-md p-4">
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt="Gallery image"
                          className="w-full h-32 object-cover rounded-md mb-3"
                        />
                      )}
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => editGalleryItem(item)}
                          className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteGallery(item)}
                          className="text-red-600 hover:text-red-900 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ContactSection({ contacts }) {
  return (
    <div>
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Contact Messages</h4>
          <div className="space-y-4">
            {contacts.length === 0 ? (
              <p className="text-sm text-gray-500">No contact messages received yet.</p>
            ) : (
              contacts.map((contact) => (
                <div key={contact.id} className="border border-gray-200 rounded-md p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h5 className="text-sm font-medium text-gray-900">{contact.name}</h5>
                      <p className="text-sm text-gray-500">{contact.email}</p>
                      {contact.phone && <p className="text-sm text-gray-500">{contact.phone}</p>}
                    </div>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        contact.processed
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {contact.processed ? 'Processed' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-2">{contact.message}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Received on {new Date(contact.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * A specialized delete button that requires two clicks to confirm.
 */
function DeleteConfirmButton({ onDelete, memberName }) {
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
        className="p-2 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-100 transition-all flex items-center justify-center"
        title="Delete Member"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    );
  }

  if (confirmStep === 1) {
    return (
      <button
        type="button"
        onClick={() => setConfirmStep(2)}
        className="px-3 py-1.5 rounded-lg bg-red-100 text-red-700 text-xs font-bold hover:bg-red-200 transition-all whitespace-nowrap"
      >
        Are you sure?
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onDelete}
      className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-all animate-pulse whitespace-nowrap"
    >
      Yes, DELETE!
    </button>
  );
}

export function MembersSection({
  registeredMembers,
  handleUpdateRegisteredMemberStatus,
  handleDeleteRegisteredMember,
}) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h4 className="text-xl font-bold text-gray-900">Manage Registered Members</h4>
            <p className="text-sm text-gray-500 mt-1">Review, manage, and delete approved church member accounts.</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm text-sm font-medium text-gray-600 flex items-center">
            Total Members: <span className="text-blue-600 font-bold ml-2 text-lg">{registeredMembers.length}</span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Member</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Details</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-50">
              {registeredMembers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-gray-500">
                    No registered members found.
                  </td>
                </tr>
              ) : (
                registeredMembers.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          {m.photo_url ? (
                            <img className="h-10 w-10 rounded-full object-cover border border-gray-200" src={m.photo_url} alt="" />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                              {m.first_name?.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-gray-900">{m.first_name} {m.surname}</div>
                          <div className="text-xs text-gray-500 italic mt-0.5">{m.marital_status}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <div><strong className="text-xs text-gray-400 block mb-0.5">Mobile</strong> {m.mobile_number}</div>
                      <div className="mt-1"><strong className="text-xs text-gray-400 block mb-0.5">Applied on</strong> {new Date(m.created_at).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                        m.status === 'Approved' ? 'bg-green-100 text-green-800 border-green-200' : 
                        m.status === 'Rejected' ? 'bg-red-100 text-red-800 border-red-200' : 
                        'bg-yellow-100 text-yellow-800 border-yellow-200'
                      }`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-3">
                        <select 
                           value={m.status}
                           onChange={(e) => handleUpdateRegisteredMemberStatus(m.id, e.target.value)}
                           className="text-xs border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 py-1"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Approved">Approved</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                        <div className="w-px h-6 bg-gray-200"></div>
                        <DeleteConfirmButton onDelete={() => handleDeleteRegisteredMember(m.id)} memberName={m.first_name} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function UploadsSection({ uploads, selectedFile, setSelectedFile, handleFileUpload }) {
  const uploadsList = Array.isArray(uploads) ? uploads : [];

  return (
    <div>
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">File Upload</h4>
          <form onSubmit={handleFileUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select File</label>
              <input
                type="file"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                accept="image/*"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Upload File
            </button>
          </form>

          <div className="mt-8">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Uploaded Files</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {uploadsList.length === 0 ? (
                <p className="text-sm text-gray-500 col-span-full">No files uploaded yet.</p>
              ) : (
                uploadsList.map((upload) => (
                  <div key={upload.id} className="border border-gray-200 rounded-md p-4">
                    <img
                      src={upload.url}
                      alt="Uploaded file"
                      className="w-full h-32 object-cover rounded-md mb-2"
                    />
                    <p className="text-xs text-gray-500">
                      Uploaded: {new Date(upload.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ChurchPastorsSection({
  churchPastors,
  churchPastorForm,
  setChurchPastorForm,
  handleChurchPastorSubmit,
  editChurchPastor,
  handleDeleteChurchPastor,
  token,
}) {
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <form onSubmit={handleChurchPastorSubmit} className="bg-gray-50 rounded-lg p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              {churchPastorForm.id ? 'Edit Pastor' : 'Add New Pastor'}
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  value={churchPastorForm.name}
                  onChange={(e) => setChurchPastorForm({ ...churchPastorForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <input
                  value={churchPastorForm.role}
                  onChange={(e) => setChurchPastorForm({ ...churchPastorForm, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <ImageUploadInput
                label="Photo"
                value={churchPastorForm.image_url}
                onChange={(url) => setChurchPastorForm({ ...churchPastorForm, image_url: url })}
                token={token}
              />
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="church_pastor_is_active"
                  checked={churchPastorForm.is_active}
                  onChange={(e) => setChurchPastorForm({ ...churchPastorForm, is_active: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="church_pastor_is_active" className="ml-2 block text-sm text-gray-900">Active</label>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {churchPastorForm.id ? 'Update Pastor' : 'Create Pastor'}
              </button>
            </div>
          </form>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow">
            <div className="px-4 py-5 sm:p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Existing Pastors</h4>
              <div className="space-y-3">
                {churchPastors.length === 0 ? (
                  <p className="text-sm text-gray-500">No pastors added yet.</p>
                ) : (
                  churchPastors.map((pastor) => (
                    <div key={pastor.id} className="border border-gray-200 rounded-md p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                          {pastor.image_url && (
                            <img src={pastor.image_url} className="w-16 h-16 rounded object-cover" alt={pastor.name} />
                          )}
                          <div>
                            <h5 className="text-sm font-medium text-gray-900">{pastor.name}</h5>
                            <p className="text-sm text-gray-500">{pastor.role}</p>
                            <p className="text-xs mt-1">
                               <span className={`px-2 py-1 rounded text-xs font-semibold ${pastor.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                  {pastor.is_active ? 'Active' : 'Inactive'}
                               </span>
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            type="button"
                            onClick={() => editChurchPastor(pastor)}
                            className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteChurchPastor(pastor)}
                            className="text-red-600 hover:text-red-900 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AboutUsSection({
  homeForm,
  setHomeForm,
  homeSectionOptions,
  loadHomeSectionIntoForm,
  handleSaveHomeSection,
  token,
}) {
  // Ensure the section is set to aboutus on load
  useEffect(() => {
    if (homeForm.sectionKey !== 'aboutus') {
      loadHomeSectionIntoForm('aboutus');
    }
  }, [homeForm.sectionKey, loadHomeSectionIntoForm]);

  return (
    <form onSubmit={handleSaveHomeSection} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            About Us Content
          </h4>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title / Name</label>
              <textarea
                name="title"
                id="title"
                rows={2}
                value={homeForm.title || ''}
                onChange={(e) => setHomeForm({ ...homeForm, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter Name or Title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle / Small Heading</label>
              <input
                type="text"
                name="subtitle"
                id="subtitle"
                value={homeForm.subtitle || ''}
                onChange={(e) => setHomeForm({ ...homeForm, subtitle: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter Subtitle"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                id="description"
                rows={4}
                value={homeForm.description || ''}
                onChange={(e) => setHomeForm({ ...homeForm, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter description"
              />
            </div>
            
            <ImageUploadInput
              label="Image"
              value={homeForm.image_url}
              onChange={(url) => setHomeForm({ ...homeForm, image_url: url })}
              token={token}
            />
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save About Us Section
          </button>
        </div>
      </div>
    </form>
  );
}
