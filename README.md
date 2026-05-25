# StudyFlow — Student Productivity Dashboard

A modern, responsive student productivity web app built with **React**, **Vite**, and **Tailwind CSS**. Designed for portfolio and interview demonstrations with a premium SaaS-style UI.

## Features

- **Dashboard** — Welcome section, productivity summary, stats, motivation quotes (API + fallback)
- **Tasks** — CRUD, priorities, filters, LocalStorage persistence
- **Pomodoro** — 25/5 min timer, circular progress, session counter, sound alerts
- **Notes** — Create/edit/delete with auto-save
- **Goals** — Daily goals, progress bars, streak counter
- **Analytics** — Recharts pie, bar, and line charts
- **Settings** — Profile, theme, notifications
- **UI** — Glassmorphism, dark mode, responsive layout, toasts, search, live clock

## Tech Stack

- React 19 (functional components + hooks)
- Tailwind CSS v4
- Recharts
- react-hot-toast
- lucide-react
- LocalStorage for data persistence

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── analytics/
│   ├── dashboard/
│   ├── goals/
│   ├── layout/
│   ├── notes/
│   ├── pomodoro/
│   ├── settings/
│   ├── tasks/
│   └── ui/
├── context/
├── hooks/
└── utils/
```

## License

MIT
