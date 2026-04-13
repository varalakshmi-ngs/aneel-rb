export function getApiBase() {
  if (process.env.NEXT_PUBLIC_ADMIN_API_URL) {
    return process.env.NEXT_PUBLIC_ADMIN_API_URL;
  }

  // In production, use the backend URL
  if (process.env.NODE_ENV === 'production') {
    return 'https://robochurch.nuhvin.com/api';
  }

  // In development, call the backend directly on localhost:4000
  return 'http://localhost:4000/api';
}

