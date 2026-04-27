# Phoenix-AI — Rehabilitation, reimagined

A full-stack physiotherapy rehabilitation web app with Doctor Dashboard and Patient Dashboard.

---

## Screens included

### Shared
- **Login page** — role selector (Doctor / Patient), black canvas hero

### Doctor Dashboard
- **Patient overview** — stat cards, mini charts, searchable patient grid
- **Patient detail** — tabbed view: overview chart, exercises list, send feedback
- **Assign exercises** — category filter, multi-select, sticky assign bar

### Patient Dashboard
- **Home** — greeting, score, streak, today's exercises, progress chart
- **Exercise detail** — video placeholder, instructions, joint tracking info
- **Camera session** — full-screen AI pose detection simulation with animated skeleton
- **Score screen** — animated score counter, joint analysis breakdown
- **Feedback** — doctor messages with unread indicator

---

## Deploy options

### Option 1: Netlify (Recommended — free, ~2 minutes)

1. Go to [netlify.com](https://netlify.com) and sign up / log in
2. Drag and drop the `dist/` folder onto the Netlify dashboard
3. Your site is live instantly with a public URL

Or via Netlify CLI:
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Option 2: Vercel (free, ~2 minutes)

```bash
npm install -g vercel
vercel --prod
```

When prompted: set output directory to `dist`.

### Option 3: GitHub Pages

1. Push this repo to GitHub
2. Go to Settings → Pages → Source: GitHub Actions
3. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Option 4: Local development

```bash
npm install
npm run dev
```

Open http://localhost:5173

### Option 5: Preview the production build locally

```bash
npm install
npm run build
npm run preview
```

Open http://localhost:4173

---

## Tech stack

- **React 18** + **React Router v6**
- **Recharts** for data visualisation
- **Vite** for build tooling
- Zero external UI libraries — design system built from scratch

## Demo credentials

Click "Sign in" without any credentials to enter the demo.
- Doctor role → Doctor Dashboard
- Patient role → Patient Dashboard (Arjun Mehta's account)

---

## Design system

Apple-inspired precision editorial system. See the full spec in the project document.
Colors, typography, and components are all implemented as inline styles matching the spec exactly.
