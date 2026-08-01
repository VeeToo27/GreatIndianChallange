# Rivyou Survey + Live Dashboard

A 9-question survey (`/survey`) that anyone can fill out on their phone, and
a live dashboard (`/dashboard`) that updates in real time — across every
visitor's device, not just your own browser — as answers come in.

## How it's wired

- **Next.js 14** (App Router) — one project, deploys to Vercel with zero config.
- **`/survey`** — a one-question-at-a-time mobile-friendly form.
- **`/api/responses`** — a serverless API route. `POST` records an answer,
  `GET` returns live aggregated counts.
- **`/dashboard`** — polls `/api/responses` every 3 seconds and redraws the
  bar charts, so anyone with the link watches results fill in live.
- **Upstash Redis** — the actual live storage. Vercel's serverless functions
  don't share memory between requests, so a real (free) datastore is what
  makes it "live" across everyone answering, not just one tab.

## 1. Local setup

```bash
npm install
```

Create a free Redis database at **https://console.upstash.com** (takes ~1
minute, no credit card):
1. Create Database → any region close to your users.
2. Open the database → "REST API" section → copy the URL and token.
3. Copy `.env.example` to `.env.local` and paste them in:

```bash
cp .env.example .env.local
```

```
UPSTASH_REDIS_REST_URL=https://xxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxxxxxxxxx
```

Run it:

```bash
npm run dev
```

Open `http://localhost:3000` — try `/survey` in one tab and `/dashboard` in
another to watch it update live.

## 2. Deploy to Vercel

**Option A — CLI**
```bash
npm i -g vercel
vercel
```

**Option B — GitHub**
1. Push this folder to a new GitHub repo.
2. Go to https://vercel.com/new and import the repo.
3. Vercel auto-detects Next.js — no build settings needed.

**Either way**, before (or right after) the first deploy, add the same two
env vars in **Vercel → Project → Settings → Environment Variables**:

```
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
```

Redeploy once they're added if the first deploy happened before you set them.

## 3. Share it

- Survey link to send around: `https://your-project.vercel.app/survey`
- Dashboard to keep open on a laptop/projector during your pitch:
  `https://your-project.vercel.app/dashboard`

## Changing the questions

Everything about the questions — text, options, section labels — lives in
one file: `lib/questions.ts`. Both the survey and the dashboard read from it,
so editing a question there updates both pages automatically. No id reuse
required — if you add a new question, the dashboard picks it up on the next
build with a "waiting for first response" empty state until someone answers.

## Notes

- Answers are anonymous by design — no names or identifiers are stored.
- The dashboard polls rather than uses websockets, which keeps this
  deployable on Vercel's standard serverless functions with no extra
  infrastructure. 3-second polling reads as "live" in practice.
- Free Upstash tier comfortably handles a class-sized or campus-sized survey.
