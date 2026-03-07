# Misogi Landing Page

Lead generation landing page with an interactive Life Audit across 7 pillars.

## Deploy to Vercel

### 1. Push to GitHub

```bash
cd misogi-landing
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/misogi-landing.git
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"**
3. Import your `misogi-landing` repository
4. Vercel auto-detects Vite — just click **"Deploy"**
5. Your site is live in ~60 seconds

### 3. Custom domain (optional)

1. In Vercel: **Settings → Domains → Add**
2. Enter your domain (e.g. `getmisogi.com`)
3. Update DNS at your registrar to point to Vercel

### 4. Wire up email collection
This project ships with a Beehiiv-backed email gate:

- The UI calls `POST /api/subscribe` from `src/App.jsx`
- `/api/subscribe` is a Vercel Serverless Function that forwards the email to Beehiiv (so your API key is never exposed to the browser)

#### Vercel environment variables

Set these in Vercel: **Project → Settings → Environment Variables**

- **`BEEHIIV_API_KEY`**: your Beehiiv API key
- **`BEEHIIV_PUBLICATION_ID`**: the publication ID you want to subscribe users to

#### Local development with the API route

Vite’s dev server won’t run Vercel `/api` routes by itself. For local end-to-end testing, use the Vercel CLI:

```bash
npm i
npx vercel dev
```

Then open the URL it prints and try the audit flow through to the email gate.

## Local development

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`
