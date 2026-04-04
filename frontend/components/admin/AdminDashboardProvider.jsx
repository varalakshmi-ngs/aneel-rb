'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  fetchHomeSections,
  saveHomeSection,
  fetchEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  fetchGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  fetchPccMembers,
  lookupPccMember,
  createPccMember,
  updatePccMember,
  deletePccMember,
  updatePccMemberStatus,
  fetchMembers,
  createMember,
  updateMember,
  deleteMember,
  fetchContacts,
  uploadFile,
  fetchUploads,
  fetchChurchPastors,
  createChurchPastor,
  updateChurchPastor,
  deleteChurchPastor,
} from '@/utils/adminApi';

const AdminDashboardContext = createContext(null);

const initialHomeForm = {
  sectionKey: 'hero',
  title: '',
  subtitle: '',
  description: '',
  image_url: '',
  heroPastorName: '',
  heroPastorImage: '',
  pastors: [],
};

const initialEventForm = {
  id: null,
  title: '',
  description: '',
  event_date: '',
  location: '',
  image_url: '',
  is_active: true,
};

const initialGalleryForm = {
  id: null,
  title: '',
  description: '',
  image_url: '',
  category: '',
};

const initialPccForm = {
  id: null,
  name: '',
  role: '',
  bio: '',
  photo_url: '',
  mobile: '',
  email: '',
  family_details: [''],
  passcode: '',
  social_links: [],
  status: 'pending',
};

const initialLookupForm = {
  name: '',
  role: '',
  bio: '',
  photo_url: '',
  mobile: '',
  email: '',
  family_details: [''],
};

const initialMemberForm = {
  id: null,
  name: '',
  role: '',
  bio: '',
  photo_url: '',
  email: '',
  phone: '',
  address: '',
};

const initialChurchPastorForm = {
  id: null,
  name: '',
  role: 'Pastor',
  image_url: '',
  is_active: true,
};

