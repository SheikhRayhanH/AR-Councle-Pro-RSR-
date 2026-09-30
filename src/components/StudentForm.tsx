import { useState, type FormEvent } from 'react'
import type { Student, StudentInput } from '../types'
import { COUNSELORS, STATUSES } from '../data/mock'
import { useUser } from '../hooks/useAuth'
type NumKey = 'ssc' | 'hsc' | 'bachelor' | 'ielts'
const TEXT: [keyof StudentInput, string, string][] = [['name', 'Full name', 'text'], ['email', 'Email', 'email'], ['phone', 'Phone', 'tel'], ['dob', 'Date of birth', 'date'], ['address', 'Address', 'text'], ['subject', 'Subject', 'text'], ['country', 'Preferred country', 'text'], ['university', 'Preferred university', 'text'], ['budget', 'Budget', 'text'], ['intake', 'Intake', 'text']]
const NUM: [NumKey, string, number][] = [['ssc', 'SSC GPA (0-5)', 5], ['hsc', 'HSC GPA (0-5)', 5], ['bachelor', 'Bachelor CGPA (0-4)', 4], ['ielts', 'IELTS (0-9)', 9]]
const EMPTY: StudentInput = { name: '', email: '', phone: '', dob: '', address: '', ssc: 0, hsc: 0, bachelor: 0, subject: '', country: '', university: '', budget: '', ielts: 0, intake: '', status: 'Draft', counselor: COUNSELORS[0], notes: '' }
interface Props { initial?: Student; onSave: (v: StudentInput) => Promise<void>; onCancel: () => void }
export default function StudentForm({ initial, onSave, onCancel }: Props) {
  const user = useUser()
  const [f, setF] = useState<StudentInput>(initial ?? { ...EMPTY, counselor: user.role === 'counselor' ? user.name : EMPTY.counselor })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)
  const set = (k: keyof StudentInput, v: string | number) => setF((p) => ({ ...p, [k]: v }))
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const er: Record<string, string> = {}
    if (!f.name.trim()) er.name = 'Name is required'
    if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = 'Enter a valid email'
    NUM.forEach(([k, l, max]) => { if (f[k] < 0 || f[k] > max) er[k] = `${l} must be within range` })
    setErrors(er)
    if (Object.keys(er).length) return
    setBusy(true); await onSave(f); setBusy(false)
  }
  const Err = ({ k }: { k: string }) => (errors[k] ? <span className="text-xs text-red-600">{errors[k]}</span> : null)
  return (
    <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
      {TEXT.map(([k, l, t]) => (<label key={k} className="text-xs font-semibold text-mut">{l}<input type={t} className="input mt-1" value={String(f[k])} onChange={(e) => set(k, e.target.value)} /><Err k={k} /></label>))}
      {NUM.map(([k, l]) => (<label key={k} className="text-xs font-semibold text-mut">{l}<input type="number" step="0.01" className="input mt-1" value={f[k]} onChange={(e) => set(k, e.target.value === '' ? 0 : Number(e.target.value))} /><Err k={k} /></label>))}
      <label className="text-xs font-semibold text-mut">Application status<select className="input mt-1" value={f.status} onChange={(e) => set('status', e.target.value)}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></label>
      <label className="text-xs font-semibold text-mut">Counselor<select className="input mt-1" disabled={user.role === 'counselor'} value={f.counselor} onChange={(e) => set('counselor', e.target.value)}>{COUNSELORS.map((c) => <option key={c}>{c}</option>)}</select></label>
      <label className="text-xs font-semibold text-mut sm:col-span-2">Notes<textarea rows={2} className="input mt-1" value={f.notes} onChange={(e) => set('notes', e.target.value)} /></label>
      <div className="flex justify-end gap-2 sm:col-span-2"><button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button><button className="btn" disabled={busy}>{busy ? 'Saving...' : initial ? 'Save changes' : 'Add student'}</button></div>
    </form>)
}
