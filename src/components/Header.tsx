import { useState } from 'react'
import { Bell, LogOut, Menu, Moon, Search, Settings, Sun } from 'lucide-react'
import { useAuth, useUser } from '../hooks/useAuth'
import { canView, ROLE_LABEL } from '../data/permissions'
import { ACTIVITIES } from '../data/mock'
import type { Page } from '../types'
interface Props { query: string; onQuery: (q: string) => void; onMenu: () => void; onGo: (p: Page) => void }
type Menu = 'notif' | 'user' | null
const ITEM = 'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-soft'
export default function Header({ query, onQuery, onMenu, onGo }: Props) {
  const user = useUser()
  const { logout } = useAuth()
  const [dark, setDark] = useState(() => document.documentElement.dataset.theme === 'dark')
  const [menu, setMenu] = useState<Menu>(null)
  const [read, setRead] = useState(false)
  const toggle = () => { const t = dark ? 'light' : 'dark'; document.documentElement.dataset.theme = t; try { localStorage.setItem('arcp-theme', t) } catch { /* ignore */ } setDark(!dark) }
  const open = (m: Menu) => { setMenu(menu === m ? null : m); if (m === 'notif') setRead(true) }
  return (
    <header className="print:hidden sticky top-0 z-10 flex items-center gap-3 border-b border-line bg-bg px-4 py-3 lg:px-8">
      {menu && <div className="fixed inset-0 z-10" onClick={() => setMenu(null)} />}
      <button className="btn-ghost !px-2.5 lg:hidden" onClick={onMenu} aria-label="Open menu"><Menu size={18} /></button>
      <label className="flex max-w-md flex-1 items-center gap-2 rounded-xl border border-line bg-card px-3 text-mut">
        <Search size={16} />
        <input value={query} onChange={(e) => onQuery(e.target.value)} aria-label="Global search" placeholder="Search students, applications, universities..." className="w-full bg-transparent py-2.5 text-sm text-ink outline-none" />
      </label>
      <div className="flex-1" />
      <button className="btn-ghost !px-2.5" onClick={toggle} aria-label="Toggle dark mode">{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
      <div className="relative">
        <button className="btn-ghost relative !px-2.5" onClick={() => open('notif')} aria-label="Notifications" aria-expanded={menu === 'notif'}><Bell size={18} />{!read && <span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">3</span>}</button>
        {menu === 'notif' && <div className="card absolute right-0 top-12 z-20 w-72 !p-3 shadow-lg"><b className="text-sm">Notifications</b>
          <ul className="mt-2">{ACTIVITIES.slice(0, 4).map(([t, w, when], i) => <li key={i} className="border-b border-line py-2 text-sm last:border-0"><b className="block">{t}</b><span className="text-xs text-mut">{w} · {when}</span></li>)}</ul></div>}
      </div>
      <div className="relative">
        <button className="flex items-center gap-2 rounded-xl border border-line bg-card py-1 pl-1 pr-3" onClick={() => open('user')} aria-label="Account menu" aria-expanded={menu === 'user'}>
          <span className="grid h-8 w-8 place-items-center rounded-full bg-pri text-sm font-bold text-white">{user.name[0]}</span>
          <span className="hidden text-left leading-tight sm:block"><b className="block text-sm">{user.role === 'admin' ? 'Rayhan' : user.name.split(' ')[0]}</b><span className="pill">{ROLE_LABEL[user.role]}</span></span>
        </button>
        {menu === 'user' && <div className="card absolute right-0 top-12 z-20 w-56 !p-2 shadow-lg">
          <div className="px-3 py-2"><b className="block text-sm">{user.name}</b><span className="text-xs text-mut">{ROLE_LABEL[user.role]}</span></div>
          {canView(user.role, 'settings') && <button className={ITEM} onClick={() => { setMenu(null); onGo('settings') }}><Settings size={16} />Profile & Settings</button>}
          <button className={`${ITEM} text-red-600`} onClick={logout}><LogOut size={16} />Sign out</button>
        </div>}
      </div>
    </header>)
}
