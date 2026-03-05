# Corporate Ranker - AI Studio App

This is a Google AI Studio app that helps with corporate evaluation and ranking.

## Quick Links

- **Live Demo**: [GitHub Pages](https://hachi399.github.io/Corporate-Ranker/)
- **Setup Guide**: [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- **Deployment Checklist**: [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
- **Secrets Configuration**: [.github/SECRETS_SETUP.md](./.github/SECRETS_SETUP.md)

## Run Locally

### Prerequisites
- Node.js 22+

### Setup Steps

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env and add your Gemini API key:
   # VITE_GEMINI_API_KEY=your_api_key_here
   # Get API key from: https://aistudio.google.com/apikey
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```
   
   Open `http://localhost:3000` in your browser.

## Deploy to GitHub Pages

### Step 1: Configure GitHub Secrets

1. Go to **Settings → Secrets and variables → Actions**
2. Add a new secret:
   - **Name**: `VITE_GEMINI_API_KEY`
   - **Value**: Your Gemini API key from https://aistudio.google.com/apikey

### Step 2: Configure GitHub Pages

1. Go to **Settings → Pages**
2. Set:
   - **Source**: "Deploy from a branch"
   - **Branch**: `main`
   - **Folder**: `/docs`
3. Save

### Step 3: Deploy

Just push to main branch:
```bash
git add .
git commit -m "Update code"
git push origin main
```

GitHub Actions will automatically:
1. Build your app with the API key from Secrets
2. Deploy to GitHub Pages at: `https://hachi399.github.io/Corporate-Ranker/`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production (outputs to docs/)
- `npm run lint` - TypeScript type checking
- `npm run clean` - Remove build artifacts

## ⚠️ Security Note

This application embeds the Gemini API key in the client-side code, making it visible in the browser. For production use, consider using serverless functions (Vercel, Netlify, etc.) to protect the API key.
