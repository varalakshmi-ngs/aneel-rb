const API_BASE = process.env.NEXT_PUBLIC_ADMIN_API_URL || '/api';

async function fetchJson(path) {
  const res = await fetch(`${API_BASE}${path}`, { cache: 'no-store' });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `Failed to fetch ${path}`);
  }
  return res.json();
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
