# NoteX

NoteX is a modern notes app built with **Next.js App Router**.

It includes:

- **Authentication** (register/login/logout)
- **Notes CRUD** (create, list, update, delete)
- **Favorites** + **Archived** views
- **Search** (title/content)
- **MongoDB** persistence via Mongoose
- **JWT auth stored in an HTTP-only cookie**

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling/UI**: Tailwind CSS v4 + Radix UI primitives
- **Animation**: Framer Motion
- **Database**: MongoDB (Atlas/local)
- **ODM**: Mongoose
- **Auth**: JWT (`jsonwebtoken`) + HTTP-only cookies
- **Password hashing**: `bcryptjs`
- **Validation**: Zod
- **Linting**: ESLint

## Quick Start

1) Install dependencies

```bash
npm install
```

2) Create `.env` (copy from `.env.example`)

```bash
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xwhs72f.mongodb.net/notes?retryWrites=true&w=majority
JWT_SECRET=replace-with-a-long-random-secret
```

3) Run dev server

```bash
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Required:

- **`MONGO_URI`**: MongoDB connection string
- **`JWT_SECRET`**: secret used to sign/verify JWTs (set a long random value)

Optional (present in `.env.example`, but not required by the current JWT-cookie auth flow):

- `AUTH_SECRET`
- `NEXTAUTH_URL`
- OAuth provider keys

## Scripts

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`

## API Routes

Implemented as **Next.js Route Handlers** under `src/app/api/*`.

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

Notes:

- `GET /api/notes` (supports query params: `q`, `page`, `limit`, `favorite`, `archived`, `tag`)
- `POST /api/notes`
- `GET /api/notes/[id]`
- `PUT /api/notes/[id]`
- `DELETE /api/notes/[id]`

## Project Structure (high level)

- `src/app/`
  - `(auth)/` auth pages (`/login`, `/register`)
  - `(app)/` protected app pages (`/notes`, `/notes/[id]`)
  - `api/` route handlers
- `src/lib/`
  - `db.ts` Mongo connection (cached)
  - `auth.ts` JWT + cookie helpers (`token` cookie)
  - `models/` Mongoose models (`User`, `Note`)
  - `validation/` Zod schemas
  - `api.ts` client-side API wrapper
- `src/components/`
  - UI building blocks and app shell

## Notes about Auth

- Auth is implemented using a **JWT** stored in an **HTTP-only cookie** named `token`.
- Server-side auth checks use `getAuthedUser()` from `src/lib/auth.ts`.

## Build & Production

```bash
npm run build
npm run start
```
