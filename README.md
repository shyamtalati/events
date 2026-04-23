# Drexel University Events (Web MVP)

A minimal Next.js web app for discovering Drexel events in one place, starting with finance and career programming and expanding university-wide.

## Local development

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

If you want to test the alert flow locally, run the site through Netlify so the Functions and Blobs APIs are available:

```bash
npx netlify dev
```

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

This repo still uses static export mode (`next.config.mjs` with `output: "export"`) for the event pages. Email alerts run separately through Netlify Functions and Netlify Blobs.

## Email alerts

Users can now opt into email alerts directly from the filter view.

### What the flow does

- The user chooses filters and submits an email address.
- A confirmation link is emailed to that address before the subscription becomes active.
- The verified subscription is stored server-side in Netlify Blobs.
- An hourly scheduled Netlify Function checks for new matching events in the next 7 days and sends a digest.
- Users receive at most one digest email per day.
- The same event is not emailed repeatedly once it has already been included in a digest.
- Every alert includes a one-click unsubscribe link.

### Security and privacy notes

- Email addresses are never stored in the client.
- Email addresses are encrypted at rest before they are written to Netlify Blobs.
- Subscription creation is rate-limited and requires a confirmation email, which reduces abuse and accidental signups.
- Email delivery credentials stay in Netlify environment variables.
- Unsubscribing removes the saved subscription record.

### Required Netlify environment variables

Add these in Netlify under the `universityevent` site settings:

```txt
ALERTS_ENCRYPTION_KEY
RESEND_API_KEY
ALERTS_FROM_EMAIL
```

`ALERTS_FROM_EMAIL` should be a sender address from a verified Resend domain, for example `Drexel Events <alerts@yourdomain.com>`.
The Resend test sender `onboarding@resend.dev` is only suitable for sending to your own email address during testing, not to public users.

### Resend setup without exposing secrets

Do not hardcode your API key in the repo. Keep it in a local env file for development and in Netlify environment variables for production.

```js
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
```

If you are following the Resend quickstart snippet locally, replace `re_xxxxxxxxx` with your real API key in `.env.local`, not in committed source.

Generate the encryption key with one of these:

```bash
openssl rand -base64 32
# or
openssl rand -hex 32
```

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
