# Work Intelligence OS

A personal-first **work intelligence and reflection** system for developers and knowledge workers. It helps you understand what you actually did, see patterns in how you work, and end each day with clarity instead of guilt.

**For everyone:** Use the web app in the browser or install it as an app on your phone. An **Android app** (installable from the Play Store) is available so you can log and close your day from your phone with the same account and data.

live web app link: https://wio-dev.vercel.app

**For developers:** Full technical docs → [docs/DEVELOPER.md](docs/DEVELOPER.md). Features and value in depth → [docs/FEATURES_AND_VALUE.md](docs/FEATURES_AND_VALUE.md).

---

## The problem

Most of us juggle several projects, switch between tools, and plan more than we can realistically do. We feel busy but unclear. Tools usually track **plans** (tasks, deadlines) but not **reality** (what actually happened). The result is guilt, overload, and a sense that work never quite “makes sense.”

## What this does

Work Intelligence OS is a **reflection layer** on top of how you work. It does not replace your project tools. It does not try to optimize you. It helps you:

1. **Capture reality** — What you did, when, and where your attention went.
2. **See patterns** — Context switching, work-type mix, which projects get attention and which don’t.
3. **Close the loop** — End the day (and week, month) with a clear picture and a short reflection instead of open loops and guilt.
4. **Connect plan and reality** — See how what you planned (tasks, goals) lines up with what you actually did — without scores or shame.

---

## How it works (core workflow)

Everything in the app supports one loop:

```
  Plan (optional)  →  Log  →  Insight  →  Closure
        ↑                ↑         ↑            ↑
        │                │         │            └── End the day with a reflection
        │                │         └── Understand what happened (day / week / month)
        │                └── Record what you did (and optionally link to a task)
        └── Goals, tasks, milestones (by hand or with the AI planner)
```

- **Plan** — You define projects, goals, tasks, and milestones (or get a first draft from the AI Project Planner). This is “what I intend.”
- **Log** — You record what you actually did: date, project, work type, a short note, and optionally which task you worked on. This is “what happened.”
- **Insight** — The app turns your logs into a daily briefing, weekly story, monthly view, and patterns over the last 14 days. No scores — only observations.
- **Closure** — You close the day with a short reflection (built from your data) and an optional note. A mental bookmark: “Today is done.”

Gentle **reminders** (end-of-day, weekly, overdue tasks, “no progress” on a project) and a **notifications** page keep the loop in view without adding pressure.

---

## Features

### Capture and plan

- **Daily work log** — Date, project, work type (e.g. deep focus, meetings, fixing, learning, thinking), note, and optional link to a task. Your logs are the single source for all insights.
- **Projects** — Create and organize work by project. Each project can have goals, tasks, and milestones; list, board, and calendar views; drag-and-drop reorder.
- **AI Project Planner** — Describe a project in a few sentences; the app suggests goals, tasks, and milestones. You get an editable draft in one step (optional; manual creation is always available).

### Understand (insights and patterns)

- **Dashboard (Today)** — Real daily briefing: narrative summary, quick stats (logs today, focus time, projects touched, day closed), primary focus, work mix, project momentum, and “this week: plan vs reality.”
- **Insights** — **Day** (today): narrative + charts (focus vs reactive, context switching, work-type balance). **Week**: story of the week, plan vs reality, week-over-week comparison. **Month**: how the month looked (days logged, projects, work types).
- **Patterns** — Last 14 days: context switching over time, which projects dominated, work-type balance, weekly and monthly comparison. Observations only; no scores.
- **Your work at a glance** — Last 7 and 30 days: log count, days closed, projects touched, and (for 30 days) one sentence on plan vs actual.

### Close and stay on track

- **Closure (close the day)** — End-of-day reflection generated from your data plus an optional personal note. One closure per day; stored so you can look back.
- **Notifications** — One place for what needs attention: overdue tasks, due today, due soon, projects with no logs this week, and your reminder schedule. Calm tone; no shaming.
- **Reminders** — Configurable: end-of-day reminder, weekly reflection, optional overdue-task reminder, optional “no progress this week” nudge. Delivered in-app, by **email** (morning briefing), and as **OS-level push** (e.g. on your phone or desktop).

### Auth and onboarding

- Sign-in with **Clerk**. Short onboarding: name, role (e.g. developer, freelancer, student), and optional work style so the app can tailor tone and examples.

---

## Where you can use it

