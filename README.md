# WCAC PCAC

**MICA's digital "kiske paas hai?"**

A hyperlocal campus utility platform for MICA. Students already borrow, lend, buy, sell,
volunteer, and report lost/found items over WhatsApp using campus shorthand — **WCAC** (Will
Come And Collect), **PCAC** (Please Come And Collect), **WCAB** (Will Come And Buy), **PCAB**
(Please Come And Buy) — plus **LOST**, **FOUND**, and **VOLUNTEER**. WCAC PCAC gives that
existing behaviour one searchable, organised home instead of a scattered group chat.

**Live app:** https://wcac-pcac.vercel.app
**Test credentials:** see [Test account](#test-account) below

## The core flow

1. **Post** something you need (WCAC), have (PCAC), want to buy (WCAB), are selling (PCAB),
   lost, found, or a call for volunteers.
2. Other students **browse the feed**, filter by type, and **respond** to your post.
3. You (the post owner) **accept a response** — the post is marked **Fulfilled** and the loop
   closes. This mirrors a classic browse → offer → checkout flow, just in campus language.
   VOLUNTEER posts work the same way but accept multiple responses up to however many people
   you need, only fulfilling once every slot is filled.

## Stack

- **Next.js 16** (App Router, TypeScript, Server Actions, Turbopack)
- **Tailwind CSS v4**
- **Supabase** — Postgres database, Row Level Security, and email/password Auth
- **Vercel** — deployment

## Features

- **Auth** — sign up, log in, log out (Supabase Auth, email/password)
- **CRUD** — create, read, update, delete posts (`WCAC / PCAC / WCAB / PCAB / LOST / FOUND / VOLUNTEER`)
- **Core business flow** — browse feed → respond to a post → owner accepts → post fulfilled
- **Resource pool ("My Stuff")** — a standing list of things MICAans are willing to lend, rent,
  sell or give away, independent of any single request
- **Communities** — hostels, committees, societies and clubs; join/leave, and post into a
  community's own feed (Hostel Mode)
- **Events** — community-run event hubs with a needs checklist ("I have it" / "I need it"),
  a live "days until" banner standing in for staged reminders, and an "upcoming this week"
  widget on the main feed
- **Volunteers** — VOLUNTEER posts with a slot count; the owner can accept multiple sign-ups
  up to capacity
- **Gamification** — points for every accepted response, a "Most Helpful MICAans" leaderboard
  with derived badges, and "Community Wars" ranking communities by their members' points
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
   contents of [`supabase/schema.sql`](./supabase/schema.sql), and run it. This creates every
   table (`profiles`, `posts`, `responses`, `resources`, `communities`, `community_members`,
   `events`, `event_needs`, `event_need_responses`), the `user_stats`/`community_stats` views
   backing the leaderboard, RLS policies, and seeds a handful of real MICA communities
   (Hostel 1–5, CulComm, LitCom, Sports Com).

4. **Turn off email confirmation** so signup logs you in immediately: in Supabase, go to
   **Authentication → Providers → Email**, and if a "Confirm email" toggle is there, disable
   it. If you don't see it (this moved around in recent Supabase versions), you can instead
   set it directly: **Settings → API → generate a personal access token**, then
   `PATCH https://api.supabase.com/v1/projects/<ref>/config/auth` with body
   `{"mailer_autoconfirm": true}`.

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

> Already have a project running the earlier (pre-features) schema? Run
> [`supabase/migration-002-features.sql`](./supabase/migration-002-features.sql) instead of
> `schema.sql` — it's additive and won't touch existing posts/responses/profiles data.

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

This account already owns open posts and has joined Hostel 1 and CulComm. To try the full
response/accept loop as a second user, there's also:

```
email:    helper@wcacpcac.test
password: testpass123
```

You can also sign up with your own email — confirmation is disabled, so it logs you straight
in.

## Project structure

```
src/
  app/
    actions/            Server Actions (auth, posts, responses, resources, communities, events)
    feed/                Browse + filter + search open posts, "coming up this week" widget
    resources/           The standing resource pool + "My stuff"
    communities/          Browse/join/create communities; [id] is the Hostel-Mode feed + events
    events/                Upcoming/past events; [id] is the event hub (checklist, banner)
    leaderboard/          Most Helpful MICAans + Community Wars
    login/, signup/       Auth pages
    my-posts/              Your posts + posts you've responded to
    posts/[id]/             Post detail — respond / accept / fulfil (incl. volunteer sign-ups)
    posts/new/               Create a post
  components/           Navbar, PostCard/Form, ResourceCard/Form, badges
  lib/supabase/         Browser/server Supabase clients + session refresh
  lib/dates.ts           "Days until" helper standing in for push notifications
  lib/badges.ts           Derived badge rules for the leaderboard
  types.ts               Shared types for every entity
supabase/schema.sql     Full database schema + RLS policies (fresh installs)
supabase/migration-002-features.sql  Additive migration for an existing project
```

## Known issues / not built

- No real push/email notifications for event reminders — the brief's staged reminders are
  approximated with a live "days until" banner on the event page and an "upcoming this week"
  widget on the feed, computed on each render rather than sent to you.
- No image uploads on posts or resources yet (text-only listings).
- No in-app messaging — responses are visible on the post page, coordination happens off-app.
- Community and event creation has no edit/delete UI yet (communities and events, once
  created, are permanent).
