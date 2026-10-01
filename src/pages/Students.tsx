import { useEffect, useMemo, useState } from 'react'
import { ArrowUpDown, ChevronLeft, ChevronRight, Eye, Pencil, Plus, Trash2, Users } from 'lucide-react'
import { useStudents } from '../hooks/useStudents'
import { useToast } from '../hooks/useToast'
import { STATUSES } from '../data/mock'
import { useTeam } from '../hooks/useTeam'
import { useUser } from '../hooks/useAuth'
import { seesAllStudents } from '../data/permissions'
import type { Student, StudentInput } from '../types'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import StudentForm from '../components/StudentForm'
import StatusPill from '../components/StatusPill'
import StudentDrawer from '../components/StudentDrawer'
const PER_PAGE = 5
interface Props { query: string; openAdd: boolean; onAddHandled: () => void }
export default function Students({ query, openAdd, onAddHandled }: Props) {
  const { students: all, loading, add, update, remove } = useStudents()
  const user = useUser()
  const isAdmin = seesAllStudents(user.role)
  const students = useMemo(() => (isAdmin ? all : all.filter((s) => s.counselor === user.name)), [all, isAdmin, user.name])
  const toast = useToast()
  const { counselors } = useTeam()
  const [status, setStatus] = useState('')
  const [co, setCo] = useState('')
  const [asc, setAsc] = useState(true)
  const [pg, setPg] = useState(1)
  const [editing, setEditing] = useState<Student | 'new' | null>(null)
  const [del, setDel] = useState<Student | null>(null)
  const [viewing, setViewing] = useState<Student | null>(null)
  useEffect(() => { if (openAdd) { setEditing('new'); onAddHandled() } }, [openAdd, onAddHandled])
  useEffect(() => { setPg(1) }, [query, status, co])
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return students.filter((s) => (!status || s.status === status) && (!co || s.counselor === co) && (!q || `${s.name} ${s.email} ${s.country} ${s.subject}`.toLowerCase().includes(q)))
      .sort((a, b) => (asc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)))
  }, [students, query, status, co, asc])
  const pages = Math.max(1, Math.ceil(rows.length / PER_PAGE))
  const view = rows.slice((pg - 1) * PER_PAGE, pg * PER_PAGE)
  const save = async (v: StudentInput) => {
    if (editing === 'new') { await add(v); toast('Student added') }
    else if (editing) { await update(editing.id, v); toast('Student updated') }
    setEditing(null)
  }
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-2xl font-extrabold">Students</h1><p className="text-sm text-mut">{rows.length} students. Each shows the counselor who added them.</p></div>
        <button className="btn" onClick={() => setEditing('new')}><Plus size={16} />Add Student</button>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        <select className="input !w-auto" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status"><option value="">All statuses</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
        <select className="input !w-auto" hidden={!isAdmin} value={co} onChange={(e) => setCo(e.target.value)} aria-label="Filter by counselor"><option value="">All counselors</option>{counselors.map((c) => <option key={c}>{c}</option>)}</select>
        <button className="btn-ghost" onClick={() => setAsc(!asc)}><ArrowUpDown size={16} />Name {asc ? 'A-Z' : 'Z-A'}</button>
      </div>
      <div className="card overflow-x-auto !p-0">
        <table className="w-full min-w-[760px] text-sm">
          <thead><tr className="text-left text-xs text-mut">{['Student', 'Added by', 'Country', 'HSC / Bachelor', 'IELTS', 'Status', ''].map((h) => <th key={h} className="border-b border-line px-4 py-3 font-semibold">{h}</th>)}</tr></thead>
          <tbody>
            {loading && Array.from({ length: 4 }).map((_, i) => <tr key={i}><td colSpan={7} className="px-4 py-3"><div className="h-8 animate-pulse rounded-lg bg-soft" /></td></tr>)}
            {!loading && view.map((s) => (
              <tr key={s.id} className="border-b border-line last:border-0 hover:bg-soft">
                <td className="px-4 py-3"><b>{s.name}</b><div className="text-xs text-mut">{s.subject}</div></td>
                <td className="px-4 py-3">{s.counselor}<div className="text-xs text-mut">{s.addedAt}</div></td>
                <td className="px-4 py-3">{s.country}</td>
                <td className="px-4 py-3">{s.hsc.toFixed(2)} / {s.bachelor.toFixed(2)}</td>
                <td className="px-4 py-3">{s.ielts.toFixed(1)}</td>
                <td className="px-4 py-3"><StatusPill status={s.status} /></td>
                <td className="px-4 py-3"><div className="flex gap-1">
                  <button aria-label={`View ${s.name}`} className="rounded-lg p-2 hover:bg-card" onClick={() => setViewing(s)}><Eye size={15} /></button>
                  <button aria-label={`Edit ${s.name}`} className="rounded-lg p-2 hover:bg-card" onClick={() => setEditing(s)}><Pencil size={15} /></button>
                  <button aria-label={`Delete ${s.name}`} className="rounded-lg p-2 text-red-600 hover:bg-card" onClick={() => setDel(s)}><Trash2 size={15} /></button></div></td>
              </tr>))}
          </tbody>
        </table>
        {!loading && !rows.length && <div className="grid place-items-center gap-2 py-14 text-center text-mut"><Users size={28} /><b className="text-ink">No students found</b><span className="text-sm">Try a different search or filter, or add a new student.</span></div>}
      </div>
      <div className="mt-4 flex items-center justify-end gap-2 text-sm">
        <button className="btn-ghost !px-2.5" disabled={pg <= 1} onClick={() => setPg(pg - 1)} aria-label="Previous page"><ChevronLeft size={16} /></button>
        <span className="text-mut">Page {pg} of {pages}</span>
        <button className="btn-ghost !px-2.5" disabled={pg >= pages} onClick={() => setPg(pg + 1)} aria-label="Next page"><ChevronRight size={16} /></button>
      </div>
      {viewing && <StudentDrawer s={viewing} onClose={() => setViewing(null)} onEdit={() => { setEditing(viewing); setViewing(null) }} />}
      {editing && <Modal title={editing === 'new' ? 'Add Student' : 'Edit Student'} onClose={() => setEditing(null)}><StudentForm initial={editing === 'new' ? undefined : editing} onSave={save} onCancel={() => setEditing(null)} /></Modal>}
      {del && <ConfirmDialog title="Delete student?" message={`${del.name} will be permanently removed. This cannot be undone.`} confirmLabel="Delete" onClose={() => setDel(null)} onConfirm={async () => { await remove(del.id); toast('Student deleted'); setDel(null) }} />}
    </div>)
}
