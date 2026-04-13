import { getApiBase } from '@/utils/apiBase';

const API_BASE = getApiBase();

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

function clearSavedTokenIfUnauthorized(status) {
  if (status !== 401 && status !== 403) return;
  if (typeof window === 'undefined') return;
  try {
    window.localStorage?.removeItem('adminToken');
  } catch {
    // ignore
  }
}

async function sendJson(path, method = 'GET', token, body) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    throw new ApiError(
      `Network request failed for ${API_BASE}${path}: ${error.message}`,
      0,
      { originalError: error }
    );
  }

  const contentType = res.headers.get('content-type') || '';
  let data = {};

  if (contentType.includes('application/json')) {
    data = await res.json().catch(() => ({}));
  }

  if (!res.ok) {
    clearSavedTokenIfUnauthorized(res.status);
    throw new ApiError(data.message || 'Request failed', res.status, data);
  }

  return data;
}

async function sendFormData(path, token, formData) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers,
    body: formData,
  });

  const contentType = res.headers.get('content-type') || '';
  let data = {};
  if (contentType.includes('application/json')) {
    data = await res.json().catch(() => ({}));
  }

  if (!res.ok) {
    clearSavedTokenIfUnauthorized(res.status);
    throw new ApiError(data.message || 'Upload failed', res.status, data);
  }
  return data;
}

export async function adminLogin(username, password) {
  return sendJson('/admin/login', 'POST', null, { username, password });
}

export async function fetchHomeSections(token) {
  return sendJson('/home', 'GET', token);
}

export async function saveHomeSection(token, payload) {
  return sendJson(`/home/${payload.sectionKey}`, 'PUT', token, payload);
}

export async function fetchEvents(token) {
  return sendJson('/events', 'GET', token);
}

export async function createEvent(token, payload) {
  return sendJson('/events', 'POST', token, payload);
}

export async function updateEvent(token, id, payload) {
  return sendJson(`/events/${id}`, 'PUT', token, payload);
}

export async function deleteEvent(token, id) {
  return sendJson(`/events/${id}`, 'DELETE', token);
}

export async function fetchGallery(token) {
  return sendJson('/gallery', 'GET', token);
}

export async function createGalleryItem(token, payload) {
  return sendJson('/gallery', 'POST', token, payload);
}

export async function updateGalleryItem(token, id, payload) {
  return sendJson(`/gallery/${id}`, 'PUT', token, payload);
}

export async function deleteGalleryItem(token, id) {
  return sendJson(`/gallery/${id}`, 'DELETE', token);
}

export async function fetchPccMembers(token) {
  return sendJson('/pcc-members', 'GET', token);
}

export async function lookupPccMember(token, passcode) {
  return sendJson(`/pcc-members/lookup?passcode=${encodeURIComponent(passcode)}`, 'GET', token);
}

export async function createPccMember(token, payload) {
  return sendJson('/pcc-members', 'POST', token, payload);
}

export async function updatePccMember(token, id, payload) {
  return sendJson(`/pcc-members/${id}`, 'PUT', token, payload);
}

export async function updatePccMemberStatus(token, id, status) {
  return sendJson(`/pcc-members/${id}/status`, 'PUT', token, { status });
}

export async function deletePccMember(token, id) {
  return sendJson(`/pcc-members/${id}`, 'DELETE', token);
}

export async function registerPccMember(payload) {
  return sendJson('/pcc-members/register', 'POST', null, payload);
}

export async function fetchMembers(token) {
  return sendJson('/members', 'GET', token);
}

export async function createMember(token, payload) {
  return sendJson('/members', 'POST', token, payload);
}

export async function updateMember(token, id, payload) {
  return sendJson(`/members/${id}`, 'PUT', token, payload);
}

export async function deleteMember(token, id) {
  return sendJson(`/members/${id}`, 'DELETE', token);
}

export async function fetchContacts(token) {
  return sendJson('/contact', 'GET', token);
}

export async function uploadFile(token, file) {
  const formData = new FormData();
  formData.append('file', file);
  return sendFormData('/upload', token, formData);
}

export async function uploadPublicFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  return sendFormData('/upload-public', null, formData);
}

export async function fetchUploads(token) {
  return sendJson('/uploads', 'GET', token);
}

export async function fetchChurchPastors(token) {
  return sendJson('/church-pastors', 'GET', token);
}

export async function createChurchPastor(token, payload) {
  return sendJson('/church-pastors', 'POST', token, payload);
}

export async function updateChurchPastor(token, id, payload) {
  return sendJson(`/church-pastors/${id}`, 'PUT', token, payload);
}

export async function deleteChurchPastor(token, id) {
  return sendJson(`/church-pastors/${id}`, 'DELETE', token);
}

export async function fetchAllRegisteredMembers(token) {
  return sendJson('/admin/members/all', 'GET', token);
}

export async function updateRegisteredMemberStatus(token, id, status) {
  return sendJson(`/admin/members/${id}/status`, 'PUT', token, { status });
}

export async function deleteRegisteredMember(token, id) {
  return sendJson(`/admin/members/${id}`, 'DELETE', token);
}
