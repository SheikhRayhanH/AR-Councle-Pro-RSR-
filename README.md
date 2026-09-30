# AR Councle Pro

Education consultancy management system (frontend only). Built by Md. Rayhan Sheikh Rahat.

## Features
Dashboard with live KPIs and charts, Students CRUD (search, filter, sort, pagination, confirm delete), dark mode, responsive layout, Web3Forms contact form.

## Stack
React, Vite, TypeScript, Tailwind CSS, Lucide React, Recharts.

## Structure
```text
src/
  components/  reusable UI (Sidebar, Header, Modal, forms)
  pages/       Dashboard, Students, ComingSoon
  data/        mock data and agency info
  services/    studentService (swap for real API later), contactService (Web3Forms)
  hooks/       useStudents, useToast
  types/       shared TypeScript types
```

## Run
```bash
npm install
npm run dev
```

## Web3Forms setup
1. Get a free access key at https://web3forms.com
2. Copy `.env.example` to `.env` and set `VITE_WEB3FORMS_ACCESS_KEY`
3. Restart `npm run dev`. `.env` is git-ignored.

## Roadmap
Applications, Universities, Counselors, Tasks, Reports, Settings pages; admin-only Payments; then backend (auth, database, REST API, role-based access, document storage).
