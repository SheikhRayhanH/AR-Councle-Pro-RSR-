import type { Student, StudentInput } from '../types'
import { initialStudents } from '../data/mock'
// Swap these functions for real fetch() calls when the backend is ready. Nothing else changes.
let db: Student[] = [...initialStudents]
const wait = <T>(v: T, ms = 350) => new Promise<T>((r) => setTimeout(() => r(v), ms))
export const studentService = {
  list: () => wait([...db]),
  create: (i: StudentInput) => { const s: Student = { ...i, id: crypto.randomUUID(), addedAt: new Date().toISOString().slice(0, 10) }; db = [s, ...db]; return wait(s) },
  update: (id: string, i: StudentInput) => { db = db.map((s) => (s.id === id ? { ...s, ...i } : s)); return wait(db.find((s) => s.id === id)!) },
  remove: (id: string) => { db = db.filter((s) => s.id !== id); return wait(id) },
}
