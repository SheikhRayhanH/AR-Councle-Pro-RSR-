import { BarChart3, Building2, FileText, GraduationCap, LayoutDashboard, ListChecks, Settings, CreditCard, UserCog, Users, type LucideIcon } from 'lucide-react'
import type { Page } from '../types'
import { AGENCY } from '../data/agency'
import { useUser } from '../hooks/useAuth'
import { canView, ROLE_LABEL } from '../data/permissions'
export const NAV: { id: Page; label: string; icon: LucideIcon; adminOnly?: boolean }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }, { id: 'students', label: 'Students', icon: Users },
  { id: 'applications', label: 'Applications', icon: FileText }, { id: 'universities', label: 'Universities', icon: Building2 },
  { id: 'counselors', label: 'Counselors', icon: UserCog }, { id: 'payments', label: 'Payments', icon: CreditCard, adminOnly: true }, { id: 'tasks', label: 'Tasks & Reminders', icon: ListChecks },
  { id: 'reports', label: 'Reports', icon: BarChart3 }, { id: 'settings', label: 'Settings', icon: Settings },
]
interface Props { page: Page; open: boolean; onNavigate: (p: Page) => void; onClose: () => void }
export default function Sidebar({ page, open, onNavigate, onClose }: Props) {
  const user = useUser()
  return (<>
    {open && <div className="fixed inset-0 z-20 bg-black/50 lg:hidden" onClick={onClose} />}
    <aside className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-navy p-4 text-[#b7c4ee] transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex items-center gap-3 px-2 pb-6">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-pri text-white"><GraduationCap size={20} /></div>
        <div><b className="block text-white">{AGENCY.name}</b><small className="text-xs text-[#8fa3de]">{AGENCY.tagline}</small></div>
      </div>
      <nav className="flex flex-1 flex-col gap-1" aria-label="Main">
        {NAV.filter((n) => canView(user.role, n.id)).map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => onNavigate(id)} aria-current={page === id ? 'page' : undefined}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${page === id ? 'bg-pri text-white shadow-lg shadow-blue-900/40' : 'hover:bg-white/10 hover:text-white'}`}>
            <Icon size={18} />{label}
          </button>))}
      </nav>
      <div className="mt-3 flex items-center gap-3 border-t border-white/10 px-2 pt-4">
        <div className="grid h-9 w-9 place-items-center rounded-full bg-blue-500 font-bold text-white">{user.name[0]}</div>
        <div><b className="block text-sm text-white">{user.name}</b><small className="text-[#8fa3de]">{ROLE_LABEL[user.role]}</small></div>
      </div>
    </aside></>)
}
