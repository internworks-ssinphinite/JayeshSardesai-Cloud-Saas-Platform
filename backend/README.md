SS Infinite - Backend

Setup
1. Copy `.env.example` to `.env` and fill in your values (DATABASE_URL, JWT_SECRET).
2. Create the Postgres database and run the SQL in `db/schema.sql`.
3. Install dependencies: `npm install`.
4. Run the server: `npm run dev` (requires nodemon) or `npm start`.

Endpoints
- POST /api/auth/register { email, password } -> { token }
- POST /api/auth/login { email, password } -> { token }
- GET /api/dashboard (Authorization: Bearer <token>) -> { message, userEmail }
