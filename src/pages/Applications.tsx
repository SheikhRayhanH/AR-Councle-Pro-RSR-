import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { ArrowUpDown, Pencil, Plus, Trash2 } from 'lucide-react'
import { useStudents } from '../hooks/useStudents'
import { useToast } from '../hooks/useToast'
import { applicationStore, universityStore } from '../services/stores'
import { STATUSES } from '../data/mock'
import type { Application, ApplicationStatus, Student, University } from '../types'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import Pagination from '../components/Pagination'
const PER = 6
function AppForm({ initial, students, unis, onSave, onCancel }: { initial?: Application; students: Student[]; unis: University[]; onSave: (v: Omit<Application, 'id'> & { id?: string }) => Promise<void>; onCancel: () => void }) {
  const [student, setStudent] = useState(initial?.student ?? students[0]?.name ?? '')
  const [uni, setUni] = useState(initial?.university ?? unis[0]?.name ?? '')
  const [program, setProgram] = useState(initial?.program ?? '')
  const [intake, setIntake] = useState(initial?.intake ?? 'Fall 2027')
  const [status, setStatus] = useState<ApplicationStatus>(initial?.status ?? 'Draft')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!student || !uni || !program.trim()) return setErr('Student, university and program are required')
    setErr(''); setBusy(true)
    await onSave({ id: initial?.id, student, university: uni, country: unis.find((u) => u.name === uni)?.country ?? '', program, intake, status, date: initial?.date ?? new Date().toISOString().slice(0, 10) })
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
      <div className="flex justify-end gap-2 sm:col-span-2"><button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button><button className="btn" disabled={busy}>{busy ? 'Saving...' : initial ? 'Save changes' : 'Add application'}</button></div>
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
  const [editing, setEditing] = useState<Application | 'new' | null>(null)
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
  const create = async (v: Omit<Application, 'id'> & { id?: string }) => { const a = await applicationStore.save(v); setRows((r) => (r.some((x) => x.id === a.id) ? r.map((x) => (x.id === a.id ? a : x)) : [a, ...r])); await syncStudent(a.student, a.status); toast(v.id ? 'Application updated' : 'Application added'); setEditing(null) }
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-2xl font-extrabold">Applications</h1><p className="text-sm text-mut">{list.length} applications. Changing a status updates the Dashboard.</p></div>
        <button className="btn" onClick={() => setEditing('new')}><Plus size={16} />Add Application</button>
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
                <td className="px-4 py-3"><div className="flex gap-1"><button aria-label={`Edit application for ${a.student}`} className="rounded-lg p-2 hover:bg-card" onClick={() => setEditing(a)}><Pencil size={15} /></button><button aria-label={`Delete application for ${a.student}`} className="rounded-lg p-2 text-red-600 hover:bg-card" onClick={() => setDel(a)}><Trash2 size={15} /></button></div></td>
              </tr>))}
          </tbody>
        </table>
        {!loading && !list.length && <p className="py-12 text-center text-sm text-mut">No applications found. Try a different search or add one.</p>}
      </div>
      <Pagination page={pg} total={list.length} per={PER} onChange={setPg} />
      {editing && <Modal title={editing === 'new' ? 'Add Application' : 'Edit Application'} onClose={() => setEditing(null)}><AppForm initial={editing === 'new' ? undefined : editing} students={students} unis={unis} onSave={create} onCancel={() => setEditing(null)} /></Modal>}
      {del && <ConfirmDialog title="Delete application?" message={`The application for ${del.student} at ${del.university} will be removed.`} confirmLabel="Delete" onClose={() => setDel(null)} onConfirm={async () => { await applicationStore.remove(del.id); setRows((r) => r.filter((x) => x.id !== del.id)); toast('Application deleted'); setDel(null) }} />}
    </div>)
}
