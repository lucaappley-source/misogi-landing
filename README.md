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

Replace the `handleSubmit` function in `src/App.jsx` with your email service API call. Example for ConvertKit:

```javascript
const handleSubmit = async () => {
  if (!email.includes("@")) return;
  await fetch("https://api.convertkit.com/v3/forms/YOUR_FORM_ID/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: "YOUR_API_KEY",
      email: email,
    }),
  });
  setSubmitted(true);
};
```

## Local development

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`
