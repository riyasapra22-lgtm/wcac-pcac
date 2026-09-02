# WCAC PCAC

**MICA's digital "kiske paas hai?"**

A hyperlocal campus utility platform for MICA. Students already borrow, lend, buy, sell,
and report lost/found items over WhatsApp using campus shorthand — **WCAC** (Will Come And
Collect), **PCAC** (Please Come And Collect), **WCAB** (Will Come And Buy), **PCAB** (Please
Come And Buy) — plus **LOST** and **FOUND**. WCAC PCAC gives that existing behaviour one
searchable, organised home instead of a scattered group chat.

**Live app:** https://wcac-pcac.vercel.app
**Test credentials:** see [Test account](#test-account) below

## The core flow

1. **Post** something you need (WCAC), have (PCAC), want to buy (WCAB), are selling (PCAB),
   lost, or found.
2. Other students **browse the feed**, filter by type, and **respond** to your post.
3. You (the post owner) **accept a response** — the post is marked **Fulfilled** and the loop
   closes. This mirrors a classic browse → offer → checkout flow, just in campus language.

## Stack

- **Next.js 16** (App Router, TypeScript, Server Actions, Turbopack)
- **Tailwind CSS v4**
- **Supabase** — Postgres database, Row Level Security, and email/password Auth
- **Vercel** — deployment

## Features

- **Auth** — sign up, log in, log out (Supabase Auth, email/password)
- **CRUD** — create, read, update, delete posts (`WCAC / PCAC / WCAB / PCAB / LOST / FOUND`)
- **Core business flow** — browse feed → respond to a post → owner accepts → post fulfilled
- Filter feed by type, search by title, "My posts" dashboard, close/reopen a post

## Local setup

1. **Clone and install**

   ```bash
   git clone <this-repo-url>
   cd wcac-pcac
   npm install
   ```

2. **Create a Supabase project** at [supabase.com](https://supabase.com) (free tier).

3. **Run the schema.** In your Supabase project, open **SQL Editor → New query**, paste the
   contents of [`supabase/schema.sql`](./supabase/schema.sql), and run it. This creates the
   `profiles`, `posts`, and `responses` tables with Row Level Security policies, plus a
   trigger that creates a profile row on signup.

4. **Turn off email confirmation** (so signup logs you in immediately — good for a quick
   demo/reviewer flow): in Supabase, go to **Authentication → Sign In / Providers → Email**
   and disable "Confirm email".

5. **Copy environment variables.**

   ```bash
   cp .env.local.example .env.local
   ```

   Fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from your Supabase
   project's **Settings → API** page.

6. **Run the dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Deploying

1. Push this repo to GitHub.
2. Import it into [Vercel](https://vercel.com) (New Project → select the repo).
3. Add the two environment variables from `.env.local` in the Vercel project settings.
4. Deploy. Vercel builds with `next build` automatically.

## Test account

For reviewers — log in directly with:

```
email:    owner@wcacpcac.test
password: testpass123
```

This account already owns an open PCAC post. To try the full response/accept loop as a
second user, there's also:

```
email:    helper@wcacpcac.test
password: testpass123
```

You can also sign up with your own email — note that new signups currently require email
confirmation (see "Known issues" below).

## Project structure

```
src/
  app/
    actions/       Server Actions (auth, posts, responses)
    feed/           Browse + filter + search open posts
    login/, signup/ Auth pages
    my-posts/       Your posts + posts you've responded to
    posts/[id]/     Post detail — respond / accept / fulfil
    posts/new/      Create a post
  components/       Navbar, PostCard, PostForm, badges
  lib/supabase/     Browser/server Supabase clients + session refresh
  types.ts          Shared Post / Response / Profile types
supabase/schema.sql Database schema + RLS policies
```

## Known issues / not built (scoped out of the MVP)

- Events hub, volunteer requests, hostel-specific feeds, leaderboards/gamification, and
  community point tallies described in the original concept are not implemented — the MVP
  focuses on the core WCAC/PCAC/WCAB/PCAB/LOST/FOUND request → response → fulfil loop.
- No image uploads on posts yet (text-only listings).
- No in-app messaging — responses are visible on the post page, coordination happens off-app.
- New signups currently require email confirmation via Supabase's default flow; use the
  seeded test accounts above to skip that step during review.
