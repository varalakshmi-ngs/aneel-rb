import { useEffect } from 'react';
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Section key</label>
              <select
                value={homeForm.sectionKey}
                onChange={(e) => loadHomeSectionIntoForm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
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
                    placeholder="Enter subtitle"
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

                <div className="mt-4">
                  <h4 className="text-md font-medium text-gray-900 mb-2">Hero Pastor Settings</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hero Pastor Name</label>
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                        <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                        <input
                          value={currentName}
                          onChange={(e) => {
                            const nextPastors = [...homeForm.pastors];
                            const nextCurrent = nextPastors[idx] && typeof nextPastors[idx] === 'object' ? { ...nextPastors[idx] } : {};
                            nextCurrent.name = e.target.value;
                            nextPastors[idx] = nextCurrent;
                            setHomeForm({ ...homeForm, pastors: nextPastors });
                          }}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Date</label>
                <input
                  type="date"
                  value={eventForm.event_date}
                  onChange={(e) => setEventForm({ ...eventForm, event_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  value={eventForm.location}
                  onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={4}
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
              {galleryForm.id ? 'Edit Gallery Item' : 'Add New Gallery Item'}
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  value={galleryForm.title}
                  onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <input
                  value={galleryForm.category}
                  onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Events, Church, Community"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={3}
                  value={galleryForm.description}
                  onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <ImageUploadInput
                label="Image"
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
                          alt={item.title}
                          className="w-full h-32 object-cover rounded-md mb-3"
                        />
                      )}
                      <h5 className="text-sm font-medium text-gray-900 mb-1">{item.title}</h5>
                      {item.category && (
                        <p className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full inline-block mb-2">
                          {item.category}
                        </p>
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

export function PccSection({
  pccMembers,
  pccForm,
  setPccForm,
  handlePccSubmit,
  editPccMember,
  handleDeletePcc,
  handlePccStatusChange,
  token,
}) {
  return (
    <div>
      <div className={`grid grid-cols-1 ${pccForm.id ? 'lg:grid-cols-2' : ''} gap-6`}>
        {pccForm.id && (
          <div>
            <form onSubmit={handlePccSubmit} className="bg-gray-50 rounded-lg p-6 shadow-sm border border-blue-100">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-medium text-blue-900">
                  Edit PCC Member
                </h4>
                <button
                  type="button"
                  onClick={() => setPccForm({ name: '', role: '', bio: '', photo_url: '', mobile: '', email: '', family_details: [''], social_links: [] })}
                  className="text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  value={pccForm.name}
                  onChange={(e) => setPccForm({ ...pccForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <input
                  value={pccForm.role}
                  onChange={(e) => setPccForm({ ...pccForm, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  rows={3}
                  value={pccForm.bio}
                  onChange={(e) => setPccForm({ ...pccForm, bio: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <ImageUploadInput
                label="Photo"
                value={pccForm.photo_url}
                onChange={(url) => setPccForm({ ...pccForm, photo_url: url })}
                token={token}
              />

              {pccForm.id && pccForm.passcode && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <p className="text-sm font-medium text-blue-800">Generated Passcode</p>
                  <p className="text-lg font-semibold text-blue-900 mt-1">{pccForm.passcode}</p>
                  <p className="text-xs text-blue-700 mt-1">This passcode can be used in Member Lookup.</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={pccForm.email}
                  onChange={(e) => setPccForm({ ...pccForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                <input
                  type="tel"
                  value={pccForm.mobile}
                  onChange={(e) => setPccForm({ ...pccForm, mobile: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Mobile number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Family Details</label>
                <div className="space-y-2">
                  {pccForm.family_details.map((detail, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={detail}
                        onChange={(e) => {
                          const nextFamily = [...pccForm.family_details];
                          nextFamily[index] = e.target.value;
                          setPccForm({ ...pccForm, family_details: nextFamily });
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Family detail"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const nextFamily = pccForm.family_details.filter((_, i) => i !== index);
                          setPccForm({ ...pccForm, family_details: nextFamily.length ? nextFamily : [''] });
                        }}
                        className="px-3 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setPccForm({ ...pccForm, family_details: [...pccForm.family_details, ''] })}
                  className="mt-2 px-3 py-2 bg-green-500 text-white rounded-md text-sm hover:bg-green-600"
                >
                  Add Family Detail
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Social Links</label>
                {pccForm.social_links.map((link, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <select
                      value={link.platform || ''}
                      onChange={(e) => {
                        const newLinks = [...pccForm.social_links];
                        newLinks[index] = { ...newLinks[index], platform: e.target.value };
                        setPccForm({ ...pccForm, social_links: newLinks });
                      }}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="">Platform</option>
                      <option value="facebook">Facebook</option>
                      <option value="twitter">Twitter</option>
                      <option value="instagram">Instagram</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="youtube">YouTube</option>
                    </select>
                    <input
                      type="url"
                      placeholder="URL"
                      value={link.url || ''}
                      onChange={(e) => {
                        const newLinks = [...pccForm.social_links];
                        newLinks[index] = { ...newLinks[index], url: e.target.value };
                        setPccForm({ ...pccForm, social_links: newLinks });
                      }}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newLinks = pccForm.social_links.filter((_, i) => i !== index);
                        setPccForm({ ...pccForm, social_links: newLinks });
                      }}
                      className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setPccForm({
                      ...pccForm,
                      social_links: [...pccForm.social_links, { platform: '', url: '' }],
                    });
                  }}
                  className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                >
                  Add Social Link
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {pccForm.id ? 'Update PCC Member' : 'Create PCC Member'}
              </button>
            </div>
          </form>
        </div>
        )}

        <div>
          <div className="bg-white rounded-lg shadow">
            <div className="px-4 py-5 sm:p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">PCC Members</h4>
              <div className="space-y-3">
                {pccMembers.length === 0 ? (
                  <p className="text-sm text-gray-500">No PCC members added yet.</p>
                ) : (
                  pccMembers.map((member) => (
                    <div key={member.id} className="border border-gray-200 rounded-md p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h5 className="text-sm font-medium text-gray-900">{member.name}</h5>
                          <p className="text-sm text-gray-500">{member.role}</p>
                          {member.passcode && (
                            <p className="text-xs text-blue-600 mt-1">Passcode: {member.passcode}</p>
                          )}
                          {member.status && (
                            <p className="mt-1">
                              <span
                                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                  member.status === 'active'
                                    ? 'bg-green-100 text-green-800'
                                    : member.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                              </span>
                            </p>
                          )}
                          {(member.email || member.mobile) && (
                            <p className="text-xs text-gray-500 mt-1">
                              {member.email ? `${member.email}${member.mobile ? ' • ' : ''}` : ''}
                              {member.mobile ? member.mobile : ''}
                            </p>
                          )}
                          {member.bio && (
                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{member.bio}</p>
                          )}
                        </div>
                        <div className="flex flex-col space-y-2 ml-4">
                          <div className="flex space-x-2">
                            {member.status !== 'active' && (
                              <button
                                type="button"
                                onClick={() => handlePccStatusChange(member.id, 'active')}
                                className="text-green-600 hover:text-green-900 text-sm font-medium"
                              >
                                Approve
                              </button>
                            )}
                            {member.status !== 'suspended' && member.status !== 'pending' && (
                              <button
                                type="button"
                                onClick={() => handlePccStatusChange(member.id, 'suspended')}
                                className="text-yellow-600 hover:text-yellow-900 text-sm font-medium"
                              >
                                Suspend
                              </button>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <button
                              type="button"
                              onClick={() => editPccMember(member)}
                              className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeletePcc(member)}
                              className="text-red-600 hover:text-red-900 text-sm font-medium"
                            >
                              Delete
                            </button>
                          </div>
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

export function LookupSection({ pccMembers, handlePccStatusChange, handleDeletePcc }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-xl font-bold text-gray-900">Manage PCC Registrations</h4>
            <p className="text-sm text-gray-500 mt-1">Review, approve, or suspend incoming PCC member registrations seamlessly.</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm text-sm font-medium text-gray-600 flex items-center">
            Total registrations: <span className="text-blue-600 font-bold ml-2 text-lg">{pccMembers.length}</span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Applicant</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Contact Info</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Passcode</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider rounded-tr-2xl">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-50">
              {pccMembers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <p className="text-lg font-semibold text-gray-900">No registrations found</p>
                      <p className="text-sm text-gray-500 mt-1">There are no pending or active PCC members at the moment.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                pccMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {member.photo_url ? (
                          <img className="h-12 w-12 rounded-xl object-cover border border-gray-200 shadow-sm" src={member.photo_url} alt="" />
                        ) : (
                          <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-lg shadow-sm border border-blue-100">
                            {member.name?.charAt(0) || '?'}
                          </div>
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-bold text-gray-900">{member.name}</div>
                          <div className="text-xs font-medium text-gray-500 mt-1">{member.role || 'Unspecified Role'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1.5">
                        <div className="flex items-center text-sm text-gray-700">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                          {member.email || 'N/A'}
                        </div>
                        <div className="flex items-center text-xs font-medium text-gray-500">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                          {member.mobile || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex px-3 py-1.5 rounded-lg text-sm font-semibold bg-gray-100 text-gray-800 font-mono tracking-widest border border-gray-200">
                        {member.passcode || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`inline-flex flex-col items-center justify-center px-4 py-1.5 rounded-full text-xs font-bold border ${
                          member.status === 'active'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : member.status === 'pending'
                            ? 'bg-yellow-50 text-yellow-700 border-yellow-200 shadow-[0_0_10px_rgba(253,224,71,0.4)]'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}
                      >
                        <div className="flex items-center">
                          {member.status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>}
                          {member.status === 'pending' && <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-2 animate-pulse"></span>}
                          {member.status === 'suspended' && <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2"></span>}
                          {member.status ? member.status.toUpperCase() : 'PENDING'}
                        </div>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex items-center justify-end space-x-2">
                        {member.status !== 'active' && (
                          <button
                            type="button"
                            onClick={() => handlePccStatusChange(member.id, 'active')}
                            title="Approve"
                            className="p-2 rounded-xl text-white bg-green-500 hover:bg-green-600 focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all shadow-sm transform hover:-translate-y-0.5"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                          </button>
                        )}
                        {member.status !== 'suspended' && member.status !== 'pending' && (
                          <button
                            type="button"
                            onClick={() => handlePccStatusChange(member.id, 'suspended')}
                            title="Suspend"
                            className="p-2 rounded-xl text-white bg-yellow-500 hover:bg-yellow-600 focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all shadow-sm transform hover:-translate-y-0.5"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>
                          </button>
                        )}
                        <span className="w-px h-6 bg-gray-200 mx-1"></span>
                        <button
                          type="button"
                          onClick={() => handleDeletePcc(member)}
                          className="p-2 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-100 transition-all"
                          title="Delete Registration"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
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

export function MembersSection({
  members,
  memberForm,
  setMemberForm,
  handleMemberSubmit,
  editMember,
  handleDeleteMember,
  token,
}) {
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <form onSubmit={handleMemberSubmit} className="bg-gray-50 rounded-lg p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              {memberForm.id ? 'Edit Member' : 'Add New Member'}
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  value={memberForm.name}
                  onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <input
                  value={memberForm.role}
                  onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  rows={3}
                  value={memberForm.bio}
                  onChange={(e) => setMemberForm({ ...memberForm, bio: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <ImageUploadInput
                label="Photo"
                value={memberForm.photo_url}
                onChange={(url) => setMemberForm({ ...memberForm, photo_url: url })}
                token={token}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={memberForm.email}
                  onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={memberForm.phone}
                  onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea
                  rows={2}
                  value={memberForm.address}
                  onChange={(e) => setMemberForm({ ...memberForm, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {memberForm.id ? 'Update Member' : 'Create Member'}
              </button>
            </div>
          </form>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow">
            <div className="px-4 py-5 sm:p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Members</h4>
              <div className="space-y-3">
                {members.length === 0 ? (
                  <p className="text-sm text-gray-500">No members added yet.</p>
                ) : (
                  members.map((member) => (
                    <div key={member.id} className="border border-gray-200 rounded-md p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h5 className="text-sm font-medium text-gray-900">{member.name}</h5>
                          <p className="text-sm text-gray-500">{member.role}</p>
                          {member.bio && (
                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{member.bio}</p>
                          )}
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            type="button"
                            onClick={() => editMember(member)}
                            className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteMember(member)}
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

export function UploadsSection({ uploads, selectedFile, setSelectedFile, handleFileUpload }) {
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
              {uploads.length === 0 ? (
                <p className="text-sm text-gray-500 col-span-full">No files uploaded yet.</p>
              ) : (
                uploads.map((upload) => (
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
