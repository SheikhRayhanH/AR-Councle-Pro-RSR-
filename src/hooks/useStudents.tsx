import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Student, StudentInput } from '../types'
import { studentService } from '../services/studentService'
interface Value { students: Student[]; loading: boolean; add: (i: StudentInput) => Promise<void>; update: (id: string, i: StudentInput) => Promise<void>; remove: (id: string) => Promise<void> }
const Ctx = createContext<Value | null>(null)
export function StudentsProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => { studentService.list().then((s) => { setStudents(s); setLoading(false) }) }, [])
  const add = async (i: StudentInput) => { const s = await studentService.create(i); setStudents((p) => [s, ...p]) }
  const update = async (id: string, i: StudentInput) => { const s = await studentService.update(id, i); setStudents((p) => p.map((x) => (x.id === id ? s : x))) }
  const remove = async (id: string) => { await studentService.remove(id); setStudents((p) => p.filter((x) => x.id !== id)) }
  return <Ctx.Provider value={{ students, loading, add, update, remove }}>{children}</Ctx.Provider>
}
export const useStudents = () => { const c = useContext(Ctx); if (!c) throw new Error('useStudents must be used inside StudentsProvider'); return c }
