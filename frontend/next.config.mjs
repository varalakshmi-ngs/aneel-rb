/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
      },
      // Backend upload images (admin uploads served by Express at /uploads)
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/api/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
        pathname: '/api/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '127.0.0.1',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        pathname: '/api/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '127.0.0.1',
        pathname: '/api/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'robochurch.nuhvin.com',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'robochurch.nuhvin.com',
        pathname: '/api/uploads/**',
      },
    ],
  },
};

export default nextConfig;
