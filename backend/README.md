# Backend API

This backend is built with Node.js, Express, and MySQL. It provides admin-managed endpoints for:

- Home section content
- Event management
- Gallery items
- PCC members
- Members
- Contact form submissions
- File uploads

## Setup

1. Copy `.env.example` to `.env` and adjust database credentials.
2. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Start the backend:
   ```bash
   npm run dev
   ```

## MySQL

Use `backend/sql/schema.sql` to initialize the database schema manually if needed.

## Default admin

The server will create a default admin when the database is empty.

- `ADMIN_USERNAME=admin`
- `ADMIN_PASSWORD=admin123`

Change these values in your `.env` before starting the server.
