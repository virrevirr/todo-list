# ToDo

A task manager built with Next.js and Supabase. Create lists, add tasks, set deadlines, and track what you've done.

## Tech stack

- **Framework** — [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- **Auth & Database** — [Supabase](https://supabase.com) (Row Level Security, `timestamptz` deadlines)
- **Styling** — [Tailwind CSS 4](https://tailwindcss.com)
- **Testing** — [Playwright](https://playwright.dev) (E2E)
- **Language** — TypeScript, React 19

## Features

- Email/password signup and login
- Create, rename, and delete todo lists
- Add, complete, un-complete, and delete tasks
- Task detail sidebar with description and deadline
- Overdue deadline indicator (coral tag when past due)
- Responsive mobile layout with stacked tags
- User profile with editable name
- Account deletion

## Getting started

### Prerequisites

- Node.js 18+
- A Supabase project with `lists`, `todos`, and `profiles` tables

### Environment variables

Create a `.env.local` file in the project root:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
app/
  page.tsx              — Landing page
  (auth)/login/         — Login
  (auth)/signup/        — Signup
  dashboard/            — Main app (lists + todos)
  profile/              — User profile
  api/lists/            — Lists CRUD
  api/todos/            — Todos CRUD
  api/profile/          — Profile update & account deletion
components/
  dashboard-shell.tsx   — Dashboard layout with sidebar drawer
  sidebar.tsx           — List navigation and creation
  todo-view.tsx         — Todo list for a selected list
  todo-list-item.tsx    — Single todo row with overdue logic
  todo-details-sidebar.tsx — Detail panel (title, description, deadline)
  add-todo-form.tsx     — New task input
  profile-form.tsx      — Profile editing and account deletion
lib/
  types.ts              — Shared TypeScript types (List, Todo)
  supabase-browser.ts   — Supabase client (browser)
  supabase-server.ts    — Supabase client (server)
```

## Testing

Tests use Playwright and run against `http://localhost:3000`.

To run authenticated tests locally, add to `.env.local`:

```
TEST_EMAIL=your-test-user@example.com
TEST_PASSWORD=your-test-password
```

Then:

```bash
npm test          # headless
npm run test:ui   # interactive UI
```

## Deployment

Deploy to [Vercel](https://vercel.com) with the same environment variables set in your project settings.
