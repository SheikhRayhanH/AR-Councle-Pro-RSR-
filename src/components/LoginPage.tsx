import { ClipboardCheck, GraduationCap, ShieldCheck, UserRound, type LucideIcon } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { AGENCY } from '../data/agency'
import { USERS } from '../data/mock'
import { ROLE_LABEL } from '../data/permissions'
import type { Role } from '../types'
const ROLES: { role: Role; icon: LucideIcon; note: string }[] = [
  { role: 'admin', icon: ShieldCheck, note: 'Everything, including Payments, Settings and Team.' },
  { role: 'admission', icon: ClipboardCheck, note: 'Students, Applications and Universities. No Payments.' },
  { role: 'counselor', icon: UserRound, note: 'Only own students and tasks.' },
]
export default function LoginPage() {
  const { login } = useAuth()
  return (
    <div className="grid min-h-screen place-items-center p-4">
      <div className="card w-full max-w-md text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-pri text-white"><GraduationCap /></div>
        <h1 className="mt-3 text-2xl font-extrabold">{AGENCY.name}</h1>
        <p className="text-sm text-mut">{AGENCY.tagline}</p>
        <p className="mb-3 mt-6 text-sm font-semibold">Choose how to sign in</p>
        <div className="grid gap-3">
          {ROLES.map(({ role, icon: Icon, note }) => (
            <button key={role} className="btn-ghost !justify-start !p-4 text-left" onClick={() => login(role)}>
              <Icon className="shrink-0 text-pri" /><span><b className="block">{ROLE_LABEL[role]}</b><span className="text-xs font-normal text-mut">{USERS[role].name}. {note}</span></span>
            </button>))}
        </div>
        <p className="mt-5 text-xs text-mut">Demo mode. Real email and password login comes with the backend.</p>
        <p className="mt-4 text-xs text-mut">Developed by {AGENCY.developer}</p>
      </div>
    </div>)
}
