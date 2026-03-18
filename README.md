# Fast Food Deals Sri Lanka

Aggregates live deals from major fast food chains in Sri Lanka, adds nearest-branch distance, and exposes a manual sync action to refresh scraped deals on demand.

## Tech stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4

## Local development

Install dependencies:

```bash
npm install
```

Run dev server:

```bash
npm run dev
```

Open http://localhost:3000.

## Production checks before deploy

Run these locally before pushing:

```bash
npm run lint
npm run build
```

## Environment variables

This app runs without custom env vars, but Pizza Hut token parameters can be overridden.

Optional:

- `PIZZA_HUT_TOKEN_USERNAME`
- `PIZZA_HUT_TOKEN_PASSWORD`
- `PIZZA_HUT_TOKEN_SCOPE`

If unset, the scraper uses built-in defaults discovered from Pizza Hut's public client bundle.

## Deploy to Vercel

1. Push this repository to GitHub/GitLab/Bitbucket.
2. In Vercel, click "Add New..." -> "Project" and import the repository.
3. Keep framework preset as Next.js.
4. Build command: `npm run build`.
5. Output directory: leave empty (Next.js default).
6. Add optional environment variables above if you want to manage Pizza Hut auth values from Vercel settings.
7. Click Deploy.

## Vercel runtime notes

- Deals API route runs on Node runtime with explicit max duration and preferred region (`sin1`) for lower latency to Sri Lanka targets.
- In-memory cache is process-local. On Vercel cold starts or scale-out, cache may be empty and scraping will run again.

## Post-deploy validation

After first deploy:

1. Open `/` and confirm deals render.
2. Click "Sync deals" and confirm data refreshes.
3. Call `/api/deals?force=1` and verify JSON includes `scrapedAt` and deals list.
4. Check Vercel function logs for `/api/deals` latency and errors.