export function AdminDashboardProvider({ children }) {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [homeSections, setHomeSections] = useState([]);
  const [homeForm, setHomeForm] = useState(initialHomeForm);

  const [events, setEvents] = useState([]);
  const [eventForm, setEventForm] = useState(initialEventForm);

  const [gallery, setGallery] = useState([]);
  const [galleryForm, setGalleryForm] = useState(initialGalleryForm);

  const [pccMembers, setPccMembers] = useState([]);
  const [pccForm, setPccForm] = useState(initialPccForm);

  const [members, setMembers] = useState([]);
  const [memberForm, setMemberForm] = useState(initialMemberForm);

  const [churchPastors, setChurchPastors] = useState([]);
  const [churchPastorForm, setChurchPastorForm] = useState(initialChurchPastorForm);

  const [contacts, setContacts] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [lookupForm, setLookupForm] = useState(initialLookupForm);
  const [lookupCreateResult, setLookupCreateResult] = useState(null);
  const [lookupCreateError, setLookupCreateError] = useState('');
  const [lookupCreateLoading, setLookupCreateLoading] = useState(false);
  const [lookupPasscode, setLookupPasscode] = useState('');
  const [lookupMember, setLookupMember] = useState(null);
  const [lookupError, setLookupError] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);

  const homeSectionOptions = useMemo(() => {
    const fromDb = homeSections
      .map((s) => s.section_key)
      .filter((k) => Boolean(k) && k !== 'weekly_timetable');
    const predefined = ['hero', 'pastors', 'aboutus'];
    return Array.from(new Set([...predefined, ...fromDb])).sort();
  }, [homeSections]);

  const loadAllData = useCallback(async () => {
    if (!token) {
      return;
    }

    setLoading(true);
    try {
      const [homeData, eventsData, galleryData, pccData, membersData, contactsData, uploadsData, churchPastorsData] = await Promise.all([
        fetchHomeSections(token),
        fetchEvents(token),
        fetchGallery(token),
        fetchPccMembers(token),
        fetchMembers(token),
        fetchContacts(token),
        fetchUploads(token),
        fetchChurchPastors(token),
      ]);

      setHomeSections(homeData);
      setEvents(eventsData);
      setGallery(galleryData);
      setPccMembers(pccData);
      setMembers(membersData);
      setContacts(contactsData);
      setUploads(uploadsData);
      setChurchPastors(churchPastorsData);

      if (homeData.length > 0) {
        const first = homeData[0];
        setHomeForm({
          sectionKey: first.section_key || 'hero',
          title: first.title || '',
          subtitle: first.subtitle || '',
          description: first.description || '',
          image_url: first.image_url || '',
          heroPastorName: first.hero_pastor_name || '',
          heroPastorImage: first.hero_pastor_image_url || '',
          pastors: Array.isArray(first.pastors) ? first.pastors : [],
        });
      }
    } catch (error) {
      if (error && (error.status === 401 || error.status === 403)) {
        setStatusMessage('Session expired. Please sign in again.');
        localStorage.removeItem('adminToken');
        setToken('');
        router.push('/admin/login');
        return;
      }
      setStatusMessage(error.message || 'Unable to load admin data.');
    } finally {
      setLoading(false);
    }
  }, [router, token]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('adminToken');
      if (saved) {
        setToken(saved);
      } else {
        router.push('/admin/login');
      }
    }
  }, [router]);

  useEffect(() => {
    if (token) {
      loadAllData();
    }
  }, [token, loadAllData]);

  const loadHomeSectionIntoForm = useCallback(
    (sectionKey) => {
      const match = homeSections.find((s) => s.section_key === sectionKey);
      if (!match) {
        setHomeForm({ ...initialHomeForm, sectionKey });
        return;
      }

      setHomeForm({
        sectionKey,
        title: match.title || '',
        subtitle: match.subtitle || '',
        description: match.description || '',
        image_url: match.image_url || '',
        heroPastorName: match.hero_pastor_name || '',
        heroPastorImage: match.hero_pastor_image_url || '',
        pastors: Array.isArray(match.pastors) ? match.pastors : [],
      });
    },
    [homeSections]
  );

  async function handleSaveHomeSection(event) {
    event.preventDefault();
    setStatusMessage('Saving home content...');

    try {
      await saveHomeSection(token, {
        ...homeForm,
        hero_pastor_name: homeForm.heroPastorName,
        hero_pastor_image_url: homeForm.heroPastorImage,
        pastors: homeForm.pastors,
      });
      setStatusMessage('Home section saved successfully.');
      await loadAllData();
    } catch (error) {
      setStatusMessage(error.message || 'Saving home content failed.');
    }
  }

  async function handleEventSubmit(event) {
    event.preventDefault();
    setStatusMessage('Saving event...');

    try {
      if (eventForm.id) {
        await updateEvent(token, eventForm.id, eventForm);
        setStatusMessage('Event updated successfully.');
      } else {
        await createEvent(token, eventForm);
        setStatusMessage('Event created successfully.');
      }
      setEventForm(initialEventForm);
      await loadAllData();
    } catch (error) {
      setStatusMessage(error.message || 'Saving event failed.');
    }
  }

  function editEvent(item) {
    setEventForm({
      id: item.id,
      title: item.title || '',
      description: item.description || '',
      event_date: item.event_date || '',
      location: item.location || '',
      image_url: item.image_url || '',
      is_active: item.is_active === 1 || item.is_active === true,
    });
  }

  async function handleDeleteEvent(item) {
    if (!confirm('Delete this event?')) {
      return;
    }
    setStatusMessage('Deleting event...');
    try {
      await deleteEvent(token, item.id);
      setStatusMessage('Event deleted.');
      await loadAllData();
    } catch (error) {
      setStatusMessage(error.message || 'Could not delete event.');
    }
  }

  async function handleGallerySubmit(event) {
    event.preventDefault();
    setStatusMessage('Saving gallery item...');

    try {
      if (galleryForm.id) {
        await updateGalleryItem(token, galleryForm.id, galleryForm);
        setStatusMessage('Gallery item updated successfully.');
      } else {
        await createGalleryItem(token, galleryForm);
        setStatusMessage('Gallery item created successfully.');
      }
      setGalleryForm(initialGalleryForm);
      await loadAllData();
    } catch (error) {
      setStatusMessage(error.message || 'Saving gallery item failed.');
    }
  }

  function editGalleryItem(item) {
    setGalleryForm({
      id: item.id,
      title: item.title || '',
      description: item.description || '',
      image_url: item.image_url || '',
      category: item.category || '',
    });
  }

  async function handleDeleteGallery(item) {
    if (!confirm('Delete this gallery item?')) return;
    setStatusMessage('Deleting gallery item...');
    try {
      await deleteGalleryItem(token, item.id);
      setStatusMessage('Gallery item deleted.');
      await loadAllData();
    } catch (error) {
      setStatusMessage(error.message || 'Could not delete gallery item.');
    }
  }

  async function handlePccSubmit(event) {
    event.preventDefault();
    setStatusMessage('Saving PCC member...');

    try {
      if (pccForm.id) {
        await updatePccMember(token, pccForm.id, pccForm);
        setStatusMessage('PCC member updated successfully.');
      } else {
        const data = await createPccMember(token, pccForm);
        setStatusMessage(`PCC member created successfully. Passcode: ${data.passcode || 'ROBO-XXXXX'}`);
      }
      setPccForm(initialPccForm);
      await loadAllData();
    } catch (error) {
      setStatusMessage(error.message || 'Saving PCC member failed.');
    }
  }

  async function handleLookupSubmit(event) {
    event.preventDefault();
    setLookupError('');
    setLookupMember(null);
    const query = lookupPasscode.trim();
    if (!query) {
      setLookupError('Please enter a passcode to lookup.');
      return;
    }

    setLookupLoading(true);
    try {
      const member = await lookupPccMember(token, query);
      setLookupMember(member);
      setLookupError('');
    } catch (error) {
      setLookupError(error.message || 'Lookup failed.');
    } finally {
      setLookupLoading(false);
    }
  }

  async function handleLookupCreate(event) {
    event.preventDefault();
    setLookupCreateError('');
    setLookupCreateResult(null);

    if (!lookupForm.name.trim()) {
      setLookupCreateError('PCC member name is required.');
      return;
    }

    setLookupCreateLoading(true);
    try {
      const data = await createPccMember(token, lookupForm);
      setLookupCreateResult({
        ...lookupForm,
        passcode: data.passcode,
      });
      setLookupForm(initialLookupForm);
      setStatusMessage(`PCC member created successfully. Passcode: ${data.passcode}`);
      await loadAllData();
    } catch (error) {
      setLookupCreateError(error.message || 'Could not create PCC member.');
    } finally {
      setLookupCreateLoading(false);
    }
  }

  function editPccMember(item) {
    let familyDetails = [''];
    if (Array.isArray(item.family_details)) {
      familyDetails = item.family_details;
    } else if (typeof item.family_details === 'string') {
      try {
        familyDetails = JSON.parse(item.family_details);
      } catch {
        familyDetails = item.family_details ? [item.family_details] : [''];
      }
    }

    setPccForm({
      id: item.id,
      name: item.name || '',
      role: item.role || '',
      bio: item.bio || '',
      photo_url: item.photo_url || '',
      mobile: item.mobile || '',
      email: item.email || '',
      family_details: familyDetails.length ? familyDetails : [''],
      passcode: item.passcode || '',
      social_links: Array.isArray(item.social_links) ? item.social_links : [],
      status: item.status || 'pending',
    });
  }

  async function handlePccStatusChange(id, newStatus) {
    if (!token) return;
    setStatusMessage(`Updating status to ${newStatus}...`);
    try {
      await updatePccMemberStatus(token, id, newStatus);
      setStatusMessage(`Member status updated to ${newStatus}.`);
      await loadAllData();
    } catch (error) {
      setStatusMessage(error.message || 'Could not update status.');
    }
  }

  async function handleDeletePcc(item) {
    if (!confirm('Delete this PCC member?')) return;
    setStatusMessage('Deleting PCC member...');
    try {
      await deletePccMember(token, item.id);
      setStatusMessage('PCC member deleted.');
      await loadAllData();
    } catch (error) {
      setStatusMessage(error.message || 'Could not delete this PCC member.');
    }
  }

  async function handleMemberSubmit(event) {
    event.preventDefault();
    setStatusMessage('Saving member...');

    try {
      if (memberForm.id) {
        await updateMember(token, memberForm.id, memberForm);
        setStatusMessage('Member updated successfully.');
      } else {
        await createMember(token, memberForm);
        setStatusMessage('Member created successfully.');
      }
      setMemberForm(initialMemberForm);
      await loadAllData();
    } catch (error) {
      setStatusMessage(error.message || 'Saving member failed.');
    }
  }

  function editMember(item) {
    setMemberForm({
      id: item.id,
      name: item.name || '',
      role: item.role || '',
      bio: item.bio || '',
      photo_url: item.photo_url || '',
      email: item.email || '',
      phone: item.phone || '',
      address: item.address || '',
    });
  }

  async function handleDeleteMember(item) {
    if (!confirm('Delete this member?')) return;
    setStatusMessage('Deleting member...');
    try {
      await deleteMember(token, item.id);
      setStatusMessage('Member deleted.');
      await loadAllData();
    } catch (error) {
      setStatusMessage(error.message || 'Could not delete member.');
    }
  }

  async function handleChurchPastorSubmit(event) {
    event.preventDefault();
    setStatusMessage('Saving church pastor...');

    try {
      if (churchPastorForm.id) {
        await updateChurchPastor(token, churchPastorForm.id, churchPastorForm);
        setStatusMessage('Church pastor updated successfully.');
      } else {
        await createChurchPastor(token, churchPastorForm);
        setStatusMessage('Church pastor created successfully.');
      }
      setChurchPastorForm(initialChurchPastorForm);
      await loadAllData();
    } catch (error) {
      setStatusMessage(error.message || 'Saving church pastor failed.');
    }
  }

  function editChurchPastor(item) {
    setChurchPastorForm({
      id: item.id,
      name: item.name || '',
      role: item.role || '',
      image_url: item.image_url || '',
      is_active: item.is_active === 1 || item.is_active === true,
    });
  }

  async function handleDeleteChurchPastor(item) {
    if (!confirm('Delete this church pastor?')) return;
    setStatusMessage('Deleting church pastor...');
    try {
      await deleteChurchPastor(token, item.id);
      setStatusMessage('Church pastor deleted.');
      await loadAllData();
    } catch (error) {
      setStatusMessage(error.message || 'Could not delete church pastor.');
    }
  }

  async function handleFileUpload(event) {
    event.preventDefault();
    if (!selectedFile) {
      setStatusMessage('Select a file to upload.');
      return;
    }
    setStatusMessage('Uploading file...');

    try {
      await uploadFile(token, selectedFile);
      setSelectedFile(null);
      setStatusMessage('File uploaded successfully.');
      await loadAllData();
    } catch (error) {
      setStatusMessage(error.message || 'File upload failed.');
    }
  }

  return (
    <AdminDashboardContext.Provider
      value={{
        token,
        statusMessage,
        loading,
        homeSections,
        homeForm,
        setHomeForm,
        homeSectionOptions,
        loadHomeSectionIntoForm,
        handleSaveHomeSection,
        events,
        eventForm,
        setEventForm,
        handleEventSubmit,
        editEvent,
        handleDeleteEvent,
        gallery,
        galleryForm,
        setGalleryForm,
        handleGallerySubmit,
        editGalleryItem,
        handleDeleteGallery,
        contacts,
        pccMembers,
        pccForm,
        setPccForm,
        handlePccSubmit,
        editPccMember,
        handleDeletePcc,
        handlePccStatusChange,
        members,
        memberForm,
        setMemberForm,
        handleMemberSubmit,
        editMember,
        handleDeleteMember,
        churchPastors,
        churchPastorForm,
        setChurchPastorForm,
        handleChurchPastorSubmit,
        editChurchPastor,
        handleDeleteChurchPastor,
        uploads,
        selectedFile,
        setSelectedFile,
        handleFileUpload,
        lookupForm,
        setLookupForm,
        lookupCreateResult,
        lookupCreateError,
        lookupCreateLoading,
        lookupPasscode,
        setLookupPasscode,
        lookupMember,
        lookupError,
        lookupLoading,
        handleLookupCreate,
        handleLookupSubmit,
      }}
    >
      {children}
    </AdminDashboardContext.Provider>
  );
}

export function useAdminDashboard() {
  const context = useContext(AdminDashboardContext);
  if (!context) {
    throw new Error('useAdminDashboard must be used within AdminDashboardProvider');
  }
  return context;
}
