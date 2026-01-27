# Learning-web Backend (Prototype)

This is a minimal Express + TypeScript backend for the Learning-web frontend. It's intentionally small and uses an in-memory store so you can prototype without a database.

Quick start

1. cd server
2. npm install
3. copy `.env.example` to `.env` and set `MONGODB_URI` and `JWT_SECRET`
4. npm run dev

Available endpoints

- GET / -> health check
- POST /api/auth/signup -> { email, password, name? }
- POST /api/auth/login -> { email, password }
- GET /api/lessons -> list of lessons
- GET /api/lessons/:id -> single lesson

Creating lessons (protected)

- POST /api/lessons -> { title, language, content } (requires Authorization: Bearer <token>)

Env

- Create a `.env` file in `server/` (or set env vars) with:

	MONGODB_URI, JWT_SECRET, PORT

Notes

- This is a prototype. Replace the in-memory store with a real DB and add proper auth before production.
- To integrate with the Vite frontend, configure the dev server proxy to forward `/api` to `http://localhost:4000`.
