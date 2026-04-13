import { getApiBase } from '@/utils/apiBase';

const API_BASE = getApiBase();

async function fetchJson(path) {
  const res = await fetch(`${API_BASE}${path}`, { cache: 'no-store' });
  const contentType = res.headers.get('content-type') || '';
  let data = {};

  if (contentType.includes('application/json')) {
    data = await res.json().catch(() => ({}));
  }

  if (!res.ok) {
    throw new Error(data.message || `Failed to fetch ${path}`);
  }
  return data;
}

export async function fetchHomeSections() {
  return fetchJson('/home');
}

export async function fetchEvents() {
  return fetchJson('/events');
}

export async function fetchGalleryItems() {
  return fetchJson('/gallery');
}

export async function fetchPccMembers() {
  return fetchJson('/pcc-members');
}

export async function fetchMembers() {
  return fetchJson('/members');
}
