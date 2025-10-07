# SS Infinite - Fullstack Starter

This workspace contains two projects:

- `ss-infinite-backend` - Express.js + PostgreSQL API
- `ss-infinite-frontend` - React.js frontend

Quickstart

1. Backend
   - cd into `ss-infinite-backend`
   - copy `.env.example` to `.env` and update `DATABASE_URL` and `JWT_SECRET`
   - create the Postgres database and run `db/schema.sql` to create the `users` table
   - npm install
   - npm run dev

2. Frontend
   - cd into `ss-infinite-frontend`
   - npm install
   - npm start

Notes
- The backend listens on the port set in `.env` (default 4000). The frontend expects the API under `/api` and can be proxied during development.
