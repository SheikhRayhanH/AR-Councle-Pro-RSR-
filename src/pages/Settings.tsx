import { useState, type FormEvent } from 'react'
import { Bell, Building2, Lock, Palette, SlidersHorizontal, UserRound, type LucideIcon } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useToast } from '../hooks/useToast'
import { AGENCY } from '../data/agency'
interface F { k: string; l: string; t: 'text' | 'select' | 'toggle'; o?: string[] }
const TABS: { id: string; label: string; icon: LucideIcon; fields: F[] }[] = [
  { id: 'profile', label: 'Profile', icon: UserRound, fields: [{ k: 'pname', l: 'Full name', t: 'text' }, { k: 'pemail', l: 'Email', t: 'text' }, { k: 'pphone', l: 'Phone', t: 'text' }] },
  { id: 'agency', label: 'Agency Information', icon: Building2, fields: [{ k: 'aname', l: 'Agency name', t: 'text' }, { k: 'atype', l: 'Type', t: 'text' }, { k: 'atag', l: 'Tagline', t: 'text' }] },
  { id: 'notif', label: 'Notifications', icon: Bell, fields: [{ k: 'n1', l: 'New student registered', t: 'toggle' }, { k: 'n2', l: 'Application status changes', t: 'toggle' }, { k: 'n3', l: 'Task reminders', t: 'toggle' }, { k: 'n4', l: 'Payments received', t: 'toggle' }] },
  { id: 'appearance', label: 'Appearance', icon: Palette, fields: [{ k: 'theme', l: 'Theme', t: 'select', o: ['Light', 'Dark'] }] },
  { id: 'security', label: 'Security', icon: Lock, fields: [] },
  { id: 'prefs', label: 'Preferences', icon: SlidersHorizontal, fields: [{ k: 'lang', l: 'Language', t: 'select', o: ['English', 'Bangla'] }, { k: 'datefmt', l: 'Date format', t: 'select', o: ['YYYY-MM-DD', 'DD/MM/YYYY'] }, { k: 'cur', l: 'Currency', t: 'select', o: ['BDT'] }] },
]
type S = Record<string, string | boolean>
const DEFAULTS: S = { pname: AGENCY.developer, pemail: AGENCY.email, pphone: AGENCY.phone, aname: AGENCY.name, atype: AGENCY.type, atag: AGENCY.tagline, n1: true, n2: true, n3: true, n4: true, theme: 'Light', lang: 'English', datefmt: 'YYYY-MM-DD', cur: 'BDT' }
function Security() {
  const toast = useToast()
  const [cur, setCur] = useState('')
  const [next, setNext] = useState('')
  const [again, setAgain] = useState('')
  const [err, setErr] = useState('')
  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!cur) return setErr('Enter your current password')
    if (next.length < 8) return setErr('New password must be at least 8 characters')
    if (next !== again) return setErr('Passwords do not match')
    setErr(''); setCur(''); setNext(''); setAgain(''); toast('Password change will work once the backend is connected')
  }
  return (
    <form onSubmit={submit} className="grid max-w-sm gap-3">
      {([['Current password', cur, setCur], ['New password', next, setNext], ['Confirm new password', again, setAgain]] as const).map(([l, v, set]) => <label key={l} className="text-xs font-semibold text-mut">{l}<input type="password" className="input mt-1" value={v} onChange={(e) => set(e.target.value)} /></label>)}
      {err && <p role="alert" className="text-sm text-red-600">{err}</p>}
      <label className="flex items-center gap-2 text-sm text-mut"><input type="checkbox" disabled /> Two-factor authentication (available with the backend)</label>
      <div><button className="btn">Update password</button></div>
    </form>)
}
export default function Settings() {
  const toast = useToast()
  const [saved, setSaved] = useLocalStorage<S>('arcp-settings', DEFAULTS)
  const [draft, setDraft] = useState<S>({ ...saved, theme: document.documentElement.dataset.theme === 'dark' ? 'Dark' : 'Light' })
  const [tab, setTab] = useState('profile')
  const cur = TABS.find((t) => t.id === tab)!
  const save = () => { setSaved(draft); if (tab === 'appearance') { const t = draft.theme === 'Dark' ? 'dark' : 'light'; document.documentElement.dataset.theme = t; try { localStorage.setItem('arcp-theme', t) } catch { /* ignore */ } }; toast('Settings saved') }
  return (
    <div className="space-y-4">
      <div><h1 className="text-2xl font-extrabold">Settings</h1><p className="text-sm text-mut">Admin only. Saved in this browser until the backend is connected.</p></div>
      <div className="grid gap-4 md:grid-cols-[220px_1fr]">
        <nav className="card flex gap-1 overflow-x-auto !p-2 md:flex-col" aria-label="Settings sections">
          {TABS.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setTab(id)} aria-current={tab === id ? 'page' : undefined} className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-left text-sm font-semibold ${tab === id ? 'bg-pri text-white' : 'hover:bg-soft'}`}><Icon size={16} />{label}</button>)}
        </nav>
        <div className="card">
          <h2 className="mb-4 font-bold">{cur.label}</h2>
          {tab === 'security' ? <Security /> : (
            <div className="grid max-w-md gap-3">
              {cur.fields.map((f) => f.t === 'toggle'
                ? <label key={f.k} className="flex items-center justify-between rounded-xl border border-line bg-bg px-3 py-2.5 text-sm font-medium">{f.l}<input type="checkbox" className="h-4 w-4 accent-[#1d4ed8]" checked={!!draft[f.k]} onChange={(e) => setDraft({ ...draft, [f.k]: e.target.checked })} /></label>
                : <label key={f.k} className="text-xs font-semibold text-mut">{f.l}
                    {f.t === 'select' ? <select className="input mt-1" value={String(draft[f.k])} onChange={(e) => setDraft({ ...draft, [f.k]: e.target.value })}>{f.o!.map((o) => <option key={o}>{o}</option>)}</select>
                      : <input className="input mt-1" value={String(draft[f.k])} onChange={(e) => setDraft({ ...draft, [f.k]: e.target.value })} />}</label>)}
              <div><button className="btn" onClick={save}>Save changes</button></div>
            </div>)}
        </div>
      </div>
    </div>)
}
