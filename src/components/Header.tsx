import { useState } from 'react'
import { useAuth, useUser } from '../hooks/useAuth'
import { ROLE_LABEL } from '../data/permissions'
import { Bell, Menu, Moon, Search, Sun, LogOut } from 'lucide-react'
interface Props { query: string; onQuery: (q: string) => void; onMenu: () => void }
export default function Header({ query, onQuery, onMenu }: Props) {
  const user = useUser()
  const { logout } = useAuth()
  const [dark, setDark] = useState(() => document.documentElement.dataset.theme === 'dark')
  const toggle = () => { document.documentElement.dataset.theme = dark ? 'light' : 'dark'; setDark(!dark) }
  return (
    <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-line bg-bg px-4 py-3 lg:px-8">
      <button className="btn-ghost !px-2.5 lg:hidden" onClick={onMenu} aria-label="Open menu"><Menu size={18} /></button>
      <label className="flex max-w-md flex-1 items-center gap-2 rounded-xl border border-line bg-card px-3 text-mut">
        <Search size={16} />
        <input value={query} onChange={(e) => onQuery(e.target.value)} aria-label="Global search" placeholder="Search students, applications, universities..." className="w-full bg-transparent py-2.5 text-sm text-ink outline-none" />
      </label>
      <div className="flex-1" />
      <button className="btn-ghost !px-2.5" onClick={toggle} aria-label="Toggle dark mode">{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
      <button className="btn-ghost relative !px-2.5" aria-label="Notifications"><Bell size={18} /><span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">3</span></button>
      <div className="hidden items-center gap-2 rounded-xl border border-line bg-card py-1 pl-1 pr-3 sm:flex">
        <div className="grid h-8 w-8 place-items-center rounded-full bg-pri text-sm font-bold text-white">{user.name[0]}</div>
        <div className="leading-tight"><b className="block text-sm">{user.role === 'admin' ? 'Rayhan' : user.name.split(' ')[0]}</b><span className="pill">{ROLE_LABEL[user.role]}</span></div>
      </div>
      <button className="btn-ghost !px-2.5" onClick={logout} aria-label="Sign out"><LogOut size={18} /></button>
    </header>)
}
