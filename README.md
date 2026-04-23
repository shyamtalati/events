# Drexel University Events (Web MVP)

A minimal Next.js web app for discovering Drexel events in one place, starting with finance and career programming and expanding university-wide.

## Local development

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Push code to GitHub (important)

If GitHub still shows only `.gitkeep`, your local commits are not pushed yet or they are on a different branch.

```bash
# check local branch and commits
git branch -vv
git log --oneline -n 5

# connect your GitHub repo once (if needed)
git remote add origin https://github.com/<your-username>/events.git

# push current branch
git push -u origin work

# optional: make this the default branch used by GitHub/Netlify
git push origin work:main
```

## Deploy to Netlify

1. Push this repo to GitHub.
2. In Netlify, click **Add new site** → **Import an existing project**.
3. Select the GitHub repo.
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `out`
5. Deploy.

This repo uses static export mode (`next.config.mjs` with `output: "export"`), which is ideal for this MVP since all pages are pre-rendered and no server runtime is required.

## Updating events from email

When you send event updates, use this format for each event:

```txt
Title:
Start (ISO 8601 with timezone):
End (optional, ISO 8601):
Location:
Host Org:
Tags (comma-separated from: Networking, Recruiting, Workshop, Speaker, Social, Competition):
Description:
RSVP URL (optional):
```

Example:

```txt
Title: LeBow Finance Networking Night
Start (ISO 8601 with timezone): 2026-05-01T18:00:00-04:00
End (optional, ISO 8601): 2026-05-01T20:00:00-04:00
Location: Gerri C. LeBow Hall, Atrium
Host Org: LeBow Finance Society
Tags: Networking, Recruiting
Description: Meet alumni and recruiters for internship and analyst opportunities.
RSVP URL (optional): https://example.com/register
```

Then update `data/events.ts` with the same fields (`slug`, `title`, `startsAt`, `endsAt`, `location`, `hostOrg`, `tags`, `description`, `rsvpUrl`).
