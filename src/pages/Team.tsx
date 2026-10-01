import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { applicationStore, taskStore } from '../services/stores'
import { Plus, Trash2 } from 'lucide-react'
import { useTeam } from '../hooks/useTeam'
import { useStudents } from '../hooks/useStudents'
import { useUser } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import { PAGE_ACCESS, ROLE_LABEL } from '../data/permissions'
import { NAV } from '../components/Sidebar'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import type { Application, Role, Task, TeamMember } from '../types'
const ROLES: Role[] = ['admin', 'admission', 'counselor']
function MemberForm({ onSave, onCancel }: { onSave: (v: Omit<TeamMember, 'id'>) => Promise<void>; onCancel: () => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<Role>('counselor')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return setErr('Name is required')
    if (!/^\S+@\S+\.\S+$/.test(email)) return setErr('Enter a valid email')
    setErr(''); setBusy(true)
    await onSave({ name: name.trim(), email, role, status: 'Active', joined: new Date().toISOString().slice(0, 10) })
    setBusy(false)
  }
  return (
    <form onSubmit={submit} className="grid gap-3">
      <label className="text-xs font-semibold text-mut">Full name<input className="input mt-1" value={name} onChange={(e) => setName(e.target.value)} /></label>
      <label className="text-xs font-semibold text-mut">Email<input type="email" className="input mt-1" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
      <label className="text-xs font-semibold text-mut">Role<select className="input mt-1" value={role} onChange={(e) => setRole(e.target.value as Role)}>{ROLES.map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}</select></label>
      {err && <p role="alert" className="text-sm text-red-600">{err}</p>}
      <div className="flex justify-end gap-2"><button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button><button className="btn" disabled={busy}>{busy ? 'Adding...' : 'Add member'}</button></div>
    </form>)
}
export default function Team({ query }: { query: string }) {
  const { members, loading, save, remove } = useTeam()
  const { students } = useStudents()
  const me = useUser()
  const toast = useToast()
  const [adding, setAdding] = useState(false)
  const [off, setOff] = useState<TeamMember | null>(null)
  const [del, setDel] = useState<TeamMember | null>(null)
  const [apps, setApps] = useState<Application[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  useEffect(() => { applicationStore.list().then(setApps); taskStore.list().then(setTasks) }, [])
  const list = useMemo(() => { const q = query.trim().toLowerCase(); return members.filter((m) => !q || `${m.name} ${m.email}`.toLowerCase().includes(q)) }, [members, query])
  const stats = (m: TeamMember) => { const mine = students.filter((s) => s.counselor === m.name); const won = mine.filter((s) => s.status === 'Offer Received' || s.status === 'Visa Approved').length; return { n: mine.length, pct: mine.length ? Math.round((won / mine.length) * 100) : 0 } }
  const setRole = async (m: TeamMember, role: Role) => { await save({ ...m, role }); toast(`${m.name} is now ${ROLE_LABEL[role]}`) }
  const setStatus = async (m: TeamMember, status: TeamMember['status']) => { await save({ ...m, status }); toast(`${m.name} ${status === 'Active' ? 'enabled' : 'disabled'}`); setOff(null) }
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-2xl font-extrabold">Team</h1><p className="text-sm text-mut">Admin only. Add members and control what each role can see.</p></div>
        <button className="btn" onClick={() => setAdding(true)}><Plus size={16} />Add Member</button>
      </div>
      <div className="card overflow-x-auto !p-0">
        <table className="w-full min-w-[980px] text-sm">
          <thead><tr className="text-left text-xs text-mut">{['Member', 'Role', 'Assigned students', 'Applications', 'Pending tasks', 'Performance', 'Status', ''].map((h) => <th key={h} className="border-b border-line px-4 py-3 font-semibold">{h}</th>)}</tr></thead>
          <tbody>
            {loading && Array.from({ length: 4 }).map((_, i) => <tr key={i}><td colSpan={8} className="px-4 py-3"><div className="h-8 animate-pulse rounded-lg bg-soft" /></td></tr>)}
            {!loading && list.map((m) => {
              const self = m.name === me.name, st = stats(m), isC = m.role === 'counselor', ap = apps.filter((a) => students.find((s) => s.name === a.student)?.counselor === m.name).length, pt = tasks.filter((t) => t.assignee === m.name && !t.done).length
              return (
                <tr key={m.id} className="border-b border-line last:border-0 hover:bg-soft">
                  <td className="px-4 py-3"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-soft font-bold text-pri">{m.name[0]}</span><div><b>{m.name}{self && <span className="ml-2 text-xs font-medium text-mut">(you)</span>}</b><div className="text-xs text-mut">{m.email}</div></div></div></td>
                  <td className="px-4 py-3"><select aria-label={`Role for ${m.name}`} disabled={self} className="input !w-auto !py-1.5" value={m.role} onChange={(e) => setRole(m, e.target.value as Role)}>{ROLES.map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}</select></td>
                  <td className="px-4 py-3">{isC ? st.n : <span className="text-mut">-</span>}</td>
                  <td className="px-4 py-3">{isC ? ap : <span className="text-mut">-</span>}</td><td className="px-4 py-3">{pt}</td>
                  <td className="px-4 py-3">{isC ? <div className="w-28"><div className="text-xs text-mut">{st.pct}% offers/visa</div><div className="mt-1 h-1.5 overflow-hidden rounded bg-line"><i className="block h-full bg-pri" style={{ width: `${st.pct}%` }} /></div></div> : <span className="text-mut">-</span>}</td>
                  <td className="px-4 py-3"><span className={`pill ${m.status === 'Active' ? '!bg-emerald-100 !text-emerald-700' : '!bg-stone-200 !text-stone-600'}`}>{m.status}</span></td>
                  <td className="px-4 py-3">{!self && <div className="flex gap-1"><button className="btn-ghost !px-3 !py-1.5 text-xs" onClick={() => (m.status === 'Active' ? setOff(m) : setStatus(m, 'Active'))}>{m.status === 'Active' ? 'Disable' : 'Enable'}</button><button aria-label={`Remove ${m.name}`} className="rounded-lg p-2 text-red-600 hover:bg-card" onClick={() => setDel(m)}><Trash2 size={15} /></button></div>}</td>
                </tr>)
            })}
          </tbody>
        </table>
        {!loading && !list.length && <p className="py-12 text-center text-sm text-mut">No team members found.</p>}
      </div>
      <div className="card"><h2 className="mb-3 font-bold">Roles and access</h2>
        <div className="grid gap-3 md:grid-cols-3">{ROLES.map((r) => <div key={r} className="rounded-xl border border-line bg-bg p-3"><b className="text-sm">{ROLE_LABEL[r]}</b><p className="mt-1 text-xs text-mut">{PAGE_ACCESS[r].map((p) => NAV.find((n) => n.id === p)?.label).join(', ')}{r === 'counselor' ? '. Own students only.' : ''}</p></div>)}</div>
      </div>
      {adding && <Modal title="Add Team Member" onClose={() => setAdding(false)}><MemberForm onCancel={() => setAdding(false)} onSave={async (v) => { await save(v); toast('Member added. The invite email will be sent once the backend is connected.'); setAdding(false) }} /></Modal>}
      {off && <ConfirmDialog title="Disable member?" message={`${off.name} will no longer appear in counselor lists. You can enable them again anytime.`} confirmLabel="Disable" onClose={() => setOff(null)} onConfirm={() => setStatus(off, 'Disabled')} />}
      {del && <ConfirmDialog title="Remove member?" message={`${del.name} will be removed from the team. Their students stay in the system.`} confirmLabel="Remove" onClose={() => setDel(null)} onConfirm={async () => { await remove(del.id); toast('Member removed'); setDel(null) }} />}
    </div>)
}
