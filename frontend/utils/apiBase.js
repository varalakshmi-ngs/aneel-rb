export function getApiBase() {
  if (process.env.NEXT_PUBLIC_ADMIN_API_URL) {
    return process.env.NEXT_PUBLIC_ADMIN_API_URL;
  }

  // Fallback to local backend during development or local preview.
  return 'http://localhost:4000/api';
}

