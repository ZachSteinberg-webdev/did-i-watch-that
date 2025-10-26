Did I Watch That?!?!

This is my TV show tracker. I built it because I kept forgetting which seasons and episodes I’d already watched, especially for long-running shows like The Simpsons, It’s Always Sunny in Philadelphia, etc. The app lets me search for any show, pull live episode data from a public TV database via an API (TVmaze), mark what I’ve already seen, and then quickly see where I left off — without needing to create an account first.

It’s a full-stack Node/Express + MongoDB app with server-rendered views and vanilla JavaScript. It supports both anonymous “scratchpad mode” and persistent accounts with login. Anonymous users can track progress immediately in their browser, then later create an account to save it permanently. My focus was to make something actually usable for how people binge TV in the real world.

---

## High-Level Overview

- I consume a third-party TV metadata API (show info, seasons, episode names, and air dates).
- I normalize that data into my own app model so I can track status per episode (“seen” vs “unseen”) per user.
- I give the user fast answers to: “Where should I resume?”
- I intentionally allow casual use with no signup and no popups begging for signup.
- Later, if you make an account, I promote your local progress into MongoDB under that account.

This app provides users a stateful, personal timeline of their viewing history per television show.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
   - [Runtime / Server](#runtime--server)
   - [Views & Client Behavior](#views--client-behavior)
   - [Database / Models](#database--models)
   - [3rd-Party API Usage](#3rd-party-api-usage)
2. [Core Flow](#core-flow)
   - [Search & Add a Show](#search--add-a-show)
   - [Marking Episodes Watched](#marking-episodes-watched)
   - [Resume Point / Progress Summary](#resume-point--progress-summary)
   - [Anonymous vs Registered Use](#anonymous-vs-registered-use)
3. [Security / Reliability / Abuse Handling](#security--reliability--abuse-handling)
   - [Rate Limiting on External API](#rate-limiting-on-external-api)
   - [Input Validation / Sanitization](#input-validation--sanitization)
   - [Session / Auth](#session--auth)
   - [Abuse Surfaces](#abuse-surfaces)
4. [Operational Notes](#operational-notes)
   - [Environment Variables / Secrets](#environment-variables--secrets)
   - [Data Freshness / API sync](#data-freshness--api-sync)
   - [Caching Strategy](#caching-strategy)
   - [Retention / Cleanup](#retention--cleanup)
5. [What Makes This Interesting](#what-makes-this-interesting)

---

## Tech Stack

### Runtime / Server

- **Node.js + Express**

  - Routing, session handling, flash messages, auth, view rendering.
  - Dedicated routes for:
    - Searching shows by title
    - Viewing a show’s seasons/episodes
    - Toggling “watched” state on an episode
    - Viewing current “next episode to watch”
    - Register / login / logout
  - Central async error wrapper and error handler (similar pattern I use in my other projects) so unexpected failures don’t drop the process.

- **Helmet**

  - Sets baseline security headers, including a CSP tuned for this app.
  - Locks down where scripts/styles are allowed from.
  - Helps prevent cross-site scripting and basic clickjacking issues.

- **express-mongo-sanitize**

  - Removes `$` and `.` keys from any untrusted input before hitting Mongo.
  - This is a guardrail against NoSQL injection attempts via crafted body/query strings.

- **cookie-parser + express-session + connect-mongo**
  - Sessions are stored in MongoDB so they survive restarts.
  - Cookies are httpOnly and signed.
  - I use a custom cookie name instead of the Express default.

### Views & Client Behavior

- **Server-rendered EJS views**

  - Search page
  - Show detail page (season list, episodes list, progress indicators)
  - Auth pages (login, register)
  - Account / settings
  - Error pages and redirect surfaces (for “Please log in first,” etc.)

- **Vanilla JS for enhancement**

  - Inline toggles for “mark this episode watched / unwatched” without a full page reload.
  - Expand/collapse per-season episode lists.
  - Optimistic UI update (e.g. state changes instantly, then I confirm with the server).

- **Progress UI**
  - I visually distinguish:
    - Episodes I’ve seen
    - The next unseen episode
    - Episodes that haven’t aired yet (future-dated)
  - The goal is: I should be able to open the app, scroll for 2 seconds, and know what to watch tonight.

All meaningful actions still work using classic form POSTs if JavaScript is disabled. The JS layer just reduces friction (no full reload to mark 10 episodes as watched).

### Database / Models

MongoDB (via Mongoose) stores:

1. User

   - `email`
   - `passwordHash` / salt (bcrypt)
   - Basic profile / timestamps
   - Saved TV progress

2. Show

   - Stable show ID from the external API
   - Title
   - Metadata (year, network, poster art URL if provided, summary blurb, etc.)

3. Episode

   - Show reference
   - Season number
   - Episode number
   - Episode title
   - Air date
   - (Optionally) description or summary
   - I index on `(showId, season, episodeNumber)` so I can find and render a season quickly without doing an expensive full-graph lookup every time.

4. UserEpisodeProgress
   - `userId`
   - `episodeId`
   - `watched` (boolean)
   - `watchedAt` timestamp (helpful for tie-breaking “what’s next” if I’ve marked multiple at once)
   - I treat this as the source of truth for “have I seen this one.”

I do not try to store “derived state” like “current season” directly on the user. Instead, I compute it from these facts, which avoids sync drift.

### 3rd-Party API Usage

- I talk to a public TV metadata API (TVmaze).
- I request:
  - Show search results by name
  - Episode list by show ID
  - Season / episode metadata
- I do not trust this external data directly. I normalize it:
  - I coerce missing fields into predictable defaults.
  - I strip or escape anything that looks like HTML/script in summaries.
  - I store only what I need.

That gives me:

- An internal Show document
- A set of Episode documents linked to that show
- A nice clean place to join against `UserEpisodeProgress`

---

## Core Flow

### Search & Add a Show

1. User types “The Simpsons” or “It’s Always Sunny in Philadelphia” in the search box.
2. I hit the external TV API for fuzzy results.
3. I render a results page with:

   - Title
   - Year / network / short summary
   - “Track this show” button

4. When the user chooses “Track”:
   - I upsert the Show into my DB if I don’t have it yet.
   - I pull down all seasons/episodes for that show.
   - I upsert those episodes into my Episodes collection.

Important: I don’t require the user to be logged in yet. Anonymous users can do this too. Anonymous storage lives in localStorage, and I represent their “watched” state client-side.

### Marking Episodes Watched

On the Show detail page I list seasons and their episodes. Each episode row shows:

- Episode number
- Title
- A “seen it” toggle

When the user clicks that toggle:

1. If they’re logged in:

   - I POST `/episode/:episodeId/toggle`.
   - The server flips `watched` for that `userId`/`episodeId` pair.
   - I update the DB row in `UserEpisodeProgress` (create if it doesn’t exist yet).
   - I return JSON `{ watched: true/false }`.
   - The client updates the UI state (checkmark, styling, etc.).

2. If they’re anonymous:
   - I update a browser-side structure (e.g. `localStorage.watchedEpisodes["<showId>"]["<episodeId>"] = true`).
   - I style the UI based on that in-memory state so it still “feels logged in.”

This is intentional. I don’t hold watched-state hostage behind a signup wall.

### Resume Point / Progress Summary

On a show’s page I also compute “resume from here.”

The logic is:

1. Get the ordered list of episodes by air date / (season, episodeNumber).
2. Find the first episode where:
   - I have NOT marked it watched
   - The air date is in the past (not a future unaired episode)
3. That’s my “Next episode to watch.”

I highlight it with a “Continue here” style so I can jump straight back in after a break.

For very long shows (30+ seasons), this is a huge usability win. I don’t want to remember “I think I stopped somewhere around Season 18 Episode 4.” The app just tells me.

### Anonymous vs Registered Use

Anonymous (no account):

- You search for shows.
- You add a show to “your” tracker.
- You mark episodes seen.
- I store those episode flags in your browser storage and in your server session, but I do NOT persist anything in the main MongoDB collections under a User record.
- If you close the tab and come back later (same browser), you still see your progress because of local persistence.

Registered (account created / logged in):

- You do the same stuff, but now:
  - Episode toggles persist in `UserEpisodeProgress`.
  - Your shows exist in Mongo in a way I can rehydrate server-side even on a new device.
- When you register after using the app anonymously:
  - I walk your client-side watch history and write those flags into Mongo Linked to your new account.
  - After that point, your account is the source of truth.

This is the same “guest → permanent migration” pattern I use in my other apps. It respects the user’s time. You don’t lose hours of marking episodes just because you finally created an account.

---

## Security / Reliability / Abuse Handling

### Rate Limiting on External API

The main abuse surface in this app is actually the external TV metadata API, not my own database. I don’t want my instance to become a free proxy for high-volume scraping.

Mitigations:

- I keep an in-memory cache of recent search queries (e.g. “cops”, “sunny”, etc.) for a short TTL so I don’t hammer the external API on every keystroke.
- I can easily wrap “search TV API” behind a lightweight per-IP rate limiter:
  1. N search requests per 10 seconds per IP.
  2. Burst allowed up to N but not sustained.
- If you exceed that, I respond with a generic “Slow down” JSON.
- That protects me from someone trying to script `?q=a`, `?q=aa`, `?q=aaa`, etc. through my server and effectively use me as a crawler.

### Input Validation / Sanitization

- I sanitize user-supplied strings before they ever touch Mongo using `express-mongo-sanitize`.
- I enforce required shapes in my Mongoose schemas (email format, episode ID format, etc.).
- I don’t trust the external TV API either:
  - I strip embedded markup from summaries and descriptions before rendering them back out in my views.
  - I escape text going into EJS so untrusted content doesn’t become executable JS.

### Session / Auth

- Sessions are handled through `express-session` + `connect-mongo`.
- I use `cookie-parser` with a server-side secret so I can sign cookies and detect tampering.
- The session cookie:
  - Uses a non-default name (not `connect.sid`).
  - Is `httpOnly`, so frontend JS can’t just read it.
  - Gets an explicit `maxAge` so idle sessions expire.
- Passwords are stored hashed+salted with bcrypt. I never store raw plaintext.

I also surface “You must be logged in to do that” for any persistent write endpoints so anonymous users cannot mutate MongoDB records for arbitrary accounts.

### Abuse Surfaces

1. **Episode toggle spam**

   - Someone could slam `/episode/:episodeId/toggle` in a loop.
   - That’s low risk: it just flips a boolean. But it’s still a write, so I can attach basic per-IP or per-session rate limiting to that route to avoid DB churn.

2. **Search spam**

   - High risk for cost (external API calls).
   - As mentioned above, I treat this as the primary rate-limiting target.

3. **Show import spam**
   - When you “Track this show,” I pull and store the entire episode list.
   - Real users won’t import 200 shows per minute.
   - I can cap “new show imports per session per hour” to prevent someone from trying to populate my DB as a free mirror of the public dataset.

Overall, the app is mostly read-heavy and personal. The main threat isn’t “hack the data,” it’s “use my server to bulk harvest someone else’s TV data source.”

---

## Operational Notes

### Environment Variables / Secrets

Typical env vars:

- `MONGO_URI`
  MongoDB Atlas connection string. Used for app data, user progress, and also session store.

- `SESSION_SECRET`
  Secret used to sign/verify session cookies.

- `COOKIE_NAME`
  Custom cookie name to avoid predictable defaults.

- `API_BASE_URL` / `API_KEY`
  Used to query the third-party TV metadata service. I do not ship this to the browser. All external API calls run server-side.

- `NODE_ENV`
  Drives behavior like logging verbosity, Helmet strictness, error detail in templates, etc.

In production:

- Secrets are injected as platform config vars.
- I never embed raw keys client-side. All lookups go through my server so I maintain control of usage and rate limiting.

### Data Freshness / API sync

TV data changes:

- New seasons drop.
- Episode air dates get updated (or corrected).
- Episode titles sometimes change pre-airing.

To handle that:

- On every “Track this show,” I pull a full fresh copy of that show’s episodes.
- When a logged-in user visits a tracked show again later, I can optionally re-sync the episode list:
  - For each episode from the API:
    - If I don’t have it yet, insert.
    - If I do have it and metadata changed (title/date), update.
- I do NOT blow away `UserEpisodeProgress`. Your “watched” flags are separate and survive metadata refresh.

### Caching Strategy

There are really two levels of caching:

1. **Search results caching**

   - For queries like “sunny”, I keep a short-term in-memory cache keyed by lowercase query.
   - This cuts down on bursts of identical searches and shields the external API a bit.

2. **Show metadata caching**
   - Once I’ve imported a show and its episodes, I don’t need to ask the external API again for every page load.
   - I serve seasons/episodes from my own database.
   - Re-sync is explicit and controlled.

This gives me performance, but also isolation: even if the third-party API goes down, I can still render shows I’ve already imported.

### Retention / Cleanup

Anonymous data:

- I keep anonymous “watched” state in the browser and in the server session while it’s active.
- When the session cookie expires, the server forgets you.
- The browser copy can live longer (localStorage), but it’s only on that device.

Registered data:

- Lives in Mongo under your account.
- I only store what I actually need: IDs and booleans.
- If I ever wanted GDPR-style “forget me,” it’s easy to wipe: delete the User, delete all `UserEpisodeProgress` for that user. The shared Show / Episode metadata is not personally identifying and doesn’t need to be purged.

---

## What Makes This Interesting

1. It solves a real binge-watching pain point: “Where did I leave off?”  
   Long-running, high-episode-count TV (COPS, procedural dramas, etc.) is exactly where human memory fails. Most public episode databases are not built around “my personal progress,” and most streaming apps silo your watch state by service. I wanted a single source of truth.

2. I treat unauthenticated usage like a first-class citizen.  
   You can use this without creating an account. You can make progress. You can close the tab and come back. That’s intentional. I’m respecting user effort instead of demanding sign-up just to try it.

3. I promote guest data into a real account.  
   If you later create an account, I don’t throw away your anonymous watch history. I migrate it into MongoDB under your new user. Same pattern I use in my other apps.

4. I run my own copy of episode metadata.  
   I don’t just proxy the TV API at render time. I pull down show/episode data, normalize it, index it, and store it. That means:

   - I can keep working even if the upstream API throttles or rate-limits.
   - I can precompute “next episode to watch” quickly without making a live external call.
   - I can control filtering (ignore unaired episodes unless you explicitly want them).

5. I separate personal watch state from global show data.  
   Show metadata and episode metadata are globally shared. Watch state is per-user. That keeps the data model clean and makes it easy to compute per-user views without duplicating the entire episode tree per account.

6. I think like an operator, not just a tutorial follower.
   - Sessions are stored in Mongo so restarts don’t log everyone out.
   - Cookies are signed and httpOnly.
   - I sanitize every inbound request before it ever touches Mongo.
   - I gate persistence behind login, but I don’t gate usability behind login.
   - I rate-limit calls to the external provider so my service can’t be abused as someone else’s scraping layer.
