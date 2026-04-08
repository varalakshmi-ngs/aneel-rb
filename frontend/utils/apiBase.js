export function getApiBase() {
  if (process.env.NEXT_PUBLIC_ADMIN_API_URL) {
    return process.env.NEXT_PUBLIC_ADMIN_API_URL;
  }

  // In production, use the backend URL
  if (process.env.NODE_ENV === 'production') {
    return 'https://robochurch.nuhvin.com/api';
  }

  // In development, use the same origin so deployed builds do not hardcode localhost.
  // This allows the frontend to call the backend through the current host path.
  return '/api';
}