- **Web app** — Use it in any modern browser. Same experience on desktop and tablet: full dashboard, insights, patterns, projects (goals, tasks, milestones), log, closure, reminders, and notifications.
- **Mobile (PWA)** — Add the web app to your home screen for a phone-friendly experience. Bottom navigation (Home, Log, Projects, History, More), quick log and close-the-day flows, morning briefing, and optional push nudges. Same account and data as the web app.
- **Android app** — Install from the Play Store (or as a Trusted Web Activity). Same app and data as web and PWA; optimized for logging and closure on the go.

Data and timezone are tied to your account: the same account on web, PWA, and Android sees the same projects, logs, insights, and reminders. Your reminder times and “today” / “this week” use your Settings timezone.

---

## Intelligence under the hood

The app uses a small **intelligence layer** so what you see is based on your real data, not generic tips.

- **Day engine** — From your logs for a given day: context switching (how many projects), work-type distribution, attention imbalance (projects with no log for a while), and overcommit signals. Feeds the dashboard, day insight, and closure reflection.
- **Week engine** — From day insights and logs for the week: most focused / most fragmented day, projects touched vs ignored, work-type mix, overload cues. Feeds the week insight and “this week vs last week” comparison.
- **Month engine** — Aggregates logs for the month: days logged, work types, projects touched. Feeds the month insight.
- **Narratives** — Your dashboard and insight pages lead with **language** (a short summary of what happened). When an API key is set, the app can generate these summaries; otherwise it uses clear template copy. Tone is calm and observational, never judgmental.

There are no productivity scores, rankings, or “good/bad” labels — only clarity, patterns, and closure.

---

## Tech stack (for developers)

- **Next.js 14** (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **TanStack Query**, Zustand, **@tanstack/react-table**, **@dnd-kit** (sortable)
- **Prisma**, PostgreSQL (e.g. Supabase)
- **Clerk** (auth)
- **OpenAI** (gpt-4o-mini) for narratives, insights, AI project planner, reminder copy
- **Recharts** for insight and pattern charts
- **Resend** for reminder emails; **Web Push** (VAPID) for OS-level nudges

Server Actions for mutations; cron + DB for background work (weekly insights, send reminders, push nudges, refresh narratives). Engine logic is pure (no DB/UI in engine code). See [docs/DEVELOPER.md](docs/DEVELOPER.md) for architecture, data model, flows, and APIs.

---

## Setup

1. Copy `.env.example` to `.env` and set:
   - **Database:** `DATABASE_URL` (e.g. Supabase PostgreSQL)
   - **Clerk:** `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, and optional sign-in/sign-up/after-sign-in/after-sign-up URLs
   - Optional: `OPENAI_API_KEY` (narratives, insights, planner), `CRON_SECRET`, `FAKE_USER_ID` (for populate script), Resend and VAPID keys for email and push

2. Install and run migrations:
   ```bash
   npm install
   npx prisma generate
   npx prisma migrate dev
   ```

3. Run the app:
   ```bash
   npm run dev
   ```

4. **Optional:** Seed fake data for testing:
   - In the app: sign in → **Settings** → **Seed my account**, or
   - CLI: `npm run db:populate-fake` (uses `FAKE_USER_ID` from `.env` or pass your Clerk user id as first arg).

**Data and timezone:** Local dev uses the database in your `.env`. Production uses its own database. Reminder times and “today” / “this week” use your Settings timezone.

---

## Reminders and notifications (production)

For **reliable morning email** and **OS-level push nudges** in all timezones:

1. Set **`CRON_SECRET`** (same value in your host and scheduler).
2. Set **`VAPID_PUBLIC_KEY`** and **`VAPID_PRIVATE_KEY`** (e.g. `npx web-push generate-vapid-keys`) for Web Push.
3. **QStash (or equivalent) is required:** run `npm run qstash:schedule` once after deploy. This schedules:
   - **Push nudges** — `GET /api/cron/send-push-nudges` every 15 minutes
   - **Morning email** — `GET /api/cron/send-reminders` every 60 minutes
   - **Weekly reminder** — `GET /api/cron/send-weekly-reminders` every 60 minutes
   - **Overdue and weekly project nudge** — `GET /api/cron/send-overdue-and-project-nudges` every 60 minutes
4. In [Upstash Console → QStash → Schedules](https://console.upstash.com/qstash), confirm all schedules exist.

Without QStash, OS-level nudges and morning email may not reach users in all timezones. See [docs/QSTASH_SETUP.md](docs/QSTASH_SETUP.md).

---

## Product law

If a feature does not help a tired knowledge worker feel **more understood** at the end of the day, it is not built.

- **Clarity** over productivity  
- **Understanding** over optimization  
- **Closure** over hustle  

Everything in the app is evaluated against this.
