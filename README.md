# Expense Tracker

Full-stack personal finance tracker with Firebase authentication, MongoDB persistence, transaction analytics, profile management, and reminders.

## Tech Stack

- Frontend: React (Create React App), React Router, Tailwind CSS, Recharts, Firebase Web Auth
- Backend: Node.js, Express, MongoDB (Mongoose), Firebase Admin SDK, Multer
- Auth: Firebase ID tokens verified on backend
- Deployment frontend: Vercel or Netlify
- Deployment backend: Render (recommended), Railway, Fly.io, or any Node host

## Features

- User signup/login with Firebase Authentication
- Secure protected routes
- Create/list/delete expense or income transactions
- Dashboard includes balance summary, income and expense charts, and transaction history
- Reminder CRUD APIs (`/api/reminders`)
- Profile update with avatar upload (`/api/auth/updatedetails`)
- Dark/light theme toggle

## Project Structure

```text
expense-tracker/
  src/                    # React frontend
  public/                 # Static assets + Netlify redirect file
  server/                 # Express backend
    config/
    middleware/
    models/
    routes/
```

## Local Development

### 1. Install dependencies

```bash
npm install
cd server && npm install
```

### 2. Backend environment (`server/.env`)

Create `server/.env`:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
FIREBASE_SERVICE_ACCOUNT_BASE64=your_base64_encoded_service_account_json
```

Notes:
- In local development, backend also supports `server/serviceAccountKey.json` when `FIREBASE_SERVICE_ACCOUNT_BASE64` is not set.
- `server/serviceAccountKey.json` is ignored by git and must never be committed.

### 3. Frontend environment (`.env`)

Create root `.env`:

```env
REACT_APP_API_BASE_URL=http://localhost:5000
```

### 4. Run locally

Run frontend + backend together:

```bash
npm run dev
```

Or separately:

```bash
npm start
cd server && npm run dev
```

## API Overview

All protected routes require:

```http
Authorization: Bearer <firebase_id_token>
```

Auth routes:
- `GET /api/auth/me`
- `POST /api/auth/sync`
- `PUT /api/auth/updatedetails` (multipart form upload)

Transaction routes:
- `GET /api/transactions`
- `POST /api/transactions`
- `POST /api/transactions/import`
- `DELETE /api/transactions/:id`

Reminder routes:
- `GET /api/reminders`
- `POST /api/reminders`
- `PUT /api/reminders/:id`
- `DELETE /api/reminders/:id`

## Deployment (Recommended): Vercel + Render

### A. Deploy backend on Render

1. Push code to GitHub (already done).
2. In Render, create a new **Web Service** from this repo.
3. Configure Root Directory as `server`, Build Command as `npm install`, and Start Command as `npm start`.
4. Add environment variables in Render: `NODE_ENV=production`, `PORT=10000` (or Render default), `MONGO_URI=<your production Mongo URI>`, `FIREBASE_SERVICE_ACCOUNT_BASE64=<base64 of service account json>`.
5. Deploy and copy your backend URL, for example:
- `https://expense-tracker-api.onrender.com`

### B. Deploy frontend on Vercel

1. In Vercel, import this GitHub repo.
2. Framework Preset: **Create React App**
3. Build Command: `npm run build`
4. Output Directory: `build`
5. Add frontend env var: `REACT_APP_API_BASE_URL=https://your-backend-url.onrender.com`
6. Deploy.

This repo includes `vercel.json` for SPA route fallback so browser refresh on routes works.

## Deployment (Alternative): Netlify + Render

### A. Backend

Use the same Render steps above.

### B. Frontend on Netlify

1. In Netlify, import this GitHub repo.
2. Build settings: Build command `npm run build`, Publish directory `build`.
3. Add environment variable: `REACT_APP_API_BASE_URL=https://your-backend-url.onrender.com`.
4. Deploy.

This repo includes `public/_redirects` for SPA fallback:
- `/* /index.html 200`

## Production Checklist

- MongoDB allows your backend host IP/network access.
- Firebase service account belongs to the correct Firebase project.
- `REACT_APP_API_BASE_URL` points to deployed backend URL (not localhost).
- CORS is enabled on backend (already enabled in `server/index.js`).
- Image upload paths resolve from backend static `public` directory.

## Scripts

- `npm start` -> run frontend
- `npm run build` -> production frontend build
- `npm run dev` -> run frontend + backend together

- In `server/`:
- `npm start` -> run backend
- `npm run dev` -> run backend with nodemon

## Security Notes

- Never commit `server/serviceAccountKey.json`.
- Never commit `.env` files with secrets.
- Credentials are now protected in `.gitignore`.

## Troubleshooting

- Frontend loads but API fails: check `REACT_APP_API_BASE_URL` in Vercel/Netlify.
- `Not authorized` errors: ensure Firebase token is sent in `Authorization` header.
- Backend startup fails: verify `MONGO_URI` and `FIREBASE_SERVICE_ACCOUNT_BASE64`.
- SPA route returns 404 on refresh: ensure `vercel.json` or `public/_redirects` is deployed.
