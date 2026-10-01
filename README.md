# AR Councle Pro

Education consultancy management system. Frontend only for now: all data is mock and held in memory.
Developed by Md. Rayhan Sheikh Rahat.

## Features
- Dashboard with KPIs that update from student data, trend and country charts, quick actions
- Students: search, filter, sort, pagination, add, edit, view details, delete with confirmation
- Applications: status tracking (updates the student and the Dashboard), add, edit, delete
- Universities, Team, Tasks & Reminders, Payments, Reports (CSV and print), Settings
- Role-based access (demo): Admin, Admission team, Counselor
- Dark mode (remembered), responsive layout, Web3Forms contact form

## Roles
| Role | Access |
|---|---|
| Admin | Everything, including Payments, Reports, Settings and Team |
| Admission team | Dashboard, Students, Applications, Universities |
| Counselor | Dashboard, own students, Tasks |

Rules live in `src/data/permissions.ts`. The demo login is for UI only; the backend must enforce roles on every request.

## Stack
React, Vite, TypeScript, Tailwind CSS, Lucide React, Recharts.

## Structure
```text
src/
  components/  reusable UI
  pages/       one file per page
  data/        mock data, permissions, agency info
  services/    data access (swap for real API calls later)
  hooks/       auth, students, team, toast, local storage
  types/       shared types
```

## Run
```bash
npm install
npm run dev
```
Build for production: `npm run build`.

## Web3Forms setup
1. Get a free access key at https://web3forms.com
2. Copy `.env.example` to `.env` and set `VITE_WEB3FORMS_ACCESS_KEY`
3. Restart `npm run dev`. On Netlify, add the same variable under Environment variables.

## Roadmap
Backend: real login and invites, database, REST API, server-side role checks, document storage, audit log, payment gateway, multiple counselors and agencies.
