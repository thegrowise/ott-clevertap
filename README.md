# GrowStream — Sample OTT Web (Vue)

Hotstar / Zee5 style demo web app with Growise Web SDK instrumentation.

## Setup

```bash
cd sample-project/web-app/ott
npm install
npm run dev
```

Set `VITE_GROWISE_API_KEY` in `.env` to your Growise project key.

## Screens

Home, Browse, Title detail, Watch (mock player + progress milestones), Search, My List, Plans, Profile, **Login / Signup**.

Watch, My List, Subscribe, and Profile require login.

Demo account: `viewer@growstream.demo` / `growise123`

Catalog: `src/data/catalog.json` (copied to Flutter `assets/catalog.json`).
