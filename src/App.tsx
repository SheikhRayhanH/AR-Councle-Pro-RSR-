import { useCallback, useState } from 'react'
import type { Page } from './types'
import { AGENCY } from './data/agency'
import { AuthProvider, useAuth, useUser } from './hooks/useAuth'
import { StudentsProvider } from './hooks/useStudents'
import { ToastProvider } from './hooks/useToast'
import Sidebar, { NAV } from './components/Sidebar'
import Header from './components/Header'
import LoginPage from './components/LoginPage'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import Payments from './pages/Payments'
import Team from './pages/Team'
import Tasks from './pages/Tasks'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import { TeamProvider } from './hooks/useTeam'
import Universities from './pages/Universities'
import Applications from './pages/Applications'
import { canView } from './data/permissions'
import ComingSoon from './pages/ComingSoon'
function Shell() {
  const user = useUser()
  const [page, setPage] = useState<Page>('dashboard')
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [openAdd, setOpenAdd] = useState(false)
  const go = (p: Page) => { setPage(p); setOpen(false) }
  const onQuery = (q: string) => { setQuery(q); if (q && page !== 'students') setPage('students') }
  const addHandled = useCallback(() => setOpenAdd(false), [])
  const built = ['dashboard', 'students', 'payments', 'universities', 'applications', 'counselors', 'tasks', 'reports', 'settings'].includes(page)
  return (<>
    <Sidebar page={page} open={open} onNavigate={go} onClose={() => setOpen(false)} />
    <div className="lg:ml-64 print:ml-0">
      <Header query={query} onQuery={onQuery} onMenu={() => setOpen(true)} onGo={go} />
      <main className="mx-auto max-w-7xl p-4 lg:p-8">
        {page === 'dashboard' && <Dashboard onGo={go} onAddStudent={() => { setPage('students'); setOpenAdd(true) }} />}
        {page === 'students' && <Students query={query} openAdd={openAdd} onAddHandled={addHandled} />}
        {page === 'payments' && canView(user.role, 'payments') && <Payments />}
        {page === 'universities' && canView(user.role, 'universities') && <Universities query={query} />}
        {page === 'applications' && canView(user.role, 'applications') && <Applications query={query} />}
        {page === 'counselors' && canView(user.role, 'counselors') && <Team query={query} />}
        {page === 'tasks' && canView(user.role, 'tasks') && <Tasks query={query} />}
        {page === 'reports' && canView(user.role, 'reports') && <Reports />}
        {page === 'settings' && canView(user.role, 'settings') && <Settings />}
        {!built && <ComingSoon title={NAV.find((n) => n.id === page)!.label} />}
      </main>
      <footer className="print:hidden px-4 pb-8 pt-2 text-center text-xs text-mut"><b className="text-ink">{AGENCY.name} © 2026</b><br />Developed by {AGENCY.developer}</footer>
    </div>
  </>)
}
function Gate() {
  const { user } = useAuth()
  if (!user) return <LoginPage />
  return <TeamProvider><StudentsProvider><Shell key={user.role} /></StudentsProvider></TeamProvider>
}
export default function App() { return <AuthProvider><ToastProvider><Gate /></ToastProvider></AuthProvider> }
