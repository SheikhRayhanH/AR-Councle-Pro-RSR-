import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { TeamMember } from '../types'
import { teamStore } from '../services/stores'
interface Value { members: TeamMember[]; loading: boolean; counselors: string[]; save: (v: Omit<TeamMember, 'id'> & { id?: string }) => Promise<void>; remove: (id: string) => Promise<void> }
const Ctx = createContext<Value | null>(null)
export function TeamProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => { teamStore.list().then((m) => { setMembers(m); setLoading(false) }) }, [])
  const counselors = useMemo(() => members.filter((m) => m.role === 'counselor' && m.status === 'Active').map((m) => m.name), [members])
  const save: Value['save'] = async (v) => { const m = await teamStore.save(v); setMembers((p) => (p.some((x) => x.id === m.id) ? p.map((x) => (x.id === m.id ? m : x)) : [...p, m])) }
  const remove = async (id: string) => { await teamStore.remove(id); setMembers((p) => p.filter((x) => x.id !== id)) }
  return <Ctx.Provider value={{ members, loading, counselors, save, remove }}>{children}</Ctx.Provider>
}
export const useTeam = () => { const c = useContext(Ctx); if (!c) throw new Error('useTeam must be used inside TeamProvider'); return c }
