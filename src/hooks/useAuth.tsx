import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Role, User } from '../types'
import { USERS } from '../data/mock'
// Demo auth only. Replace login/logout with real API calls when the backend exists.
const KEY = 'arcp-role'
interface Value { user: User | null; login: (r: Role) => void; logout: () => void }
const Ctx = createContext<Value | null>(null)
const saved = (): User | null => { try { const r = localStorage.getItem(KEY) as Role | null; return r && USERS[r] ? USERS[r] : null } catch { return null } }
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(saved)
  const login = (r: Role) => { try { localStorage.setItem(KEY, r) } catch { /* ignore */ } setUser(USERS[r]) }
  const logout = () => { try { localStorage.removeItem(KEY) } catch { /* ignore */ } setUser(null) }
  return <Ctx.Provider value={{ user, login, logout }}>{children}</Ctx.Provider>
}
export const useAuth = () => { const c = useContext(Ctx); if (!c) throw new Error('useAuth must be used inside AuthProvider'); return c }
export const useUser = () => { const { user } = useAuth(); if (!user) throw new Error('No signed-in user'); return user }
