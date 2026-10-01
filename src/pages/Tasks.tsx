import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Plus } from 'lucide-react'
import { useStudents } from '../hooks/useStudents'
import { useTeam } from '../hooks/useTeam'
import { useUser } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import { taskStore } from '../services/stores'
import type { Task } from '../types'
import Modal from '../components/Modal'
const TONE: Record<Task['priority'], string> = { High: '!bg-red-100 !text-red-700', Medium: '!bg-amber-100 !text-amber-700', Low: '' }
const today = () => new Date().toISOString().slice(0, 10)
interface FormProps { names: string[]; students: string[]; locked?: string; onSave: (v: Omit<Task, 'id'>) => Promise<void>; onCancel: () => void }
function TaskForm({ names, students, locked, onSave, onCancel }: FormProps) {
  const [title, setTitle] = useState('')
  const [due, setDue] = useState(today())
  const [priority, setPriority] = useState<Task['priority']>('Medium')
  const [assignee, setAssignee] = useState(locked ?? names[0] ?? '')
  const [student, setStudent] = useState('')
  const [err, setErr] = useState('')
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !assignee) return setErr('Title and assignee are required')
    await onSave({ title: title.trim(), due, priority, assignee, student: student || undefined, done: false })
  }
  return (
    <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
      <label className="text-xs font-semibold text-mut sm:col-span-2">Task<input className="input mt-1" value={title} onChange={(e) => setTitle(e.target.value)} /></label>
      <label className="text-xs font-semibold text-mut">Due date<input type="date" className="input mt-1" value={due} onChange={(e) => setDue(e.target.value)} /></label>
      <label className="text-xs font-semibold text-mut">Priority<select className="input mt-1" value={priority} onChange={(e) => setPriority(e.target.value as Task['priority'])}><option>High</option><option>Medium</option><option>Low</option></select></label>
      <label className="text-xs font-semibold text-mut">Assigned to<select className="input mt-1" disabled={!!locked} value={assignee} onChange={(e) => setAssignee(e.target.value)}>{(locked ? [locked] : names).map((n) => <option key={n}>{n}</option>)}</select></label>
      <label className="text-xs font-semibold text-mut">Student (optional)<select className="input mt-1" value={student} onChange={(e) => setStudent(e.target.value)}><option value="">None</option>{students.map((n) => <option key={n}>{n}</option>)}</select></label>
      {err && <p role="alert" className="text-sm text-red-600 sm:col-span-2">{err}</p>}
      <div className="flex justify-end gap-2 sm:col-span-2"><button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button><button className="btn">Add task</button></div>
    </form>)
}
export default function Tasks({ query }: { query: string }) {
  const me = useUser()
  const { students } = useStudents()
  const { members } = useTeam()
  const toast = useToast()
  const [rows, setRows] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const mine = me.role === 'counselor'
  const t = today()
  useEffect(() => { taskStore.list().then((r) => { setRows(r); setLoading(false) }) }, [])
  const names = useMemo(() => members.filter((m) => m.status === 'Active' && m.role !== 'admission').map((m) => m.name), [members])
  const visible = useMemo(() => { const q = query.trim().toLowerCase(); return rows.filter((r) => (!mine || r.assignee === me.name) && (!q || `${r.title} ${r.student ?? ''} ${r.assignee}`.toLowerCase().includes(q))).sort((a, b) => a.due.localeCompare(b.due)) }, [rows, mine, me.name, query])
  const groups: [string, Task[]][] = [['Overdue', visible.filter((r) => !r.done && r.due < t)], ['Today', visible.filter((r) => !r.done && r.due === t)], ['Upcoming', visible.filter((r) => !r.done && r.due > t)], ['Completed', visible.filter((r) => r.done)]]
  const toggle = async (r: Task) => { const u = await taskStore.save({ ...r, done: !r.done }); setRows((p) => p.map((x) => (x.id === u.id ? u : x))) }
  const create = async (v: Omit<Task, 'id'>) => { const u = await taskStore.save(v); setRows((p) => [u, ...p]); toast('Task added'); setAdding(false) }
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-2xl font-extrabold">Tasks & Reminders</h1><p className="text-sm text-mut">{mine ? 'Your tasks' : 'All team tasks'}</p></div>
        <button className="btn" onClick={() => setAdding(true)}><Plus size={16} />Add Task</button>
      </div>
      {loading && <div className="h-32 animate-pulse rounded-2xl bg-soft" />}
      {!loading && groups.map(([name, list]) => (
        <section key={name} className="card">
          <h2 className="mb-1 font-bold">{name} <span className={`pill ${name === 'Overdue' && list.length ? '!bg-red-100 !text-red-700' : ''}`}>{list.length}</span></h2>
          {!list.length && <p className="py-3 text-sm text-mut">Nothing here.</p>}
          <ul>{list.map((r) => (
            <li key={r.id} className="flex items-center gap-3 border-b border-line py-3 last:border-0">
              <input type="checkbox" className="h-4 w-4 accent-[#1d4ed8]" checked={r.done} onChange={() => toggle(r)} aria-label={`Mark "${r.title}" as ${r.done ? 'not done' : 'done'}`} />
              <div className="min-w-0 flex-1"><b className={`block text-sm ${r.done ? 'text-mut line-through' : ''}`}>{r.title}</b><span className="text-xs text-mut">{r.student ? `${r.student} · ` : ''}{r.assignee} · Due {r.due}</span></div>
              <span className={`pill ${TONE[r.priority]}`}>{r.priority}</span>
            </li>))}</ul>
        </section>))}
      {adding && <Modal title="Add Task" onClose={() => setAdding(false)}><TaskForm names={names} students={students.map((s) => s.name)} locked={mine ? me.name : undefined} onSave={create} onCancel={() => setAdding(false)} /></Modal>}
    </div>)
}
