import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useToast } from '../hooks/useToast'
import { universityStore } from '../services/stores'
import type { University } from '../types'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import Pagination from '../components/Pagination'
type Draft = Omit<University, 'id'> & { id?: string }
const PER = 6
const EMPTY: Draft = { name: '', country: '', city: '', ranking: 0, tuition: '', deadline: '', ielts: 6.5, programs: '', status: 'Open' }
const TEXT: [keyof Draft, string, string][] = [['name', 'University', 'text'], ['country', 'Country', 'text'], ['city', 'City', 'text'], ['tuition', 'Tuition fee', 'text'], ['deadline', 'Application deadline', 'date'], ['programs', 'Popular programs', 'text']]
function UniForm({ initial, onSave, onCancel }: { initial?: University; onSave: (v: Draft) => Promise<void>; onCancel: () => void }) {
  const [f, setF] = useState<Draft>(initial ?? EMPTY)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const set = (k: keyof Draft, v: string | number) => setF((p) => ({ ...p, [k]: v }))
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!f.name.trim() || !f.country.trim()) return setErr('University and country are required')
    if (f.ielts < 0 || f.ielts > 9) return setErr('IELTS must be between 0 and 9')
    setErr(''); setBusy(true); await onSave(f); setBusy(false)
  }
  return (
    <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
      {TEXT.map(([k, l, t]) => <label key={k} className="text-xs font-semibold text-mut">{l}<input type={t} className="input mt-1" value={String(f[k] ?? '')} onChange={(e) => set(k, e.target.value)} /></label>)}
      <label className="text-xs font-semibold text-mut">Ranking<input type="number" min="0" className="input mt-1" value={f.ranking} onChange={(e) => set('ranking', Number(e.target.value))} /></label>
      <label className="text-xs font-semibold text-mut">IELTS requirement<input type="number" step="0.5" className="input mt-1" value={f.ielts} onChange={(e) => set('ielts', Number(e.target.value))} /></label>
      <label className="text-xs font-semibold text-mut">Status<select className="input mt-1" value={f.status} onChange={(e) => set('status', e.target.value)}><option>Open</option><option>Closed</option></select></label>
      {err && <p role="alert" className="text-sm text-red-600 sm:col-span-2">{err}</p>}
      <div className="flex justify-end gap-2 sm:col-span-2"><button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button><button className="btn" disabled={busy}>{busy ? 'Saving...' : 'Save university'}</button></div>
    </form>)
}
export default function Universities({ query }: { query: string }) {
  const toast = useToast()
  const [rows, setRows] = useState<University[]>([])
  const [loading, setLoading] = useState(true)
  const [country, setCountry] = useState('')
  const [pg, setPg] = useState(1)
  const [editing, setEditing] = useState<University | 'new' | null>(null)
  const [del, setDel] = useState<University | null>(null)
  useEffect(() => { universityStore.list().then((r) => { setRows(r); setLoading(false) }) }, [])
  useEffect(() => { setPg(1) }, [query, country])
  const countries = useMemo(() => [...new Set(rows.map((r) => r.country))], [rows])
  const list = useMemo(() => { const q = query.trim().toLowerCase(); return rows.filter((r) => (!country || r.country === country) && (!q || `${r.name} ${r.city} ${r.programs}`.toLowerCase().includes(q))) }, [rows, query, country])
  const save = async (v: Draft) => {
    const u = await universityStore.save(v)
    setRows((r) => (r.some((x) => x.id === u.id) ? r.map((x) => (x.id === u.id ? u : x)) : [u, ...r]))
    toast(v.id ? 'University updated' : 'University added'); setEditing(null)
  }
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-2xl font-extrabold">Universities</h1><p className="text-sm text-mut">{list.length} universities</p></div>
        <button className="btn" onClick={() => setEditing('new')}><Plus size={16} />Add University</button>
      </div>
      <select className="input mb-4 !w-auto" value={country} onChange={(e) => setCountry(e.target.value)} aria-label="Filter by country"><option value="">All countries</option>{countries.map((c) => <option key={c}>{c}</option>)}</select>
      <div className="card overflow-x-auto !p-0">
        <table className="w-full min-w-[900px] text-sm">
          <thead><tr className="text-left text-xs text-mut">{['University', 'Country', 'Ranking', 'Tuition fee', 'Deadline', 'IELTS', 'Popular programs', 'Status', ''].map((h) => <th key={h} className="border-b border-line px-4 py-3 font-semibold">{h}</th>)}</tr></thead>
          <tbody>
            {loading && Array.from({ length: 4 }).map((_, i) => <tr key={i}><td colSpan={9} className="px-4 py-3"><div className="h-8 animate-pulse rounded-lg bg-soft" /></td></tr>)}
            {!loading && list.slice((pg - 1) * PER, pg * PER).map((u) => (
              <tr key={u.id} className="border-b border-line last:border-0 hover:bg-soft">
                <td className="px-4 py-3"><b>{u.name}</b><div className="text-xs text-mut">{u.city}</div></td><td className="px-4 py-3">{u.country}</td><td className="px-4 py-3">#{u.ranking}</td>
                <td className="px-4 py-3">{u.tuition}</td><td className="px-4 py-3">{u.deadline}</td><td className="px-4 py-3">{u.ielts.toFixed(1)}</td><td className="max-w-[220px] px-4 py-3 text-xs text-mut">{u.programs}</td>
                <td className="px-4 py-3"><span className={`pill ${u.status === 'Open' ? '!bg-emerald-100 !text-emerald-700' : '!bg-stone-200 !text-stone-600'}`}>{u.status}</span></td>
                <td className="px-4 py-3"><div className="flex gap-1"><button aria-label={`Edit ${u.name}`} className="rounded-lg p-2 hover:bg-card" onClick={() => setEditing(u)}><Pencil size={15} /></button><button aria-label={`Delete ${u.name}`} className="rounded-lg p-2 text-red-600 hover:bg-card" onClick={() => setDel(u)}><Trash2 size={15} /></button></div></td>
              </tr>))}
          </tbody>
        </table>
        {!loading && !list.length && <p className="py-12 text-center text-sm text-mut">No universities found. Try a different search or add one.</p>}
      </div>
      <Pagination page={pg} total={list.length} per={PER} onChange={setPg} />
      {editing && <Modal title={editing === 'new' ? 'Add University' : 'Edit University'} onClose={() => setEditing(null)}><UniForm initial={editing === 'new' ? undefined : editing} onSave={save} onCancel={() => setEditing(null)} /></Modal>}
      {del && <ConfirmDialog title="Delete university?" message={`${del.name} will be removed from the list.`} confirmLabel="Delete" onClose={() => setDel(null)} onConfirm={async () => { await universityStore.remove(del.id); setRows((r) => r.filter((x) => x.id !== del.id)); toast('University deleted'); setDel(null) }} />}
    </div>)
}
