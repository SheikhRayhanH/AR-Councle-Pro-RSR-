import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { ArrowUpDown, Plus, Trash2 } from 'lucide-react'
import { useStudents } from '../hooks/useStudents'
import { useToast } from '../hooks/useToast'
import { applicationStore, universityStore } from '../services/stores'
import { STATUSES } from '../data/mock'
import type { Application, ApplicationStatus, Student, University } from '../types'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import Pagination from '../components/Pagination'
const PER = 6
function AppForm({ students, unis, onSave, onCancel }: { students: Student[]; unis: University[]; onSave: (v: Omit<Application, 'id'>) => Promise<void>; onCancel: () => void }) {
  const [student, setStudent] = useState(students[0]?.name ?? '')
  const [uni, setUni] = useState(unis[0]?.name ?? '')
  const [program, setProgram] = useState('')
  const [intake, setIntake] = useState('Fall 2027')
  const [status, setStatus] = useState<ApplicationStatus>('Draft')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!student || !uni || !program.trim()) return setErr('Student, university and program are required')
    setErr(''); setBusy(true)
    await onSave({ student, university: uni, country: unis.find((u) => u.name === uni)?.country ?? '', program, intake, status, date: new Date().toISOString().slice(0, 10) })
    setBusy(false)
  }
  return (
    <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
      <label className="text-xs font-semibold text-mut">Student<select className="input mt-1" value={student} onChange={(e) => setStudent(e.target.value)}>{students.map((s) => <option key={s.id}>{s.name}</option>)}</select></label>
      <label className="text-xs font-semibold text-mut">University<select className="input mt-1" value={uni} onChange={(e) => setUni(e.target.value)}>{unis.map((u) => <option key={u.id}>{u.name}</option>)}</select></label>
      <label className="text-xs font-semibold text-mut">Program<input className="input mt-1" value={program} onChange={(e) => setProgram(e.target.value)} /></label>
      <label className="text-xs font-semibold text-mut">Intake<input className="input mt-1" value={intake} onChange={(e) => setIntake(e.target.value)} /></label>
      <label className="text-xs font-semibold text-mut">Status<select className="input mt-1" value={status} onChange={(e) => setStatus(e.target.value as ApplicationStatus)}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></label>
      {err && <p role="alert" className="text-sm text-red-600 sm:col-span-2">{err}</p>}
      <div className="flex justify-end gap-2 sm:col-span-2"><button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button><button className="btn" disabled={busy}>{busy ? 'Saving...' : 'Add application'}</button></div>
    </form>)
}
export default function Applications({ query }: { query: string }) {
  const { students, update } = useStudents()
  const toast = useToast()
  const [rows, setRows] = useState<Application[]>([])
  const [unis, setUnis] = useState<University[]>([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [newest, setNewest] = useState(true)
  const [pg, setPg] = useState(1)
  const [adding, setAdding] = useState(false)
  const [del, setDel] = useState<Application | null>(null)
  useEffect(() => { Promise.all([applicationStore.list(), universityStore.list()]).then(([a, u]) => { setRows(a); setUnis(u); setLoading(false) }) }, [])
  useEffect(() => { setPg(1) }, [query, status])
  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows.filter((r) => (!status || r.status === status) && (!q || `${r.student} ${r.university} ${r.program}`.toLowerCase().includes(q))).sort((a, b) => (newest ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)))
  }, [rows, query, status, newest])
  // Keep the student's status in step with their latest application, so Dashboard numbers update.
  const syncStudent = async (name: string, st: ApplicationStatus) => { const s = students.find((x) => x.name === name); if (s) { const { id, addedAt, ...input } = s; await update(id, { ...input, status: st }) } }
  const changeStatus = async (a: Application, st: ApplicationStatus) => { const u = await applicationStore.save({ ...a, status: st }); setRows((r) => r.map((x) => (x.id === u.id ? u : x))); await syncStudent(a.student, st); toast(`Status changed to ${st}`) }
  const create = async (v: Omit<Application, 'id'>) => { const a = await applicationStore.save(v); setRows((r) => [a, ...r]); await syncStudent(a.student, a.status); toast('Application added'); setAdding(false) }
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-2xl font-extrabold">Applications</h1><p className="text-sm text-mut">{list.length} applications. Changing a status updates the Dashboard.</p></div>
        <button className="btn" onClick={() => setAdding(true)}><Plus size={16} />Add Application</button>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        <select className="input !w-auto" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status"><option value="">All statuses</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
        <button className="btn-ghost" onClick={() => setNewest(!newest)}><ArrowUpDown size={16} />{newest ? 'Newest first' : 'Oldest first'}</button>
      </div>
      <div className="card overflow-x-auto !p-0">
        <table className="w-full min-w-[900px] text-sm">
          <thead><tr className="text-left text-xs text-mut">{['Student', 'University', 'Program', 'Intake', 'Applied on', 'Status', ''].map((h) => <th key={h} className="border-b border-line px-4 py-3 font-semibold">{h}</th>)}</tr></thead>
          <tbody>
            {loading && Array.from({ length: 4 }).map((_, i) => <tr key={i}><td colSpan={7} className="px-4 py-3"><div className="h-8 animate-pulse rounded-lg bg-soft" /></td></tr>)}
            {!loading && list.slice((pg - 1) * PER, pg * PER).map((a) => (
              <tr key={a.id} className="border-b border-line last:border-0 hover:bg-soft">
                <td className="px-4 py-3 font-bold">{a.student}</td><td className="px-4 py-3">{a.university}<div className="text-xs text-mut">{a.country}</div></td>
                <td className="px-4 py-3">{a.program}</td><td className="px-4 py-3">{a.intake}</td><td className="px-4 py-3">{a.date}</td>
                <td className="px-4 py-3"><select aria-label={`Status for ${a.student}`} className="input !w-auto !py-1.5" value={a.status} onChange={(e) => changeStatus(a, e.target.value as ApplicationStatus)}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></td>
                <td className="px-4 py-3"><button aria-label={`Delete application for ${a.student}`} className="rounded-lg p-2 text-red-600 hover:bg-card" onClick={() => setDel(a)}><Trash2 size={15} /></button></td>
              </tr>))}
          </tbody>
        </table>
        {!loading && !list.length && <p className="py-12 text-center text-sm text-mut">No applications found. Try a different search or add one.</p>}
      </div>
      <Pagination page={pg} total={list.length} per={PER} onChange={setPg} />
      {adding && <Modal title="Add Application" onClose={() => setAdding(false)}><AppForm students={students} unis={unis} onSave={create} onCancel={() => setAdding(false)} /></Modal>}
      {del && <ConfirmDialog title="Delete application?" message={`The application for ${del.student} at ${del.university} will be removed.`} confirmLabel="Delete" onClose={() => setDel(null)} onConfirm={async () => { await applicationStore.remove(del.id); setRows((r) => r.filter((x) => x.id !== del.id)); toast('Application deleted'); setDel(null) }} />}
    </div>)
}
