# Corporate Ranker - AI Studio App

This is a Google AI Studio app that helps with corporate evaluation and ranking.

## Quick Links

- **Live Demo**: [GitHub Pages](https://hachi399.github.io/Corporate-Ranker/)
- **Setup Guide**: [SETUP_GUIDE.md](./SETUP_GUIDE.md)
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

1. **Build the app**:
   ```bash
   npm run build
   # Outputs to docs/ directory
   ```

2. **Commit and push**:
   ```bash
   git add docs/
   git commit -m "chore: rebuild for deployment"
   git push origin main
   ```

3. **GitHub Pages Configuration**:
   - Go to Settings → Pages
   - Set Source to "Deploy from a branch"
   - Select `main` branch and `/docs` folder
   - Save

Your app will be published at: `https://hachi399.github.io/Corporate-Ranker/`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production (outputs to docs/)
- `npm run lint` - TypeScript type checking
- `npm run clean` - Remove build artifacts

## ⚠️ Security Note

This application embeds the Gemini API key in the client-side code, making it visible in the browser. For production use, consider using serverless functions (Vercel, Netlify, etc.) to protect the API key.
