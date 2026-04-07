# Corporate Ranker

Corporate Ranker is a React + Vite app that analyzes companies using Gemini.

This repository uses a Vercel Serverless Function endpoint (`/api/analyze`) so the Gemini API key is kept on the server side and never shipped to browsers.

## Architecture

- Frontend: React + Vite (TypeScript)
- Backend: Vercel Serverless Functions (`api/analyze.ts`)
- AI provider: Gemini API

## Local Development

### Prerequisites

- Node.js 22+

### Setup

1. Install dependencies

```bash
npm install
```

2. Create `.env` from `.env.example`

```bash
cp .env.example .env
```

3. Edit `.env`

- `GEMINI_API_KEY`: required
- `ALLOWED_ORIGINS`: optional comma-separated CORS allowlist
   - Example: `https://hachi-dev.codes,https://www.hachi-dev.codes,http://localhost:3000`

4. Run dev server

```bash
npm run dev
```

Open `http://localhost:3000`.

## Deploy to Vercel

1. Import this repository into Vercel
2. Set environment variables in Vercel dashboard:
   - `GEMINI_API_KEY` (required)
   - `ALLOWED_ORIGINS` (recommended)
3. Deploy

Vercel will host both static frontend and `/api/analyze` serverless function on the same domain.

## Security Notes

- Gemini API key is managed in server-side environment variables (`GEMINI_API_KEY`)
- Browser only calls `/api/analyze`; direct key exposure is prevented
- CORS allowlist can be configured using `ALLOWED_ORIGINS`

## Optional Edge Runtime

If lower latency is required, switch runtime configuration in `api/analyze.ts` from `nodejs` to `edge` after validating compatibility.

## Scripts

- `npm run dev`: start local development server
- `npm run build`: production build
- `npm run preview`: preview production build
- `npm run lint`: TypeScript type check
